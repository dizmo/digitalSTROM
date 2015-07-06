//= compat
//= require <flab/Namespace>
//= require <flab/Class>

flab.Namespace.create('flab.kastellan');

flab.kastellan.PropertyTree = flab.Class.extend(Object, {
	constructor: function(url) {
		var me = this;
		me.notificationStore = new Array();
		me.localstore = new Array();
		jQuery.ajax(url,{
			async : false,
			dataType : 'xml',
			success : function(data) {
				console.log('data = ' , data);
				me.data = data;
			}
		});
	},
	preferenceForKey : function(_instance , key) {
		var me = this;
		var key = me.preprocessKey(key);
		console.log('flab.kastellan.PropertyTree preferenceForKey ' , _instance , key);
		var instanceNode = jQuery(me.data).find("property[key='" + _instance + "']")[0];
		var classNode = jQuery(instanceNode).parent("property");
		classValue = jQuery(classNode).attr('key');
		console.log('classValue = ' , classValue);
		
		var keyParts = key.split('/'); 
		keyParts.unshift(classValue);
		keyParts.unshift('globals');

		var selector = '';
		for (var i = 0 ; i < keyParts.length ; i ++ ) {
			selector = selector + " property[key='" + keyParts[i] + "']";
		}
		selector = selector + ' value';
		var result = jQuery(me.data).find(selector)[0];
		var text = unescape(jQuery(result).text());
		
		try {
			text = jQuery.parseJSON(text);
		} catch(e){}

		console.log('return = ' , text);
		return text;
	},
	
	classIdForInstance : function(_instance) {
		var me = this;
		var instanceNode = jQuery(me.data).find("property[key='" + _instance + "']")[0];
		var classNode = jQuery(instanceNode).parent("property");
		classValue = jQuery(classNode).attr('key');
		console.log('classValue = ' , classValue);
		return classValue;
	},

	globalPreferenceForKey : function(key) {
		var me = this;
		var key = me.preprocessKey(key);

		text = me.localstore['/global/' + key];
		if (text != undefined) {
			return text;
		}

		var keyParts = key.split('/'); 
		keyParts.unshift('globals');
		var selector = '';
		for (var i = 0 ; i < keyParts.length ; i ++ ) {
			selector = selector + " property[key='" + keyParts[i] + "']";
		}
		selector = selector + ' value';
		var result = jQuery(me.data).find(selector)[0];
		var text = unescape(jQuery(result).text());
		// TODO: we still use a local store. Not nice! 
		try {
			text = jQuery.parseJSON(text);
		} catch(e){}
		/*if (!text) {
			console.log('trying to load from local store: key = \'' + '/global/' + key + '\'');
			text = me.localstore['/global/' + key];
			console.log('text = ' , text);
		}*/
		return text;
	},

    setPreferenceForKey : function(_instance , value , key ){
    	var me = this;
		var key = me.preprocessKey(key);
		console.log('flab.kastellan.PropertyTree setPreferenceForKey ' , _instance , value , key);
    },
    
    setGlobalPreferenceForKey : function(value , key ) {
    	var me = this;
    	console.log('value , key' , value , key);
		var key = me.preprocessKey(key);
		console.log('flab.kastellan.PropertyTree setGlobalPreferenceForKey ' , value , key);

		var oldVal = me.localstore['/global/' + key];
		me.localstore['/global/' + key] = value;
		console.log('after = ' , me.localstore['/global/' + key]);
		
		me.sendNotifications(key , oldVal , me.localstore['/global/' + key]);
    },
    
    bindToPreference : function(_instanceId , key , funcRef , context) {
    	var me = this;
    	
		var key = me.preprocessKey(key);
        if (!me.notificationStore[key]) {
        	me.notificationStore[key] = [];
        }
        me.notificationStore[key].push({
        	func : funcRef,
        	caller : context,
        	instanceId : _instanceId
        });
	},
	
	sendNotifications : function(key , oldVal , newVal) {
		var me = this;
		console.log('me.notificationStore[key]' , me.notificationStore[key]);
		if (me.notificationStore[key]) {
			for (var i = 0 ; i < me.notificationStore[key].length ; i++ ) {
				notificationObject = me.notificationStore[key][i];
				Widgets[notificationObject.instanceId].runFunction(notificationObject.func ,notificationObject.caller ,key , oldVal , newVal);
				//notificationObject.func.call(notificationObject.caller , key , oldVal , newVal);
			}
		}
	},
    
    preprocessKey : function(key) {
    	var me = this;
    	return key.replace(/^\// , '');
    },

});
