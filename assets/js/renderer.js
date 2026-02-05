/**
 * renderer.js
 * Handles rendering content to the DOM
 * Follows Single Responsibility Principle - each function has one clear purpose
 */

/**
 * DOMRenderer - Encapsulates DOM manipulation logic
 * Follows Interface Segregation Principle - specific rendering methods
 */
const DOMRenderer = {
    /**
     * Render text content to element
     * @param {string} selector - jQuery selector
     * @param {string} text - Text content
     */
    renderText: function(selector, text) {
        $(selector).text(text);
    },
    
    /**
     * Clear container content
     * @param {string} selector - jQuery selector
     */
    clearContainer: function(selector) {
        $(selector).empty();
    },
    
    /**
     * Append element to container
     * @param {string} selector - jQuery selector
     * @param {jQuery} $element - jQuery element to append
     */
    appendToContainer: function(selector, $element) {
        $(selector).append($element);
    }
};

/**
 * PostElementFactory - Creates post-related DOM elements
 * Follows Factory Pattern and Single Responsibility
 */
const PostElementFactory = {
    /**
     * Create NEW badge element
     * @returns {jQuery} Badge element
     */
    createNewBadge: function() {
        return $('<span>')
            .css({
                'background-color': COLORS.BRIGHT_YELLOW,
                'color': COLORS.NAVY_BLUE,
                'padding': '2px 6px',
                'margin-right': '8px',
                'font-weight': 'bold',
                'font-size': '0.75em',
                'border': '2px solid ' + COLORS.BLACK
            })
            .text('NEW!');
    },
    
    /**
     * Create post title element
     * @param {Object} post - Post data
     * @param {boolean} isNew - Whether to show NEW badge
     * @returns {jQuery} Title element
     */
    createPostTitle: function(post, isNew) {
        const $title = $('<h3>')
            .addClass('font-mono font-bold text-base mb-2')
            .css('color', COLORS.WHITE);
        
        if (isNew) {
            $title.append(this.createNewBadge());
        }
        
        $title.append(post.title + ' | ' + post.date);
        return $title;
    },
    
    /**
     * Create post excerpt element
     * @param {string} excerpt - Excerpt text
     * @returns {jQuery} Excerpt element
     */
    createPostExcerpt: function(excerpt) {
        return $('<p>')
            .addClass('text-sm leading-relaxed mb-3')
            .css('color', COLORS.LIGHT_GRAY)
            .text(excerpt);
    },
    
    /**
     * Create read more button
     * @param {string} url - Post URL
     * @returns {jQuery} Button element
     */
    createReadMoreButton: function(url) {
        return $('<a>')
            .attr('href', url)
            .addClass(CSS_CLASSES.DOS_BUTTON + ' text-xs')
            .css({
                'padding': '4px 12px',
                'display': 'inline-block'
            })
            .text('READ MORE');
    },
    
    /**
     * Create complete post element
     * @param {Object} post - Post data
     * @param {number} index - Post index
     * @param {number} totalPosts - Total number of posts
     * @returns {jQuery} Complete post element
     */
    createPostElement: function(post, index, totalPosts) {
        const $postDiv = $('<div>')
            .addClass('mb-5 pb-4')
            .css('border-bottom', index < totalPosts - 1 ? '1px solid ' + COLORS.LIGHT_GRAY : 'none');
        
        const isFirstPost = index === 0;
        const $title = this.createPostTitle(post, isFirstPost);
        const $excerpt = this.createPostExcerpt(post.excerpt);
        const $button = this.createReadMoreButton(post.url);
        
        return $postDiv.append($title, $excerpt, $button);
    }
};

/**
 * LinkElementFactory - Creates link-related DOM elements
 * Follows Factory Pattern
 */
const LinkElementFactory = {
    /**
     * Create sidebar link element
     * @param {Object} link - Link data
     * @returns {jQuery} Link element
     */
    createLinkElement: function(link) {
        const $linkDiv = $('<div>');
        const $link = $('<a>')
            .attr('href', link.url)
            .css('color', COLORS.BRIGHT_YELLOW)
            .text('► ' + link.label);
        
        return $linkDiv.append($link);
    }
};

/**
 * Public API - Render functions
 * These functions coordinate between factories and DOM renderer
 */

/**
 * Render blog posts
 * @param {Array} posts - Array of post objects
 */
function renderPosts(posts) {
    DOMRenderer.clearContainer(SELECTORS.POSTS_CONTAINER);
    
    posts.forEach(function(post, index) {
        const $postElement = PostElementFactory.createPostElement(post, index, posts.length);
        DOMRenderer.appendToContainer(SELECTORS.POSTS_CONTAINER, $postElement);
    });
}

/**
 * Render site title
 * @param {Object} site - Site data
 */
function renderSiteTitle(site) {
    DOMRenderer.renderText(SELECTORS.SITE_TITLE, site.title);
}

/**
 * Render sidebar about section
 * @param {Object} sidebar - Sidebar data
 */
function renderSidebarAbout(sidebar) {
    DOMRenderer.renderText(SELECTORS.SIDEBAR_ABOUT_TITLE, sidebar.aboutTitle);
    DOMRenderer.renderText(SELECTORS.SIDEBAR_ROLE, sidebar.role);
    DOMRenderer.renderText(SELECTORS.SIDEBAR_EXPERIENCE, sidebar.experience);
    DOMRenderer.renderText(SELECTORS.SIDEBAR_ACHIEVEMENT, sidebar.achievement);
    DOMRenderer.renderText(SELECTORS.SIDEBAR_BIO, sidebar.bio);
}

/**
 * Render footer section
 * @param {Object} footer - Footer data
 */
function renderFooter(footer) {
    DOMRenderer.renderText(SELECTORS.FOOTER_BANNER, footer.banner);
    DOMRenderer.renderText(SELECTORS.FOOTER_COPYRIGHT, footer.copyright);
}

/**
 * Render sidebar links
 * @param {Array} links - Array of link objects
 */
function renderSidebarLinks(links) {
    DOMRenderer.clearContainer(SELECTORS.SIDEBAR_LINKS);
    
    links.forEach(function(link) {
        const $linkElement = LinkElementFactory.createLinkElement(link);
        DOMRenderer.appendToContainer(SELECTORS.SIDEBAR_LINKS, $linkElement);
    });
}
