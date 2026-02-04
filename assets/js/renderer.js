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
    
    const borderColors = ['#B11016', '#F37022', '#2ABA9E', '#007096', '#FBD0A6'];
    const bgColors = ['rgba(177, 16, 22, 0.3)', 'rgba(243, 112, 34, 0.3)', 'rgba(42, 186, 158, 0.3)', 'rgba(0, 112, 150, 0.3)', 'rgba(251, 208, 166, 0.2)'];
    
    posts.forEach(function(post, index) {
        const borderColor = borderColors[index % borderColors.length];
        const bgColor = bgColors[index % bgColors.length];
        
        const $article = $('<article>')
            .addClass('border-4 border-double p-3 rounded-lg')
            .css({
                'border-color': borderColor,
                'background-color': bgColor
            });
        
        const $title = $('<h3>')
            .addClass('font-impact text-xl font-bold mb-2')
            .css({
                'color': '#F37022',
                'text-shadow': '2px 2px #2ABA9E',
                'letter-spacing': '1px'
            })
            .html('⚡ <a href="' + post.url + '">' + post.title + '</a> ⚡');
        
        const $date = $('<p>')
            .addClass('text-xs mb-2 font-courier')
            .css('color', '#2ABA9E')
            .html('📅 ' + post.date);
        
        const $excerpt = $('<p>')
            .addClass('leading-relaxed font-courier text-sm')
            .css('color', '#FBD0A6')
            .text(post.excerpt);
        
        $article.append($title, $date, $excerpt);
        $container.append($article);
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
