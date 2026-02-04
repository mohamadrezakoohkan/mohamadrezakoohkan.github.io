/**
 * content-loader.js
 * Handles loading data from JSON files
 */

/**
 * Load all content from JSON files
 */
function loadContent() {
    // Load all JSON files in parallel
    $.when(
        $.getJSON('./data/content.json'),
        $.getJSON('./data/posts.json'),
        $.getJSON('./data/links.json')
    ).done(function(contentResponse, postsResponse, linksResponse) {
        // Extract data from responses (jQuery returns [data, status, xhr])
        const content = contentResponse[0];
        const posts = postsResponse[0];
        const links = linksResponse[0];
        
        // Render all sections
        renderSiteInfo(content.site);
        renderAbout(content.about);
        renderPosts(posts.posts);
        renderLinks(links.links);
        initVisitorCounter(content.site.visitorCount);
    }).fail(function() {
        console.error('Failed to load data files');
    });
}
