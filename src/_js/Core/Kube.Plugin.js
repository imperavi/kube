/**
 * @library Kube Plugin
 * @author Imperavi LLC
 * @license MIT
 */
(function(Kube)
{
    Kube.Plugin = {
        create: function(classname, pluginname)
        {
            pluginname = (typeof pluginname === 'undefined') ? classname.toLowerCase() : pluginname;

            $.fn[pluginname] = function(method, options)
            {
                var args = Array.prototype.slice.call(arguments, 1);
                var name = 'fn.' + pluginname;
                var val = [];

                this.each(function()
                {
                    var $this = $(this), data = $this.data(name);
                    options = (typeof method === 'object') ? method : options;

                    if (!data)
                    {
                        // Initialization
                        $this.data(name, {});
                        $this.data(name, (data = new Kube[classname](this, options)));
                    }

                    // Call methods
                    if (typeof method === 'string')
                    {
                        if ($.isFunction(data[method]))
                        {
                            var methodVal = data[method].apply(data, args);
                            if (methodVal !== undefined)
                            {
                                val.push(methodVal);
                            }
                        }
                        else
                        {
                            $.error('No such method "' + method + '" for ' + classname);
                        }
                    }

                });

                return (val.length === 0 || val.length === 1) ? ((val.length === 0) ? this : val[0]) : val;
            };

            $.fn[pluginname].options = {};

            return this;
        },
        autoload: function(pluginname)
        {
            var arr = pluginname.split(',');
            var len = arr.length;

            for (var i = 0; i < len; i++)
            {
                var name = arr[i].toLowerCase().split(',').map(function(s) { return s.trim() }).join(',');
                this.autoloadQueue.push(name);
            }

            return this;
        },
        autoloadQueue: [],
        startAutoload: function()
        {
            if (!window.MutationObserver || this.autoloadQueue.length === 0)
            {
                return;
            }

            var self = this;
    		var observer = new MutationObserver(function(mutations)
    		{
    			mutations.forEach(function(mutation)
    			{
    				var newNodes = mutation.addedNodes;
    			    if (newNodes.length === 0 || (newNodes.length === 1 && newNodes.nodeType === 3))
    			    {
    				    return;
    				}

                    self.startAutoloadOnce();
    			});
    		});

    		// pass in the target node, as well as the observer options
    		observer.observe(document, {
    			 subtree: true,
    			 childList: true
    		});
        },
        startAutoloadOnce: function()
        {
            var self = this;
            var $nodes = $('[data-component]').not('[data-loaded]');
    		$nodes.each(function()
    		{
        		var $el = $(this);
        		var pluginname = $el.data('component');

                if (self.autoloadQueue.indexOf(pluginname) !== -1)
                {
            		$el.attr('data-loaded', true);
                    $el[pluginname]();
                }
            });

        },
        watch: function()
        {
            Kube.Plugin.startAutoloadOnce();
            Kube.Plugin.startAutoload();
        }
    };

    $(window).on('load', function()
    {
        Kube.Plugin.watch();
    });

}(Kube));