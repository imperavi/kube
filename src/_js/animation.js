(function($)
{
	$.fn.animation = function(animation, options, callback)
	{
		return this.each(function()
		{
			return new Animation(this, animation, options, callback);
		});
	};

	function Animation(element, animation, options, callback)
	{
		// default
		var opts = {
    		name: 'show',
			duration: 0.5,
			iterate: 1,
			delay: 0,
			prefix: '',
			timing: 'linear'
		};

        // animation name or options
		if (typeof animation === 'object')
		{
    		callback = options;
    		options = animation;
		}
		else
		{
    		opts.name = animation;
		}

		// options or callback
		if (typeof options === 'function')
		{
			callback = options;
			this.opts = opts;
		}
		else
		{
			this.opts = $.extend(opts, options);
		}

		this.slide = (this.opts.name === 'slideDown' || this.opts.name === 'slideUp');
		this.$element = $(element);
		this.prefixes = ['', '-moz-', '-o-animation-', '-webkit-'];
		this.queue = [];

		// slide
		if (this.slide)
		{
			this.$element.height(this.$element.height());
		}

		// init
		this.init(callback);
	}

    Animation.prototype = {

		init: function(callback)
		{
			this.queue.push(this.opts.name);
			this.clean();

			if (this.opts.name === 'show')
			{
    			this.$element.removeClass('hide').show();
            }
            else if (this.opts.name === 'hide')
            {
                this.$element.hide();
            }

			if (this.opts.name === 'show' || this.opts.name === 'hide')
			{
				this.opts.timing = 'linear';

				if (typeof callback === 'function')
				{
                    setTimeout(callback, this.opts.duration * 1000);
				}
			}
			else
			{
				this.animate(callback);
			}

		},
		animate: function(callback)
		{
			this.$element.addClass('animated').css('display', 'block').removeClass('hide');
			this.$element.addClass(this.opts.prefix + this.queue[0]);

			this.set(this.opts.duration + 's', this.opts.delay + 's', this.opts.iterate, this.opts.timing);
			var _callback = (this.queue.length > 1) ? null : callback;
			this.complete('AnimationEnd', $.proxy(this.makeComplete, this), _callback);
		},
		set: function(duration, delay, iterate, timing)
		{
			var len = this.prefixes.length;

			while (len--)
			{
				this.$element.css(this.prefixes[len] + 'animation-duration', duration);
				this.$element.css(this.prefixes[len] + 'animation-delay', delay);
				this.$element.css(this.prefixes[len] + 'animation-iteration-count', iterate);
				this.$element.css(this.prefixes[len] + 'animation-timing-function', timing);
			}
		},
		clean: function()
		{
			this.$element.removeClass('animated').removeClass(this.opts.prefix + this.queue[0]);
			this.set('', '', '', '');
		},
		makeComplete: function()
		{
            if (this.$element.hasClass(this.opts.prefix + this.queue[0]))
            {
				this.clean();
				this.queue.shift();

				if (this.queue.length)
				{
					this.animate(callback);
				}
			}
		},
		complete: function(type, make, callback)
		{
			this.$element.one(type.toLowerCase() + ' webkit' + type + ' o' + type + ' MS' + type, $.proxy(function()
			{
				if (typeof make === 'function')
				{
					make();
				}

				// hide
				var effects = ['fadeOut', 'slideUp', 'zoomOut', 'slideOutUp', 'slideOutRight', 'slideOutLeft'];
				if ($.inArray(this.opts.name, effects) !== -1)
				{
					this.$element.css('display', 'none');
				}

				// slide
				if (this.slide)
				{
					this.$element.css('height', '');
				}

				if (typeof callback === 'function')
				{
					callback(this);
				}

			}, this));
		}
	};

})(jQuery);