/*
	Kube. CSS & JS Framework
	Version 6.5.2
	Updated: February 2, 2017

	http://imperavi.com/kube/

	Copyright (c) 2009-2017, Imperavi LLC.
	License: MIT
*/
if (typeof jQuery === 'undefined') {throw new Error('Kube\'s requires jQuery')};
;(function($) { var version = $.fn.jquery.split('.'); if (version[0] == 1 && version[1] < 8) {throw new Error('Kube\'s requires at least jQuery v1.8'); }})(jQuery);

;(function()
{
    // Inherits
    Function.prototype.inherits = function(parent)
    {
        var F = function () {};
        F.prototype = parent.prototype;
        var f = new F();

        for (var prop in this.prototype) f[prop] = this.prototype[prop];
        this.prototype = f;
        this.prototype.super = parent.prototype;
    };

    // Core Class
    var Kube = function(element, options)
    {
        options = (typeof options === 'object') ? options : {};

        this.$element = $(element);
        this.opts     = $.extend(true, this.defaults, $.fn[this.namespace].options, this.$element.data(), options);
        this.$target  = (typeof this.opts.target === 'string') ? $(this.opts.target) : null;
    };

    // Core Functionality
    Kube.prototype = {
        getInstance: function()
        {
            return this.$element.data('fn.' + this.namespace);
        },
        hasTarget: function()
        {
           return !(this.$target === null);
        },
        callback: function(type)
        {
    		var args = [].slice.call(arguments).splice(1);

            // on element callback
            if (this.$element)
            {
                args = this._fireCallback($._data(this.$element[0], 'events'), type, this.namespace, args);
            }

            // on target callback
            if (this.$target)
            {
                args = this._fireCallback($._data(this.$target[0], 'events'), type, this.namespace, args);
    		}

    		// opts callback
    		if (this.opts && this.opts.callbacks && $.isFunction(this.opts.callbacks[type]))
    		{
                return this.opts.callbacks[type].apply(this, args);
    		}

    		return args;
        },
        _fireCallback: function(events, type, eventNamespace, args)
        {
            if (events && typeof events[type] !== 'undefined')
            {
    			var len = events[type].length;
    			for (var i = 0; i < len; i++)
    			{
    				var namespace = events[type][i].namespace;
    				if (namespace === eventNamespace)
    				{
    					var value = events[type][i].handler.apply(this, args);
    				}
    			}
    		}

            return (typeof value === 'undefined') ? args : value;
        }
    };

    // Scope
    window.Kube = Kube;

})();