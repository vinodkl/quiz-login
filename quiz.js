var LoginWidget = function(node, options) {
	//keep track of the number of instances of the widget
	LoginWidget.count = LoginWidget.count || 0;
	var id = ++LoginWidget.count;
	this.nm = 'login_widget_';
	this.id = this.nm + id;

	//get the base node, if no node specified or if the node passed doesn't exist
	if(!node || $("#" + node).length < 1) {
		this.createBaseNode(id);
		node = 'widget' + id;
	}
	this.baseNode = $("#"+node);

	//if needed pass on some config data, not doing anything right now
	this.init(options);
};

LoginWidget.prototype.createBaseNode = function(id) { 
	$(document.body).append($('<div id="widget' + id + '" class="widget"></div>'));
};

LoginWidget.prototype.loadTemplate = function() {
	var template = $('#login_tmpl').html();
	//replace placeholders in template, right now trying to add a id for the parent node, not needed anyway, just demo
	template = template.replace(/\{\{id\}\}/, ' id= "' + this.id + '" '); //TODO: handle failure case if template node doesn't exist
	return template;
};

LoginWidget.prototype.init = function(options) {
	this.options = options;
};

LoginWidget.prototype.bindAll = function() {
	var that = this,
		username = this.baseNode.find('.username'),
		password = this.baseNode.find('.password'),
		addPlaceHolder = function(el) {
			if (el.val() == '' || el.val() == el.attr('placeholder')) {
				el.addClass('placeholder');
				el.val(el.attr('placeholder'));
			}
			if(el.hasClass('password') && (el.val() == '' || el.val() == el.attr('placeholder'))) {
				el.attr('type', "text");
			}
		},
		removePlaceHolder = function(el) {
			if(el.val() == el.attr('placeholder')) {
				el.val('');
				el.removeClass('placeholder');
			}
			if(el.hasClass('password')) {
				el.attr('type', "password");
			}
		};

	//event handler submit
	this.baseNode.find('form').bind('submit', function(e) {
			var action = e.target.getAttribute('action') || 'login.php',
			id = $(that.baseNode).attr('id'),
			data;

		if($(username).val() && $(password).val()) {
			data = {username: $(username).val(), password: $(password).val()};
			that.baseNode.find('.error-msg').hide();
			
			// do the POST if we have all values to be passed
			$.ajax({
			  type: 'POST',
			  crossDomain: false,
			  dataType: 'json',
			  url: action,
			  data: data,
			  success: function(result) {
			    if(result.status == "failure") {
			    	that.baseNode.find('.error-msg').html('Invalid credentials');
			    	that.baseNode.find('.error-msg').show();	
			    } else {
			    	that.baseNode.find('.error-msg').html('Login success. Welcome');
			    	that.baseNode.find('.error-msg').show();
			    }
			  } //TODO: handle other failures
			});
		} else {
			that.baseNode.find('.error-msg').html('Login failure!! Try again');
			that.baseNode.find('.error-msg').show();
		}
		e.preventDefault();
	});

	// For IE, hack the placeholder
	if(typeof document.createElement("input").placeholder == 'undefined') {
		
		addPlaceHolder($(username));
		addPlaceHolder($(password));

		username.bind('focus', function(e) {
			var el = $(e.target);
			removePlaceHolder(el);
		});

		username.bind('blur', function(e) {
			var el = $(e.target);
			addPlaceHolder(el);
		});

		password.bind('focus', function(e) {
			var el = $(e.target);
			removePlaceHolder(el);
		});

		password.bind('blur', function(e) {
			var el = $(e.target);
			addPlaceHolder(el);
		});
	}
};


LoginWidget.prototype.render = function() {
	var template = this.loadTemplate(this.id); //get the final template with all substitutions
	this.baseNode.html(template); //update the baseNode with template
	this.bindAll(); //attach the event handlers in the module
};