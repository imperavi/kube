/**
 * @library Kube Tabs
 * @author Imperavi LLC
 * @license MIT
 */
(function(Kube)
{
    Kube.Tabs = function(element, options)
    {
        this.namespace = 'tabs';
        this.defaults = {
    		equals: false,
    		active: false, // string (hash = tab id selector)
    		live: false, // class selector
    		hash: true, //boolean
    		callbacks: ['init', 'next', 'prev', 'open', 'opened', 'close', 'closed']
        };

        // Parent Constructor
        Kube.apply(this, arguments);

        // Initialization
        this.start();
    };

    // Functionality
    Kube.Tabs.prototype = {
        start: function()
        {
            if (this.opts.live !== false) this.buildLiveTabs();

            this.tabsCollection = [];
            this.hashesCollection = [];
            this.currentHash = [];
            this.currentItem = false;

            // items
            this.$items = this.getItems();
            this.$items.each($.proxy(this.loadItems, this));

            // tabs
    		this.$tabs = this.getTabs();

            // location hash
    		this.currentHash = this.getLocationHash();

    		// close all
    		this.closeAll();

            // active & height
    		this.setActiveItem();
    		this.setItemHeight();

            // callback
    		this.callback('init');

    	},
    	getTabs: function()
    	{
        	return $(this.tabsCollection).map(function()
        	{
            	return this.toArray();
            });
    	},
    	getItems: function()
    	{
    		return this.$element.find('a');
    	},
    	loadItems: function(i, el)
    	{
    		var item = this.getItem(el);

    		// set item identificator
    		item.$el.attr('rel', item.hash);

    		// collect item
            this.collectItem(item);

            // active
    		if (item.$parent.hasClass('active'))
    		{
    			this.currentItem = item;
    			this.opts.active = item.hash;
    		}

    		// event
    		item.$el.on('click.tabs', $.proxy(this.open, this));

    	},
    	collectItem: function(item)
    	{
    		this.tabsCollection.push(item.$tab);
    		this.hashesCollection.push(item.hash);
    	},
    	buildLiveTabs: function()
    	{
    		var $layers = $(this.opts.live);

    		if ($layers.length === 0)
    		{
    			return;
    		}

    		this.$liveTabsList = $('<ul />');
    		$layers.each($.proxy(this.buildLiveItem, this));

    		this.$element.html('').append(this.$liveTabsList);

    	},
    	buildLiveItem: function(i, tab)
    	{
    		var $tab = $(tab);
    		var $li = $('<li />');
    		var $a = $('<a />');
    		var index = i + 1;

    		$tab.attr('id', this.getLiveItemId($tab, index));

    		var hash = '#' + $tab.attr('id');
    		var title = this.getLiveItemTitle($tab);

    		$a.attr('href', hash).attr('rel', hash).text(title);
    		$li.append($a);

    		this.$liveTabsList.append($li);
    	},
    	getLiveItemId: function($tab, index)
    	{
        	return (typeof $tab.attr('id') === 'undefined') ? this.opts.live.replace('.', '') + index : $tab.attr('id');
    	},
    	getLiveItemTitle: function($tab)
    	{
        	return (typeof $tab.attr('data-title') === 'undefined') ? $tab.attr('id') : $tab.attr('data-title');
    	},
    	setActiveItem: function()
    	{
    		if (this.currentHash)
    		{
    			this.currentItem = this.getItemBy(this.currentHash);
    			this.opts.active = this.currentHash;
    		}
    		else if (this.opts.active === false)
    		{
    			this.currentItem = this.getItem(this.$items.first());
    			this.opts.active = this.currentItem.hash;
    		}

    		this.addActive(this.currentItem);
    	},
    	addActive: function(item)
    	{
    		item.$parent.addClass('active');
    		item.$tab.removeClass('hide').addClass('open');

    		this.currentItem = item;
    	},
    	removeActive: function(item)
    	{
    		item.$parent.removeClass('active');
    		item.$tab.addClass('hide').removeClass('open');

    		this.currentItem = false;
    	},
    	next: function(e)
    	{
    		if (e) e.preventDefault();

    		var item = this.getItem(this.fetchElement('next'));

    		this.open(item.hash);
    		this.callback('next', item);

    	},
    	prev: function(e)
    	{
    		if (e) e.preventDefault();

    		var item = this.getItem(this.fetchElement('prev'));

    		this.open(item.hash);
    		this.callback('prev', item);
    	},
    	fetchElement: function(type)
    	{
            var element;
    		if (this.currentItem !== false)
    		{
    			// prev or next
    			element = this.currentItem.$parent[type]().find('a');

    			if (element.length === 0)
    			{
    				return;
    			}
    		}
    		else
    		{
    			// first
    			element = this.$items[0];
    		}

    		return element;
    	},
    	open: function(e, push)
    	{
        	if (typeof e === 'undefined') return;
    		if (typeof e === 'object') e.preventDefault();

    		var item = (typeof e === 'object') ? this.getItem(e.target) : this.getItemBy(e);
    		this.closeAll();

    		this.callback('open', item);
    		this.addActive(item);

    		// push state (doesn't need to push at the start)
            this.pushStateOpen(push, item);
    		this.callback('opened', item);
    	},
    	pushStateOpen: function(push, item)
    	{
    		if (push !== false && this.opts.hash !== false)
    		{
    			history.pushState(false, false, item.hash);
    		}
    	},
    	close: function(num)
    	{
    		var item = this.getItemBy(num);

    		if (!item.$parent.hasClass('active'))
    		{
    			return;
    		}

    		this.callback('close', item);
    		this.removeActive(item);
    		this.pushStateClose();
    		this.callback('closed', item);

    	},
    	pushStateClose: function()
    	{
            if (this.opts.hash !== false)
            {
    			history.pushState(false, false, ' ');
    		}
    	},
    	closeAll: function()
    	{
    		this.$tabs.removeClass('open').addClass('hide');
    		this.$items.parent().removeClass('active');
    	},
    	getItem: function(element)
    	{
    		var item = {};

    		item.$el = $(element);
    		item.hash = item.$el.attr('href');
    		item.$parent = item.$el.parent();
    		item.$tab = $(item.hash);

    		return item;
    	},
    	getItemBy: function(num)
    	{
    		var element = (typeof num === 'number') ? this.$items.eq(num-1) : this.$element.find('[rel="' + num + '"]');

    		return this.getItem(element);
    	},
    	getLocationHash: function()
    	{
    		if (this.opts.hash === false)
    		{
    			return false;
    		}

    		return (this.isHash()) ? top.location.hash : false;
    	},
    	isHash: function()
    	{
        	return !(top.location.hash === '' || $.inArray(top.location.hash, this.hashesCollection) === -1);
    	},
    	setItemHeight: function()
    	{
    		if (this.opts.equals)
    		{
    	    	var minHeight = this.getItemMaxHeight() + 'px';
        		this.$tabs.css('min-height', minHeight);
    		}
    	},
    	getItemMaxHeight: function()
    	{
    		var max = 0;
    		this.$tabs.each(function()
    		{
    			var h = $(this).height();
    			max = h > max ? h : max;
    		});

    		return max;
    	}
    };

    // Inheritance
    Kube.Tabs.inherits(Kube);

    // Plugin
    Kube.Plugin.create('Tabs');
    Kube.Plugin.autoload('Tabs');

}(Kube));