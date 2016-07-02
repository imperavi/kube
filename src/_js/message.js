(function(Kube)
{
    Kube.Alert = SuperKube.plugin('message', {

        opts: {
            target: null,
            top: '16px',
            right: '16px',
            position: 'right', // center
            click: true,
            delay: 3, // message autohide delay - seconds or false
            animation: {
                open: {
                    name: 'fadeIn',
                    duration: 0.35,
                    timing: 'linear'
                },
                close: {
                    name: 'fadeOut',
                    duration: 0.35,
                    timing: 'linear'
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
            this.$element.on('click.component.message', $.proxy(this.open, this));

            // close link
    		this.$close = this.getCloseLink();
    		this.$close.on('click.component.message', $.proxy(this.close, this));
    	},
    	getCloseLink: function()
    	{
            return this.$target.find('.close');
    	},
        setPosition: function()
        {
            this.opts.top = (this.isLine()) ? 0 : this.opts.top;

            if (this.opts.position === 'center' || this.isLine())
            {
                this.$target.css({ 'top': this.opts.top, 'right': '', 'left': '50%' });
                this.$target.css({ 'margin-left': '-' + this.$target.innerWidth()/2 + 'px' });
            }
            else
            {
                this.$target.css({ 'top': this.opts.top, 'right': this.opts.right, 'left': '' });
            }
        },
        open: function()
        {
            if (this.isOpened())
            {
                return;
            }

            this.closeAll();
            this.setPosition();

            this.callback('open');
            this.$target.addClass('open').animation(this.opts.animation.open, $.proxy(this.opened, this));

        },
        opened: function()
        {
    		$(document).on('keyup.component.message', $.proxy(this.handleKeyboard, this));

            this.$target.addClass('open');

    		if (this.opts.click)
    		{
    			this.$target.on('click.component.message', $.proxy(this.close, this));
            }

    		if (this.opts.delay !== false)
    		{
    			this.timeout = setTimeout($.proxy(this.close, this), this.opts.delay * 1000);
            }

            this.callback('opened');
        },
        closeAll: function()
        {
            $(document).off('keyup.component.message');
            $('.message').not(this.$target[0]).hide().removeClass('open');
            clearTimeout(this.timeout);
        },
    	handleKeyboard: function(e)
    	{
    		return (e.which === 27) ? this.close() : true;
    	},
    	close: function(e)
    	{
            if (this.isClosed())
            {
                return;
            }

    		if (e && e.preventDefault)
    		{
    			e.preventDefault();
    		}

            this.callback('close');
    		this.$target.off('click.component.message').animation(this.opts.animation.close, $.proxy(this.closed, this));
    	},
    	closed: function()
    	{
    		this.$target.removeClass('open');
    		$(document).off('keyup.component.message');
    		clearTimeout(this.timeout);
    		this.callback('closed');
    	},
    	isLine: function()
    	{
            return this.$target.hasClass('line');
    	},
        isOpened: function()
        {
            return this.$target.hasClass('open');
        },
        isClosed: function()
        {
            return !this.$target.hasClass('open');
        }

    });

}(Kube));