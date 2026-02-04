/**
 * renderer.js
 * Handles rendering content to the DOM
 */

/**
 * Render blog posts
 */
function renderPosts(posts) {
    const $container = $('#posts-container');
    $container.empty();
    
    posts.forEach(function(post, index) {
        // Create post wrapper
        const $postDiv = $('<div>')
            .addClass('mb-5 pb-4')
            .css('border-bottom', index < posts.length - 1 ? '1px solid #AAAAAA' : 'none');
        
        // Create title with NEW badge for first post
        const $title = $('<h3>')
            .addClass('font-mono font-bold text-base mb-2')
            .css('color', '#FFFFFF');
        
        // Add NEW badge for first post (DOS style)
        if (index === 0) {
            const $newBadge = $('<span>')
                .css({
                    'background-color': '#FFFF55',
                    'color': '#000080',
                    'padding': '2px 6px',
                    'margin-right': '8px',
                    'font-weight': 'bold',
                    'font-size': '0.75em',
                    'border': '2px solid #000000'
                })
                .text('NEW!');
            $title.append($newBadge);
        }
        
        $title.append(post.title + ' | ' + post.date);
        
        // Create excerpt
        const $excerpt = $('<p>')
            .addClass('text-sm leading-relaxed mb-3')
            .css('color', '#AAAAAA')
            .text(post.excerpt);
        
        // Create read more button
        const $button = $('<a>')
            .attr('href', post.url)
            .addClass('dos-button text-xs')
            .css({
                'padding': '4px 12px',
                'display': 'inline-block'
            })
            .text('READ MORE');
        
        $postDiv.append($title, $excerpt, $button);
        $container.append($postDiv);
    });
}

/**
 * Render links section
 */
function renderLinks(links) {
    const $list = $('#links-list');
    $list.empty();
    
    const icons = ['🔗', '⭐', '💫', '🌟', '✨', '🎮', '💾', '📼'];
    
    links.forEach(function(link, index) {
        const icon = icons[index % icons.length];
        const $item = $('<li>')
            .addClass('transition-colors')
            .css('color', '#F37022')
            .html(icon + ' <a href="' + link.url + '">' + link.label + '</a>')
            .on('mouseenter', function() {
                $(this).css('color', '#B11016');
            })
            .on('mouseleave', function() {
                $(this).css('color', '#F37022');
            });
        $list.append($item);
    });
}

/**
 * Render sidebar about section
 */
function renderSidebarAbout(sidebar) {
    $('#sidebar-role').text(sidebar.role);
    $('#sidebar-experience').text(sidebar.experience);
    $('#sidebar-achievement').text(sidebar.achievement);
    $('#sidebar-bio').text(sidebar.bio);
}

/**
 * Render footer section
 */
function renderFooter(footer) {
    $('#footer-banner').text(footer.banner);
    $('#footer-copyright').text(footer.copyright);
}

/**
 * Render sidebar links
 */
function renderSidebarLinks(links) {
    const $container = $('#sidebar-links');
    $container.empty();
    
    links.forEach(function(link) {
        const $linkDiv = $('<div>');
        const $link = $('<a>')
            .attr('href', link.url)
            .css('color', '#FFFF55')
            .text('► ' + link.label);
        $linkDiv.append($link);
        $container.append($linkDiv);
    });
}
