(function(Kube)
{
    Kube.Sticky = SuperKube.plugin('sticky', {

        classname: 'sticky',
        opts: {
    		offset: 0, // int
    		callbacks: ['fixed', 'unfixed']
        },
    	init: function()
    	{
        	Kube.apply(this, arguments);

    	    this.offsetTop = this.getOffsetTop();

    	    this.fixing();
    	    $(window).scroll($.proxy(this.fixing, this));
    	},
    	getOffsetTop: function()
    	{
        	return this.$element.offset().top;
    	},
    	fixing: function()
    	{
    		if (this.isMobileScreen())
    		{
    			return this.unfixed();
    		}

    		return (this.isFixingNeeded()) ? this.fixed() : this.unfixed();
    	},
    	isFixingNeeded: function()
    	{
            return ($(window).scrollTop() > (this.offsetTop + this.opts.offset));
    	},
    	fixed: function()
    	{
    		this.$element.addClass('fixed');
    		this.callback('fixed');
    	},
    	unfixed: function()
    	{
    		this.$element.removeClass('fixed');
    		this.callback('unfixed');
    	}
    });

}(Kube));