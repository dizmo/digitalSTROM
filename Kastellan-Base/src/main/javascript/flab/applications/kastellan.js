//= compat
//= require <flab/kastellan/PropertyTree>
//= require <flab/kastellan/SessionHandler>

resizeWidgetTo = function(_instanceId , width, height ) {
	console.log('resizeWidgetTo ' , _instanceId , width, height );
	Widgets[_instanceId].resizeTo(width,height);
}
flab_setTitle = function(_instanceId , title) {
	console.log('resizeWidgetTo ' , _instanceId , title );
	Widgets[_instanceId].setTitle(title);
}
setIconName = function(_instanceId , icon) {
	Widgets[_instanceId].setIcon(icon);
}
var Widgets = [];

var pTree = new flab.kastellan.PropertyTree('/cgi-bin/Settings.cgi');
var SessionHandler = new flab.kastellan.SessionHandler('/Session.ini');
if (isiPhone()) {
	Widgets = SessionHandler.start_first_activity_widget();
	jQuery('.kastellan_main_container').css('width' , '256px');
	jQuery('.kastellan_main_container').css('height' , '256px');
} else {
	Widgets = SessionHandler.startWidgets();
	jQuery('.kastellan_main_container').css('width' , '6000px');
	jQuery('.kastellan_main_container').css('height' , '6000px');
}

/*
var instance1 = 'instance1';
Widgets[instance1] = new flab.kastellan.WidgetContainer.Controller(jQuery('.kastellan_main_container'));
Widgets[instance1].startWidget('../Widgets/ch.futurelab.widget.shaspa' , 'class1' , instance1 );
Widgets[instance1].moveTo(50,50);
*/

/*
var instance1 = 'h40402cf67eeff50';
Widgets[instance1] = new flab.kastellan.WidgetContainer.Controller(jQuery('.kastellan_main_container'));
Widgets[instance1].startWidget('../Widgets/ch.futurelab.widget.digitalSTROM.activities' , 'class2' , instance1 );
Widgets[instance1].moveTo(10,10);
*/


/*
instance1 = 'instance2';
Widgets[instance1] = new flab.kastellan.WidgetContainer.Controller(jQuery('.kastellan_main_container'));
Widgets[instance1].startWidget('../Widgets/ch.futurelab.widget.shaspa' , 'class1' , instance1 );
Widgets[instance1].moveTo(600,100);
*/

function isiPhone() {
	var val = navigator.platform.indexOf("iPhone") != -1;
	return val;
}

function isiPad() {
	var val = navigator.platform.indexOf("iPhone") != -1;
	return val;
}
