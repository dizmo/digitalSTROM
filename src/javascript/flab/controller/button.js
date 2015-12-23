//= compat
//= require flab/Namespace
//= require flab/Class
//= require flab/HomeAutomation
//= require flab/view/button/backside
//= require flab/view/button/frontside
//= require flab/view/button/frontsideSingle
//= require flab/l10n/Translate
//= require flab/controller/genesisBase

flab.Namespace.create('flab.controller');

flab.controller.button = flab.Class.extend(flab.controller.genesisBase, /** @lends flab.controller.button.prototype */{
	/**
     * This is the controller Class for the button dizmo of the digitalSTROM Kastellan implementation.
	 * @param {jQueryElement} frontElement    The element where the frontside of the dizmo should be rendered in
	 * @param {jQueryElement} backElement     The element where the backside of thw dizmo should be rendered in
	 * @constructs
	 * @extends Object
	 */
	constructor: function(frontElement,backElement) {
		var me = this;
		me.initialLoad = true;
		me.frontElement = frontElement;
		// setup the digitalSTROM Connector
		var hm = new flab.HomeAutomation();
		me.connector = hm.getConnector();
		me.connector.registerForNotifications(me);

		// get default groupid and currentView from preferences
		var groupidCache = dizmo.privateStorage.getProperty("groupid");
		me.groupid = groupidCache ? groupidCache : 1 ;
		var currentViewCache = dizmo.privateStorage.getProperty("currentView");
		me.currentView = currentViewCache ? currentViewCache : 'view5';
		var singleIconCache = dizmo.privateStorage.getProperty("singleIcon");
		me.singleicon = singleIconCache ? singleIconCache : 'walk';
		console.log('flab.controller.button constructor : groupid ' , me.groupid , ' currentView ' , me.currentView , ' singleicon' , me.singleicon);

		// setup the views and render them
		me.backside_view = new flab.view.button.backside(me,me.connector);
		me.frontside_view = me.getFrontSideViewForViewId(me.currentView);

		// load the initial values from the Kastellan Properties.
		var initObj = me.loadBasicInfo();
		me.zoneid = initObj.zoneid;
		me.hostname = initObj.hostname;
		me.authtoken = initObj.authtoken;
		me.genesis = new dizmojs.Dizmo(initObj.genesis);
		me.connector.setGenesis(me.genesis);
		
		dizmo.setAttribute('settings/title' , flab.tr('Button') + ' ' + initObj.displayname);
		me.backside_view.setDisplayName(initObj.displayname);
		me.backside_view.setZoneId(me.zoneid);

		// render the two views
		me.frontside_view.render_to(me.frontElement);
		me.backside_view.render_to(backElement);

		me.nologin = false;
		if (me.hostname && me.authtoken) {
			me.connector.login(me.hostname , me.authtoken);
		} else {
			me.nologin = true;
		}

		me.genesis.publicStorage.subscribeToProperty('lastCallSceneTimestamp', function(key, newVal, oldVal) {
			console.log('lastCallSceneTimestamp listener button');
			me.connector.zone_getLastCalledSceneForGroup(me.zoneid , me.groupid);
		});

		me.enableTitleHandling(flab.tr('Button'));

	},

	getFrontSideViewForViewId : function(viewid) {
		var me = this;
		if (viewid == 'view1') {
			return new flab.view.button.frontsideSingle(me,me.connector , me.singleicon);
		} else {
			return new flab.view.button.frontside(me,me.connector);
		}

	},

	/**
	 * Will be called from the dssconnector as soon as a successfull login was made.
	 */
	loginSuccess : function() {
		var me = this;
		me.groupIdChanged(me.groupid , me.currentView , me.singleicon);
	},

	// flab.view.button.backside delegate
	/**
	 * Wil be called from the backside view instance, if the user changes the group (color) settings
	 * @param {Integer} groupid      the new groupid
	 */
	groupIdChanged : function(groupID , viewid , icon) {
		var me = this;
		// load the new view, if we need to
		me.currentView = viewid;
		dizmo.privateStorage.setProperty("currentView" , me.currentView);

		if (!me.initialLoad) {
			me.frontside_view.remove();
			me.frontside_view = me.getFrontSideViewForViewId(me.currentView);
		}
		me.initialLoad = false;

		me.frontside_view.render_to(me.frontElement);
		if (me.currentView == 'view1') {
			me.frontside_view.set_single_icon(icon);
			me.singleicon = icon;
			dizmo.privateStorage.setProperty("singleIcon" , me.singleicon);
		}

		// first of all tell the view which activities we have
		var activities = me.connector.zone_getArrayOfActivityIds(me.zoneid , me.groupid);
		me.frontside_view.set_activities(activities);
		// unbind the preferences first
		if (me.iconSubscriptions) {
			for (var i = 0; i < me.iconSubscriptions.length ; i++) {
				me.genesis.publicStorage.unsubscribeProperty(me.iconSubscriptions[i]);
			}
		}

		// now set the new groupid
		me.groupid = groupID;
		dizmo.privateStorage.setProperty( "groupid" , me.groupid + "");
		me.icons = [];
		me.iconSubscriptions = [];
		for(var i = 0; i < activities.length ; i++ ) {
			var theKey = 'zone_' + me.zoneid + '/group_' + me.groupid + '/icon_' + activities[i];
			var theIcon = me.genesis.publicStorage.getProperty(theKey);
			if (theIcon) {
				me.icons[i] = theIcon;
			} else {
				var randId = me.getRandomIconId();
				me.genesis.publicStorage.setProperty(theKey , randId + "");
				me.icons[i] = randId;
			}
			var subscriptionID = me.genesis.publicStorage.subscribeToProperty(theKey, function(key, newVal, oldVal) {
				var activityid = key.split('/').pop().split('_').pop();
				var acts = me.connector.zone_getArrayOfActivityIds(me.zoneid , me.groupid);
				for (var j = 0; j < acts.length ; j ++ ) {
					if (acts[j] == activityid) {
						me.icons[j] = newVal;
					}
				}
				me.frontside_view.set_iconArray(me.icons);
			});
			me.iconSubscriptions.push(subscriptionID);
		}
		// tell the front which icons to use
		me.frontside_view.set_iconArray(me.icons);
		// tell the fron view the new group id
		me.frontside_view.set_groupid(me.groupid);
		// loading the current scene from the dss
		me.connector.zone_getLastCalledSceneForGroup(me.zoneid , me.groupid);
	},
	// end of flab.view.button.backside delegate

	/**
	 * helper function to unbind the icon change listeners. We will do this, before we update the icons,
	 * to avoid recursive calling of the listeners
	 */
	unbindIconPreferences : function() {
		var me = this;
		var activities = me.connector.zone_getArrayOfActivityIds(me.zoneid , me.groupid);
		for(var i = 0; i < activities.length ; i++ ) {
			var theKey = me.zoneid + '/' + me.groupid + '/' + activities[i] + '_icon';
			console.log('unbinding the preference for the key ' , theKey);
			me.genesis.publicStorage.unsubscribeProperty(theKey);
		}
	},

	// flab.view.button.frontside delegate
	/**
	 * Wil be called from the frontside view instance, if the user presses a button
	 * @param {String} button      the identifier of the button which was pressed. May be one of these 'increase' 'left' 'push' 'right' 'decrease'
	 */
	buttonPressed : function(button) {
		var me = this;
		// if we could not login at startup we need to try it here
		if (me.nologin) {
			if (me.hostname && me.authtoken) {
				me.connector.login(me.hostname , me.authtoken);
				me.nologin = false;
			} else {
				return;
			}
		}
		switch (button) {
			case "increase":
				me.connector.zone_StartIncreaseValueForGroup(me.zoneid , me.groupid);
				break;
			case "left":
				me.connector.zone_previousSceneForGroup(me.zoneid , me.groupid);
				break;
			case "push":
				me.connector.zone_toggleForGroup(me.zoneid , me.groupid);
				break;
			case "right":
				me.connector.zone_nextSceneForGroup(me.zoneid , me.groupid);
				break;
			case "decrease":
				me.connector.zone_StartDecreaseValueForGroup(me.zoneid , me.groupid);
				break;
			case "stop_increase":
				me.connector.zone_StopIncreaseValueForGroup(me.zoneid , me.groupid);
				break;
			case "stop_decrease":
				me.connector.zone_StopDecreaseValueForGroup(me.zoneid , me.groupid);
				break;
			default:
				console.log('you should never get here!!!');
			break;
		}
	},

	/**
	 * Wil be called from the frontside view instance, if the user presses a single button
	 */
	singleButtonPressed : function() {
		var me = this;
		if (me.singleicon == 'walk') {
			// call 'gehen' button
			me.connector.set_absent();
		} else {
			if (me.groupid == '5') {
				// panic
				me.connector.set_panic();
			} else {
				// bell
				me.connector.set_doorbell();
			}
		}
	},
	// end of flab.view.button.frontside delegate


	/**
	 * Wil be called from the application when the dizmo is removed.
	 */
	remove: function() {
		var me = this;
		me.dizmo();
	}
});
