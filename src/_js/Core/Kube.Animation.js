/**
 * @library Kube Animation
 * @author Imperavi LLC
 * @license MIT
 */
(function(Kube)
{
    Kube.Animation = function(element, effect, callback)
    {
        this.namespace = 'animation';
        this.defaults = {};

        // Parent Constructor
        Kube.apply(this, arguments);

        // Initialization
        this.effect = effect;
        this.completeCallback = (typeof callback === 'undefined') ? false : callback;
        this.prefixes = ['', '-moz-', '-o-animation-', '-webkit-'];
        this.queue = [];

        this.start();
    };

    Kube.Animation.prototype = {
        start: function()
        {
	    	if (this.isSlideEffect()) this.setElementHeight();

			this.addToQueue();
			this.clean();
			this.animate();
        },
        addToQueue: function()
        {
            this.queue.push(this.effect);
        },
        setElementHeight: function()
        {
            this.$element.height(this.$element.height());
        },
        removeElementHeight: function()
        {
            this.$element.css('height', '');
        },
        isSlideEffect: function()
        {
            return (this.effect === 'slideDown' || this.effect === 'slideUp');
        },
        isHideableEffect: function()
        {
            var effects = ['fadeOut', 'slideUp', 'flipOut', 'zoomOut', 'slideOutUp', 'slideOutRight', 'slideOutLeft'];

			return ($.inArray(this.effect, effects) !== -1);
        },
        isToggleEffect: function()
        {
            return (this.effect === 'show' || this.effect === 'hide');
        },
        storeHideClasses: function()
        {
            if (this.$element.hasClass('hide-sm'))      this.$element.data('hide-sm-class', true);
            else if (this.$element.hasClass('hide-md')) this.$element.data('hide-md-class', true);
        },
        revertHideClasses: function()
        {
            if (this.$element.data('hide-sm-class'))      this.$element.addClass('hide-sm').removeData('hide-sm-class');
            else if (this.$element.data('hide-md-class')) this.$element.addClass('hide-md').removeData('hide-md-class');
            else                                          this.$element.addClass('hide');
        },
        removeHideClass: function()
        {
            if (this.$element.data('hide-sm-class'))      this.$element.removeClass('hide-sm');
            else if (this.$element.data('hide-md-class')) this.$element.removeClass('hide-md');
            else                                          this.$element.removeClass('hide');
        },
        animate: function()
        {
            this.storeHideClasses();
            if (this.isToggleEffect())
			{
				return this.makeSimpleEffects();
            }

            this.$element.addClass('kubeanimated');
			this.$element.addClass(this.queue[0]);
            this.removeHideClass();

			var _callback = (this.queue.length > 1) ? null : this.completeCallback;
			this.complete('AnimationEnd', $.proxy(this.makeComplete, this), _callback);
        },
        makeSimpleEffects: function()
        {
           	if      (this.effect === 'show') this.removeHideClass();
            else if (this.effect === 'hide') this.revertHideClasses();

            if (typeof this.completeCallback === 'function') this.completeCallback(this);
        },
		makeComplete: function()
		{
            if (this.$element.hasClass(this.queue[0]))
            {
				this.clean();
				this.queue.shift();

				if (this.queue.length) this.animate();
			}
		},
        complete: function(type, make, callback)
		{
    		var event = type.toLowerCase() + ' webkit' + type + ' o' + type + ' MS' + type;

			this.$element.one(event, $.proxy(function()
			{
				if (typeof make === 'function')     make();
				if (this.isHideableEffect())        this.revertHideClasses();
				if (this.isSlideEffect())           this.removeElementHeight();
				if (typeof callback === 'function') callback(this);

				this.$element.off(event);

			}, this));
		},
		clean: function()
		{
			this.$element.removeClass('kubeanimated').removeClass(this.queue[0]);
		}
    };

    // Inheritance
    Kube.Animation.inherits(Kube);

}(Kube));

// Plugin
(function($)
{
    $.fn.animation = function(effect, callback)
    {
        var name = 'fn.animation';

        return this.each(function()
        {
            var $this = $(this), data = $this.data(name);

            $this.data(name, {});
            $this.data(name, (data = new Kube.Animation(this, effect, callback)));
        });
    };

    $.fn.animation.options = {};

})(jQuery);