/**
 * @library Kube Modal
 * @author Imperavi LLC
 * @license MIT
 */
(function($)
{
    $.modalcurrent = null;
	$.modalwindow = function(options)
	{
    	var opts = $.extend({}, options, { show: true });
    	var $element = $('<span />');

    	$element.modal(opts);
	};

})(jQuery);

(function(Kube)
{
    Kube.Modal = function(element, options)
    {
        this.namespace = 'modal';
        this.defaults = {
            target: null,
            show: false,
    		url: false,
    		header: false,
    		width: '600px', // string
    		height: false, // or string
    		maxHeight: false,
    		position: 'center', // top or center
    		overlay: true,
    		appendForms: false,
    		appendFields: false,
    		animationOpen: 'show',
        	animationClose: 'hide',
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
    Kube.Modal.prototype = {
        start: function()
        {
            if (!this.hasTarget())
    		{
    			return;
    		}

            if (this.opts.show) this.load();
    		else this.$element.on('click.' + this.namespace, $.proxy(this.load, this));
    	},
    	buildModal: function()
    	{
    		this.$modal = this.$target.find('.modal');
    		this.$header = this.$target.find('.modal-header');
    		this.$close = this.$target.find('.close');
    		this.$body = this.$target.find('.modal-body');
    	},
    	buildOverlay: function()
    	{
    		if (this.opts.overlay === false)
    		{
    			return;
    		}

    		if ($('#modal-overlay').length !== 0)
    		{
    			this.$overlay = $('#modal-overlay');
    		}
    		else
    		{
    			this.$overlay = $('<div id="modal-overlay">').addClass('hide');
    			$('body').prepend(this.$overlay);
    		}

    		this.$overlay.addClass('overlay');
    	},
    	buildHeader: function()
    	{
        	if (this.opts.header) this.$header.html(this.opts.header);
    	},
    	load: function(e)
    	{
    		this.buildModal();
    		this.buildOverlay();
    		this.buildHeader();

            if (this.opts.url) this.buildContent();
            else               this.open(e);
    	},
    	open: function(e)
    	{
        	if (e) e.preventDefault();

            if (this.isOpened())
    		{
    			return;
    		}

    		if (this.detect.isMobile()) this.opts.width = '96%';
    		if (this.opts.overlay)      this.$overlay.removeClass('hide');

    		this.$target.removeClass('hide');
    		this.$modal.removeClass('hide');

            this.enableEvents();
    		this.findActions();

    		this.resize();
    		$(window).on('resize.' + this.namespace, $.proxy(this.resize, this));

    		if (this.detect.isDesktop()) this.utils.disableBodyScroll();

    		// enter
    		this.$modal.find('input[type=text],input[type=url],input[type=email]').on('keydown.' + this.namespace, $.proxy(this.handleEnter, this));

    		this.callback('open');
    		this.$modal.animation(this.opts.animationOpen, $.proxy(this.onOpened, this));
        },
        close: function(e)
        {
            if (!this.$modal || !this.isOpened())
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

    		this.callback('close');
    		this.disableEvents();

    		this.$modal.animation(this.opts.animationClose, $.proxy(this.onClosed, this));

            if (this.opts.overlay) this.$overlay.animation(this.opts.animationClose);
        },
    	onOpened: function()
    	{
    		this.$modal.addClass('open');
            this.callback('opened');

            $.modalcurrent = this;
    	},
    	onClosed: function()
    	{
    		this.callback('closed');

            this.$target.addClass('hide');
            this.$modal.removeClass('open');

    		if (this.detect.isDesktop()) this.utils.enableBodyScroll();

    		this.$body.css('height', '');
            $.modalcurrent = null;
    	},
    	isOpened: function()
    	{
        	return (this.$modal.hasClass('open'));
    	},
    	getData: function()
    	{
            var formdata = new Kube.FormData(this);
            formdata.set('');

            return formdata.get();
    	},
    	buildContent: function()
    	{
    		$.ajax({
    			url: this.opts.url + '?' + new Date().getTime(),
    			cache: false,
    			type: 'post',
    			data: this.getData(),
    			success: $.proxy(function(data)
    			{
    				this.$body.html(data);
    				this.open();

    			}, this)
    		});
    	},
    	buildWidth: function()
    	{
    		var width = this.opts.width;
    		var top = '2%';
    		var bottom = '2%';
    		var percent = width.match(/%$/);

    		if ((parseInt(this.opts.width) > $(window).width()) && !percent)
    		{
                width = '96%';
    		}
    		else if (!percent)
    		{
                top = '16px';
                bottom = '16px';
    		}

    		this.$modal.css({ 'width': width, 'margin-top': top, 'margin-bottom': bottom });

    	},
    	buildPosition: function()
    	{
    		if (this.opts.position !== 'center')
    		{
    			return;
    		}

    		var windowHeight = $(window).height();
    		var height = this.$modal.outerHeight();
    		var top = (windowHeight/2 - height/2) + 'px';

    		if (this.detect.isMobile())     top = '2%';
    		else if (height > windowHeight) top = '16px';

    		this.$modal.css('margin-top', top);
    	},
    	buildHeight: function()
    	{
    		var windowHeight = $(window).height();

    		if (this.opts.maxHeight)
    		{
        		var padding = parseInt(this.$body.css('padding-top')) + parseInt(this.$body.css('padding-bottom'));
        		var margin = parseInt(this.$modal.css('margin-top')) + parseInt(this.$modal.css('margin-bottom'));
    			var height = windowHeight - this.$header.innerHeight() - padding - margin;

    			this.$body.height(height);
    		}
    		else if (this.opts.height !== false)
    		{
    			this.$body.css('height', this.opts.height);
    		}

    		var modalHeight = this.$modal.outerHeight();
    		if (modalHeight > windowHeight)
    		{
    			this.opts.animationOpen = 'show';
    			this.opts.animationClose = 'hide';
    		}
    	},
    	resize: function()
    	{
    		this.buildWidth();
    		this.buildPosition();
    		this.buildHeight();
    	},
    	enableEvents: function()
    	{
    		this.$close.on('click.' + this.namespace, $.proxy(this.close, this));
    		$(document).on('keyup.' + this.namespace, $.proxy(this.handleEscape, this));
    		this.$target.on('click.' + this.namespace, $.proxy(this.close, this));
    	},
    	disableEvents: function()
    	{
    		this.$close.off('.' + this.namespace);
    		$(document).off('.' + this.namespace);
    		this.$target.off('.' + this.namespace);
    		$(window).off('.' + this.namespace);
    	},
    	findActions: function()
    	{
    		this.$body.find('[data-action="modal-close"]').on('mousedown.' + this.namespace, $.proxy(this.close, this));
    	},
    	setHeader: function(header)
    	{
    		this.$header.html(header);
    	},
    	setContent: function(content)
    	{
    		this.$body.html(content);
    	},
    	setWidth: function(width)
    	{
    		this.opts.width = width;
    		this.resize();
    	},
    	getModal: function()
    	{
            return this.$modal;
    	},
    	getBody: function()
    	{
            return this.$body;
    	},
    	getHeader: function()
    	{
            return this.$header;
    	},
    	handleEnter: function(e)
    	{
        	if (e.which === 13)
        	{
            	e.preventDefault();
            	this.close(false);
            }
    	},
    	handleEscape: function(e)
    	{
        	return (e.which === 27) ? this.close(false) : true;
    	},
    	shouldNotBeClosed: function(el)
    	{
            if ($(el).attr('data-action') === 'modal-close' || el === this.$close[0])
            {
                return false;
        	}
        	else if ($(el).closest('.modal').length === 0)
        	{
            	return false;
        	}

        	return true;
    	}
    };

    // Inheritance
    Kube.Modal.inherits(Kube);

    // Plugin
    Kube.Plugin.create('Modal');
    Kube.Plugin.autoload('Modal');

}(Kube));