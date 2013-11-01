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
}

LoginWidget.prototype.createBaseNode = function(id) { 
	$(document.body).append($('<div id="widget' + id + '" class="widget"></div>'));
}

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
	var that = this;
	this.baseNode.find('form').bind('submit', function(e) {
		var username = that.baseNode.find('.username')[0].value,
			password = that.baseNode.find('.password')[0].value,
			action = e.target.getAttribute('action') || 'login.php',
			id = that.baseNode[0].getAttribute('id'),
			data;

		if(username && password) {
			data = {username: username, password: password};
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
};

LoginWidget.prototype.render = function() {
	var template = this.loadTemplate(this.id); //get the final template with all substitutions
	this.baseNode.html(template); //update the baseNode with template
	this.bindAll(); //attach the event handlers in the module
}