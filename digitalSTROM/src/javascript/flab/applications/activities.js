//= compat
//= require <flab/Namespace>
//= require <flab/controller/activities>

/**
 * This is the default javascript class which will handle all the requests from Kastellan
 * The activities widget will be used to edit and select different activities from a specific colour 
 */

// instanciate the controller, and tell him where to render the content. 
// the controller will do the rest of the job... :) 
var activities = new flab.controller.activities(jQuery("#frontcontent") , jQuery("#backcontent"));

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