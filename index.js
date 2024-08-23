// defining constants
const DAY_NUMBER = dayOfYear() + 1; // (+1) to take the table header into account
const SHEET_ID = "1V3c2-kDkehR_ViJdsJsgWkpK9vAn233j6Gm7lPOVueM";
const SHEET_TITLE = "annual_time_table";
const SHEET_RANGE = "A" + DAY_NUMBER + ":G" + DAY_NUMBER;
const FULL_URL = "https://docs.google.com/spreadsheets/d/" + SHEET_ID + "/gviz/tq?sheet=" + SHEET_TITLE + "&range=" + SHEET_RANGE;

function dayOfYear() {
    const now = new Date();
    const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let dayNumber = 0;
    for (let i = 0; i < now.getMonth(); i++) {
        dayNumber += daysInMonth[i];
    }
    dayNumber += now.getDate();
    // console.log(dayNumber);
    return dayNumber;
}

window.onload = async function () {
    // showCurrentTime();
    timeRemaining();
    // setInterval(showCurrentTime, 30000);
    setInterval(timeRemaining, 1000);
    try {
        const table = await fetchDataFromSheet();
        // console.log(table);

        document.getElementById("time-table").innerHTML = "";

        const eventNames = ["Today", "Fajr", "Sunrise", "Zuhr", "Asr", "Maghrib", "Isha"];

        for (let i = 1; i < table.length; i++) {
            let event = document.createElement("div");
            event.id = eventNames[i];

            (i % 2 == 0)
                ? event.classList.add("flex", "flex-row", "m-1", "bg-gray-400")
                : event.classList.add("flex", "flex-row", "m-1", "bg-gray-500");

            document.getElementById("time-table").append(event);

            let name = document.createElement("div");
            name.classList.add("w-32", "md:w-64")
            name.innerText = eventNames[i];
            document.getElementById(eventNames[i]).append(name);

            let time = document.createElement("div");
            time.classList.add("w-32", "md:w-64")
            time.innerText = table[i].time;
            document.getElementById(eventNames[i]).append(time);
        }
    } catch (error) {
        console.error("Error occurred in onload function:", error);
    }
};

async function fetchDataFromSheet() {
    try {
        const res = await fetch(FULL_URL);
        if (!res.ok) {
            throw new Error(`Failed to fetch sheet data: ${res.statusText}`);
        }
        const rep = await res.text();
        const dataJson = rep.substr(47).slice(0, -2);
        const data = JSON.parse(dataJson);
        const table = data.table.rows[0].c.map((row) => ({
            time: row.f,
        }));
        return table;
    } catch (error) {
        console.error('Error fetching sheet data:', error);
        throw error;
    }
}

async function timeRemaining() {
    try {
        document.getElementById("remaining-time").innerText = "  :  ";
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTimeInMinutes = currentHour * 60 + currentMinute;
        // console.log("Current time: " + currentTimeInMinutes);
        
        const table = await fetchDataFromSheet();

        let remainingTimeInMinutes = 1440 - currentTimeInMinutes + minuteUnits(table[1].time, false);
        for (let i = 1; i < table.length; i++) {
            const eventTimeInMinutes = minuteUnits(table[i].time, i>3);
            // console.log("Event time: " + eventTimeInMinutes);
            if(eventTimeInMinutes > currentTimeInMinutes) {
                remainingTimeInMinutes = eventTimeInMinutes - currentTimeInMinutes;
                // console.log("Time remaining: " + timeRemaining);
                break;
            }
        }
        // console.log("Time remaining: " + remainingTimeInMinutes);
        const remainingTimeToBeDisplayed = displayFormat(remainingTimeInMinutes);
        // console.log("Time remaining: " + remainingTimeToBeDisplayed);

        document.getElementById("remaining-time").innerText = remainingTimeToBeDisplayed;

    } catch (error) {
        console.error("Error occurred in timeRemaining function:", error);
        return;
    }
}

function minuteUnits(time, isPM) {
    const [hour, minute] = time.split(":");
    return (Number(hour)+ (isPM ? 12 : 0)) * 60 + Number(minute);
}

function displayFormat(remainingTimeInMinutes) {
    const hours = Math.floor(remainingTimeInMinutes / 60).toString().padStart(2, '0');
    const minutes = (remainingTimeInMinutes % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

// async function showCurrentTime() {
//         const now = new Date();
//         const date = now.getDate().toString().padStart(2, '0');
//         const month = (now.getMonth() + 1).toString().padStart(2, '0');
//         const year = now.getFullYear();
//         const hour = now.getHours().toString().padStart(2, '0');
//         const minute = now.getMinutes().toString().padStart(2, '0');
//         const second = now.getSeconds().toString().padStart(2, '0');
//         document.getElementById("current-time").innerText = `${hour}:${minute}:${second}\n${date}/${month}/${year}`;
//         // document.getElementById("current-time").innerText = now;
//         // document.getElementById("current-time").innerText = now.toLocaleTimeString();
// }
