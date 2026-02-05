/**
 * main.js
 * Main entry point - orchestrates all modules
 * 
 * Dependencies (load in order):
 * 1. jQuery
 * 2. greeting.js
 * 3. content-loader.js
 * 4. renderer.js
 * 5. effects.js
 * 6. main.js (this file)
 */

$(function() {
    // Initialize all modules in correct order
    initIPGreeting();      // greeting.js
    loadContent();         // content-loader.js (also calls renderer.js functions)
    initSparkleEffect();   // effects.js - retro sparkle animations
    initCursorSparkles();  // effects.js - sparkle cursor trail!
});
