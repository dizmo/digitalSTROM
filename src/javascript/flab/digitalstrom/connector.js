//= compat
//= require flab/Namespace
//= require flab/Class
flab.Namespace.create('flab.digitalstrom');

flab.digitalstrom.connector = flab.Class.extend(Object, {
	constructor: function() {
		var me = this;
		me.host = undefined;
		me.token = undefined;
		me.protocol = 'https';
		me.pollingTimeout = 10000;
		me.pollingRequests = 0;
		me.isGenesis = false;
		me.genesis = undefined;
		me.connected = false;

		me.intervalIds = {};
		
		me.delegates = [];
	},
	
	getDefaultSceneId : function() {
		var me = this;
		return 5;
	},
	
	setHostName : function(host) {
		var me = this;
		// removing protocol from host name if we have one. 
		host = host.replace(/.*?:\/\//g, "");
		
		var parts = host.split(':');
		if (parts.length < 2 ) {
			// we don't have a port in the postname. adding 8080
			host = host + ":8080";
		}
		me.host = host;
	},
	
	getHostname : function() {
		var me = this;
		return me.host;
	},
	
	setToken : function(token) {
		var me = this;
		me.token = token;
	},
	
	setGenesis : function (genesis) {
		var me = this;
		me.genesis = genesis;
	},
	
	registerForNotifications : function(delegate) {
		var me = this;
		me.delegates.push(delegate);
	},
	
	requestAuthToken : function() {
		var me = this;
		var jqxhr = jQuery.ajax({
				url: me.protocol + '://' + me.host + '/json/system/requestApplicationToken?applicationName=Dizmo',
				dataType : 'json',
				timeout: 1000
			})
		    .success(function(data) {
				for (var i = 0; i < me.delegates.length ; i++ ) {
					if(me.delegates[i].didRequestApplicationToken && typeof me.delegates[i].didRequestApplicationToken == 'function')  {
						me.delegates[i].didRequestApplicationToken();
					}
					if(me.delegates[i].updateApplicationToken && typeof me.delegates[i].updateApplicationToken == 'function')  {
						me.delegates[i].updateApplicationToken(data.result.applicationToken);
					}
				}
				// we try to enable the token using the default username and password. 
				// 1. Login
				var jqxhr = jQuery.ajax({
						url: me.protocol + '://' + me.host + '/json/system/login?user=dssadmin&password=dssadmin',
						dataType : 'json'
					}).success(function(loginData) {
						if (loginData.ok) {
							var jqxhr = jQuery.ajax({
									url: me.protocol + '://' + me.host + '/json/system/enableToken?applicationToken=' + data.result.applicationToken,
									dataType : 'json'
								}).success(function(enableTokenData) {
									if (loginData.ok) {
										me.checkIfAuthTokenIsValid();
									} else {
										me.couldNotLoginWithDefaultCredentials();
									}
								}).error(function(enableResponse){
									me.couldNotEnableToken();
								}
							);
						} else {
							me.couldNotLoginWithDefaultCredentials();
						}
					}).error(function(){
						me.couldNotLoginWithDefaultCredentials();
					}
				);
		    })
		    .error(function() {
				me.invalidHostName();
		    }
		);
	},
	
	couldNotEnableToken : function() {
		var me = this;
		for (var i = 0; i < me.delegates.length ; i++ ) {
			if(me.delegates[i].couldNotEnableToken && typeof me.delegates[i].couldNotEnableToken == 'function')  {
				me.delegates[i].couldNotEnableToken();
			}
		}
	},
	
	invalidHostName : function() {
		var me = this;
		for (var i = 0; i < me.delegates.length ; i++ ) {
			if(me.delegates[i].invalidHostName && typeof me.delegates[i].invalidHostName == 'function')  {
				me.delegates[i].invalidHostName();
			}
		}
	},

	couldNotLoginWithDefaultCredentials : function() {
		var me = this;
		for (var i = 0; i < me.delegates.length ; i++ ) {
			if(me.delegates[i].couldNotLoginWithDefaultCredentials && typeof me.delegates[i].couldNotLoginWithDefaultCredentials == 'function')  {
				me.delegates[i].couldNotLoginWithDefaultCredentials();
			}
		}
	},

	
	checkIfAuthTokenIsValid : function() {
		var me = this;
		jQuery.ajax({
			url: me.protocol + '://' + me.host + '/json/system/loginApplication?loginToken=' + me.token,
			dataType: 'json',
			success: function(data) {
				if (data.ok == true) {
					me._connected();
					for (var i = 0; i < me.delegates.length ; i++ ) {
						if(me.delegates[i].tokenIsValid && typeof me.delegates[i].tokenIsValid == 'function')  {
							me.delegates[i].tokenIsValid(data.result);
						}
					}
				} else {
					me.couldNotLoginWithDefaultCredentials();
				}
			},
			error : function(x, t, m) {
				if(t==="timeout") {
					me.invalidHostName();
				} else {
					me.invalidHostName();
				}
			}
		});
	},
	
	login : function(host , token) {
		var me = this;
		if (host) {
			me.host = host;
			me.setHostName(host);
		}
		if (token) {
			me.token = token;
			me.setToken(token);
		}
		jQuery.getJSON(me.protocol + '://' + me.host + '/json/system/loginApplication?loginToken=' + me.token, function(data) {
			if (data.ok == true) {
				me._connected();
				for (var i = 0; i < me.delegates.length ; i++ ) {
					if(me.delegates[i].loginSuccess && typeof me.delegates[i].loginSuccess == 'function')  {
						me.delegates[i].loginSuccess();
					}
				}
			}	
		});
	},
	
	requestNewZoneList : function() {
		var me = this;
		me.jsonRequest(me.protocol + '://' + me.host + '/json/apartment/getStructure', function(data) {
			if (data.ok == true) {
				for (var i = 0; i < me.delegates.length ; i++ ) {
					if(me.delegates[i].updateZoneList && typeof me.delegates[i].updateZoneList == 'function')  {
						me.delegates[i].updateZoneList(data.result);
					}
				}
			}
		});
	},
	
	requestAppartmentName : function(){
		var me = this;
		me.jsonRequest(me.protocol + '://' + me.host + '/json/apartment/getName', function(data) {
			if (data.ok == true) {
				for (var i = 0; i < me.delegates.length; i++ ) {
					if(me.delegates[i].updateAppartmentName && typeof me.delegates[i].updateAppartmentName == 'function')  {
						me.delegates[i].updateAppartmentName(data.result);
					}
				}
			}
		});
	},
	
	zone_getDsmId : function(zone) {
		var me = this;
		me.jsonRequest(me.protocol + '://' + me.host + '/json/property/query?query=%2Fapartment%2Fzones%2Fzone' + zone + '%2Fdevices%2F*(DSMeterDSID)' , function(data) {
			if (data.ok == true) {
				var dsmID = data.result.devices[0].DSMeterDSID;
				for (var i = 0; i < me.delegates.length; i++ ) {
					if(me.delegates[i].dsmidForZone && typeof me.delegates[i].dsmidForZone == 'function')  {
						me.delegates[i].dsmidForZone(dsmID , zone);
					}
				}
			}
		});
	},
	
	zone_getDevices : function(zone) {
		var me = this;
		me.jsonRequest(me.protocol + '://' + me.host + '/json/property/query?query=%2Fapartment%2Fzones%2Fzone' + zone + '%2Fdevices%2F*(productID,dSID,name)' , function(data) {
			if (data.ok == true) {
				for (var i = 0; i < me.delegates.length; i++ ) {
					if(me.delegates[i].devicesInZone && typeof me.delegates[i].devicesInZone == 'function')  {
						me.delegates[i].devicesInZone(data.result.devices , zone);
					}
				}
			}
		});
	},
	
	zone_filterSensorDevices : function(devices) {
		var me = this;
		var sensors = [];
		var sensors_counter = 0;
		for (var i = 0 ; i < devices.length ; i++) {
			var check = ((devices[i].productID>>10)&0x3f);
			if (!((check == 1) || (check == 4))) {
				sensors[sensors_counter] = devices[i];
				sensors_counter = sensors_counter + 1;
			}
		}
		return sensors;
	},
	
	zone_loadInitialUsage : function(dsmID, resolution) {
		var me = this;
		me.jsonRequest(me.protocol + '://' + me.host + '/json/metering/getValues?dsid=' + dsmID + '&resolution=' + resolution + '&type=consumption' , function(data) {
			if (data.ok == true) {
				for (var i = 0; i < me.delegates.length; i++ ) {
					if(me.delegates[i].initMeteringInfoForZone && typeof me.delegates[i].initMeteringInfoForZone == 'function')  {
						me.delegates[i].initMeteringInfoForZone(dsmID , data.result.values);
					}
				}
			}
		});
	},
	
	zone_getCurrentUsage : function(dsmID) {
		var me = this;
		me.jsonRequest(me.protocol + '://' + me.host + '/json/circuit/getConsumption?id=' + dsmID , function(data) {
			if (data.ok == true) {
				for (var i = 0; i < me.delegates.length; i++ ) {
					if(me.delegates[i].currentMeteringInfoForDsmID && typeof me.delegates[i].currentMeteringInfoForDsmID == 'function')  {
						me.delegates[i].currentMeteringInfoForDsmID(dsmID , data.result.consumption);
					}
				}
			}
		});
	},
	
	zone_getArrayOfActivityIds : function(zone , group) {
		var me = this;
		return new Array(5,17,18,19);
	},
	
	/* get the description of the different device groups 
	 * possible usage: 
	 * 
	 * var groups = me.connector.zone_getGroupDescriptions(zone);
	 * var listContent = '';
	 * for (var i = 0 ; i < groups.length ; i++ ) {
	 * 	listContent = listContent + '<li id="group_null_view5_' + groups[i].id + '" class="' + groups[i].classid + 
	 * 	            '"><div class="comboicon ' + groups[i].classid + '"></div>' + flab.tr(groups[i].text) + '</li>';
	 * }	 
	 */
	zone_getGroupDescriptions : function(zone) {
		var me = this;
		return [
			{
				'id' : '0',
				'classid' : 'white',
				'text' : 'All'
			},
			{
				'id' : '1',
				'classid' : 'yellow',
				'text' : 'Light'
			},
			{
				'id' : '2',
				'classid' : 'gray',
				'text' : 'Shadow'
			},
			{
				'id' : '3',
				'classid' : 'blue',
				'text' : 'Climate'
			},
			{
				'id' : '4',
				'classid' : 'cyan',
				'text' : 'Audio'
			}
		]
	},
	
	
	zone_requestActivityNames : function(zone , group) {
		var me = this;
		var scenes = me.zone_getArrayOfActivityIds();
		for (var i = 0 ; i < scenes.length ; i++) {
			me.zone_requestActivityNamesForScene(zone , group , scenes[i]);
		}
	},
	
	zone_requestActivityNamesForScene : function(zone , group , scene ) {
		var me = this;
		me.jsonRequest(me.protocol + '://' + me.host + '/json/zone/sceneGetName?id=' + zone + '&groupID=' + group + '&sceneNumber=' + scene , function(data) {
			if (data.ok == true) {
				for (var i = 0; i < me.delegates.length; i++ ) {
					if(me.delegates[i].updateActivityName && typeof me.delegates[i].updateActivityName == 'function')  {
						me.delegates[i].updateActivityName(zone , group , scene , data.result.name);
					}
				}
			}
		});
	},

	zone_setNameForSceneOfGroup : function(zone , name , scene, group) {
		var me = this;
		if (group == 0) {
			var groups = me.zone_getGroupDescriptions();
			me.nameOfSceneCounter = groups.length;
			for (var i = 0 ; i < groups.length ; i++) {
				me._zone_setNameForSceneOfGroup(zone , name , scene, groups[i].id);
			}
		} else {
			me.nameOfSceneCounter = 1;
			me._zone_setNameForSceneOfGroup(zone , name , scene, group);
		}
	},
	
	_zone_setNameForSceneOfGroup : function(zone , name , scene, group) {
		var me = this;
		me.jsonRequest(me.protocol + '://' + me.host + '/json/zone/sceneSetName?id=' + zone + '&groupID=' + group + '&sceneNumber=' + scene + '&newName=' + escape(name) , function(data) {
			if (data.ok == true) {
				for (var i = 0; i < me.delegates.length; i++ ) {
					if(me.delegates[i].updateActivityName && typeof me.delegates[i].updateActivityName == 'function')  {
						me.delegates[i].updateActivityName(zone , group , scene , name);
					}
				}				
			}
			me.nameOfSceneCounter = me.nameOfSceneCounter - 1;
			if (me.nameOfSceneCounter < 1) {
				for (var i = 0; i < me.delegates.length; i++ ) {
					if(me.delegates[i].zone_didSetNameForSceneOfGroup && typeof me.delegates[i].zone_didSetNameForSceneOfGroup == 'function')  {
						me.delegates[i].zone_didSetNameForSceneOfGroup(zone , group , scene , name);
					}
				}				
			}
		});
	},
	
	zone_setSceneForGroup : function(zone , scene , group) {
		var me = this;
		me.jsonRequest(me.protocol + '://' + me.host + '/json/zone/callScene?id=' + zone + '&groupID=' + group + '&sceneNumber=' + scene , function(data) {
			if (data.ok == true) {
				me.zone_getLastCalledSceneForGroup(zone,group);
			}
		});
	},
		
	zone_getLastCalledSceneForGroup : function(zone , group) {
		var me = this;
		me.jsonRequest(me.protocol + '://' + me.host + '/json/property/getInteger?path=%2Fapartment%2Fzones%2Fzone' + zone + '%2Fgroups%2Fgroup' + group + '%2FlastCalledScene' , function(data) {
			if (data.ok == true) {
				/* we normalize the scene number right after we got it from the server. we don't want to handle this mess */
				data.result.value = me.normalize_scene_number_config[data.result.value];
				me.updateLastCalledSceneForGroupAndZone(data.result.value , group , zone);
				for (var i = 0; i < me.delegates.length; i++ ) {
					if(me.delegates[i].updateLastCalledSceneForGroupAndZone && typeof me.delegates[i].updateLastCalledSceneForGroupAndZone == 'function')  {
						me.delegates[i].updateLastCalledSceneForGroupAndZone(data.result.value , group , zone);
					}
				}				
			}
		});
	},
	
	/* sceens are assumed to be as descibed here : http://redmine.digitalstrom.org/projects/dss/wiki/Scene_table */
	normalize_scene_number_config : {
		0 : 0 , 1 : 0 , 2 : 0 , 3 : 0 , 4 : 0, 13 : 0 , 32 : 0 , 33 : 0 , 34 : 0 , 35 : 0 , 36 : 0 , 37 : 0 , 38 : 0, 39 : 0 , /* scenes 1 to 4 and 32 to 39 are all "off" which is 0 ... wtf??? and we even need the scene 13 because the wall switches set 13 which would be minimum fo all. */
		5 : 5 , 6 : 5 , 7 : 5 , 8 : 5 , 9 : 5 , 14 : 5 , /* scenes 6 to 9 are all scene 5 just introduced by another type of button!??? and 14 is maximum all which is introduced by the wall switches... ??? */
		17 : 17 , 20 : 17 , 23 : 17 , 26 : 17 , 29 : 17, 
		18 : 18 , 21 : 18 , 24 : 18 , 25 : 18 , 30 : 18,
		19 : 19 , 22 : 19 , 25 : 19 , 26 : 19 , 31 : 19
	},
	
	next_scene_congifuration : {
		5 : 17, 
		17 : 18, 
		18 : 19,
		19 : 5,
		0 : 5
	},
	
	previous_scene_configuration : {
		5 : 19,
		19 : 18, 
		18 : 17, 
		17 : 5,
		0 : 19
	},
	
	toggle_scene_configuration : {
		0 : 5 , 
		5 : 0 , 17 : 0 , 18 : 0 , 19 : 0
	},
	
	current_scene : {
		0 : {},
		1 : {},
		2 : {},
		3 : {},
		4 : {},
		6 : {},
		7 : {},
		8 : {}
	}, 
	
	updateLastCalledSceneForGroupAndZone : function(value , group , zone) {
		var me = this;
		me.current_scene[group][zone] = value;
	},
	
	_get_next_scene : function(zone , group) {
		var me = this;
		if (group == 4) {
			return 18;
		}
		if (typeof(me.current_scene[group][zone]) !== "undefined") {
			return me.next_scene_congifuration[me.current_scene[group][zone]];
		} else {
			/* no scene known yet. setting first scene */
			return 5;
		}
	},
	
	_get_previous_scene : function(zone , group) {
		var me = this;
		if (group == 4) {
			return 17;
		}
		if (typeof(me.current_scene[group][zone]) !== "undefined") {
			return me.previous_scene_configuration[me.current_scene[group][zone]];
		} else {
			/* no scene known yet. setting the last one */
			return 19;
		}
	},
	
	_get_toggle_scene : function(zone , group) {
		var me = this;
		if (group == 4) {
			return 5;
		}
		if (typeof(me.current_scene[group][zone]) !== "undefined") {
			return me.toggle_scene_configuration[me.current_scene[group][zone]];
		} else {
			return 5;
		}
	},

	zone_toggleForGroup : function(zone ,group) {
		var me = this;
		me.jsonRequest(me.protocol + '://' + me.host + '/json/zone/callScene?id=' + zone + '&groupID=' + group + '&sceneNumber=' + me._get_toggle_scene(zone,group), function(data) {
			me.zone_getLastCalledSceneForGroup(zone , group);
		});		
	},

	zone_StartIncreaseValueForGroup : function(zone , group) {
		var me = this;
		me.intervalIds['inc' + zone + group] = window.setInterval(function() {
			me.jsonRequest(me.protocol + '://' + me.host + '/json/zone/callScene?id=' + zone + '&groupID=' + group + '&sceneNumber=12', function(data) {
			});
		},250);
	},
	zone_StopIncreaseValueForGroup : function (zone , group) {
		var me = this;
		window.clearInterval(me.intervalIds['inc' + zone + group]);
	},
	
	zone_StartDecreaseValueForGroup : function(zone , group) {
		var me = this;
		me.intervalIds['dec' + zone + group] = window.setInterval(function() {
			me.jsonRequest(me.protocol + '://' + me.host + '/json/zone/callScene?id=' + zone + '&groupID=' + group + '&sceneNumber=11', function(data) {
			});
		},250);
	},
	zone_StopDecreaseValueForGroup : function (zone , group) {
		var me = this;
		window.clearInterval(me.intervalIds['dec' + zone + group]);
	},

	zone_previousSceneForGroup : function(zone , group) {
		var me = this;
		me.jsonRequest(me.protocol + '://' + me.host + '/json/zone/callScene?id=' + zone + '&groupID=' + group + '&sceneNumber=' + me._get_previous_scene(zone,group), function(data) {
			me.zone_getLastCalledSceneForGroup(zone , group);
		});		
	},
	zone_nextSceneForGroup : function(zone , group) {
		var me = this;
		me.jsonRequest(me.protocol + '://' + me.host + '/json/zone/callScene?id=' + zone + '&groupID=' + group + '&sceneNumber=' + me._get_next_scene(zone,group) , function(data) {
			me.zone_getLastCalledSceneForGroup(zone , group);
		});
	},

	zone_setName : function(zone , newName) {
		var me = this;
		me.jsonRequest(me.protocol + '://' + me.host + '/json/zone/setName?id=' + zone + '&newName=' + escape(newName) , function(data) {
			if (data.ok == true) {
				me.requestNewZoneList();
			}
		});
	},

	zone_add : function(zone) {
		var me = this;
		me.jsonRequest(me.protocol + '://' + me.host + '/json/structure/addZone?zoneID=' + zone , function(data) {
			if (data.ok == true) {
				me.requestNewZoneList();
			}
		});
	},
	
	zone_remove : function(zone) {
		var me = this;
		me.jsonRequest(me.protocol + '://' + me.host + '/json/structure/removeZone?zoneID=' + zone , function(data) {
			if (data.ok == true) {
				me.requestNewZoneList();
			}
		});
	},
	
	zone_addDevice : function(zone , device) {
		var me = this;
		me.jsonRequest(me.protocol + '://' + me.host + '/json/structure/zoneAddDevice?zone=' + zone + '&deviceID=' + device, function(data) {
			if (data.ok == true) {
				// everything fine 
			} else {
				for (var i = 0; i < me.delegates.length; i++ ) {
					if(me.delegates[i].couldNotAddDeviceToZone && typeof me.delegates[i].couldNotAddDeviceToZone == 'function')  {
						me.delegates[i].couldNotAddDeviceToZone(zone , device);
					}
				}				
			}
		}, function(data){
			for (var i = 0; i < me.delegates.length; i++ ) {
				if(me.delegates[i].couldNotAddDeviceToZone && typeof me.delegates[i].couldNotAddDeviceToZone == 'function')  {
					me.delegates[i].couldNotAddDeviceToZone(zone , device);
				}
			}				
		});
	},
	
	zone_saveSceneForGroup : function(zone , scene , group) {
		var me = this;
		me.jsonRequest(me.protocol + '://' + me.host + '/json/zone/saveScene?id=' + zone + '&groupID=' + group + '&sceneNumber=' + scene, function(data) {
			if (data.ok == true) {
				for (var i = 0; i < me.delegates.length; i++ ) {
					if(me.delegates[i].didSaveScene && typeof me.delegates[i].didSaveScene == 'function')  {
						me.delegates[i].didSaveScene(zone , scene , group);
					}
				}				
			}
		});
	},
	
	device_setName : function(dsid , name) {
		var me = this;
		me.jsonRequest(me.protocol + '://' + me.host + '/json/device/setName?dsid=' + dsid + '&newName=' + escape(name) , function(data) {
			if (data.ok == true) {
			}
		});
	},
	
	set_absent : function() {
		var me = this;
		me.jsonRequest(me.protocol + '://' + me.host + '/json/apartment/callScene?sceneNumber=72', function(data) {
			if (data.ok == true) {
			}
		});		
	},

	set_panic : function() {
		var me = this;
		me.jsonRequest(me.protocol + '://' + me.host + '/json/apartment/callScene?sceneNumber=65', function(data) {
			if (data.ok == true) {
			}
		});
	},
	
	set_doorbell : function() {
		var me = this;
		me.jsonRequest(me.protocol + '://' + me.host + '/json/apartment/callScene?sceneNumber=73', function(data) {
			if (data.ok == true) {
			}
		});
	},
	
	get_group_for_device : function(dsid) {
		var me = this;
		me.jsonRequest(me.protocol + '://' + me.host + '/json/device/getGroups?dsid=' + dsid, function(data) {
			if (data.ok == true) {
				for (var i = 0; i < me.delegates.length; i++ ) {
					if(me.delegates[i].groupIdForDevice && typeof me.delegates[i].groupIdForDevice == 'function')  {
						me.delegates[i].groupIdForDevice(data.result.groups[0].id , dsid);
					}
				}				
			}
		});
	},

	get_state_for_device : function(dsid) {
		var me = this;
		me.jsonRequest(me.protocol + '://' + me.host + '/json/device/getState?dsid=' + dsid, function(data) {
			if (data.ok == true) {
				for (var i = 0; i < me.delegates.length; i++ ) {
					if(me.delegates[i].stateForDevice && typeof me.delegates[i].stateForDevice == 'function')  {
						me.delegates[i].stateForDevice(data.result.isOn , dsid);
					}
				}				
			}
		});
	},
	
	/**
	 * load the real value of a device. Don't use this call if you have other possibilities. 
	 * The dss needs to request the current value of the digitalSTROM Bus. This will take quiet a while. 
	 * @param {String} dsid     the id of the device
	 */
	get_value_for_device : function(dsid) {
		var me = this;
		me.jsonRequest(me.protocol + '://' + me.host + '/json/device/getConfig?class=64&index=0&dsid=' + dsid, function(data) {
			if (data.ok == true) {
				for (var i = 0; i < me.delegates.length; i++ ) {
					if(me.delegates[i].valueForDevice && typeof me.delegates[i].valueForDevice == 'function')  {
						me.delegates[i].valueForDevice(data.result.value , dsid);
					}
				}				
			}
		});
	},
	
	set_value_for_device : function(value , dsid) {
		var me = this;
		me.jsonRequest(me.protocol + '://' + me.host + '/json/device/setValue?dsid=' + dsid + '&value=' + value, function(data) {
			if (data.ok == true) {
			}
		});
	},

	enable_callScenePolling : function() {
		var me = this;
		me.isGenesis = true;
		me.jsonRequest(me.protocol + '://' + me.host + '/json/event/subscribe?name=callScene&subscriptionID=1&token='+me.token , function(data) {
			if (data.ok == true) {
				me.waitForNextCallScene();
				me.scenePollingControllInterval = window.setInterval(function() {
					if (me.pollingRequests == 0) {
						me.waitForNextCallScene();
					}
				},1100);
			}
		});
	},
	
	getTimestamp : function() {
		var me = this;
		var ms = new Date().getTime();
		var timestamp = Math.round(ms/1000);
		return timestamp;
	},
	
	waitForNextCallScene : function() {
		var me = this;
		
		
		var urlsufix = '/json/event/get?subscriptionID=1&timeout=' + me.pollingTimeout + '&token='+me.token;
		if (me.unittestMode) {
			urlsufix = '/json/event/get.cgi?subscriptionID=1&token='+me.token;
		}
		// increase the polling request counter
		me.pollingRequests = me.pollingRequests + 1;
		setTimeout(function(){
			me.pollingRequests = me.pollingRequests -1;
		},me.pollingTimeout);

		setTimeout(function(){
			jQuery.ajax({
				url: me.protocol + '://' + me.host + urlsufix,
				dataType: 'json',
				async : true,
				success: function(data) {
					me._connected();
					if (data && data.ok == true) {
						if (data.result.events.length > 0) {
							for (var i = 0; i < me.delegates.length; i++ ) {
								if(me.delegates[i].updateLastCalledScene && typeof me.delegates[i].updateLastCalledScene == 'function')  {
									me.delegates[i].updateLastCalledScene();
								}
							}
							me.waitForNextCallScene();
						}						
					} else {
						jQuery.getJSON(me.protocol + '://' + me.host + '/json/system/loginApplication?loginToken=' + me.token, function(data) {
							me.enable_callScenePolling();
						});
					}
				},
				error : function(data) {
					me._lostConnection();
					jQuery.getJSON(me.protocol + '://' + me.host + '/json/system/loginApplication?loginToken=' + me.token, function(data) {
						me.enable_callScenePolling();
					});
				}
			});
		},1);
	},
	
	_connected : function() {
		var me = this;
		if (!me.connected) {
			me.connected = true;
			for (var i = 0; i < me.delegates.length; i++ ) {
				if(me.delegates[i].coundConnect && typeof me.delegates[i].coundConnect == 'function')  {
					me.delegates[i].coundConnect();
				}
			}
		}
	},
	
	_lostConnection : function() {
		var me = this;
		if (me.connected) {
			me.connected = false;
			for (var i = 0; i < me.delegates.length; i++ ) {
				if(me.delegates[i].lostConnection && typeof me.delegates[i].lostConnection == 'function')  {
					me.delegates[i].lostConnection();
				}
			}
		}
	},
	
	jsonRequest : function(url , callback , errorCallback) {
		var me = this;
		if (me.isGenesis) {
			me.doJsonRequest(url , callback , errorCallback);
		} else {
			me.sendJsonRequestToGenesis(url , callback , errorCallback);
		}
	},
	
	initializeGenesis : function() {
		var me = this;
		me.genesis.publicStorage.subscribeToProperty('ajax' , function(changes){
			for (var i = 0 ; i < changes.length; i++) {
				var obj = changes[i];
				var key = obj.path;
				var oldVal = obj.oldVal;
				var newVal = obj.val;
				var dataTarget = key.replace('uri' , 'data').replace('ajax' , 'response');
				var statusTarget = key.replace('uri' , 'status').replace('ajax' , 'response');
				me.doJsonRequest(newVal , function(data){
					// success
					me.genesis.publicStorage.setProperty(dataTarget , data);
					me.genesis.publicStorage.setProperty(statusTarget , 'success');
				} , function(data){
					// error
					me.genesis.publicStorage.setProperty(statusTarget , 'error');
				});
			}
		},{
			recursive : true
		});
	},
	
	sendJsonRequestToGenesis : function(url , callback , errorCallback) {
		var me = this;
		var tmp = new Date();
		myKey = dizmo.identifier + tmp.getTime();
		var sub_id = me.genesis.publicStorage.subscribeToProperty('response/'+myKey+'/status' , function(key, newVal, oldVal){
			me.genesis.publicStorage.unsubscribeProperty(sub_id);
			var dataKey = key.replace('status' , 'data');
			if (newVal == 'success') {
				var data = me.genesis.publicStorage.getProperty(dataKey);

				// delete data
				me.genesis.publicStorage.deleteProperty(key);
				me.genesis.publicStorage.deleteProperty(dataKey);
				dataKey=dataKey.replace('response/','ajax/');
				dataKey=dataKey.replace('/data','/uri');
				me.genesis.publicStorage.deleteProperty(dataKey);

				callback(data);
			} else {
				var data = me.genesis.publicStorage.getProperty(dataKey);
				errorCallback(data);
			}
		});
		me.genesis.publicStorage.setProperty('ajax/'+myKey+'/uri'  , url);
	},
	
	doJsonRequest : function(url , callback , errorCallback) {
		var me = this;
		jQuery.ajax({
			url: url,
			dataType: 'json',
			success: function(data) {
				if (data.ok == true) {
					callback(data);
				} else {
					// we are probably not logged in anmore
					// doing a relogin
					me.retryAfterLogin(url , callback , data , errorCallback);
				}
			},
			error : function(data) {
				if (data.ok == true) {
					// we got an error, but a ok=true... strange
					if (errorCallback) {
						errorCallback(data);
					}
				} else {
					me.retryAfterLogin(url , callback , data , errorCallback);
				}
			}
		});
	},
	
	retryAfterLogin : function(url , callback, data , errorCallback) {
		var me = this;
		jQuery.ajax({
			url: me.protocol + '://' + me.host + '/json/system/loginApplication?loginToken=' + me.token,
			dataType: 'json',
			success: function(data) {
				jQuery.ajax({
					url: url,
					dataType: 'json',
					success: function(data) {
						if (data.ok == true) {
							callback(data);
						} else {
							if (errorCallback) {
								errorCallback(data);
							}
						}
					},
					error : function(data){
						if (errorCallback) {
							errorCallback(data);
						}
					}
				});
			},
			error : function(data) {
				if (errorCallback) {
					errorCallback(data);
				}
			}
		});
	},
	
	
	
	/**
	 * a convenience method to get the display name of a zone after updateZoneList of a delegate has been called
	 * @param {Object} zone the Object you get when you register for notifications from the flab.digitalstrom.connector
	 *                      and the updateZoneList method has been called.
	 * @returns {String} the String to display for a specific zone
	 * @usage
	 * ...
	 * connector.registerForNotifications(me);
	 * ...
	 * updateZoneList : function(data) {
	 *   var me = this;
	 *   data.apartment.zones.each(function(zone){
	 *     var display_name = me.connector.get_display_name_for_zone(zone);
	 *     // do something with the display_name
	 *     ...
	 *   }
	 * }
	 */
	get_display_name_for_zone : function(zone) {
		var me = this;
		var display_name = zone.name;
		if (zone.name == '') {
			if (zone.id == 0) {
				display_name = 'Wohnung *';
			} else {
				display_name = 'Raum #' + zone.id;
			}
		}
		return display_name;
	},
	
	setUnittestMode : function() {
		var me = this;
		me.unittestMode = true;
		me.protocol = 'http';
	}
		
});
