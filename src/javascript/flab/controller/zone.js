//= compat
//= require flab/Namespace
//= require flab/Class
//= require flab/HomeAutomation
//= require flab/view/zone/backside
//= require flab/view/zone/frontside
//= require flab/l10n/Translate
//= require flab/controller/genesisBase

flab.Namespace.create('flab.controller');

flab.controller.zone = flab.Class.extend(flab.controller.genesisBase, /** @lends flab.controller.zone.prototype */{
	/**
     * This is the controller Class for the zone dizmo of the digitalSTROM Kastellan implementation.
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
		me.backside_view = new flab.view.zone.backside(me,me.connector);
		me.frontside_view = new flab.view.zone.frontside(me,me.connector);
		me.frontside_view.render_to(frontElement);
		me.backside_view.render_to(backElement);

		// enable the dizmo to accept the dropping of devices on it
		dizmo.publicStorage.setProperty('may_accept_device_drop' , 'richtig');

		// load the initial values from the Kastellan Properties.
		var initObj = me.loadBasicInfo();
		console.log('initObj = ' , initObj);
		me.zoneid = initObj.zoneid;
		me.hostname = initObj.hostname;
		me.authtoken = initObj.authtoken;
		me.genesis = new dizmojs.Dizmo(initObj.genesis);
		me.connector.setGenesis(me.genesis);
		
		dizmo.setAttribute('settings/title' , flab.tr('Zone') + ' ' + initObj.displayname);

		// default zone = Broadcast zone
		me.nologin = false;
		if (me.hostname && me.authtoken) {
			me.connector.login(me.hostname , me.authtoken);
		} else {
			me.nologin = true;
		}

		me.enableTitleHandling(flab.tr('Zone'));
	},

	/**
	 * Will be called from the dssconnector as soon as a successfull login was made.
	 */
	loginSuccess : function() {
		var me = this;
		var children = dizmo.getChildDizmos();
		console.log('login success children = ' , children);
		if (children.length < 1) {
			// we only start the child dizmos if we did not already do so.
			// without this we will have duplicate devices after restarting Kastellan
			me.connector.zone_getDevices(me.zoneid);
		}
	},

	/**
	 * Will be called from the dssconnector when we have a list with all the devices in the zone.
	 * @param {Array} devices       the ids of all the devices in the room
	 * @param {String} zone         the id of the zone
	 */
	devicesInZone : function(devices , zone) {
		var me = this;
		if (zone == me.zoneid){
			console.log('me.zoneid = ' , me.zoneid);
			if (me.is_bundle_installed("ch.futurelab.dizmo.digitalstrom.device")) {
				console.log('is installed');
				me.start_device_dizmos_for_zone(devices , zone);
				return;
			}
			console.log('is not installed');
			do_start=function(dizmoInst,error){
				me.start_device_dizmos_for_zone(devices,zone);
			}
			viewer.installBundle("bundle://assets/device-0.1.dzm",do_start);

		}
	},
	
	start_device_dizmos_for_zone : function(devices , zone) {
		var me = this;
		var sensors = me.connector.zone_filterSensorDevices(devices);
		var pos = dizmo.getAbsoluteGeometry();
		console.log('pos = ' , pos);
		for( var i = 0 ; i < sensors.length ; i++) { //		

			(function(j){

			var buttonBundle = new dizmojs.Bundle("ch.futurelab.dizmo.digitalstrom.device");
			/* TODO: optimize the positioning and start to scale the dizmo if we have to many devices. */
			var x = pos.x + ((40+10) * (j % 4)) + 10;
			var y = pos.y + ((40+10) * Math.floor(j/4)) + 50;
			console.log('j = ' , j , ' x = ' , x , ' y = ' , y);
			var initParams = {
				'geometry/x' : x,
				'geometry/y' : y,
				'state/iconized' : true
			};

			do_set=function(dizmoInst,error) {
				dizmoInst.setParentDizmo(dizmo);
		
			    console.log('starting new device dizmo with params : ' , me.zoneid , sensors[j].name , dizmoInstance , sensors[j] , me.genesis);
			    me.set_zone_id_and_name_for_dizmo_instance(me.zoneid , sensors[j].name , dizmoInst , sensors[j] , me.genesis);
			}

			var dizmoInstance = buttonBundle.instantiateDizmo(initParams,{},{},do_set);

			})(i);

		}
	},

	getDeviceWidgetBundleIdentifier : function() {
		var me = this;
		return 'ch.futurelab.dizmo.digitalstrom.device';
	}
});
