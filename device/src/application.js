//= require jquery/jquery
//= require jquery/jqueryui
//= require Gettext/Gettext
//= require flab/Namespace
//= require flab/controller/device

function showBack(event) {
    dizmo.showBack();
}

function showFront(event) {
    dizmo.showFront();
}

// If your dizmo has a back side, include this function. Otherwise you
// can delete it!
function showBack() {
    dizmo.showBack();
}

// As soon as the dom is loaded, and the dizmo is ready, instantiate the main class
window.document.addEventListener('dizmoready', function() {
    // Your code should be in here so that it is secured that the dizmo is fully loaded
	var device = new flab.controller.device(jQuery("#frontcontent") , jQuery("#backcontent"));
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
});
