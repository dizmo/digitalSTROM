//= compat
//= require flab/Namespace
//= require flab/Class
//= require flab/HomeAutomation
//= require flab/view/device/backside
//= require flab/view/device/frontside
//= require flab/controller/genesisBase
//= require flab/l10n/Translate

/* patching a once again buggy dizmojs library 
   https://tracker.dizmo.com/browse/DSD-892 */
dizmo.getAbsoluteGeometry = function () {
	var self = this;

	var absoluteGeometry = {
		zoom: self.getAttribute('geometry/zoom'),
		x: self.getAttribute('geometry/x'),
		y: self.getAttribute('geometry/y'),
		angle: self.getAttribute('geometry/angle'),
		width: self.getAttribute('geometry/width'),
		height: self.getAttribute('geometry/height')
	};

	var parent = self.getParentDizmo();
	if (typeof parent !== 'undefined') {
		var parentGeometry = parent.getAbsoluteGeometry();
		absoluteGeometry.zoom = absoluteGeometry.zoom * parentGeometry.zoom;
		absoluteGeometry.angle = absoluteGeometry.angle + parentGeometry.angle;
		absoluteGeometry.x = parentGeometry.x + absoluteGeometry.x;
		absoluteGeometry.y = parentGeometry.y + absoluteGeometry.y;
	}

	return absoluteGeometry;
}

flab.Namespace.create('flab.controller');

flab.controller.device = flab.Class.extend(Object, /** @lends flab.controller.device.prototype */{
	/**
     * This is the controller Class for the device dizmo of the digitalSTROM Kastellan implementation.
	 * @param {jQueryElement} frontElement    The element where the frontside of the dizmo should be rendered in
	 * @param {jQueryElement} backElement     The element where the backside of thw dizmo should be rendered in
	 * @constructs
	 * @extends flab.controller.genesisBase
	 */
	constructor: function(frontElement,backElement) {
		var me = this;
		// setup the digitalSTROM Connector
		var hm = new flab.HomeAutomation();
		me.connector = hm.getConnector();
		me.connector.registerForNotifications(me);
		// setup the views and render them
		me.backside_view = new flab.view.device.backside(me,me.connector);
		me.frontside_view = new flab.view.device.frontside(me,me.connector);
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
		me.device = initObj.data;

		dizmo.setAttribute('settings/title' , initObj.displayname);

		// default zone = Broadcast zone
		me.nologin = false;
		if (me.hostname && me.authtoken) {
			me.connector.login(me.hostname , me.authtoken);
		} else {
			me.nologin = true;
		}

		var theKey = 'lastCallSceneTimestamp';
		me.genesis.publicStorage.subscribeToProperty(theKey , function(key, newVal, oldVal) {
			console.log('lastCallSceneTimestamp listener');
			me.connector.get_state_for_device(me.device.dSID);
		});

		dizmo.subscribeToAttribute('settings/title' , function(key, newVal, oldVal){
			me.connector.device_setName(me.device.dSID , newVal);
		});
	},

	/**
	 * Helper function to move a specific widget to a specific place
	 * @param{String} instanceId       the Instance Id of the widget
	 * @param{Int} x                          the x coordinate the widget should be moved to
	 * @param{Int} y                          the y coordinate the widget should be moved to
	 */
	move_dizmo_to : function(x,y) {
		var me = this;
		dizmo.setAttribute('geometry/x' , x);
		dizmo.setAttribute('geometry/y' , y);
	},

	/**
	 * Will be called from the dssconnector as soon as a successfull login was made.
	 */
	loginSuccess : function() {
		var me = this;
		console.log('login success');
		me.connector.get_group_for_device(me.device.dSID);
		me.connector.get_state_for_device(me.device.dSID);
	},

	/**
	 * will be called by the dss connector. When the groupId of a device has been found
	 * @param{String} groupid    the group id of the device
	 * @param{String} dsid          the device id
	 */
	groupIdForDevice : function(groupid , dsid) {
		var me = this;
		if (dsid == me.device.dSID) {
			me.groupid = groupid;
			me.frontside_view.setGroupId(me.groupid);
			me.updateIcon();
		}
	},

	/**
	 * will be called by the dss connector. When the state of a device has been received
	 * @param{Boolean} isOn      information if the device is on or not
	 * @param{String} dsid          the device id
	 */
	stateForDevice : function(isOn , dsid) {
		var me = this;
		if (dsid == me.device.dSID) {
			me.active = isOn;
			me.frontside_view.setActive(me.active);
			me.updateIcon();
		}
	},

	/**
	 * helper function to update the icon of the device
	 */
	updateIcon : function() {
		var me = this;
		var iconname = 'group' + me.groupid;
		if (me.active) {
			iconname = iconname + 'active';
		}
		iconname = iconname + '.png';
		console.log('iconname = ' , iconname);
		dizmo.setAttribute('settings/iconimage' , iconname);
	},

	/**
	 * will be called by the application when user Starts to drag the device
	 */
	startDrag: function() {
		var me = this;
		me.beforeDragPosition = {};
		var absGeo = dizmo.getAbsoluteGeometry();
		me.beforeDragPosition.x = dizmo.getAttribute('geometry/x');
		me.beforeDragPosition.y = dizmo.getAttribute('geometry/y');
		me.beforeDragPosition.absx = absGeo.x;
		me.beforeDragPosition.absy = absGeo.y;
		me.oldParent = dizmo.getParentDizmo();
	},

	/**
	 * will be called by the application when user stops to drag the device
	 * the decision of a drop is accepted will be made here. The new parent widget needs to have
	 * 'may_accept_device_drop' set to 'richtig' in the properties.
	 */
	stopDrag : function() {
		var me = this;
		var parent = dizmo.getParentDizmo();
		if (parent) {
			var value = parent.publicStorage.getProperty('may_accept_device_drop');
			if (value == 'richtig') {
				me.acceptDrop();
			} else {
				me.abortDrop();
			}
		} else {
			me.abortDrop();
		}
	},

	/**
	 * will be executed if we accept a drop.
	 */
	acceptDrop : function() {
		var me = this;
		var newParent = dizmo.getParentDizmo();
		var parentBasicInfo = JSON.parse(newParent.publicStorage.getProperty('basicinfo'));
		var newZoneId = parentBasicInfo.zoneid;
		if (newZoneId != me.zoneid) {
			console.log('tell the dss to add the device '+ me.device.dSID +' to the new zone' + newZoneId);
			// TODO: Add error handling. 
			/* If something goes wrong here, we need to move the dizmo back into the old zone 
			   and show some error to the user. Using an alert dizmo? */
			me.connector.zone_addDevice(newZoneId , me.device.dSID);
			me.zoneid = newZoneId;
		}
	},
	
	couldNotAddDeviceToZone : function(zone , device) {
		var me = this;
		if (device == me.device.dSID) {
			me.abortDrop();
		}
	},

	/**
	 * will be executed if we want to abort a drop.
	 */
	abortDrop : function() {
		var me = this;
		var parent = dizmo.getParentDizmo();
		if (parent) {
			/* TODO:: remove patching parent 
			   https://tracker.dizmo.com/browse/DSD-892 */
			parent.getAbsoluteGeometry = function () {
				var self = this;

				var absoluteGeometry = {
					zoom: self.getAttribute('geometry/zoom'),
					x: self.getAttribute('geometry/x'),
					y: self.getAttribute('geometry/y'),
					angle: self.getAttribute('geometry/angle'),
					width: self.getAttribute('geometry/width'),
					height: self.getAttribute('geometry/height')
				};

				var parent = self.getParentDizmo();
				if (typeof parent !== 'undefined') {
					var parentGeometry = parent.getAbsoluteGeometry();
					absoluteGeometry.zoom = absoluteGeometry.zoom * parentGeometry.zoom;
					absoluteGeometry.angle = absoluteGeometry.angle + parentGeometry.angle;
					absoluteGeometry.x = parentGeometry.x + absoluteGeometry.x;
					absoluteGeometry.y = parentGeometry.y + absoluteGeometry.y;
				}

				return absoluteGeometry;
			}
			/* End of TODO!!*/

			var parentAbs = parent.getAbsoluteGeometry();
			
			var newx = me.beforeDragPosition.absx - parentAbs.x;
			var newy = me.beforeDragPosition.absy - parentAbs.y;
			me.move_dizmo_to( newx , newy );
		} else {
			me.move_dizmo_to(me.beforeDragPosition.absx , me.beforeDragPosition.absy);
		}
		dizmo.setParentDizmo(me.oldParent);
	},


	showFront : function() {
		var me = this;
		// the front of the widget is shown...
		me.connector.get_state_for_device(me.device.dSID);
	},

    showBack : function() {
    	var me = this;
		// the back of the widget is shown...
		me.connector.get_value_for_device(me.device.dSID);
    },


	valueForDevice : function(value , dsid) {
		var me = this;
		me.backside_view.setValue(value);
	},

	setValue : function(value){
		var me = this;
		me.connector.set_value_for_device(value , me.device.dSID);
	},


	/**
	 * helper function used to load the default configuration of the dizmo which was set
	 * by the genesis dizmo.
	 * @private
	 * @returns {Object} an object with general configuration information of the dizmo
	 * <dl>
	 *   <dt>authtoken</dt><dd>authtoken used in the dssconnector</dd>
	 *   <dt>displayname</dt><dd>DisplayName of the zone the dizmos operates in</dd>
	 *   <dt>genesis</dt><dd>properties key of the genesis dizmo.</dd>
	 *   <dt>hostname</dt><dd>hostname of the dss</dd>
	 *   <dt>zoneid</dt><dd>id of the zone the dizmos operates in</dd>
	 * </dl>
	 */
	loadBasicInfo : function() {
		var me = this;
		var object = JSON.parse(dizmo.publicStorage.getProperty("basicinfo"));
		return object;
	}
});
