//= compat
//= require <flab/Namespace>
//= require <flab/Class>

flab.Namespace.create('flab.view.button');

flab.view.button.frontside = flab.Class.extend(Object, /** @lends flab.view.button.frontside.prototype */{
	/**
	 * This is the view Class for the frontside of the button widget of the digitalSTROM Kastellan implementation.
	 * @param {flab.view.button.frontside.delegate} delegate       delegate of this view class
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
		me.element.html('\
			<map name="dsButtonMap">\
		    	<area shape="poly" coords="0,0,70,70,186,70,256,0,0,0" onclick="button.buttonPressed(\'increase\');"/>\
		    	<area shape="poly" coords="256,0,256,256,186,186,186,70,256,0" onclick="button.buttonPressed(\'right\');"/>\
		    	<area shape="poly" coords="256,256,0,256,70,186,186,186,256,256" onclick="button.buttonPressed(\'decrease\');"/>\
		    	<area shape="poly" coords="0,0,70,70,70,186,0,256,0,0" onclick="button.buttonPressed(\'left\');"/>\
		    	<area shape="poly" coords="70,70,186,70,186,186,70,186,70,70" onclick="button.buttonPressed(\'push\');"/>\
	   		</map>\
			<img src="css/images/button.png" class="mainbutton" usemap="#dsButtonMap" ismap="ismap"/>\
			<div class="mainbuttonicontop"></div>\
			<div class="mainbuttoniconDown"></div>\
			<div class="mainbuttoniconRight"></div>\
			<div class="mainbuttoniconLeft"></div>\
			<div class="mainbuttoniconPush group1 active">\
				<div class="mainbuttoniconCenter"></div>\
			</div>');
		jQuery('.mainbuttonicontop').bind('mousedown' , function(button) {
			me.delegate.buttonPressed('increase');
		});
		jQuery('.mainbuttoniconDown').bind('mousedown' , function(button) {
			me.delegate.buttonPressed('decrease');
		});
		jQuery('.mainbuttonicontop').bind('mouseup' , function(button) {
			me.delegate.buttonPressed('stop_increase');
		});
		jQuery('.mainbuttoniconDown').bind('mouseup' , function(button) {
			me.delegate.buttonPressed('stop_decrease');
		});
		jQuery('.mainbuttoniconRight').bind('click' , function(button) {
			me.delegate.buttonPressed('right');
		});
		jQuery('.mainbuttoniconLeft').bind('click' , function(button) {
			me.delegate.buttonPressed('left');
		});
		jQuery('.mainbuttoniconPush').bind('click' , function(button) {
			me.delegate.buttonPressed('push');
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

	// dss connector delegate
	/**
	 * Will be called from the dss connector, when the scene did change. (after pushing 'left' or 'right' button)
	 * @param {Integer} scene        the activity
	 * @param {Integer} group        the groupid
	 * @param {String} zone          the id of the zone
	 */
	updateLastCalledSceneForGroupAndZone : function(value , group , zone) {
		var me = this;
		me.lastCalled = value;
		if (!me.lastCalled) {
			me.lastCalled = 0;
		}
		var activities = me.activities;
		// check if we know the last called activity
		var found_activity = false;
		for (var i = 0; i < activities.length ; i++ ) {
			if (activities[i] == me.lastCalled) {
				found_activity = true;
			}
		}
		if (!found_activity) {
			me.lastCalled = me.connector.getDefaultSceneId();;
			me.set_inactive();
		} else {
			me.set_active();
		}
		me.update_icons();
	},
	// end of dss connector delegate

	set_activities : function(activities) {
		var me = this;
		console.log('set_activities = ' , activities);
		me.activities = activities;
		console.log('me.icons = ' , me.icons);
		if (me.activities && me.icons) {
			me.update_icons();
		}
	},

	set_iconArray: function(icons) {
		var me = this;
		console.log('set_iconArray = ' , icons);
		me.icons = icons;
		if (me.activities && me.icons) {
			me.update_icons();
		}
	},

	update_icons : function() {
		var me = this;
		var center;
		var left;
		var right;
		console.log('lastCalled = ' , me.lastCalled);
		console.log('activities = ' , me.activities);
		console.log('icons = ' , me.icons);

		for (var i = 0; i < me.activities.length ; i++) {
			if (me.activities[i] == me.lastCalled) {
				console.log('found the current activity. processing the icons array with i = ' , i);
				var leftid = i-1;
				if (leftid == -1) {
					leftid = 3;
				}
				left = me.icons[leftid];

				center = me.icons[i];
				right = me.icons[(i+1)%4];
				console.log('left = ' , left , ' right = ' , right , ' center = ' , center);
			}
		}
		jQuery(".mainbuttoniconLeft").removeClass('iconundefined');
		jQuery(".mainbuttoniconCenter").removeClass('iconundefined');
		jQuery(".mainbuttoniconRight").removeClass('iconundefined');
		for (var i = 0 ; i < me.delegate.numberOfIcons ; i++ ) {
			jQuery(".mainbuttoniconLeft").removeClass('icon' + i);
			jQuery(".mainbuttoniconCenter").removeClass('icon' + i);
			jQuery(".mainbuttoniconRight").removeClass('icon' + i);
		}
		jQuery(".mainbuttoniconLeft").addClass('icon' + left);
		jQuery(".mainbuttoniconCenter").addClass('icon' + center);
		jQuery(".mainbuttoniconRight").addClass('icon' + right);
	},

	remove : function() {
		var me = this;
		me.element.empty();
	}
});
