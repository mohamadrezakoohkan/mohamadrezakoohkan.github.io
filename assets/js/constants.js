/**
 * constants.js
 * Application-wide constants
 * Single source of truth for magic strings and numbers
 */

// DOM Selectors - Centralized for easy maintenance
const SELECTORS = {
    GREETING_BANNER: '#greeting-banner',
    SITE_TITLE: '#site-title',
    SIDEBAR_ABOUT_TITLE: '#sidebar-about-title',
    SIDEBAR_ROLE: '#sidebar-role',
    SIDEBAR_EXPERIENCE: '#sidebar-experience',
    SIDEBAR_ACHIEVEMENT: '#sidebar-achievement',
    SIDEBAR_BIO: '#sidebar-bio',
    SIDEBAR_LINKS: '#sidebar-links',
    POSTS_CONTAINER: '#posts-container',
    FOOTER_BANNER: '#footer-banner',
    FOOTER_COPYRIGHT: '#footer-copyright'
};

// CSS Classes - Centralized for consistency
const CSS_CLASSES = {
    DOS_BUTTON: 'dos-button',
    BLINK: 'blink',
    TEXT_DOS_WHITE: 'text-dos-white',
    TEXT_DOS_GRAY: 'text-dos-gray',
    TEXT_DOS_YELLOW: 'text-dos-yellow',
    TEXT_DOS_GREEN: 'text-dos-green'
};

// DOS Color Palette
const COLORS = {
    NAVY_BLUE: '#000080',
    WHITE: '#FFFFFF',
    LIGHT_GRAY: '#AAAAAA',
    CYAN: '#00AAAA',
    BRIGHT_YELLOW: '#FFFF55',
    LIME_GREEN: '#55FF55',
    BLACK: '#000000'
};

// API Endpoints
const API = {
    IP_GEOLOCATION: 'https://api.ipgeolocation.io/getip'
};

// Data File Paths
const DATA_PATHS = {
    CONTENT: './data/content.json',
    POSTS: './data/posts.json',
    LINKS: './data/links.json',
    GREETINGS: './data/greetings.json'
};

// Animation Timings (in milliseconds)
const ANIMATION = {
    SPARKLE_INTERVAL: 3000,
    SPARKLE_FADE_DURATION: 800,
    CONTENT_LOAD_DELAY: 500
};

// Default Values
const DEFAULTS = {
    IP_ADDRESS: '',
    GREETING: 'Hi'
};

// Sparkle Effect Colors
const SPARKLE_COLORS = ['#FBD0A6', '#F37022', '#B11016', '#2ABA9E', '#007096'];
