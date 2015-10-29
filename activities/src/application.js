//= require ../../../digitalSTROM/src/javascript/flab/Namespace
//= require ../../../digitalSTROM/src/javascript/flab/controller/activities

// If your dizmo has a back side, include this function. Otherwise you
// can delete it!
// As soon as the dom is loaded, and the dizmo is ready, instantiate the main class
window.document.addEventListener('dizmoready', function() {
    // Your code should be in here so that it is secured that the dizmo is fully loaded
	var activities = new flab.controller.activities(jQuery("#frontcontent") , jQuery("#backcontent"));
});

function showBack(event) {
    dizmo.showBack();
}

function showFront(event) {
    dizmo.showFront();
}

dizmo.onShowBack(function() {
    jQuery(".front").hide();
    dizmo.setSize(256,284);
    jQuery(".back").show();
});

dizmo.onShowFront(function() {
    console.log('test 4');
    jQuery(".back").hide();
    dizmo.setSize(256,268);
    jQuery(".front").show();
});