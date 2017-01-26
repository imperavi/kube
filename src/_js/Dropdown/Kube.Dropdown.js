/**
 * @library Kube Dropdown
 * @author Imperavi LLC
 * @license MIT
 */
(function(Kube)
{
    Kube.Dropdown = function(element, options)
    {
        this.namespace = 'dropdown';
        this.defaults = {
    		target: null,
    		toggleEvent: 'click',
    		height: false, // integer
    		width: false, // integer
    		animationOpen: 'slideDown',
        	animationClose: 'slideUp',
    		caretUp: false,
            callbacks: ['open', 'opened', 'close', 'closed']
        };

        // Parent Constructor
        Kube.apply(this, arguments);

        // Services
        this.utils = new Kube.Utils();
        this.detect = new Kube.Detect();

        // Initialization
        this.start();
    };

    // Functionality
    Kube.Dropdown.prototype = {
        start: function()
        {
            this.buildClose();
            this.buildCaret();

            if (this.detect.isMobile()) this.buildMobileAnimation();

            this.$target.addClass('hide');
            this.$element.on(this.opts.toggleEvent + '.' + this.namespace, $.proxy(this.toggle, this));

    	},
    	stop: function()
    	{
        	this.$element.off('.' + this.namespace);
            this.$target.removeClass('open').addClass('hide');
    		this.disableEvents();
    	},
    	buildMobileAnimation: function()
    	{
            this.opts.animationOpen = 'fadeIn';
            this.opts.animationClose = 'fadeOut';
    	},
    	buildClose: function()
    	{
            this.$close = this.$target.find('.close');
    	},
    	buildCaret: function()
    	{
            this.$caret = this.getCaret();
    		this.buildCaretPosition();
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
    	getCaret: function()
    	{
        	return this.$element.find('.caret');
    	},
    	toggleCaretOpen: function()
    	{
    		if (this.opts.caretUp) this.$caret.removeClass('up').addClass('down');
    		else                   this.$caret.removeClass('down').addClass('up');
    	},
    	toggleCaretClose: function()
    	{
    		if (this.opts.caretUp) this.$caret.removeClass('down').addClass('up');
    		else                   this.$caret.removeClass('up').addClass('down');
    	},
    	toggle: function(e)
    	{
        	if (this.isOpened()) this.close(e);
        	else                 this.open(e);
    	},
    	open: function(e)
    	{
        	if (e) e.preventDefault();

            this.callback('open');
    		$('.dropdown').removeClass('open').addClass('hide');

    		if (this.opts.height) this.$target.css('min-height', this.opts.height + 'px');
    		if (this.opts.width)  this.$target.width(this.opts.width);

    		this.setPosition();
    		this.toggleCaretOpen();

    		this.$target.animation(this.opts.animationOpen, $.proxy(this.onOpened, this));
    	},
    	close: function(e)
    	{
            if (!this.isOpened())
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

    		this.utils.enableBodyScroll();
    		this.callback('close');
    		this.toggleCaretClose();

    		this.$target.animation(this.opts.animationClose, $.proxy(this.onClosed, this));
    	},
    	onClosed: function()
    	{
            this.$target.removeClass('open');
    		this.disableEvents();
    		this.callback('closed');
    	},
    	onOpened: function()
    	{
    		this.$target.addClass('open');
    		this.enableEvents();
    		this.callback('opened');
    	},
    	isOpened: function()
    	{
        	return (this.$target.hasClass('open'));
    	},
    	enableEvents: function()
    	{
    		if (this.detect.isDesktop())
    		{
    			this.$target.on('mouseover.' + this.namespace, $.proxy(this.utils.disableBodyScroll, this.utils))
    			            .on('mouseout.' + this.namespace,  $.proxy(this.utils.enableBodyScroll, this.utils));
    		}

    		$(document).on('scroll.' + this.namespace, $.proxy(this.setPosition, this));
    		$(window).on('resize.' + this.namespace, $.proxy(this.setPosition, this));
     		$(document).on('click.' + this.namespace + ' touchstart.' + this.namespace, $.proxy(this.close, this));
    		$(document).on('keydown.' + this.namespace, $.proxy(this.handleKeyboard, this));
    		this.$target.find('[data-action="dropdown-close"]').on('click.' + this.namespace, $.proxy(this.close, this));
    	},
    	disableEvents: function()
    	{
    		this.$target.off('.' + this.namespace);
    		$(document).off('.' + this.namespace);
    		$(window).off('.' + this.namespace);
    	},
    	handleKeyboard: function(e)
    	{
    		if (e.which === 27) this.close(e);
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
        isNavigationFixed: function()
    	{
        	return (this.$element.closest('.fixed').length !== 0);
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
    		if (this.detect.isMobile())
    		{
                this.$target.addClass('dropdown-mobile');
                return;
    		}

    		var position = this.getPosition();
			var coords = this.getOffset(position);
			var height = this.$target.innerHeight();
			var width = this.$target.innerWidth();
			var placement = this.getPlacement(coords.top + height + this.$element.innerHeight());
			var leftFix = ($(window).width() < (coords.left + width)) ? (width - this.$element.innerWidth()) : 0;
			var top, left = coords.left - leftFix;

			if (placement === 'bottom')
			{
    			if (!this.isOpened()) this.$caret.removeClass('up').addClass('down');

				this.opts.caretUp = false;
				top = coords.top + this.$element.outerHeight() + 1;
			}
			else
			{
				this.opts.animationOpen = 'show';
				this.opts.animationClose = 'hide';

                if (!this.isOpened()) this.$caret.addClass('up').removeClass('down');

				this.opts.caretUp = true;
				top = coords.top - height - 1;
			}

			this.$target.css({ position: position, top: top + 'px', left: left + 'px' });
    	}
    };

    // Inheritance
    Kube.Dropdown.inherits(Kube);

    // Plugin
    Kube.Plugin.create('Dropdown');
    Kube.Plugin.autoload('Dropdown');

}(Kube));