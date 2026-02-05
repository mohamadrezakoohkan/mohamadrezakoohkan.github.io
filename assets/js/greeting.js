/**
 * greeting.js
 * Handles IP-based greeting with timezone detection
 * Follows Single Responsibility and Dependency Inversion principles
 */

/**
 * GreetingService - Encapsulates greeting business logic
 * Follows Single Responsibility Principle
 */
const GreetingService = {
    // Private state
    _greetingsData: null,
    
    /**
     * Load greetings data from JSON
     * @returns {Promise} Promise that resolves when data is loaded
     */
    loadGreetingsData: async function() {
        try {
            const response = await fetch(DATA_PATHS.GREETINGS);
            this._greetingsData = await response.json();
        } catch (error) {
            console.error('Failed to load greetings data:', error);
            // Fallback data
            this._greetingsData = { 
                timezones: {}, 
                default: DEFAULTS.GREETING 
            };
        }
    },
    
    /**
     * Get greeting for timezone
     * @param {string} timeZone - IANA timezone identifier
     * @returns {string} Localized greeting
     */
    getGreetingForTimezone: function(timeZone) {
        if (!this._greetingsData) {
            return DEFAULTS.GREETING;
        }
        
        const greeting = this._greetingsData.timezones[timeZone] || this._greetingsData.default;
        console.log('Timezone:', timeZone, '| Greeting:', greeting);
        
        return greeting;
    },
    
    /**
     * Get current user timezone
     * @returns {string} IANA timezone identifier
     */
    getCurrentTimezone: function() {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
};

/**
 * IPService - Handles IP address fetching
 * Follows Single Responsibility Principle
 */
const IPService = {
    /**
     * Fetch user's IP address
     * @returns {Promise<string>} User's IP address
     */
    fetchIP: async function() {
        try {
            const response = await fetch(API.IP_GEOLOCATION);
            const data = await response.json();
            return data.ip;
        } catch (error) {
            console.error('Failed to fetch IP:', error);
            return DEFAULTS.IP_ADDRESS;
        }
    }
};

/**
 * GreetingRenderer - Handles greeting display
 * Follows Single Responsibility Principle - only renders greeting
 */
const GreetingRenderer = {
    /**
     * Create greeting HTML with blinking cursors
     * @param {string} greeting - Greeting text
     * @param {string} ip - IP address
     * @returns {string} HTML string
     */
    createGreetingHTML: function(greeting, ip) {
        const cursor = '<span class="' + CSS_CLASSES.BLINK + '">▌</span>';
        const arrow = '<span class="' + CSS_CLASSES.BLINK + '" style="color: ' + COLORS.BRIGHT_YELLOW + ';">►</span>';
        
        if (ip && ip !== DEFAULTS.IP_ADDRESS) {
            const message = '<span style="color: ' + COLORS.LIME_GREEN + '; font-family: ' + 'Courier New' + ', monospace;">' + 
                          greeting + ' ' + ip + '</span>';
            return arrow + ' ' + message + ' ' + cursor;
        }
        
        return arrow + ' ' + cursor;
    },
    
    /**
     * Render greeting to DOM
     * @param {string} html - HTML to render
     */
    render: function(html) {
        $(SELECTORS.GREETING_BANNER).html(html);
    }
};

/**
 * Update greeting banner with IP and timezone-based greeting
 * @param {string} ip - IP address to display
 */
function updateIPGreeting(ip) {
    const timeZone = GreetingService.getCurrentTimezone();
    const greeting = GreetingService.getGreetingForTimezone(timeZone);
    const html = GreetingRenderer.createGreetingHTML(greeting, ip);
    
    GreetingRenderer.render(html);
}

/**
 * Initialize IP-based greeting system
 * Public API function
 */
function initIPGreeting() {
    // Load greetings data first, then initialize
    GreetingService.loadGreetingsData().then(function() {
        updateIPGreeting(DEFAULTS.IP_ADDRESS);
        IPService.fetchIP().then(updateIPGreeting);
    });
}
