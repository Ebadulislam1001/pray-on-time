function setDate() {
    const date = new Date();
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    };
    document.getElementById("curr-date").textContent = date.toLocaleDateString("en-US", options);    
}

function setTime() {
    const date = new Date();
    const options = {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
    };
    document.getElementById("curr-time").textContent = date.toLocaleTimeString("en-US", options);
    setDate();
}

setInterval(setTime, 1000);
