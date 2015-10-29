//= compat
//= require <flab/Namespace>
//= require <flab/controller/device>
var device = new flab.controller.device(jQuery("#frontcontent") , jQuery("#backcontent"));

function showBack(event) {
    dizmo.showBack();
}

function showFront(event) {
    dizmo.showFront();
}

dizmo.onShowBack(function() {
    jQuery(".front").hide();
    dizmo.setSize(256,256);
    device.showBack();
    jQuery(".back").show();
});

dizmo.onShowFront(function() {
    console.log('test 4');
    jQuery(".back").hide();
    dizmo.setSize(256,256);
    device.showFront();
    jQuery(".front").show();
});

dizmo.onDragStart(function() {
	console.log('on drag start');
	device.startDrag();
});

dizmo.onParentChanged(function(){
	console.log('on drag end');
	device.stopDrag();
});
