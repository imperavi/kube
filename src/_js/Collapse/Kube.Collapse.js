/**
 * @library Kube Collapse
 * @author Imperavi LLC
 * @license MIT
 */
(function(Kube)
{
    Kube.Collapse = function(element, options)
    {
        this.namespace = 'collapse';
        this.defaults = {
            target: null,
            toggle: true,
            active: false, // string (hash = tab id selector)
            toggleClass: 'collapse-toggle',
            boxClass: 'collapse-box',
            callbacks: ['open', 'opened', 'close', 'closed'],

            // private
            hashes: [],
        	currentHash: false,
        	currentItem: false
        };

        // Parent Constructor
        Kube.apply(this, arguments);

        // Initialization
        this.start();
    };

    // Functionality
    Kube.Collapse.prototype = {
        start: function()
        {
            // items
            this.$items = this.getItems();
            this.$items.each($.proxy(this.loadItems, this));

            // boxes
            this.$boxes = this.getBoxes();

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
    		if (!$(item.hash).hasClass('hide'))
    		{
    			this.opts.currentItem = item;
    			this.opts.active = item.hash;

                item.$el.addClass('active');
            }

    		// event
    		item.$el.on('click.collapse', $.proxy(this.toggle, this));

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
    		    this.opts.currentItem.$box.removeClass('hide');
    		}
    	},
    	addActive: function(item)
    	{
    		item.$box.removeClass('hide').addClass('open');
    		item.$el.addClass('active');

    		if (item.$caret !== false) item.$caret.removeClass('down').addClass('up');
    		if (item.$parent !== false) item.$parent.addClass('active');

    		this.opts.currentItem = item;
    	},
    	removeActive: function(item)
    	{
    		item.$box.removeClass('open');
    		item.$el.removeClass('active');

    		if (item.$caret !== false) item.$caret.addClass('down').removeClass('up');
    		if (item.$parent !== false) item.$parent.removeClass('active');

    		this.opts.currentItem = false;
    	},
        toggle: function(e)
        {
            if (e) e.preventDefault();

            var target = $(e.target).closest('.' + this.opts.toggleClass).get(0) || e.target;
            var item = this.getItem(target);

            if (this.isOpened(item.hash)) this.close(item.hash);
            else                          this.open(e)
        },
        openAll: function()
        {
            this.$items.addClass('active');
            this.$boxes.addClass('open').removeClass('hide');
        },
        open: function(e, push)
        {
        	if (typeof e === 'undefined') return;
    		if (typeof e === 'object') e.preventDefault();

            var target = $(e.target).closest('.' + this.opts.toggleClass).get(0) || e.target;
    		var item = (typeof e === 'object') ? this.getItem(target) : this.getItemBy(e);

    		if (item.$box.hasClass('open'))
    		{
        		return;
    		}

    		if (this.opts.toggle) this.closeAll();

    		this.callback('open', item);
    		this.addActive(item);

            item.$box.animation('slideDown', $.proxy(this.onOpened, this));
        },
        onOpened: function()
        {
    		this.callback('opened', this.opts.currentItem);
        },
        closeAll: function()
        {
            this.$items.removeClass('active').closest('li').removeClass('active');
            this.$boxes.removeClass('open').addClass('hide');
        },
        close: function(num)
        {
    		var item = this.getItemBy(num);

    		this.callback('close', item);

    		this.opts.currentItem = item;

    		item.$box.animation('slideUp', $.proxy(this.onClosed, this));
        },
        onClosed: function()
        {
            var item = this.opts.currentItem;

    		this.removeActive(item);
    		this.callback('closed', item);
        },
        isOpened: function(hash)
        {
            return $(hash).hasClass('open');
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
    };

    // Inheritance
    Kube.Collapse.inherits(Kube);

    // Plugin
    Kube.Plugin.create('Collapse');
    Kube.Plugin.autoload('Collapse');

}(Kube));