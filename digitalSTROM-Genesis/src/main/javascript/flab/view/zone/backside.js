//= compat
//= require <flab/Namespace>
//= require <flab/Class>
//= require <jquery/jeditable>

flab.Namespace.create('flab.view.zone');

flab.view.zone.backside = flab.Class.extend(Object, /** @lends flab.view.zone.backside.prototype */{
	/**
	 * This is the view Class for the backside of the zone widget of the digitalSTROM Kastellan implementation. 
	 * @param {flab.view.zone.backside.delegate} delegate        delegate of this view class
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
		console.log('element = ' , element);
		self.element[0].innerHTML = '';
	},
	
});