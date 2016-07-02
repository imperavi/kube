(function($)
{
    $.observer = {
        watch: function()
        {
            $(window).on('load', function()
            {
            	$.observer.liveComponentsObserver();
            });
        },
    	getComponentsClasses: function()
    	{
    		var str = [];
    		for (var key in SuperKube.classByPlugin)
    		{
    			str.push(SuperKube.classByPlugin[key]);
    		}

    		return str;
    	},
    	getComponentsClassesAsString: function()
    	{
    		var str = $.observer.getComponentsClasses();

    		return (str.length === 0) ? '' : ',.' + str.join(',.');
    	},
    	getComponentByClass: function(classname)
    	{
    		return SuperKube.pluginsByClass[classname];
    	},
    	once: function(listen, classes)
    	{
    		var listen = (typeof listen === 'undefined') ? $.observer.getComponentsClasses() : listen;
    		var classes = (typeof classes === 'undefined') ? $.observer.getComponentsClassesAsString() : classes;

            var $nodes = $('[data-component]' + classes);
    		$nodes.each(function()
    		{
    			var $node = $(this);

    			var hasClass = false;
    			var lenClasses = listen.length;

    			if (lenClasses > 0)
    			{
    				for (var z = 0; z < lenClasses; z++)
    				{
    					if ($node.hasClass(listen[z]))
    					{
    						hasClass = $.observer.getComponentByClass(listen[z]);
    					}
    				}
    			}

                var func;
                if (hasClass)
                {
    				func = hasClass;
    				if (typeof $node.attr('data-component-' + func + '-loaded') === 'undefined' && typeof $node[func] !== 'undefined')
    				{
    					$node[func]();
    				}
    			}

    			if ($node.attr('data-component'))
    			{
    				func = $node.attr('data-component');
    				if (typeof $node.attr('data-component-' + func + '-loaded') === 'undefined' && typeof $node[func] !== 'undefined')
    				{
    					$node[func]();
    				}
    			}
    		});
    	},
        liveComponentsObserver: function()
        {
            if (!window.MutationObserver)
            {
                return;
            }

    		var listen = $.observer.getComponentsClasses();
    		var classes = $.observer.getComponentsClassesAsString();

    		var observer = new MutationObserver(function(mutations)
    		{
    			mutations.forEach(function(mutation)
    			{
    				var newNodes = mutation.addedNodes;
    			    if (newNodes.length === 0 || (newNodes.length === 1 && newNodes.nodeType === 3))
    			    {
    				    return;
    				}

                    $.observer.once(listen, classes);

    			});
    		});

    		// pass in the target node, as well as the observer options
    		observer.observe(document, {
    			 subtree: true,
    			 childList: true
    		});
        }
    };
})(jQuery);