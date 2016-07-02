(function(Kube)
{
    Kube.Dropdown = SuperKube.plugin('dropdown', {

    	opts: {

    		target: null,
    		height: false, // integer
    		width: false, // integer
    		animation: {
        		open: {
            		name: 'slideDown',
            		duration: 0.15,
            		timing: 'linear'
        		},
        		close: {
            		name: 'slideUp',
                    duration: 0.1,
                    timing: 'linear'
        		}
    		},
    		callbacks: ['open', 'opened', 'close', 'closed'],

    		// private
    		caretUp: false

    	},
    	init: function()
    	{
        	Kube.apply(this, arguments);

            if (this.opts.target === null)
            {
                return;
            }

    		this.$target = $(this.opts.target);
    		this.$target.hide();

    		if (this.isMobile())
    		{
                this.buildMobileAnimation();
    		}

    		this.$close = this.$target.find('.close');

            this.$caret = this.getCaret();
    		this.buildCaretPosition();

    		this.$element.on('click.component.dropdown', $.proxy(this.toggle, this));
    	},
    	buildMobileAnimation: function()
    	{
            this.opts.animationOpen = 'fadeIn';
            this.opts.animationClose = 'fadeOut';
    	},
    	getCaret: function()
    	{
        	return this.$element.find('.caret');
    	},
    	buildCaretPosition: function()
    	{
    		var height = this.$element.offset().top + this.$element.innerHeight() + this.$target.innerHeight();

    		if ($(document).height() > height)
    		{
    			return;
    		}

            this.opts.caretUp = true;
    		this.$caret.addClass('up');
    	},
    	toggleCaretOpen: function()
    	{
    		if (this.opts.caretUp)
    		{
        		this.$caret.removeClass('up').addClass('down');
    		}
    		else
    		{
        		this.$caret.removeClass('down').addClass('up');
    		}
    	},
    	toggleCaretClose: function()
    	{
    		if (this.opts.caretUp)
    		{
        		this.$caret.removeClass('down').addClass('up');
    		}
    		else
    		{
        		this.$caret.removeClass('up').addClass('down');
    		}
    	},
    	toggle: function(e)
    	{
    		return (this.isClosed()) ? this.open(e) : this.close(e);
    	},
    	getPlacement: function(height)
    	{
    		return ($(document).height() < height) ? 'top' : 'bottom';
    	},
    	getOffset: function(position)
    	{
    		return (this.isNavigationFixed()) ? this.$element.position() : this.$element.offset();
    	},
    	getPosition: function()
    	{
    		return (this.isNavigationFixed()) ? 'fixed' : 'absolute';
    	},
    	setPosition: function()
    	{
    		if (this.isMobile())
    		{
                this.$target.addClass('dropdown-mobile');
    		}
    		else
    		{
    			var position = this.getPosition();
    			var coords = this.getOffset(position);
    			var height = this.$target.innerHeight();
    			var width = this.$target.innerWidth();
    			var placement = this.getPlacement(coords.top + height + this.$element.innerHeight());

    			var leftFix = ($(window).width() < (coords.left + width)) ? (width - this.$element.innerWidth()) : 0;
    			var top, left = coords.left - leftFix;

    			if (placement === 'bottom')
    			{
        			if (this.isClosed())
                    {
        				this.$caret.removeClass('up').addClass('down');
                    }

    				this.opts.caretUp = false;

    				top = coords.top + this.$element.outerHeight() + 1;
    			}
    			else
    			{
    				this.opts.animation.open.name = 'show';
    				this.opts.animation.close.name = 'hide';

                    if (this.isClosed())
                    {
    				    this.$caret.addClass('up').removeClass('down');
    				}

    				this.opts.caretUp = true;

    				top = coords.top - height - 1;
    			}

    			this.$target.css({ position: position, top: top + 'px', left: left + 'px' });
    		}

    	},
    	enableEvents: function()
    	{
    		if (this.isDesktop())
    		{
    			this.$target.on('mouseover.component.dropdown', $.proxy(this.disableBodyScroll, this)).on('mouseout.component.dropdown', $.proxy(this.enableBodyScroll, this));
    		}

    		$(document).on('scroll.component.dropdown', $.proxy(this.setPosition, this));
    		$(window).on('resize.component.dropdown', $.proxy(this.setPosition, this));
    		$(document).on('click.component.dropdown touchstart.component.dropdown', $.proxy(this.close, this));
    		$(document).on('keydown.component.dropdown', $.proxy(this.handleKeyboard, this));
    		this.$target.find('[data-action="dropdown-close"]').on('click.component.dropdown', $.proxy(this.close, this));
    	},
    	disableEvents: function()
    	{
    		this.$target.off('.component.dropdown');
    		$(document).off('.component.dropdown');
    		$(window).off('.component.dropdown');
    	},
    	open: function(e)
    	{
        	if (e)
        	{
       			e.preventDefault();
        	}

    		this.callback('open');

    		$('.dropdown').removeClass('open').hide();

    		if (this.opts.height)
    		{
    			this.$target.css('min-height', this.opts.height + 'px');
    		}

    		if (this.opts.width)
    		{
    			this.$target.width(this.opts.width);
    		}

    		this.setPosition();
    		this.toggleCaretOpen();

    		this.$target.addClass('open').animation(this.opts.animation.open, $.proxy(this.opened, this));

    	},
    	opened: function()
    	{
    		this.enableEvents();
    		this.callback('opened');

    	},
    	handleKeyboard: function(e)
    	{
    		return (e.which === 27) ? this.close(e) : true;
    	},
    	shouldNotBeClosed: function(el)
    	{
            if ($(el).attr('data-action') === 'dropdown-close' || el === this.$close[0])
            {
                return false;
        	}
        	else if ($(el).closest('.dropdown').length === 0)
        	{
            	return false;
        	}

        	return true;
    	},
    	close: function(e)
    	{

            if (this.isClosed())
    		{
    			return;
    		}

    		if (e)
    		{

    			if (this.shouldNotBeClosed(e.target))
    			{
    				return;
    			}

    			e.preventDefault();
    		}

    		this.enableBodyScroll();
    		this.callback('close');
    		this.toggleCaretClose();
    		this.$target.removeClass('open').animation(this.opts.animation.close, $.proxy(this.closed, this));
    	},
    	closed: function()
    	{
    		this.disableEvents();
    		this.callback('closed');
    	},
    	isOpened: function()
    	{
        	return this.$target.hasClass('open');
    	},
    	isClosed: function()
    	{
        	return !this.$target.hasClass('open');
    	},
    	isNavigationFixed: function()
    	{
        	return (this.$element.closest('.fixed').length !== 0);
    	}
    });

}(Kube));