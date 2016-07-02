(function(Kube)
{
    Kube.Toggleme = SuperKube.plugin('toggleme', {
        classname: 'toggleme',
        opts: {
            target: null, // selector or (next, parent+next, prev, parent+prev)
            text: '',
            animation: {
                open: {
                    name: 'slideDown',
                    duration: 0.5,
                    timing: 'cubic-bezier(0.175, 0.885, 0.320, 1.375)'
                },
                close: {
                    name: 'slideUp',
                    duration: 0.5,
                    timing: 'cubic-bezier(0.600, -0.280, 0.735, 0.045)'
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

            this.text = this.$element.text();
            this.$target = this.getTarget();
            this.$element.on('click.component.toggleme', $.proxy(this.toggle, this));
        },
        getTarget: function()
        {
    		switch (this.opts.target)
    		{
    			case "next":
    				return this.$element.next();

    			case "parent+next":
    				return this.$element.parent().next();

    			case "prev":
    				return this.$element.prev();

    			case "parent+prev":
    				return this.$element.parent().prev();

    			default:
    				return $(this.opts.target);
    		}
        },
        toggle: function(e)
        {
            if (e)
            {
                e.preventDefault();
            }

            return (this.isOpened()) ? this.close() : this.open();
        },
    	isOpened: function()
        {
            return this.$target.hasClass('open');
        },
        isClosed: function()
        {
            return !this.$target.hasClass('open');
        },
        open: function(e)
        {
            if (this.isOpened())
            {
    			return;
    		}

            this.callback('open');
            this.$target.removeClass('hide-on-small').animation(this.opts.animation.open, $.proxy(this.opened, this));

            // changes the text of $element with a less delay to smooth
    		setTimeout($.proxy(this.setOpenedText, this), this.opts.animation.open.duration * 500);
        },
        opened: function()
        {
            this.$target.addClass('open');
         	this.callback('opened');
        },
        setOpenedText: function()
        {
            if (this.opts.text !== '')
            {
                this.$element.text(this.opts.text);
            }
        },
        close: function(e)
        {
            if (this.isClosed())
            {
    			return;
    		}

            this.callback('close');
            this.$target.animation(this.opts.animation.close, $.proxy(this.closed, this));
        },
        closed: function()
        {
            this.$target.removeClass('open');
            this.setClosedText();
        	this.callback('closed');
        },
        setClosedText: function()
        {
            if (this.opts.text !== '')
            {
                this.$element.text(this.text);
            }
        },
    	destroy: function()
    	{
    		this.$target.hide().removeClass('open').removeData();
    		this.$element.off('.component.toggleme').removeData();
    	}
    });

}(Kube));