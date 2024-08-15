// defining constants
function dayOfYear() {
    const now = new Date();
    const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let dayNumber = 0;
    for (let i = 0; i < now.getMonth(); i++) {
        dayNumber += daysInMonth[i];
    }
    dayNumber += now.getDate();
    console.log(dayNumber);
    return dayNumber;
}
const DAY_NUMBER = dayOfYear() + 1;
const SHEET_ID = "1V3c2-kDkehR_ViJdsJsgWkpK9vAn233j6Gm7lPOVueM";
const SHEET_TITLE = "annual_time_table";
const SHEET_RANGE = "A" + DAY_NUMBER + ":G" + DAY_NUMBER;
const FULL_URL = "https://docs.google.com/spreadsheets/d/" + SHEET_ID + "/gviz/tq?sheet=" + SHEET_TITLE + "&range=" + SHEET_RANGE;

window.onload = async function () {
    try {
        const table = await fetchDataFromSheet();
        console.log(table);

        document.getElementById("time-table").innerHTML = "";
        const eventNames = ["Today", "Fajr", "Sunrise", "Zuhr", "Asr", "Maghrib", "Isha"];

        for (let i = 1; i < table.length; i++) {
            let event = document.createElement("div");
            event.id = eventNames[i];
            if (i % 2 == 0) {
                event.classList.add("flex", "flex-row", "m-1", "bg-gray-400");
            } else {
                event.classList.add("flex", "flex-row", "m-1", "bg-gray-500");
            }
            document.getElementById("time-table").append(event);

            let name = document.createElement("div");
            name.classList.add("w-32", "md:w-64")
            name.innerText = eventNames[i];
            document.getElementById(eventNames[i]).append(name);

            let time = document.createElement("div");
            time.classList.add("w-32", "md:w-64")
            time.innerText = table[i].name;
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
            name: row.f,
        }));
        return table;
    } catch (error) {
        console.error('Error fetching sheet data:', error);
        throw error;
    }
}
