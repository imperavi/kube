/**
 * @library Kube Toggleme
 * @author Imperavi LLC
 * @license MIT
 */
(function(Kube)
{
    Kube.Toggleme = function(element, options)
    {
        this.namespace = 'toggleme';
        this.defaults = {
            toggleEvent: 'click',
            target: null,
            text: '',
            animationOpen: 'slideDown',
            animationClose: 'slideUp',
            callbacks: ['open', 'opened', 'close', 'closed']
        };

        // Parent Constructor
        Kube.apply(this, arguments);

        // Initialization
        this.start();
    };

    // Functionality
    Kube.Toggleme.prototype = {
        start: function()
        {
            if (!this.hasTarget()) return;

            this.$element.on(this.opts.toggleEvent + '.' + this.namespace, $.proxy(this.toggle, this));
        },
        stop: function()
        {
            this.$element.off('.' + this.namespace);
            this.revertText();
        },
        toggle: function(e)
        {
            if (this.isOpened()) this.close(e);
            else                 this.open(e);
        },
        open: function(e)
        {
            if (e) e.preventDefault();

            if (!this.isOpened())
            {
                this.storeText();
                this.callback('open');
                this.$target.animation('slideDown', $.proxy(this.onOpened, this));

                // changes the text of $element with a less delay to smooth
                setTimeout($.proxy(this.replaceText, this), 100);
    		}
        },
        close: function(e)
        {
            if (e) e.preventDefault();

            if (this.isOpened())
            {
                this.callback('close');
                this.$target.animation('slideUp', $.proxy(this.onClosed, this));
    		}
        },
    	isOpened: function()
        {
            return (this.$target.hasClass('open'));
        },
        onOpened: function()
        {
            this.$target.addClass('open');
         	this.callback('opened');
        },
        onClosed: function()
        {
            this.$target.removeClass('open');
            this.revertText();
        	this.callback('closed');
        },
        storeText: function()
        {
            this.$element.data('replacement-text', this.$element.html());
        },
        revertText: function()
        {
            var text = this.$element.data('replacement-text');
            if (text) this.$element.html(text);

            this.$element.removeData('replacement-text');
        },
        replaceText: function()
        {
            if (this.opts.text !== '')
            {
                this.$element.html(this.opts.text);
            }
        }
    };

    // Inheritance
    Kube.Toggleme.inherits(Kube);

    // Plugin
    Kube.Plugin.create('Toggleme');
    Kube.Plugin.autoload('Toggleme');

}(Kube));