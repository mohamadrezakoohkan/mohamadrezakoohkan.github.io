const DEFAULT_IP = "";
const ENDPOINT_URL = "https://api.ipgeolocation.io/getip";

async function getIP() {
    let response = await fetch(ENDPOINT_URL);
    let data = await response.json();
    let ip = await data.ip;
    console.log(data);
    console.log(ip);
    return ip;
}

function updateUI(ip) {
    document.getElementById("ip").innerHTML = `Hi ${ip}`;
}

updateUI(DEFAULT_IP);

getIP().then(updateUI);
