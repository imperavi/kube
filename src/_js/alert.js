(function(Kube)
{
    Kube.Alert = SuperKube.plugin('alert', {

        opts: {
            click: false,
            animation: {
                open: {
                    name: 'fadeIn',
                    timing: 'linear',
                    duration: 0.5
                },
                close:
                {
                    name: 'fadeOut',
                    timing: 'linear',
                    duration: 0.5
                }
            },
            callbacks: ['open', 'opened', 'close', 'closed']
        },
        init: function()
        {
            Kube.apply(this, arguments);

            this.$close = this.getCloseLink();
            this.$close.on('click.component.alert', $.proxy(this.close, this));

            if (this.opts.click !== false)
            {
                this.$element.on('click.component.alert', $.proxy(this.close, this));
            }
        },
        getCloseLink: function()
        {
            return this.$element.find('.close');
        },
        isOpened: function()
        {
            return this.$element.hasClass('open');
        },
        isClosed: function()
        {
            return !this.$element.hasClass('open');
        },
        open: function(e)
        {
            if (e)
            {
                e.preventDefault();
            }

            this.callback('open');
            this.$element.animation(this.opts.animation.open, $.proxy(this.opened, this));
        },
        opened: function()
        {
            this.$element.removeClass('hide').addClass('open');
            this.callback('opened');
        },
        close: function(e)
        {
            if (e)
            {
                e.preventDefault();
            }

            this.callback('close');
            this.$element.animation(this.opts.animation.close, $.proxy(this.closed, this));
        },
        closed: function()
        {
            this.$element.addClass('hide').removeClass('open');
            this.callback('closed');
        },
        destroy: function()
        {
            this.$element.off('.component.alert').removeData();
            this.$close.remove();
        }
    });

}(Kube));