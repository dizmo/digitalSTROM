//= compat
//= require <flab/Namespace>
//= require <flab/Class>

flab.Namespace.create('flab.view.button');

flab.view.button.frontsideSingle = flab.Class.extend(Object, /** @lends flab.view.button.frontsideSingle.prototype */{
	/**
	 * This is the view Class for the frontside of a single button button of the button widget of the digitalSTROM Kastellan implementation. 
	 * @param {flab.view.button.frontsideSingle.delegate} delegate       delegate of this view class
	 * @param {flab.digitalstrom.connector} connector              digitalSTROM connector instance
	 * @extends Object
	 * @constructs
	 */
	constructor: function(delegate,connector) {
		var me = this;
		me.delegate = delegate;
		me.connector = connector;
		me.connector.registerForNotifications(me);
		// default group id is light
		me.groupId = 1;
		me.lastCalled = 0;
	},
	
	/**
	 * will render the default components of this view to the jQuery Element given
	 * @param {jQueryElement} element      the element where the view should be renderd in
	 */
	render_to : function(element) {
		var me = this;
		me.element = element;
		me.element.html('<div class="singleButtonBackside">\
							<div class="mainbuttoniconPush active">\
								<div class="mainbuttoniconCenter"></div>\
							</div>\
						</div>');
		jQuery('.mainbuttoniconPush').bind('click' , function(button) {
			me.delegate.singleButtonPressed();
		});
	},
	
	set_active : function() {
		var me = this;
		jQuery(".mainbuttoniconPush").removeClass('inactive');
		jQuery(".mainbuttoniconPush").addClass('active');
	},
	set_inactive : function() {
		var me = this;
		jQuery(".mainbuttoniconPush").removeClass('active');
		jQuery(".mainbuttoniconPush").addClass('inactive');
	},
	
	
	set_groupid : function(id) {
		var me = this;
		jQuery(".mainbuttoniconPush").removeClass('group' + me.groupId);
		me.groupId = id
		jQuery(".mainbuttoniconPush").addClass('group' + me.groupId);
	},
	
	set_activities : function(activities) {
		var me = this;
	},

	set_iconArray: function(icons) {
		var me = this;
	},
	
	set_single_icon : function(icon) {
		var me = this;
		jQuery(".mainbuttoniconCenter").removeClass('icon' + me.singleIcon);
		me.singleIcon = icon;
		jQuery(".mainbuttoniconCenter").addClass('icon' + me.singleIcon);
	},

	// dss connector delegate 
	/**
	 * Will be called from the dss connector, when the scene did change. (after pushing 'left' or 'right' button)
	 * @param {Integer} scene        the activity
	 * @param {Integer} group        the groupid
	 * @param {String} zone          the id of the zone
	 */
	updateLastCalledSceneForGroupAndZone : function(value , group , zone) {
		var me = this;
		me.set_active();
	},

	remove : function() {
		var me = this;
		me.element.empty();
	}
	
});