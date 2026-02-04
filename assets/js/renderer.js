/**
 * renderer.js
 * Handles rendering content to the DOM
 */

/**
 * Render site header information
 */
function renderSiteInfo(site) {
    // Title is set by initIPGreeting, so we skip it here
    const $subtitle = $('#site-subtitle');
    const lines = site.subtitle.split('\n');
    
    $subtitle.empty();
    lines.forEach(function(line, index) {
        if (index > 0) {
            $subtitle.append('<br>');
        }
        if (index === 2) {
            $subtitle.append($('<span>').css('color', '#2ABA9E').text(line));
        } else {
            $subtitle.append(line);
        }
    });
    
    $('#last-updated').text(site.lastUpdated);
}

/**
 * Render about section
 */
function renderAbout(about) {
    $('#about-description').text(about.description);
    $('#about-note').html('<strong>Note:</strong> ' + about.note);
}

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
            .addClass('border-4 border-double p-4 rounded-lg')
            .css({
                'border-color': borderColor,
                'background-color': bgColor
            });
        
        const $title = $('<h3>')
            .addClass('font-impact text-2xl font-bold mb-2')
            .css({
                'color': '#F37022',
                'text-shadow': '2px 2px #2ABA9E',
                'letter-spacing': '1px'
            })
            .html('⚡ <a href="' + post.url + '">' + post.title + '</a> ⚡');
        
        const $date = $('<p>')
            .addClass('text-sm mb-3 font-courier')
            .css('color', '#2ABA9E')
            .html('📅 ' + post.date);
        
        const $excerpt = $('<p>')
            .addClass('leading-relaxed font-courier')
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
