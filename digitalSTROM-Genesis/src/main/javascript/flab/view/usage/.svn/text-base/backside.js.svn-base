//= compat
//= require <flab/Namespace>
//= require <flab/Class>
//= require <jquery/jeditable>

flab.Namespace.create('flab.view.usage');

flab.view.usage.backside = flab.Class.extend(Object, /** @lends flab.view.usage.backside.prototype */{
	/**
	 * This is the view Class for the backside of the usage widget of the digitalSTROM Kastellan implementation. 
	 * @param {flab.view.usage.backside.delegate} delegate         delegate of this view class
	 * @param {flab.digitalstrom.connector} connector              digitalSTROM connector instance
	 * @extends Object
	 * @constructs
	 */
	constructor: function(delegate,connector) {
		var self = this;
		self.delegate = delegate;
		self.connector = connector;
		self.connector.registerForNotifications(self);

		self.hostname = undefined;
	},
	
	/**
	 * will render the default components of this view to the jQuery Element given
	 * @param {jQueryElement} element      the element where the view should be renderd in
	 */
	render_to : function(element) {
		var self = this;
		self.element = element;
		self.element.html('<div></div>');
	},
	
});