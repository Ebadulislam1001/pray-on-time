function setTime() {
    const date = new Date();
    const options = {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
    };
    document.getElementById("curr-time").textContent = date.toLocaleTimeString("en-US", options);
    // console.log(date.toLocaleTimeString("en-US", options));
}
function callSetTime(){
    setInterval(setTime, 1000);
}

callSetTime();
