//= compat
//= require flab/Namespace
//= require flab/Class
//= require flab/HomeAutomation
//= require flab/view/usage/backside
//= require flab/view/usage/frontside
//= require flab/l10n/Translate
//= require flab/controller/genesisBase

flab.Namespace.create('flab.controller');

flab.controller.usage = flab.Class.extend(flab.controller.genesisBase, /** @lends flab.controller.usage.prototype */{
	/**
     * This is the controller Class for the usage dizmo of the digitalSTROM Kastellan implementation.
	 * @param {jQueryElement} frontElement    The element where the frontside of the dizmo should be rendered in
	 * @param {jQueryElement} backElement     The element where the backside of thw dizmo should be rendered in
	 * @constructs
	 * @extends Object
	 */
	constructor: function(frontElement,backElement) {
		var me = this;
		me.pollinginterval = 10000;
		// setup the digitalSTROM Connector
		var hm = new flab.HomeAutomation();
		me.connector = hm.getConnector();
		me.connector.registerForNotifications(me);
		// setup the views and render them
		me.backside_view = new flab.view.usage.backside(me,me.connector);
		me.frontside_view = new flab.view.usage.frontside(me,me.connector);
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
		
		dizmo.setAttribute('settings/title' , flab.tr('Usage') + ' ' + initObj.displayname);

		me.nologin = false;
		me.resolution = 2;
		if (me.hostname && me.authtoken) {
			me.connector.login(me.hostname , me.authtoken);
		} else {
			me.nologin = true;
		}

		me.enableTitleHandling(flab.tr('Usage'));
	},
	// flab.view.usage.frontside delegate implementation
	/**
	 * Will be called from the frontside view instance, if the user changes the resolution of the plot.
	 * @param {Integer} value      the new resolution. Can be one of these values 2, 300, 1800, 7200, 86400
	 */
	buttonPressed : function(value) {
		var me = this;
		me.resolution = value;
		me.init_graph();
	},
	// end of flab.view.usage.frontside delegate implementation

	/**
	 * Will be called from the dssconnector as soon as a successfull login was made.
	 */
	loginSuccess : function() {
		var me = this;
		console.log('flab.controller.usage loginSuccess');
		me.connector.zone_getDsmId(me.zoneid);
	},

	/**
	 * Will be called from the dssconnector after requesting the dsm id for a specific zone. Using me.connector.zone_getDsmId
	 * @param {String} dsmID      the id of the dsm
	 * @param {String} zone       the zoneid we used to request the dsmid
	 */
	dsmidForZone : function(dsmID , zone) {
		var me = this;
		if (me.zoneid == zone) {
			me.dsmId = dsmID;
			me.init_graph();
		}
	},

	/**
	 * Initialize the graph
	 */
	init_graph : function() {
		var me = this;
		console.log('flab.controller.usage init_graph');
		me.connector.zone_loadInitialUsage(me.dsmId , me.resolution);
	},

	/**
	 * Update the graph after having an initialized graph. This is the function we will call in the setInterval Loop.
	 */
	update_graph : function() {
		var me = this;
		console.log('flab.controller.usage update_graph');
		me.connector.zone_getCurrentUsage(me.dsmId);
	},

	/**
	 * Will be called by the digitalSTROM connector after having loaded the initial usage data.
	 * This function will reset the previously saved plot data
	 * @param {String} dsmid       the id of the dsm we requested metering data from.
	 * @param {Object} data        the metering data. Array of arrays with timestamp and usage values.
	 */
	initMeteringInfoForZone : function(dsmid , data) {
		var me = this;
		if (me.dsmId == dsmid) {
			// we have new metering data for our zone
			var tmp2 = new Date();
			console.log('initMeteringInfoForZone data = ' , data);
			for( var i = 0; i < data.length ; i++) {
				data[i][0] = data[i][0] * 1000 - tmp2.getTimezoneOffset()*60*1000;
			}
			me.plot_data = data;
			me.updateMeteringInfo();
			if (me.update_interval) {
				clearInterval(me.update_interval);
			}
			me.update_interval = setInterval(function(){
				me.update_graph();
			},me.pollinginterval);
		}
	},

	/**
	 * Will be called by the digitalSTROM connector after having loaded the current usage data of a dsm.
	 * This function will extend the previously loaded metering data
	 * @param {String} dsmid       the id of the dsm we requested metering data from.
	 * @param {Object} data        the metering data. Array of arrays with timestamp and usage values.
	 */
	currentMeteringInfoForDsmID : function(dsmid , data) {
		var me = this;
		if (me.dsmId == dsmid) {
			var tmp2 = new Date();
			console.log('time = ' , tmp2.getTime());
			console.log('offsetz = ' , tmp2.getTimezoneOffset());
			console.log('tmp2.getTimezoneOffset()*60*1000 = ' , tmp2.getTimezoneOffset()*60*1000);
			var timestamp = tmp2.getTime() - (tmp2.getTimezoneOffset()*60*1000);
			console.log('timestamp = ' , timestamp);
			console.log('last entry in array = ' , me.plot_data[0][0]);
			console.log('diff = ' , timestamp - me.plot_data[0][0]);
			if (me.plot_data[0][0] + (me.pollinginterval * 10) < timestamp) {
				// we seem to have really old initial data. refetching it.
				console.log('reset: last timestamp in graph = ' + me.plot_data[0][0] + ' timestamp of current request = ' + timestamp);
				me.connector.zone_loadInitialUsage(me.dsmId , me.resolution);
				return;
			}

			if (me.plot_data.length > 400) {
				console.log('pop');
				me.plot_data.pop();
			}
			me.plot_data.unshift([timestamp , data]);
			me.updateMeteringInfo();
		}
	},

	/**
	 * Tells the view where the plot is displayed to update the view using the current data.
	 */
	updateMeteringInfo : function() {
		var me = this;
		console.log('updateMeteringInfo');
		me.frontside_view.updateMeteringInfo(me.plot_data);
	},

	/**
	 * This function will be called from Kastellan (via the flab.application.usage class) when the dizmo is hidden.
	 * it is important to stop any timers at this point. Kastellan will Crash if we don't do this!
	 */
	remove : function() {
		var me = this;
		clearInterval(me.update_interval);
	}
});
