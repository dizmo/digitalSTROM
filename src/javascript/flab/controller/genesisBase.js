//= compat
//= require flab/Namespace
//= require flab/Class

flab.Namespace.create('flab.controller');

/* nasty hacks to fix "*"*ç"ç*"ç* behaviour of 1.2 API */
dizmojs.Bundle._bundleExists = function(id) {
	var bundles = [];
	var bundleIds = viewer.getBundles();
	for (var i = 0; i < bundleIds.length; i++) {
        bundles.push(bundleIds[i]);
    }
	return bundles;
}

/*
TODO: check why this does not work if I overwrite these methods. 
dizmo.publicStorage._parseTreeValue = function(value) {return value;}
dizmo.privateStorage._parseTreeValue = function(value) {return value;}
dizmo.publicStorage._prepareValue = function(value) {return value;}
dizmo.privateStorage._prepareValue = function(value) {return value;}
*/

/* end of nasty hacks */

flab.controller.genesisBase = flab.Class.extend(Object, /** @lends flab.controller.genesisBase.prototype */{

	numberOfIcons : 10,

	/**
	 * an instance of this object can be used to use several helper methods in connection of the genesis functionality of a widget
	 * @constructs
	 * @extends Object
	 */
	constructor: function() {
		var self = this;
	},

	/**
	 * Helper function to get a random icon id
	 */
	getRandomIconId : function() {
		var me = this;
		return Math.floor(Math.random()*me.numberOfIcons);
	},


	is_bundle_installed : function(bundleId) {
		var me = this;
		var bundles = viewer.getBundles();
		for (var i = 0 ; i < bundles.length ; i++) {
			if (bundles[i].identifier == bundleId) {
				return true;
			}
		}
		return false;
	},

	/**
	 * helper function to store the default information of a widget to the properties tree.
	 * @param {String} zoneid        the zoneid in which the widget should operate
	 * @param {String} displayname   the displayname of the zone in which the widget should operate
	 * @param {String} instanceId    the instance id of the previously created widget. (The return value of widget.addExternalWidget(...))
	 * @param {Object} data          an optional object that can be passed to the new widget
	 */
	set_zone_id_and_name_for_dizmo_instance : function(zoneid , displayname , dizmoInstance , data , genesis) {
		var self = this;

		console.log('genesis = ' , genesis);
		var object = {
			zoneid : zoneid,
			displayname : displayname,
			hostname : genesis.publicStorage.getProperty('hostname'),
			authtoken : genesis.publicStorage.getProperty('authtoken'),
			genesis : genesis.identifier
		};
		if (data) {
			object.data = data
		}
		console.log('set_zone_id_and_name_for_dizmo_instance object = '  , object)
		dizmoInstance.publicStorage.setProperty('basicinfo' , JSON.stringify(object));
	},


	enableTitleHandling : function(prefix) {
		var me = this;
		me.titlePrefix = prefix;

		dizmo.subscribeToAttribute("settings/title", function(key, newVal, oldVal){
			if(me.blockEndlessLoop) {
				me.blockEndlessLoop = false;
				return true;
			}
			console.log('the user did change the title of the dizmo to ' , newVal);
			var tmpVal = newVal.replace(me.titlePrefix , '');
			tmpVal = tmpVal.replace(/^\s+|\s+$/g, '') ;
			console.log('value to store =  ' , tmpVal);
			me.connector.zone_setName(me.zoneid , tmpVal);
			var theKey3 = 'zone_' + me.zoneid + '/displayname';
			me.genesis.publicStorage.setProperty(theKey3 , tmpVal);
		});

		var theKey2 = 'zone_' + me.zoneid + '/displayname';
		console.log('will register subscription for key ' , theKey2 , ' in genesis : ' , me.genesis);
		me.genesis.publicStorage.subscribeToProperty(theKey2, function(key, newVal, oldVal) {
			console.log('new display name listener');
			me.blockEndlessLoop = true;
			dizmo.setAttribute('settings/title' , me.titlePrefix + ' ' + newVal);
		});
	},

	get_widget_position : function(instanceId) {
		var self = this;
		var classId = widget.classIdForInstance(instanceId);
		var keyX = classId + "/" + instanceId + "/kastellan/posX";
		var keyY = classId + "/" + instanceId + "/kastellan/posY";
		var x = widget.globalPreferenceForKey(keyX);
		var y = widget.globalPreferenceForKey(keyY);
		return [x, y];
	},

	/**
	 * helper function to get a property for this widget.
	 * @param {String} key          the key of the property
	 * @return {String} value
	 */
	get_property_for_widget : function(key) {
		var self = this;
		return dizmo.publicStorage.getProperty(key);
	},

	/**
	 * helper function to set a property for this widget.
	 * @param {String} key          the key of the property
	 * @param {String} value        the value of the poroperty
	 */
	set_property_for_widget : function(key , value) {
		var self = this;
		if (value == undefined) {
			dizmo.publicStorage.deleteProperty(key);
		} else {
			dizmo.publicStorage.setProperty(key , value);
		}
	},

	/**
	 * helper function to get the directory where the widgets we want to start from the gensis widget are located.
	 * @return {String} the Absolute Path to the directory where the widgets are locatet. (Should probably be a file URL in the future)
	 */
	get_widgets_directory : function() {
		var self = this;
		return 'file:///widgets/'
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
		console.log('loadBasicInfo object_string = ' , object);
		return object;
	}
});
