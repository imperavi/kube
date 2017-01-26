/**
 * @library Kube Response
 * @author Imperavi LLC
 * @license MIT
 */
(function(Kube)
{
    Kube.Response = function(app) {};

    Kube.Response.prototype = {
        parse: function(str)
    	{
        	if (str === '') return false;

    		var obj = {};

    		try {
    			obj = JSON.parse(str);
    		} catch (e) {
    			return false;
    		}

    		if (obj[0] !== undefined)
    		{
    			for (var item in obj)
    			{
    				this.parseItem(obj[item]);
    			}
    		}
    		else
    		{
    			this.parseItem(obj);
    		}

    		return obj;
    	},
    	parseItem: function(item)
    	{
    		if (item.type === 'value')
    		{
    			$.each(item.data, $.proxy(function(key, val)
    			{
        			val = (val === null || val === false) ? 0 : val;
        			val = (val === true) ? 1 : val;

    				$(key).val(val);

    			}, this));
    		}
    		else if (item.type === 'html')
    		{
    			$.each(item.data, $.proxy(function(key, val)
    			{
        			val = (val === null || val === false) ? '' : val;

    				$(key).html(this.stripslashes(val));

    			}, this));
    		}
    		else if (item.type === 'addClass')
    		{
    			$.each(item.data, function(key, val)
    			{
    				$(key).addClass(val);
    			});
            }
    		else if (item.type === 'removeClass')
    		{
    			$.each(item.data, function(key, val)
    			{
    				$(key).removeClass(val);
    			});
            }
    		else if (item.type === 'command')
    		{
    			$.each(item.data, function(key, val)
    			{
    				$(val)[key]();
    			});
    		}
    		else if (item.type === 'animation')
    		{
    			$.each(item.data, function(key, data)
    			{
    				data.opts = (typeof data.opts === 'undefined') ? {} : data.opts;

    				$(key).animation(data.name, data.opts);
    			});
    		}
    		else if (item.type === 'location')
    		{
    			top.location.href = item.data;
    		}
    		else if (item.type === 'notify')
    		{
    			$.notify(item.data);
    		}

    		return item;
    	},
        stripslashes: function(str)
    	{
    		return (str+'').replace(/\0/g, '0').replace(/\\([\\'"])/g, '$1');
        }
    };


}(Kube));