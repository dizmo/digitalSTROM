//= require flab/Namespace
//= require flab/controller/genesis

// If your dizmo has a back side, include this function. Otherwise you
// can delete it!
function showBack() {
    dizmo.showBack();
}

// As soon as the dom is loaded, and the dizmo is ready, instantiate the main class
window.document.addEventListener('dizmoready', function() {
    // Your code should be in here so that it is secured that the dizmo is fully loaded
	var genesis = new flab.controller.genesis(jQuery("#frontcontent") , jQuery("#backcontent"));
});


function showFront(event) {
    dizmo.showFront();
}

dizmo.onShowBack(function() {
    jQuery(".front").hide();
    dizmo.setSize(256,306);
    jQuery(".back").show();
});

dizmo.onShowFront(function() {
    console.log('test 4');
    jQuery(".back").hide();
    dizmo.setSize(512,266);
    jQuery(".front").show();
});