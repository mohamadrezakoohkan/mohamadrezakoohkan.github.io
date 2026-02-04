/**
 * effects.js
 * Handles visual effects and animations
 */

/**
 * Fade in welcome message on page load with extra pizzazz
 */
function initWelcomeAnimation() {
    $('.welcome-msg').hide().fadeIn(2000, function() {
        // Add a subtle pulse effect after fade in
        $(this).animate({ opacity: 0.9 }, 500)
               .animate({ opacity: 1 }, 500);
    });
}

/**
 * Animate the visitor counter with retro style
 */
function initVisitorCounter(target) {
    const $counter = $('#visitor-count');
    if ($counter.length && target) {
        // Add some random "magic" to the counter
        const magicTarget = target + Math.floor(Math.random() * 42);
        
        $({ count: 0 }).animate({ count: magicTarget }, {
            duration: 3000,
            easing: 'swing',
            step: function() {
                $counter.text(String(Math.floor(this.count)).padStart(6, '0'));
            },
            complete: function() {
                $counter.text(String(magicTarget).padStart(6, '0'));
                // Make it glow after animation
                $counter.animate({ opacity: 0.7 }, 300)
                        .animate({ opacity: 1 }, 300);
            }
        });
    }
}

/**
 * Add hover effects to navigation links
 */
function initNavEffects() {
    $('.nav-link').on('mouseenter', function() {
        $(this).css('transform', 'scale(1.1) rotate(-2deg)');
    }).on('mouseleave', function() {
        $(this).css('transform', 'scale(1) rotate(0deg)');
    });
}

/**
 * Add sparkle effect to random elements
 */
function initSparkleEffect() {
    setInterval(function() {
        const sparkleElements = $('h1, h2, .retro-button');
        const randomElement = sparkleElements.eq(Math.floor(Math.random() * sparkleElements.length));
        
        randomElement.animate({ opacity: 0.8 }, 200)
                     .animate({ opacity: 1 }, 200);
    }, 3000);
}

/**
 * Retro scrolling effect for articles
 */
function initArticleAnimations() {
    $('article').each(function(index) {
        $(this).hide().delay(index * 200).fadeIn(800);
    });
}

/**
 * Sparkle cursor trail (classic GeoCities effect!)
 * Creates colorful sparkles that follow your mouse
 */
function initCursorSparkles() {
    const colors = ['#FBD0A6', '#F37022', '#B11016', '#2ABA9E', '#007096'];
    let sparkleCount = 0;
    
    $(document).on('mousemove', function(e) {
        // Limit sparkle creation to avoid performance issues
        if (sparkleCount % 3 !== 0) {
            sparkleCount++;
            return;
        }
        sparkleCount++;
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        const $sparkle = $('<div>')
            .css({
                position: 'fixed',
                left: e.pageX + 'px',
                top: e.pageY + 'px',
                width: '8px',
                height: '8px',
                backgroundColor: color,
                borderRadius: '50%',
                pointerEvents: 'none',
                zIndex: 9999,
                boxShadow: '0 0 10px ' + color
            })
            .appendTo('body');
        
        // Animate and remove sparkle
        $sparkle.animate({
            opacity: 0,
            top: (e.pageY - 20) + 'px',
            width: '2px',
            height: '2px'
        }, 800, function() {
            $(this).remove();
        });
    });
}

/**
 * Add random "NEW!" badges to recent content
 */
function addNewBadges() {
    $('article').first().prepend(
        $('<span>')
            .addClass('inline-block font-pixel text-xs px-2 py-1 rounded blink')
            .css({
                'background-color': '#B11016',
                'color': '#FBD0A6',
                'border': '2px solid #F37022',
                'box-shadow': '0 0 10px #F37022'
            })
            .text('NEW!')
    );
}
