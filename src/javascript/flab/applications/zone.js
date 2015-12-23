//= compat
//= require flab/Namespace
//= require flab/controller/zone
var zone = new flab.controller.zone(jQuery("#frontcontent") , jQuery("#backcontent"));

/**
 * Called when clicked on the finish button on the back side of the widget.
 */
function showFront() {
    if (window.widget) {
        widget.prepareForTransition("ToFront");
    }
    jQuery(".back").hide();
    jQuery(".front").show();
    if (window.widget) {
        setTimeout('widget.performTransition();', 0);
    }
};

/**
 * Called by kastellan when clicked on the widget menu option "Settings"
 */
function showBack() {
    if (window.widget) {
        widget.prepareForTransition("ToBack");
    }
    jQuery(".front").hide();
    jQuery(".back").show();
    if (window.widget) {
        setTimeout('widget.performTransition();', 0);
    }
};

function onstartdrag(){}
function onenddrag(){}