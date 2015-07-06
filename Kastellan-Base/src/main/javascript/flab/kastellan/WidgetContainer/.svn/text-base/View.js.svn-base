//= compat
//= require <flab/Namespace>
//= require <flab/Class>
//= require <flab/l10n/Translate>
//= require <jquery/touch>
flab.Namespace.create('flab.kastellan.WidgetContainer');

var globalTopZIndex = 100;

flab.kastellan.WidgetContainer.View = flab.Class.extend(Object, {
	constructor: function(delegate , element) {
		var me = this;
		me.delegate = delegate;
		me.element = element;
		me.Icon = 'Icon.png';
		me.title = '';
		me.isRendered = false;
		me.isMinimized = false;
		me.zIndex = false;
		me.left = 0;
		me.top = 0;
		
		me.bannerHeight = 50;
	},
	
	initializeInstance : function(classId , instanceId) {
		var me = this;
		me.instanceId = instanceId;
		me.classId = classId;
	},

	render: function(url) {
		var me = this;
		me.url = url;
		me.element.append('<div id="'+ me.instanceId + '" class="widget_container" style="width:'+me.width+'px;height:'+ (me.height/1 + me.bannerHeight/1) + 'px;">\
			<div class="widget_header_icon_out" style="display:none;left:'+(me.width-40)/2+'px;top:'+(me.height)/2+'px"></div>\
			<div class="widget_header_menu_container" style="display:none;">\
				<div class="widget_header_menu_item settings">'+flab.tr('settings')+'</div>\
				<div class="widget_header_menu_item remove">'+flab.tr('remove widget')+'</div>\
			</div>\
			<div class="widget_header">\
				<div class="widget_header_icon"></div>\
				<div class="widget_header_title">'+me.title+'</div>\
				<div class="widget_header_menu"></div>\
			</div>\
			<div class="widget_iframe_container"></div>\
		</div>');
		me.container = jQuery("#" + me.instanceId);
		
		var extendedURL = url + '/' + me.html + '?instanceId=' + me.instanceId + '&classId=' + me.classId;

		// url = url.replace(/..\/Widgets/ , '');
		// var extendedURL = '/cgi-bin/index.cgi?html=' + url + '/' + me.html + '&instanceId=' + me.instanceId + '&classId=' + me.classId;

		me.container.find(".widget_iframe_container").html('<iframe name="test" id="' + me.classId + '_' + me.instanceId + '" style="width:'+me.width+'px;height:'+me.height+'px;" src="' + extendedURL + '"></iframe>');
		me.container.find(".widget_header_icon").css('background-image' , 'url(\''+me.url + '/' + me.Icon+'\')');
		me.container.find(".widget_header_icon_out").css('background-image' , 'url(\''+me.url + '/' + me.Icon+'\')');
		me.container.draggable().touch({
			animate: false,
			sticky: false,
			dragx: true,
			dragy: true,
			rotate: false,
			resort: true,
			scale: false
		});
		me.container.find(".widget_header_menu").bind('click' , function(){
			me.container.find(".widget_header_menu_container").show();
		});
		me.container.find(".widget_header_menu_container > div").bind('click' , function(){
			me.container.find(".widget_header_menu_container").hide();
		});
		me.container.find(".widget_header_menu_container > div.settings").bind('click' , function(){
			me.delegate.showSettings();
		});
		me.container.find(".widget_header_menu_container > div.remove").bind('click' , function(){
			me.delegate.remove();
		});
		me.container.find(".widget_header_icon").bind('click' , function() {
			me.delegate.minimize();
		});
		me.container.find(".widget_header_icon_out").bind('click' , function() {
			me.delegate.maximize();
		});
		me.isRendered = true;
		me.moveTo(me.left,me.top);
		if (me.isMinimized) {
			me.minimize();
		}
		if (me.zIndex) {
			jQuery("#" + me.instanceId).css('z-index' , me.zIndex);
		}
	},
	
	move2Front : function() {
		var me = this;
		me.zIndex = globalTopZIndex;
		console.log('me.zIndex = ' , me.zIndex );
		if (me.isRendered) {
			jQuery("#" + me.instanceId).css('z-index' , me.zIndex);
		}		
		globalTopZIndex = globalTopZIndex + 1;
	},
	
	minimize : function() {
		var me = this;
		me.isMinimized = true;
		console.log('View: minimize');
		if (me.isRendered) {
			me.container.find(".widget_header_menu_container").hide();
			me.container.find(".widget_header").hide();
			me.container.find(".widget_iframe_container").hide();
			me.container.find(".widget_header_icon_out").show();
		}
	},

	maximize : function() {
		var me = this;
		me.isMinimized = false;
		if (me.isRendered) {
			console.log('View: maximize');
			me.container.find(".widget_header").show();
			me.container.find(".widget_iframe_container").show();
			me.container.find(".widget_header_icon_out").hide();
		}
	},
	
	resizeTo : function(width,height) {
		var me = this;
		me.width = width;
		me.height = height;
		if (me.isRendered) {
			me.container.css('width', me.width + 'px');
			me.container.css('height', (me.height/1 + me.bannerHeight/1) + 'px');
			me.container.find("#" + me.classId + '_' + me.instanceId ).css('width', me.width + 'px');
			me.container.find("#" + me.classId + '_' + me.instanceId ).css('height', me.height + 'px');
			me.container.find(".widget_header_icon_out").css('left:' , (me.width - 30)/2 + 'px');
			me.container.find(".widget_header_icon_out").css('top:' , (me.height - 30)/2 + 'px');
		}
	},
	
	moveTo: function(left,top) {
		var me = this;
		me.left = left;
		me.top = top;
		if(me.isRendered) {
			me.container.css('left', me.left + 'px');
			me.container.css('top', me.top + 'px');
		}
	},
	
	setIcon : function(icon) {
		var me = this;
		me.Icon = icon;
		me.container.find(".widget_header_icon").css('background-image' , 'url(\''+me.url + '/' + me.Icon+'\')');
		me.container.find(".widget_header_icon_out").css('background-image' , 'url(\''+me.url + '/' + me.Icon+'\')');
	},
	
	setTitle : function(title) {
		var me = this;
		me.title = title;
		me.container.find(".widget_header_title").html(me.title);		
	},
	
	initialize : function(plist) {
		var me = this;
		me.plist = plist;
		me.width = me.plist['Width'];
		me.height = me.plist['Height'];
		me.title = me.plist['CFBundleDisplayName'];
		me.html = me.plist['MainHTML'];
	},
	
	show_widget_back : function() {
		var me = this;
		document.getElementById(me.classId + '_' + me.instanceId ).contentWindow.showBack();
	},
	
	runFunction : function(functionRef , context , param1 , param2 , param3){
		var me = this;
		var evalFuncString = "var evalFunction = function(object, func, arg1 , arg2 , arg3){\
		    func.call(object, arg1 , arg2 , arg3);\
		}";
		document.getElementById(me.classId + '_' + me.instanceId ).contentWindow.eval(evalFuncString);
		document.getElementById(me.classId + '_' + me.instanceId ).contentWindow.evalFunction(context , functionRef , param1 , param2 , param3);
	},
	
	remove : function() {
		var me = this;
		jQuery('#' + me.instanceId).hide();
	}
	
});
