//= compat
//= require flab/Namespace
//= require flab/Class

flab.Namespace.create('flab.view.activities');

flab.view.activities.frontside = flab.Class.extend(Object, /** @lends flab.view.activities.frontside.prototype */{
	/**
	 * This is the view Class for the frontside of the activities widget of the digitalSTROM Kastellan implementation. 
	 * @param {flab.view.activities.frontside.delegate} delegate    delegate of this view class
	 * @param {flab.digitalstrom.connector} connector              digitalSTROM connector instance
	 * @extends Object
	 * @constructs
	 */
	constructor: function(delegate,connector) {
		var self = this;
		self.delegate = delegate;
		self.connector = connector;
		self.connector.registerForNotifications(self);
		self.icons = [];
	},
	
	/**
	 * will render the default components of this view to the jQuery Element given
	 * @param {jQueryElement} element      the element where the view should be renderd in
	 */
	render_to : function(element) {
		var self = this;
		self.element = element;
		self.element.html('<ul id="activities_list" class="fl_front_list"></div>');
		self.reset();
	},
	
	// flab.digitalstrom.connector delegate
	/**
	 * will be called by the digitalSTROM connector after an activity name has been updated
	 * @param {String} zone       the zone in which the activity name has been updated
	 * @param {String} group      the group in which the activity name has been updated
	 * @param {String} activitiy  the activity of which the name has been updated
	 * @param {String} name       the new activity name
	 */
	updateActivityName : function(zone , group , activity , name) {
		var self = this;
		console.log('zone , group , activity , name = ' , zone , group , activity , name);
		console.log('obj = ' ,  jQuery("#frontactivity_" + activity));
		jQuery("#frontactivity_" + activity + ' .text')[0].innerHTML = name;
	},

	/**
	 * Will be called from the dss connector, when the scene did change. (after pushing 'left' or 'right' button)
	 * @param {Integer} scene        the activity
	 * @param {Integer} group        the groupid
	 * @param {String} zone          the id of the zone
	 */
	updateLastCalledSceneForGroupAndZone : function(value , group , zone) {
		var me = this;
		jQuery("#frontactivity_" + me.lastCalled).removeClass('current');
		me.lastCalled = value;
		jQuery("#frontactivity_" + me.lastCalled).addClass('current');
	},

	// end of flab.digitalstrom.connector delegate
	
	updateIcon : function(activity , icon) {
		var self = this;
		console.log('updateIcon : activity = ' , activity , ' icon ' , icon);
		jQuery("#frontactivity_" + activity + ' .theicon').removeClass('icon' + self.icons[activity]);
		self.icons[activity] = icon;
		jQuery("#frontactivity_" + activity + ' .theicon').addClass('icon' + self.icons[activity]);
	},
	
	/**
	 * will be called to clean up the Userinterface if for example the groupid changed, and all the 
	 * activity names have to be reloaded
	 */
	reset : function() {
		var self = this;
		jQuery("#activities_list")[0].innerHTML = '';
		var activities = self.connector.zone_getArrayOfActivityIds();
		for (var i = 0 ; i < activities.length; i++){
			jQuery('#activities_list').append('<li id="frontactivity_' + activities[i] + '"><div class="text"></div><div class="theicon"></div></li>');
		}
		self.element.find('li').bind('click' , function(button) {
			console.log('button = ' , button);
			var parts = button.target.id.split('_');
			var activity = parts[1];
			if (!activity){
				parts = button.target.parentNode.id.split('_');
				activity = parts[1];
			}
			console.log('activity = ' , activity);
			self.delegate.buttonPressed(activity);
		});
	}
});