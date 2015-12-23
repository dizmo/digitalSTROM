//= compat
//= require flab/Namespace
//= require flab/Class

flab.Namespace.create('flab.view.device');

flab.view.device.frontside = flab.Class.extend(Object, /** @lends flab.view.device.frontside.prototype */{
	/**
	 * This is the view Class for the frontside of the device widget of the digitalSTROM Kastellan implementation. 
	 * @param {flab.view.device.frontside.delegate} delegate       delegate of this view class
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
		self.element[0].innerHTML = '<div class="deviceFront"></div>';
	},
	
	setGroupId : function(groupid) {
		var me = this;
		jQuery('.deviceFront').removeClass('group' + me.groupid);
		me.groupid = groupid;
		jQuery('.deviceFront').addClass('group' + me.groupid);
	},
	
	setActive : function(isOn , dsid) {
		var me = this;
		me.active = isOn;
		jQuery('.deviceFront').removeClass('active');
		if (me.active) {
			jQuery('.deviceFront').addClass('active');
		}
	}
});