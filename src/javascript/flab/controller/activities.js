//= compat
//= require flab/Namespace
//= require flab/Class
//= require flab/view/activities/backside
//= require flab/view/activities/frontside
//= require flab/l10n/Translate
//= require flab/controller/genesisBase
//= require flab/HomeAutomation

flab.Namespace.create('flab.controller');
flab.controller.activities = flab.Class.extend(flab.controller.genesisBase, /** @lends flab.controller.activities.prototype */{
	/**
     * This is the controller Class for the activities dizmo of the digitalSTROM Kastellan implementation.
	 * @param {jQueryElement} frontElement    The element where the frontside of the dizmo should be rendered in
	 * @param {jQueryElement} backElement     The element where the backside of thw dizmo should be rendered in
	 * @constructs
	 * @extends Object
	 */
	constructor: function(frontElement,backElement) {
		var me = this;
		// setup the digitalSTROM Connector
		var hm = new flab.HomeAutomation();
		me.connector = hm.getConnector();
		me.connector.registerForNotifications(me);
		// setup the views and render them
		me.backside_view = new flab.view.activities.backside(me,me.connector);
		me.frontside_view = new flab.view.activities.frontside(me,me.connector);
		me.frontside_view.render_to(frontElement);
		me.backside_view.render_to(backElement);

		// load the initial values from the Kastellan Properties.
		var initObj = me.loadBasicInfo();
		console.log('initObj = ' , initObj);
		me.zoneid = initObj.zoneid;
		me.hostname = initObj.hostname;
		me.authtoken = initObj.authtoken;
		me.genesis = new dizmojs.Dizmo(initObj.genesis);
		me.connector.setGenesis(me.genesis);
		// default group for activities is 1
		me.groupid = 1;

		dizmo.setAttribute('settings/title' , flab.tr('Activities') + ' ' + initObj.displayname);

		me.connector.login(me.hostname , me.authtoken);

		var theKey = 'lastCallSceneTimestamp';
		me.genesis.publicStorage.subscribeToProperty(theKey , function(key, newVal, oldVal) {
			console.log('lastCallSceneTimestamp listener activities');
			me.connector.zone_getLastCalledSceneForGroup(me.zoneid , me.groupid);
		});

		var theActivityRenameKey = 'lastActivityRenameTimestamp';
		me.genesis.publicStorage.subscribeToProperty(theKey , function(key, newVal, oldVal) {
			console.log('lastActivityRenameTimestamp listener activities');
			me.connector.zone_requestActivityNames(me.zoneid , me.groupid);
		});

		me.enableTitleHandling(flab.tr('Activities'));
	},

	/**
	 * Will be called from the dssconnector as soon as a successfull login was made.
	 */
	loginSuccess : function() {
		var me = this;
		me.connector.zone_requestActivityNames(me.zoneid , me.groupid);
		me.connector.zone_getLastCalledSceneForGroup(me.zoneid , me.groupid);
		me.updateActivityIcons();
	},

	// frontside delegate
	/**
	 * Will be called from the frontside view instance, if the user selects an activity
	 * @param {Integer} scene        the activity the user wants to set the dss to
	 */
	buttonPressed : function(scene) {
		var me = this;
		console.log('scene = ' , scene);
		me.connector.zone_setSceneForGroup(me.zoneid , scene , me.groupid);
	},

	/**
	 * Will be called from the frontside view instance, if the user wants to save a scene
	 * @param {Integer} scene
	 */
	saveScene : function(scene) {
		var me = this;
		me.connector.zone_saveSceneForGroup(me.zoneid , scene , me.groupid);
	},
	// end of frontside delegate


	// backside delegate
	/**
	 * Wil be called from the backside view instance, if the user changes the group (color) settings
	 * @param {Integer} groupid      the new groupid
	 */
	groupIdChanged : function(groupid) {
		var me = this;
		me.groupid = groupid;
		me.backside_view.reset();
		me.frontside_view.reset();
		me.connector.zone_requestActivityNames(me.zoneid , me.groupid);
		me.updateActivityIcons();
	},

	/**
	 * Helper function to load the icons from the settings and tell the views to render them.
	 * The icons for a specific view will be stored in the properties of the genesis dizmo.
	 * me.genesis + '/zone_' + me.zoneid + '/group_' + me.groupid + '/icon_' + activityid
	 * if no icon is specified, the function will choose a random icon, and save the icon to the settings.
	 */
	updateActivityIcons : function() {
		var me = this;
		var activities = me.connector.zone_getArrayOfActivityIds(me.zoneid , me.groupid);

		if (me.iconSubscriptions) {
			for (var i = 0; i < me.iconSubscriptions.length ; i++) {
				me.genesis.publicStorage.unsubscribeProperty(me.iconSubscriptions[i]);
			}
		}
		me.iconSubscriptions = [];
		for(var i = 0; i < activities.length ; i++ ) {
			var theKey = 'zone_' + me.zoneid + '/group_' + me.groupid + '/icon_' + activities[i];
			console.log('theKey = ' , theKey);
			var theIcon = me.genesis.publicStorage.getProperty(theKey);
			if (theIcon) {
				console.log('found icon: ' , theIcon);
			} else {
				var randId = me.getRandomIconId();
				console.log('generated random icon id ' , randId , ' storing it to the properties for key' , theKey);
				me.genesis.publicStorage.setProperty(theKey , randId + "");
				theIcon = randId;
			}
			me.frontside_view.updateIcon(activities[i] , theIcon);
			me.backside_view.updateIcon(activities[i] , theIcon);
			var subscriptionID = me.genesis.publicStorage.subscribeToProperty(theKey, function(key, newVal, oldVal) {
				console.log('activity : new icon for activity!' , newVal);
				var activityid = key.split('/').pop().split('_').pop();
				console.log('activityid = ' , activityid);
				var acts = me.connector.zone_getArrayOfActivityIds(me.zoneid , me.groupid);
				var newIcon;
				for (var j = 0; j < acts.length ; j ++ ) {
					if (acts[j] == activityid) {
						newIcon = newVal;
					}
				}
				console.log('new icon = ' , newIcon , 'activity' , activityid);
				console.log('me.frontside_view ' , me.frontside_view);
				me.frontside_view.updateIcon(activityid , newIcon);
				me.backside_view.updateIcon(activityid , newIcon);
			});
			me.iconSubscriptions.push(subscriptionID);
		}
	},

	/**
	 * Will be called from the backside view instance, if the user changes the name of a activity
	 * @param {Integer} scene       the activity which should be renamed
	 * @param {String} name         the new name for the scene
	 */
	setNameForActivity : function(scene , name) {
		var me = this;
		me.connector.zone_setNameForSceneOfGroup(me.zoneid , name , scene, me.groupid);
	},

	zone_didSetNameForSceneOfGroup : function(zone , group , scene , name) {
		var me = this;
		var theActivityRenameKey = 'lastActivityRenameTimestamp';
		console.log('theActivityRenameKey will set new timestamp');
		me.genesis.publicStorage.setProperty(theActivityRenameKey , new Date().getTime());
	},

	/**
	 * Will be called from the backside view instance, if the user sets a new icon for an activity
	 * @param {String} icon          the id of the icon selected
	 * @param {Integer} scene        the activity
	 */
	setIconForActivity : function(icon , scene) {
		var me = this;
		console.log('setIconForActivity zone = ' , me.zoneid , ' group = ' , me.groupid , ' scene = ' , scene , ' icon = ' , icon);
		var theKey = 'zone_' + me.zoneid + '/group_' + me.groupid + '/icon_' + scene;
		console.log('key = ' , theKey);
		me.genesis.publicStorage.setProperty(theKey , icon + "");
	},
	// end of backside delegate

});
