
// Direct Load
(function($)
{
    $.modalcurrent = null;
	$.modalwindow = function(options)
	{
		if (typeof this.element === 'undefined')
		{
			this.element = document.createElement('span');
		}

		if (typeof options === 'string')
		{
			var args = Array.prototype.slice.call(arguments, 1);
			$(this.element).modal(options, args[0]);
		}
		else
		{
			options.show = true;
			$(this.element).modal(options);

		}
	};

})(jQuery);

(function(Kube)
{
    Kube.Modal = SuperKube.plugin('modal', {

    	opts: {

            target: null,
    		url: false,
    		header: false,
    		width: '600px', // string
    		height: false, // or string
    		maxHeight: false,
    		position: 'center', // top or center
    		show: false,
    		overlay: true,
    		appendForms: false,
    		appendFields: false,
    		animation: {
        		open: {
            		name: 'show',
            		timing: 'linear',
            		duration: 0.25
        		},
        		close: {
            		name: 'hide',
            		timing: 'linear',
            		duration: 0.25
        		}
    		},
    		callbacks: ['open', 'opened', 'close', 'closed']
    	},
    	init: function()
    	{
        	Kube.apply(this, arguments);

    		if (this.opts.target === null)
    		{
    			return;
    		}

    		this.$target = $(this.opts.target);
    		if (this.$target.length === 0)
    		{
        		return;
    		}

    		if (this.opts.show)
    		{
    			this.load(false);
    		}
    		else
    		{
    			this.$element.on('mousedown.component.modal', $.proxy(this.load, this));
    		}
    	},
    	load: function(e)
    	{
    		if (e && e.preventDefault)
    		{
    			e.preventDefault();
    		}

    		if (this.$element.hasClass('in'))
    		{
    			return;
    		}

    		this.buildModal();
    		this.buildOverlay();
    		this.buildHeader();

    		if (this.opts.url)
    		{
        		this.buildContent();
            }
            else
            {
                this.open();
            }
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
    			this.$overlay = $('<div id="modal-overlay">').hide();
    			$('body').prepend(this.$overlay);
    		}

    		this.$overlay.addClass('overlay');
    	},
    	buildHeader: function()
    	{
        	if (this.opts.header)
        	{
    		    this.$header.html(this.opts.header);
    		}
    	},
    	buildContent: function()
    	{
    		var params = '';
    		params = this.appendForms(params);
    		params = this.appendFields(params);

    		$.ajax({
    			url: this.opts.url + '?' + new Date().getTime(),
    			cache: false,
    			type: 'post',
    			data: params,
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

    		if (this.isMobile())
    		{
    			top = '2%';
    		}
    		else if (height > windowHeight)
    		{
    			top = '16px';
    		}

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
    			this.opts.animation.open.name = 'show';
    			this.opts.animation.close.name = 'hide';
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
    		this.$close.on('click.component.modal', $.proxy(this.close, this));
    		$(document).on('keyup.component.modal', $.proxy(this.handleEscape, this));
    		this.$target.on('click.component.modal', $.proxy(this.close, this));
    	},
    	disableEvents: function()
    	{
    		this.$close.off('.component.modal');
    		$(document).off('.component.modal');
    		this.$target.off('.component.modal');
    		$(window).off('.component.modal');
    	},
    	findActions: function()
    	{
    		this.$body.find('[data-action="modal-close"]').on('mousedown.component.modal', $.proxy(this.close, this));
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
    	open: function()
    	{
    		if (this.isOpened())
    		{
    			return;
    		}

    		if (this.isMobile())
    		{
    			this.opts.width = '96%';
    		}

    		if (this.opts.overlay)
    		{
    			this.$overlay.show();
    		}

    		this.$target.removeClass('hide').show();

            this.enableEvents();
    		this.findActions();

    		this.resize();
    		$(window).on('resize.component.modal', $.proxy(this.resize, this));

    		if (this.isDesktop())
    		{
    			this.disableBodyScroll();
    		}

    		// enter
    		this.$modal.find('input[type=text],input[type=url],input[type=email]').on('keydown.component.modal', $.proxy(this.handleEnter, this));

    		this.callback('open');
    		this.$modal.animation(this.opts.animation.open, $.proxy(this.opened, this));

    	},
    	opened: function()
    	{
    		this.$modal.addClass('open');
            this.callback('opened');

            $.modalcurrent = this;
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
    	close: function(e)
    	{
    		if (!this.$modal || this.isClosed())
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

    		this.$modal.animation(this.opts.animation.close, $.proxy(this.closed, this));

            if (this.opts.overlay)
    		{
    		    this.$overlay.animation(this.opts.animation.close);
            }
    	},
    	closed: function()
    	{
    		this.callback('closed');

            this.$target.addClass('hide');
            this.$modal.removeClass('open');

    		if (this.isDesktop())
    		{
    			this.enableBodyScroll();
    		}

    		this.$body.css('height', '');
            $.modalcurrent = null;
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
    	},
    	isOpened: function()
    	{
        	return this.$modal.hasClass('open');
    	},
    	isClosed: function()
    	{
        	return !this.$modal.hasClass('open');
    	},
    	destroy: function()
    	{
    		this.$element.off('.component.modal');

    		this.enableBodyScroll();
    		this.disableEvents();

    		this.$body.css('height', '');
    		this.$target.addClass('hide');

    		if (this.opts.overlay)
    		{
    			this.$overlay.remove();
    		}
    	}
    });

}(Kube));