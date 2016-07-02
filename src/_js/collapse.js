(function(Kube)
{
    Kube.Сollapse = SuperKube.plugin('collapse', {

        classname: 'collapse',
        opts: {
            target: false,
            toggle: true,
            active: false, // string (hash = tab id selector)
            animation: {
                open: {
                    name: 'slideDown',
                    timing: 'linear',
                    duration: 0.3
                },
                close: {
                    name: 'slideUp',
                    timing: 'linear',
                    duration: 0.2
                }
            },
            toggleClass: 'collapse-toggle',
            boxClass: 'collapse-box',
            callbacks: ['open', 'opened', 'close', 'closed'],

            // private
            hashes: [],
        	currentHash: false,
        	currentItem: false

        },
        init: function()
        {
            Kube.apply(this, arguments);

            // items
            this.$items = this.getItems();
            this.$items.each($.proxy(this.loadItems, this));

            // boxes
            this.$boxes = this.getBoxes();

            // close all
            this.closeAll();

            // active
            this.setActiveItem();
        },
        getItems: function()
        {
            return this.$element.find('.' + this.opts.toggleClass);
        },
        getBoxes: function()
        {
            return this.$element.find('.' + this.opts.boxClass);
        },
    	loadItems: function(i, el)
    	{
    		var item = this.getItem(el);

    		// set item identificator
    		item.$el.attr('rel', item.hash);

            // active
    		if (item.$el.hasClass('active'))
    		{
    			this.opts.currentItem = item;
    			this.opts.active = item.hash;
    		}

    		// event
    		item.$el.on('click.component.collapse', $.proxy(this.toggle, this));

    	},
    	setActiveItem: function()
    	{
    		if (this.opts.active !== false)
    		{
    			this.opts.currentItem = this.getItemBy(this.opts.active);
    			this.opts.active = this.opts.currentItem.hash;
    		}

            if (this.opts.currentItem !== false)
            {
    		    this.addActive(this.opts.currentItem);
    		    this.opts.currentItem.$box.show();
    		}
    	},
    	addActive: function(item)
    	{
    		item.$box.removeClass('hide').addClass('open');
    		item.$el.addClass('active');

    		if (item.$caret !== false)
    		{
    		    item.$caret.removeClass('down').addClass('up');
    		}

    		if (item.$parent !== false)
    		{
        		item.$parent.addClass('active');
    		}

    		this.opts.currentItem = item;
    	},
    	removeActive: function(item)
    	{
    		item.$box.removeClass('open');
    		item.$el.removeClass('active');

    		if (item.$caret !== false)
    		{
    		    item.$caret.addClass('down').removeClass('up');
    		}

    		if (item.$parent !== false)
    		{
        		item.$parent.removeClass('active');
    		}

    		this.opts.currentItem = false;
    	},
        toggle: function(e)
        {
            if (e)
            {
                e.preventDefault();
            }

            var target = $(e.target).closest('.' + this.opts.toggleClass).get(0) || e.target;
            var item = this.getItem(target);

            return (this.isClosed(item.hash)) ? this.open(e) : this.close(item.hash);
        },
        openAll: function()
        {
            this.$items.addClass('active');
            this.$boxes.addClass('open').show();
        },
        open: function(e, push)
        {
        	if (typeof e === 'undefined')
        	{
            	return;
        	}

    		if (typeof e === 'object')
    		{
    			e.preventDefault();
            }

            var target = $(e.target).closest('.' + this.opts.toggleClass).get(0) || e.target;
    		var item = (typeof e === 'object') ? this.getItem(target) : this.getItemBy(e);

    		if (item.$box.hasClass('open'))
    		{
        		return;
    		}

    		if (this.opts.toggle)
    		{
    		    this.closeAll();
    		}

    		this.callback('open', item);
    		this.addActive(item);

            item.$box.animation(this.opts.animation.open, $.proxy(this.opened, this));
        },
        opened: function()
        {
    		this.callback('opened', this.opts.currentItem);
        },
        closeAll: function()
        {
            this.$items.removeClass('active').closest('li').removeClass('active');
            this.$boxes.removeClass('open').hide();
        },
        close: function(num)
        {
    		var item = this.getItemBy(num);

    		this.callback('close', item);
    		item.$box.animation(this.opts.animation.close, $.proxy(this.closed, this));

        },
        closed: function()
        {
            var item = this.opts.currentItem;

    		this.removeActive(item);
    		this.callback('closed', item);
        },
        isOpened: function(hash)
        {
            return $(hash).hasClass('open');
        },
        isClosed: function(hash)
        {
            return !$(hash).hasClass('open');
        },
    	getItem: function(element)
    	{
    		var item = {};

    		item.$el = $(element);
    		item.hash = item.$el.attr('href');
    		item.$box = $(item.hash);

    		var $parent = item.$el.parent();
    		item.$parent = ($parent[0].tagName === 'LI') ? $parent : false;

    		var $caret = item.$el.find('.caret');
    		item.$caret = ($caret.length !== 0) ? $caret : false;

    		return item;
    	},
    	getItemBy: function(num)
    	{
    		var element = (typeof num === 'number') ? this.$items.eq(num-1) : this.$element.find('[rel="' + num + '"]');

    		return this.getItem(element);
    	}
    });

}(Kube));