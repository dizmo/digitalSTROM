//= compat
//= require flab/Namespace
//= require flab/controller/usage
var usage = new flab.controller.usage(jQuery("#frontcontent") , jQuery("#backcontent"));


function showBack(event) {
    dizmo.showBack();
}

function showFront(event) {
    dizmo.showFront();
}

dizmo.onShowBack(function() {
    jQuery(".front").hide();
    dizmo.setSize(256,256);
    jQuery(".back").show();
});

dizmo.onShowFront(function() {
    console.log('test 4');
    jQuery(".back").hide();
    dizmo.setSize(256,256);
    jQuery(".front").show();
});