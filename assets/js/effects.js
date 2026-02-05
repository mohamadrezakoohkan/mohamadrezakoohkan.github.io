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
 * IBMCursorEffect - IBM-style horizontal stripe cursor trail
 * Follows Single Responsibility Principle
 */
const IBMCursorEffect = {
    // Private state
    _moveCount: 0,
    _throttleRate: 4,
    _stripeCount: 4,
    
    /**
     * Check if effect should be created (throttling)
     * @returns {boolean} True if should create effect
     */
    shouldCreateEffect: function() {
        this._moveCount++;
        return this._moveCount % this._throttleRate === 0;
    },
    
    /**
     * Create IBM stripe element
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {number} offset - Vertical offset for stripe
     * @returns {jQuery} Stripe element
     */
    createStripeElement: function(x, y, offset) {
        return $('<div>')
            .css({
                position: 'fixed',
                left: (x - 8) + 'px',
                top: (y + offset) + 'px',
                width: '16px',
                height: '2px',
                backgroundColor: COLORS.WHITE,
                pointerEvents: 'none',
                zIndex: 9999
            });
    },
    
    /**
     * Create stripe group container
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {jQuery} Container with stripes
     */
    createStripeGroup: function(x, y) {
        const $container = $('<div>').css({
            position: 'fixed',
            left: x + 'px',
            top: y + 'px',
            pointerEvents: 'none',
            zIndex: 9999
        });
        
        // Create horizontal stripes (IBM logo style)
        for (let i = 0; i < this._stripeCount; i++) {
            const $stripe = this.createStripeElement(0, 0, i * 4);
            $container.append($stripe);
        }
        
        return $container;
    },
    
    /**
     * Animate and remove stripe group
     * @param {jQuery} $group - Stripe group element
     */
    animateStripeGroup: function($group) {
        $group.animate({
            opacity: 0
        }, 400, function() {
            $(this).remove();
        });
    },
    
    /**
     * Handle mouse move event
     * @param {Event} e - Mouse event
     */
    handleMouseMove: function(e) {
        if (!this.shouldCreateEffect()) {
            return;
        }
        
        const $stripeGroup = this.createStripeGroup(e.pageX, e.pageY);
        
        $stripeGroup.appendTo('body');
        this.animateStripeGroup($stripeGroup);
    },
    
    /**
     * Start IBM cursor effect
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
 * Initialize IBM-style cursor trail effect
 * Public API function
 */
function initCursorSparkles() {
    IBMCursorEffect.start();
}
