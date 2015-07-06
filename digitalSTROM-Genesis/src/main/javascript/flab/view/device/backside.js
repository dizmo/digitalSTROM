//= compat
//= require <flab/Namespace>
//= require <flab/Class>
//= require <jquery/jeditable>

flab.Namespace.create('flab.view.device');

flab.view.device.backside = flab.Class.extend(Object, /** @lends flab.view.device.backside.prototype */{
	/**
	 * This is the view Class for the backside of the device widget of the digitalSTROM Kastellan implementation. 
	 * @param {flab.view.device.backside.delegate} delegate        delegate of this view class
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
		self.element[0].innerHTML = '<div class="backside_slider_container"></div>';
	},
	
	setValue : function(value) {
		var self = this;
		console.log('setValue' , value);
		self.element[0].innerHTML = '<div class="backside_slider_container"></div>';
		jQuery('.backside_slider_container').append('<div class="backside_slider"></div>');
		
		var decValue = Math.round(value/255*100);
		jQuery('.backside_slider_container .backside_slider').slider({
			orientation: "vertical",
			value : decValue,
			change : function(event, ui) {
				var dssValue = Math.round(ui.value / 100 * 255);
				self.delegate.setValue(dssValue);
			}
		});
		
	}
	
});