/**
 * effects.js
 * Handles visual effects and animations
 * Follows Single Responsibility Principle - each effect is isolated
 */

/**
 * SparkleEffect - Manages header sparkle animations
 * Follows Single Responsibility Principle
 */
const SparkleEffect = {
    /**
     * Get random element from collection
     * @param {jQuery} $elements - jQuery collection
     * @returns {jQuery} Random element
     */
    getRandomElement: function($elements) {
        const randomIndex = Math.floor(Math.random() * $elements.length);
        return $elements.eq(randomIndex);
    },
    
    /**
     * Animate element with sparkle effect
     * @param {jQuery} $element - Element to animate
     */
    animateSparkle: function($element) {
        $element.animate({ opacity: 0.8 }, 200)
                .animate({ opacity: 1 }, 200);
    },
    
    /**
     * Start sparkle effect on interval
     */
    start: function() {
        const self = this;
        setInterval(function() {
            const $headers = $('h1, h2, h3');
            const $randomHeader = self.getRandomElement($headers);
            self.animateSparkle($randomHeader);
        }, ANIMATION.SPARKLE_INTERVAL);
    }
};

/**
 * CursorSparkleEffect - Manages cursor trail sparkles
 * Follows Single Responsibility Principle
 */
const CursorSparkleEffect = {
    // Private state
    _sparkleCount: 0,
    _throttleRate: 3,
    
    /**
     * Check if sparkle should be created (throttling)
     * @returns {boolean} True if should create sparkle
     */
    shouldCreateSparkle: function() {
        this._sparkleCount++;
        return this._sparkleCount % this._throttleRate === 0;
    },
    
    /**
     * Get random color from palette
     * @returns {string} Hex color code
     */
    getRandomColor: function() {
        const randomIndex = Math.floor(Math.random() * SPARKLE_COLORS.length);
        return SPARKLE_COLORS[randomIndex];
    },
    
    /**
     * Create sparkle element
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {string} color - Sparkle color
     * @returns {jQuery} Sparkle element
     */
    createSparkleElement: function(x, y, color) {
        return $('<div>')
            .css({
                position: 'fixed',
                left: x + 'px',
                top: y + 'px',
                width: '8px',
                height: '8px',
                backgroundColor: color,
                borderRadius: '50%',
                pointerEvents: 'none',
                zIndex: 9999,
                boxShadow: '0 0 10px ' + color
            });
    },
    
    /**
     * Animate and remove sparkle
     * @param {jQuery} $sparkle - Sparkle element
     * @param {number} startY - Starting Y position
     */
    animateSparkle: function($sparkle, startY) {
        $sparkle.animate({
            opacity: 0,
            top: (startY - 20) + 'px',
            width: '2px',
            height: '2px'
        }, ANIMATION.SPARKLE_FADE_DURATION, function() {
            $(this).remove();
        });
    },
    
    /**
     * Handle mouse move event
     * @param {Event} e - Mouse event
     */
    handleMouseMove: function(e) {
        if (!this.shouldCreateSparkle()) {
            return;
        }
        
        const color = this.getRandomColor();
        const $sparkle = this.createSparkleElement(e.pageX, e.pageY, color);
        
        $sparkle.appendTo('body');
        this.animateSparkle($sparkle, e.pageY);
    },
    
    /**
     * Start cursor sparkle effect
     */
    start: function() {
        const self = this;
        $(document).on('mousemove', function(e) {
            self.handleMouseMove(e);
        });
    }
};

/**
 * Initialize header sparkle effect
 * Public API function
 */
function initSparkleEffect() {
    SparkleEffect.start();
}

/**
 * Initialize cursor sparkle trail effect
 * Public API function
 */
function initCursorSparkles() {
    CursorSparkleEffect.start();
}
