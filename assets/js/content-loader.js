/**
 * content-loader.js
 * Handles loading data from JSON files
 * Follows Single Responsibility Principle - only loads data
 */

/**
 * ContentLoader - Encapsulates data loading logic
 * Follows Dependency Inversion Principle - depends on abstractions (callbacks)
 */
const ContentLoader = {
    /**
     * Load JSON file
     * @param {string} path - File path
     * @returns {Promise} jQuery promise
     */
    loadJSON: function(path) {
        return $.getJSON(path);
    },
    
    /**
     * Extract data from jQuery response
     * @param {Array} response - jQuery response [data, status, xhr]
     * @returns {Object} Extracted data
     */
    extractData: function(response) {
        return response[0];
    },
    
    /**
     * Handle load error
     * @param {string} context - Error context
     */
    handleError: function(context) {
        console.error('Failed to load ' + context);
    }
};

/**
 * Load all content from JSON files and render
 * Coordinates between ContentLoader and renderer functions
 */
function loadContent() {
    // Load all JSON files in parallel using constants
    $.when(
        ContentLoader.loadJSON(DATA_PATHS.CONTENT),
        ContentLoader.loadJSON(DATA_PATHS.POSTS),
        ContentLoader.loadJSON(DATA_PATHS.LINKS)
    ).done(function(contentResponse, postsResponse, linksResponse) {
        // Extract data from responses
        const content = ContentLoader.extractData(contentResponse);
        const posts = ContentLoader.extractData(postsResponse);
        const links = ContentLoader.extractData(linksResponse);
        
        // Render all sections using renderer functions
        renderSidebarAbout(content.sidebar);
        renderFooter(content.footer);
        renderSidebarLinks(links.links);
        renderPosts(posts.posts);
    }).fail(function() {
        ContentLoader.handleError('data files');
    });
}
