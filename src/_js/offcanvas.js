(function(Kube)
{
    Kube.Offcanvas = SuperKube.plugin('offcanvas', {

    	opts: {

    		target: null, // selector
    		push: true, // boolean
    		width: '250px', // string
    		direction: 'left', // string: left or right
    		event: 'click',
    		clickOutside: true, // boolean
    		animation: {
        		open: {
            		name: 'slideInLeft',
                    duration: 0.3,
                    timing: 'linear'
                },
        		close: {
            		name: 'slideOutLeft',
    				duration: 0.2,
    				timing: 'linear'
                }
            },
    		callbacks: ['open', 'opened', 'close', 'closed'],

    		// private
    		onlymobile: true // boolean
    	},
    	init: function()
    	{
        	Kube.apply(this, arguments);

    		if (typeof this.opts.target === null)
    		{
    			return;
    		}

    		this.$target = $(this.opts.target);
    		this.opts.onlymobile = (this.$target.hasClass('hide-on-small'));

    		// build
    		this.opts.width = ($(window).width() < parseInt(this.opts.width)) ? '100%' : this.opts.width;
            this.$element.addClass('offcanvas-element').on(this.opts.event + '.component.offcanvas', $.proxy(this.toggle, this));

            this.buildDirectionAnimation();

            // close link
            this.$close = this.getCloseLink();
    	},
    	buildDirectionAnimation: function()
    	{
            if (this.opts.direction === 'right')
            {
                this.opts.animation.open.name = 'slideInRight';
    			this.opts.animation.close.name = 'slideOutRight';
            }
    	},
    	getCloseLink: function()
    	{
            return this.$target.find('.close');
    	},
    	toggle: function(e)
    	{
        	if (e)
        	{
    		    e.preventDefault();
    		}

    		return (this.isClosed()) ? this.open() : this.close();
    	},
    	open: function()
    	{
    		var $el = $(document).find('.offcanvas');
    		if ($el.length !== 0 && $el.hasClass('open'))
    		{
                // close all
                $(document).off('.component.offcanvas');
                $el.css('width', '').hide().removeClass('open offcanvas offcanvas-left offcanvas-right');
    		}

    		this.callback('open');
            this.$target.css('width', this.opts.width).addClass('offcanvas offcanvas-' + this.opts.direction);

            if (this.opts.onlymobile)
            {
                this.$target.removeClass('hide-on-small');
            }

            this.push();
    		this.$target.addClass('open').animation(this.opts.animation.open, $.proxy(this.opened, this));
    	},
    	push: function()
    	{
            if (this.opts.push)
            {
                var properties = (this.opts.direction === 'left') ? { 'left': this.opts.width } : { 'left': '-' + this.opts.width };
                $('body').addClass('offcanvas-push-body').animate(properties, this.opts.animation.open.duration * 1000);
            }
    	},
    	opened: function()
    	{
    		if (this.opts.clickOutside)
    		{
    			$(document).on('click.component.offcanvas', $.proxy(this.close, this));
    		}

    		if (this.isMobileScreen())
    		{
    			$('html').addClass('no-scroll');
    		}

            $(document).on('keyup.component.offcanvas', $.proxy(this.handleKeyboard, this));
            this.$close.on('click.component.offcanvas', $.proxy(this.close, this));
    		this.disableBodyScroll();
            this.callback('opened');
    	},
    	handleKeyboard: function(e)
    	{
    		return (e.which === 27) ? this.close() : true;
    	},
    	close: function(e)
    	{
        	if (e && ($(e.target).closest('.offcanvas').length !== 0 && !$(e.target).hasClass('close')))
        	{
            	return;
        	}

    		this.enableBodyScroll();
    		this.callback('close');

            this.pull();
    		this.$target.removeClass('open').animation(this.opts.animation.close, $.proxy(this.closed, this));
    	},
    	pull: function()
    	{
            if (this.opts.push)
            {
                $('body').animate({ left: 0 }, this.opts.animation.close.duration * 1000, function()
                {
                    $(this).removeClass('offcanvas-push-body');
                });
            }
    	},
    	closed: function()
    	{
    		if (this.isMobileScreen())
    		{
    			$('html').removeClass('no-scroll');
    		}

            if (this.opts.onlymobile)
            {
                this.$target.addClass('hide-on-small').css('display', '');
            }

            this.$target.css('width', '').removeClass('offcanvas offcanvas-' + this.opts.direction);
            this.$close.off('.component.offcanvas');
    		$(document).off('.component.offcanvas');
    		this.callback('closed');
    	},
        isClosed: function()
        {
            return !this.$target.hasClass('open');
        },
        isOpened: function()
        {
            return this.$target.hasClass('open');
        }

    });

}(Kube));