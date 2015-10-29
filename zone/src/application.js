//= require jquery/jquery
//= require jquery/jqueryui
//= require Gettext/Gettext
//= require flab/Namespace
//= require flab/controller/zone

/**
 * Called when clicked on the finish button on the back side of the widget.
 */
function showFront() {
    jQuery(".back").hide();
    jQuery(".front").show();
};

/**
 * Called by kastellan when clicked on the widget menu option "Settings"
 */
function showBack() {
    jQuery(".front").hide();
    dizmo.showBack();
    jQuery(".back").show();
};

function onstartdrag(){}
function onenddrag(){}

// If your dizmo has a back side, include this function. Otherwise you
// can delete it!
function showBack() {
}

// As soon as the dom is loaded, and the dizmo is ready, instantiate the main class
window.document.addEventListener('dizmoready', function() {
    // Your code should be in here so that it is secured that the dizmo is fully loaded
	var zone = new flab.controller.zone(jQuery("#frontcontent") , jQuery("#backcontent"));
});
