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
    const $title = $('#site-title');
    
    if (ip && ip !== DEFAULT_IP) {
        $title.html(`<span style="color: #FBD0A6;">${greeting}</span> <span style="color: #007096;">${ip}</span> <span style="color: #FBD0A6;">to Reza's Blog</span>`);
    } else {
        $title.html(`<span style="color: #FBD0A6;">Reza's Blog</span>`);
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
