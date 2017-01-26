/**
 * @library Kube FormData
 * @author Imperavi LLC
 * @license MIT
 */
(function(Kube)
{
    Kube.FormData = function(app)
    {
        this.opts = app.opts;
    };

    Kube.FormData.prototype = {
        set: function(data)
        {
            this.data = data;
        },
        get: function(formdata)
    	{
        	this.formdata = formdata;

            if (this.opts.appendForms) this.appendForms();
            if (this.opts.appendFields) this.appendFields();

            return this.data;
    	},
    	appendFields: function()
    	{
    		var $fields = $(this.opts.appendFields);
    		if ($fields.length === 0)
    		{
        		return;
            }

    		var self = this;
            var str = '';

            if (this.formdata)
            {
                $fields.each(function()
    			{
    				self.data.append($(this).attr('name'), $(this).val());
    			});
            }
            else
            {
    			$fields.each(function()
    			{
    				str += '&' + $(this).attr('name') + '=' + $(this).val();
    			});

    			this.data = (this.data === '') ? str.replace(/^&/, '') : this.data + str;
            }
    	},
    	appendForms: function()
    	{
    		var $forms = $(this.opts.appendForms);
    		if ($forms.length === 0)
    		{
    			return;
    		}

            if (this.formdata)
            {
                var self = this;
                var formsData = $(this.opts.appendForms).serializeArray();
                $.each(formsData, function(i,s)
                {
                	self.data.append(s.name, s.value);
                });
            }
            else
            {
                var str = $forms.serialize();

                this.data = (this.data === '') ? str : this.data + '&' + str;
            }
    	}
    };


}(Kube));