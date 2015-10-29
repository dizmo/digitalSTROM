//= compat
//= require flab/Namespace
//= require flab/Class

flab.Namespace.create('flab.view.usage');

flab.view.usage.frontside = flab.Class.extend(Object, /** @lends flab.view.usage.frontside.prototype */{
	/**
	 * This is the view Class for the frontside of the usage widget of the digitalSTROM Kastellan implementation. 
	 * @param {flab.view.usage.frontside.delegate} delegate         delegate of this view class
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
		self.element.html('<div class="toolbar">\
		<button id="usage_2" class="current">' + flab.tr('Minute')  + '</button>\
		<button id="usage_300">' + flab.tr('Tag')  + '</button>\
		<button id="usage_1800">' + flab.tr('Woche')  + '</button>\
		<button id="usage_7200">' + flab.tr('Monat')  + '</button>\
		<button id="usage_86400">' + flab.tr('Jahr')  + '</button>\
		</div>\
		<div id="flot_container" style="width:256px;height:180px;"></div>');

		self.element.find('button').bind('click' , function(button) {
			jQuery('button').removeClass('current');
			var parts = button.target.id.split('_');
			console.log('setting resolution to ' , parts[1]);
			jQuery('#' + button.target.id).addClass('current');
			self.delegate.buttonPressed(parts[1]);
		});
	},
	
	/**
	 * will show a new graph with new data. The function is called from the flab.controller.usage class. 
	 * @param {Object} data      an array of points to plot
	 */
	updateMeteringInfo : function(data){
		var self = this;
		jQuery.plot(
			$("#flot_container"), 
			[{
    	        data: data,
       	 		lines: { show: true, fill: true },
       	 		color: "#ffffff"
	        }],
	        {
	        	xaxis: {
	        		mode:"time",
	        		minTickSize: [1, "minute"],
	        	}
	        }
	    );
	}
});