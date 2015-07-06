//= compat
//= require <flab/Namespace>
//= require <flab/Class>
//= require <flab/kastellan/WidgetContainer/View>

flab.Namespace.create('flab.kastellan');

flab.kastellan.WidgetContainer.Controller = flab.Class.extend(Object, {
	constructor: function(element) {
		var me = this;
		me.element = element;
		me.view = new flab.kastellan.WidgetContainer.View(me , me.element);
		me.PlistInfo = [];
		me.instanceId = undefined;
		me.classId = undefined;
	},
	
	startWidget: function(url , classId , instanceId ) {
		var me = this;
		me.instanceId = instanceId;
		me.classId = classId;
		me.view.initializeInstance(classId , instanceId);
	    jQuery.ajax({
        	type: "GET",
            url: url + "/Info.plist",
            dataType: "xml",
            success: function(xml) {
            	console.log('xml = ' , xml);
            	var keyElements = jQuery(xml).find('key').each(function() {
            		var keyElement = jQuery(this);
            		var akey = keyElement.text();
            		var avalue = keyElement.next().text();
            		console.log('key = ' , akey , 'value = ' , avalue);
            		me.PlistInfo[akey + ''] = avalue + '';
            	});
            	for (var i in me.PlistInfo) {
	            	console.log('key = ' , i , ' value = ' , me.PlistInfo[i]);
	            }
	            me.view.initialize(me.PlistInfo);
	            me.view.render(url);
			}
		});
	},
	
	setTitle : function(title) {
		var me = this;
		me.view.setTitle(title);
	},
	
	minimize : function() {
		var me = this;
		me.view.minimize();
	},
	
	maximize : function() {
		var me = this;
		me.view.maximize();
	},
	
	move2Front : function() {
		var me = this;
		me.view.move2Front();
	},
	
	setIcon : function(icon) {
		var me = this;
		me.view.setIcon(icon);
	},
	
	showSettings : function() {
		var me = this;
		me.view.show_widget_back();
	},
	
	remove : function() {
		var me = this;
		me.view.remove();
	},
	
	resizeTo : function(width,height) {
		var me = this;
		me.view.resizeTo(width,height);
	},
	
	moveTo : function(left,top) {
		var me = this;
		me.view.moveTo(left,top);
	},
	
	runFunction: function(functionRef , context , param1 , param2 , param3) {
		var me = this;
		me.view.runFunction(functionRef , context , param1 , param2 , param3);
	}

});
