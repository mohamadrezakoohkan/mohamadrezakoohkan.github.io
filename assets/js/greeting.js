/**
 * greeting.js
 * Handles IP-based greeting with timezone detection
 */

const DEFAULT_IP = "";
const ENDPOINT_URL = "https://api.ipgeolocation.io/getip";

/**
 * Initialize IP-based greeting
 */
function initIPGreeting() {
    updateIPGreeting(DEFAULT_IP);
    getIP().then(updateIPGreeting);
}

/**
 * Fetch user's IP address
 */
async function getIP() {
    try {
        const response = await fetch(ENDPOINT_URL);
        const data = await response.json();
        const ip = await data.ip;
        return ip;
    } catch (error) {
        console.error('Failed to fetch IP:', error);
        return DEFAULT_IP;
    }
}

/**
 * Update greeting with IP and timezone-based greeting
 */
function updateIPGreeting(ip) {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const greeting = getGreeting(timeZone);
    const $banner = $('#greeting-banner');
    
    if (ip && ip !== DEFAULT_IP) {
        $banner.html(`<span class="blink" style="color: #FFFF55;">►</span> <span style="color: #55FF55; font-family: 'Courier New', monospace;">${greeting} ${ip}</span> <span class="blink">▌</span>`);
    } else {
        $banner.html(`<span class="blink" style="color: #FFFF55;">►</span> <span class="blink">▌</span>`);
    }
}

/**
 * Get greeting based on timezone
 */
function getGreeting(timeZone) {
    const timeZones = {
        "Europe/Istanbul": "Merhaba",
        "Europe/Madrid": "Hola",
        "Europe/Rome": "Ciao",
        "Europe/Paris": "Bonjour",
        "Europe/Berlin": "Hallo",
        "Asia/Tehran": "Salam aleykom",
    };
    
    const result = timeZones[timeZone];
    console.log('Timezone:', timeZone, '| Greeting:', result || 'Hi');
    
    return result || "Hi";
}
