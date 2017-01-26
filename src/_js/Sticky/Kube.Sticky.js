/**
 * @library Kube Sticky
 * @author Imperavi LLC
 * @license MIT
 */
(function(Kube)
{
    Kube.Sticky = function(element, options)
    {
        this.namespace = 'sticky';
        this.defaults = {
            classname: 'fixed',
            offset: 0, // pixels
            callbacks: ['fixed', 'unfixed']
        };

        // Parent Constructor
        Kube.apply(this, arguments);

        // Initialization
        this.start();
    };

    // Functionality
    Kube.Sticky.prototype = {
        start: function()
        {
    	    this.offsetTop = this.getOffsetTop();

    	    this.load();
    	    $(window).scroll($.proxy(this.load, this));
    	},
    	getOffsetTop: function()
    	{
        	return this.$element.offset().top;
    	},
    	load: function()
    	{
    		return (this.isFix()) ? this.fixed() : this.unfixed();
    	},
    	isFix: function()
    	{
            return ($(window).scrollTop() > (this.offsetTop + this.opts.offset));
    	},
    	fixed: function()
    	{
    		this.$element.addClass(this.opts.classname).css('top', this.opts.offset + 'px');
    		this.callback('fixed');
    	},
    	unfixed: function()
    	{
    		this.$element.removeClass(this.opts.classname).css('top', '');
    		this.callback('unfixed');
        }
    };

    // Inheritance
    Kube.Sticky.inherits(Kube);

    // Plugin
    Kube.Plugin.create('Sticky');
    Kube.Plugin.autoload('Sticky');

}(Kube));