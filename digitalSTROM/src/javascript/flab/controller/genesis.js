//= compat
//= require flab/Namespace
//= require flab/Version
//= require flab/Class
//= require flab/view/genesis/backside
//= require flab/view/genesis/frontside
//= require flab/HomeAutomation
//= require flab/controller/genesisBase

flab.Namespace.create('flab.controller');

flab.controller.genesis = flab.Class.extend(flab.controller.genesisBase, /** @lends flab.controller.genesis.prototype */{
	/**
     * This is the controller Class for the genesis widget of the digitalSTROM Kastellan implementation.
	 * @param {jQueryElement} frontElement    The element where the frontside of the widget should be rendered in
	 * @param {jQueryElement} backElement     The element where the backside of thw widget should be rendered in
	 * @constructs
	 * @extends flab.controller.genesisBase
	 */
	constructor: function(frontElement , backElement) {
		var me = this;
		// setup the digitalSTROM Connector
		var hm = new flab.HomeAutomation();
		me.connector = hm.getConnector();
		me.connector.isGenesis = true;
		me.connector.registerForNotifications(me);
		me.connector.setGenesis(dizmo);
		me.connector.initializeGenesis();
		// setup the views and render them
		me.createViews();
		me.frontside_view.render_to(frontElement);
		me.backside_view.render_to(backElement);

		dizmo.setAttribute('settings/title' , me.getGenesisTitle() + ' ' + flab.Version.Version());

		me.handleDefaultData();

	},

	getGenesisTitle : function() {
		var me = this;
		return flab.tr('digitalSTROM');
	},

	handleDefaultData : function() {
		var me = this;
		if (me.get_property_for_widget('hostname')) {
			me.backside_view.setHostNameNoEvent(me.get_property_for_widget('hostname'));
			me.connector.setHostName(me.get_property_for_widget('hostname'));
			if (me.get_property_for_widget('authtoken')) {
				me.connector.setToken(me.get_property_for_widget('authtoken'));
				me.backside_view.updateApplicationToken(me.get_property_for_widget('authtoken'));
				me.connector.checkIfAuthTokenIsValid();
			} else {
				// no token yet. but a hostname. requesting one
				me.connector.requestAuthToken();
			}
		}
	},

	createViews : function() {
		var me = this;
		me.backside_view = new flab.view.genesis.backside(me,me.connector);
		me.frontside_view = new flab.view.genesis.frontside(me,me.connector);
	},
	// flab.view.genesis.backside delegate
	/**
	 * Will be called from the backside view instance, if the user sets a new hostname.
	 * The function will store the hostname, and tell the digitalSTROM Connector to request a token.
	 * @param {String} hostname          the hostname
	 */
	hostnameDidChange : function(hostname) {
		var me = this;
		// we use the default login to not avoid the basic auth of the dss
		me.frontside_view.showStateConnecting();
		me.set_property_for_widget('hostname' , hostname);
		me.connector.setHostName(hostname);
		me.connector.requestAuthToken();
	},
	// end of flab.view.genesis.backside delegate

	// flab.view.genesis.frontside delegate
	/**
	 * Will be called from the frontside view instance, if the user clicks a button and wants to
	 * create a new button widget for a zone.
	 * @param {String} zoneid          the zoneid
	 * @param {String} displayname     the display name of the zone.
	 */
	get_button_widget_for_zone : function(zoneid , displayname) {
		var me = this;
		me.install_and_start_dizmo("bundle://assets/button_v0.1.dzm" , "ch.futurelab.dizmo.digitalstrom.button" , zoneid , displayname);
	},
	/**
	 * Will be called from the frontside view instance, if the user clicks a button and wants to
	 * create a new usage widget for a zone.
	 * @param {String} zoneid          the zoneid
	 * @param {String} displayname     the display name of the zone.
	 */
	get_usage_widget_for_zone : function(zoneid , displayname) {
		var me = this;
		me.install_and_start_dizmo("bundle://assets/usage_v0.1.dzm" , "ch.futurelab.dizmo.digitalstrom.usage" , zoneid , displayname);
	},
	/**
	 * Will be called from the frontside view instance, if the user clicks a button and wants to
	 * create a new activities widget for a zone.
	 * @param {String} zoneid          the zoneid
	 * @param {String} displayname     the display name of the zone.
	 */
	get_activities_widget_for_zone : function(zoneid , displayname) {
		var me = this;
		me.install_and_start_dizmo("bundle://assets/activities_v0.1.dzm" , "ch.futurelab.dizmo.digitalstrom.activities" , zoneid , displayname);
	},
	/**
	 * Will be called from the frontside view instance, if the user clicks a button and wants to
	 * create a new zone widget for a zone.
	 * @param {String} zoneid          the zoneid
	 * @param {String} displayname     the display name of the zone.
	 */
	get_zone_widget_for_zone : function(zoneid , displayname) {
		var me = this;
		me.install_and_start_dizmo("bundle://assets/zone_v0.1.dzm" , "ch.futurelab.dizmo.digitalstrom.zone" , zoneid , displayname);
	},
	
	install_and_start_dizmo : function(path , bundleId , zoneid , displayname) {
		var me = this;
		if (me.is_bundle_installed(bundleId)) {
			me.start_dizmo(bundleId , zoneid , displayname);
			return;
		}
		viewer.installBundle(path);
		var subscriptionID = viewer.onBundleAdded(function(bundles){
			for (var i = 0 ; i < bundles.length ; i++) {
				if (bundles[i].identifier == bundleId) {
					me.start_dizmo(bundleId , zoneid , displayname);
					viewer.unsubscribeBundleChanges(subscriptionID);
				}
			}
		});
	},
	
	start_dizmo : function(bundleId , zoneid , displayname) {
		var me = this;
		var buttonBundle = new dizmojs.Bundle(bundleId);
		var dizmoInstance = buttonBundle.instantiateDizmo();
		me.set_zone_id_and_name_for_dizmo_instance(zoneid , displayname , dizmoInstance , {} , dizmo);
	},
	
	/**
	 * Will be called from the frontside view instance, when the user wants to rename a zone.
	 * @param {String} zoneid          the zoneid
	 * @param {String} displayname     the new name of the zone.
	 */
	set_zone_name : function(zoneid , value) {
		var me = this;
		me.connector.zone_setName(zoneid , value);
		var theKey = 'zone_' + zoneid + '/displayname';
		console.log('will write new name to ' , theKey , ' from dizmo:' , dizmo);
		dizmo.publicStorage.setProperty(theKey , value);
	},
	// end of flab.view.genesis.frontside delegate


	// dss connector delegate
	/**
	 * Will be called from the digitalSTROM connector, when authentication token is valid, and the widget can operate (logged in user after calling me.connector.checkIfAuthTokenIsValid)
	 */
	tokenIsValid : function() {
		var me = this;
		me.connector.requestAppartmentName();
		me.connector.requestNewZoneList();
	},

	updateZoneList : function(data) {
		var me = this;
		for (var i = 0 ; i < data.apartment.zones.length ; i++) {
			var zone = data.apartment.zones[i];
			var theKey = 'zone_' + zone.id + '/displayname';
			dizmo.publicStorage.subscribeToProperty(theKey , function(key, newVal, oldVal){
				me.connector.requestNewZoneList();
			});
		}

		if (!me.unittestMode) {
			me.connector.enable_callScenePolling();
		}
	},

	/**
	 * Will be called each time the dss gets a callScene command from somewhere
	 */
	updateLastCalledScene : function() {
		var me = this;
		var theKey = "lastCallSceneTimestamp";
		dizmo.publicStorage.setProperty(theKey , new Date().getTime());
	},

	coundConnect : function() {
		var me = this;
		console.log('could connect to dss!');
		dizmo.setAttribute('settings/iconimage' , 'assets/IconActive.svg');
	},

	lostConnection : function() {
		var me = this;
		console.log('could not connect to dss!');
		dizmo.setAttribute('settings/iconimage' , 'assets/IconInActive.svg');
	},
	/**
	 * will be called by the digitalSTROM connector if an invalid hostname has been entered.
	 * The Function will reset the property we stored the hostname in
	 */
	invalidHostName : function() {
		var me = this;
		me.set_property_for_widget('hostname' , undefined);
	},
	/**
	 * will be called by the digitalSTROM connector if an application token could be loaded.
	 * the function will store the token to the properties and to the digitalSTROM connector instance.
	 * @param {String} token      the authentication token for the application
	 */
	updateApplicationToken : function(token) {
		var me = this;
		me.set_property_for_widget('authtoken' , token);
		me.connector.setToken(token);
	},
	// end of dss connector delegate

	/**
	 * calling this function will set the instance of the class in unittest mode.
	 * some behaviour of the class could be different in this case. At the moment this is only used in the
	 * digitalstrom connector class, to use http instead of https.
	 * @private
	 */
	setUnittestMode : function() {
		var me = this;
		me.unittestMode = true;
		me.connector.setUnittestMode();
		me.backside_view.setUnittestMode();
	}
});
