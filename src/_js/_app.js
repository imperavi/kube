;(function()
{
    var Kube = function(element, options)
    {
        this.$element = $(element);
        this.opts = $.extend(
            true,
            {},
            this.opts,
            this.$element.data(),
            options
        );

        // setup animation
        if (this.opts.hasOwnProperty('animation') && this.opts.animation === false)
        {
            this.opts.animation = {};
            this.opts.animation.open = 'show';
            this.opts.animation.close = 'hide';
        }
    };

    Kube.prototype = {
        callback: function(type)
        {
            var value;
    		var args = [].slice.call(arguments).splice(1);
    		var eventNamespace = this.pluginName;

            // on element callback
            if (typeof this.$element !== 'undefined')
            {
                value = this.fireCallback($._data(this.$element[0], 'events'), type, eventNamespace, args);
        		if (typeof value !== 'undefined')
        		{
        			return value;
        		}
    		}

            // on target callback
            if (typeof this.$target !== 'undefined' && typeof this.$target !== null)
            {
                var events;
                if (this.$target.length === 1)
                {
                    events = $._data(this.$target[0], 'events');
                    value = this.fireCallback(events, type, eventNamespace, args);

            		if (typeof value !== 'undefined')
            		{
        			    return value;
                    }
                }
                else
                {
                    value = [];
                    this.$target.each($.proxy(function(i,s)
                    {
                        events = $._data(s, 'events');
                        value.push(this.fireCallback(events, type, eventNamespace, args));

                    }, this));

                    return value;
                }
    		}

    		// no callback
    		if (typeof this.opts === 'undefined' || typeof this.opts.callbacks === 'undefined' || typeof this.opts.callbacks[type] === 'undefined')
    		{
    			return args;
    		}

    		// opts callback
    		var callback = this.opts.callbacks[type];
    		return ($.isFunction(callback)) ? callback.apply(this, args) : args;
        },
        fireCallback: function(events, type, eventNamespace, args)
        {
            if (typeof events !== 'undefined' && typeof events[type] !== 'undefined')
            {

    			var len = events[type].length;
    			for (var i = 0; i < len; i++)
    			{
    				var namespace = events[type][i].namespace;
    				if (namespace === 'callback.' + eventNamespace || namespace === eventNamespace + '.callback')
    				{
    					return events[type][i].handler.apply(this, args);
    				}
    			}
    		}
        },

    	// =scroll
    	disableBodyScroll: function()
    	{
    		var $body = $('html');
    		var windowWidth = window.innerWidth;

    		if (!windowWidth)
    		{
    			var documentElementRect = document.documentElement.getBoundingClientRect();
    			windowWidth = documentElementRect.right - Math.abs(documentElementRect.left);
    		}

    		var isOverflowing = document.body.clientWidth < windowWidth;
    		var scrollbarWidth = this.measureScrollbar();

    		$body.css('overflow', 'hidden');
    		if (isOverflowing)
    		{
    			$body.css('padding-right', scrollbarWidth);
    		}
    	},
    	measureScrollbar: function()
    	{
    		var $body = $('body');
    		var scrollDiv = document.createElement('div');
    		scrollDiv.className = 'scrollbar-measure';

    		$body.append(scrollDiv);
    		var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    		$body[0].removeChild(scrollDiv);
    		return scrollbarWidth;
    	},
    	enableBodyScroll: function()
    	{
    		$('html').css({ 'overflow': '', 'padding-right': '' });
    	},

    	// append fields
    	appendFields: function(data)
    	{
    		if (this.opts.appendFields === false)
    		{
    			return data;
    		}

    		var $fields = $(this.opts.appendFields);
    		if ($fields.length === 0)
    		{
    			return data;
    		}
    		else
    		{
                var str = '';

    			$fields.each(function()
    			{
    				str += '&' + $(this).attr('name') + '=' + $(this).val();
    			});

    			return (data === '') ? str.replace(/^&/, '') : data + str;
    		}
    	},
    	appendFieldsAsData: function(data)
    	{
    		if (this.opts.appendFields === false)
    		{
    			return data;
    		}

    		var $fields = $(this.opts.appendFields);
    		if ($fields.length === 0)
    		{
    			return data;
    		}
    		else
    		{
    			$fields.each(function()
    			{
    				data.append($(this).attr('name'), $(this).val());
    			});

    			return data;
    		}
    	},

    	// append forms
    	appendForms: function(data)
    	{
    		if (this.opts.appendForms === false)
    		{
    			return data;
    		}

    		var $forms = $(this.opts.appendForms);
    		if ($forms.length === 0)
    		{
    			return data;
    		}
    		else
    		{
    			var str = $forms.serialize();
    			return (data === '') ? str : data + '&' + str;
    		}
    	},
    	appendFormsAsData: function(data)
    	{
    		if (this.opts.appendForms === false)
    		{
    			return data;
    		}

    		var formsData = $(this.opts.appendForms).serializeArray();
    		$.each(formsData, function(z,f)
    		{
    			data.append(f.name, f.value);
    		});

    		return data;
    	},

        // =utils
    	isMobileScreen: function()
    	{
    		return ($(window).width() <= 768);
    	},
    	isTabletScreen: function()
    	{
    		return ($(window).width() >= 768 && $(window).width() <= 1024);
    	},
    	isDesktopScreen: function()
    	{
    		return ($(window).width() > 1024);
    	},
    	isLargeScreen: function()
    	{
    		return ($(window).width() > 1200);
    	},
    	isMobile: function()
    	{
    		return /(iPhone|iPod|BlackBerry|Android)/.test(navigator.userAgent);
    	},
    	isDesktop: function()
    	{
    		return !/(iPhone|iPod|iPad|BlackBerry|Android)/.test(navigator.userAgent);
    	}
    };


    var SuperKube = {
    	pluginsByClass: {},
        classByPlugin: {},
        plugin: function(name, obj)
        {
            obj.pluginName = name;

            function klass()
            {
                if (obj.hasOwnProperty('init'))
                {
                    obj.init.apply(this, arguments);
                }
            };

            klass.prototype = Object.create(Kube.prototype);
            klass.prototype.constructor = klass;

            for (var key in obj)
            {
                klass.prototype[key] = obj[key];
            }

            var classname = (obj.hasOwnProperty('classname')) ? obj.classname : false;

    		if (classname)
    		{
        		SuperKube.classByPlugin[name] = classname;
        		SuperKube.pluginsByClass[classname] = name;
    		}

            $.fn[name] = SuperKube.createPlugin(name, klass, classname);

            return klass;
        },
        createPlugin: function(name, obj, classname)
        {
            var plugin = function(options)
            {
                var val = [];
                var args = Array.prototype.slice.call(arguments, 1);

                if (typeof options === 'string')
                {
                    this.eq(0).each(function()
                    {
                        var instance = $.data(this, name);
                        if (typeof instance !== 'undefined' && $.isFunction(instance[options]))
                        {
                            var methodVal = instance[options].apply(instance, args);
                            if (methodVal !== undefined && methodVal !== instance)
                            {
                                val.push(methodVal);
                            }
                        }
                        else
                        {
                            return $.error('No such method "' + options + '" for ' + name);
                        }
                    });
                }
                else
                {
                    this.each(function()
                    {
                        var $el = $(this);

                        // loaded
                        if ($el.attr('data-component-' + name + '-loaded') === true)
                        {
                            return;
                        }
                        $el.attr('data-component-' + name + '-loaded', true);

                        var instance = new obj(this, options);

                        $.data(this, name, {});
                        $.data(this, name, instance);

                        // target api
                        if (typeof instance.$target !== 'undefined' && typeof instance.$target !== null)
                        {
                            instance.$target.data(name, instance);
                        }
                    });
                }

                return (val.length === 0 || val.length === 1) ? ((val.length === 0) ? this : val[0]) : val;
            };

            $(window).on('load.components.' + name, function()
            {
                if (classname)
    			{
        			$('.' + classname)[name]();
                }

            	$('[data-component="' + name + '"]')[name]();
            });

            return plugin;
        }
    };


    window.Kube = Kube;
    window.SuperKube = SuperKube;

})();