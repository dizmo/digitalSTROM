//= compat
//= require flab/Namespace
//= require flab/Class

flab.Namespace.create('flab.view.zone');

flab.view.zone.frontside = flab.Class.extend(Object, /** @lends flab.view.zone.frontside.prototype */{
	/**
	 * This is the view Class for the frontside of the zone widget of the digitalSTROM Kastellan implementation. 
	 * @param {flab.view.zone.frontside.delegate} delegate       delegate of this view class
	 * @param {flab.digitalstrom.connector} connector              digitalSTROM connector instance
	 * @extends Object
	 * @constructs
	 */
	constructor: function(delegate,connector) {
		var self = this;
		self.delegate = delegate;
		self.connector = connector;
		self.connector.registerForNotifications(self);
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
	}
});