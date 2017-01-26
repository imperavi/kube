/**
 * @library Kube Message
 * @author Imperavi LLC
 * @license MIT
 */
(function(Kube)
{
    Kube.Message = function(element, options)
    {
        this.namespace = 'message';
        this.defaults = {
            closeSelector: '.close',
            closeEvent: 'click',
            animationOpen: 'fadeIn',
            animationClose: 'fadeOut',
            callbacks: ['open', 'opened', 'close', 'closed']
        };

        // Parent Constructor
        Kube.apply(this, arguments);

        // Initialization
        this.start();
    };

    // Functionality
    Kube.Message.prototype = {
        start: function()
        {
            this.$close = this.$element.find(this.opts.closeSelector);
            this.$close.on(this.opts.closeEvent + '.' + this.namespace, $.proxy(this.close, this));
            this.$element.addClass('open');
        },
        stop: function()
        {
            this.$close.off('.' + this.namespace);
            this.$element.removeClass('open');
        },
        open: function(e)
        {
            if (e) e.preventDefault();

            if (!this.isOpened())
            {
                this.callback('open');
                this.$element.animation(this.opts.animationOpen, $.proxy(this.onOpened, this));
            }
        },
        isOpened: function()
        {
            return this.$element.hasClass('open');
        },
        onOpened: function()
        {
            this.callback('opened');
            this.$element.addClass('open');
        },
        close: function(e)
        {
            if (e) e.preventDefault();

            if (this.isOpened())
            {
                this.callback('close');
                this.$element.animation(this.opts.animationClose, $.proxy(this.onClosed, this));
            }
        },
        onClosed: function()
        {
            this.callback('closed');
            this.$element.removeClass('open');
        }
    };

    // Inheritance
    Kube.Message.inherits(Kube);

    // Plugin
    Kube.Plugin.create('Message');
    Kube.Plugin.autoload('Message');

}(Kube));