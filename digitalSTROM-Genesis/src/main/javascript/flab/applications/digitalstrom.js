//= compat
//= require <flab/Namespace>
//= require <flab/controller/genesis>

var genesis = new flab.controller.genesis(jQuery("#frontcontent") , jQuery("#backcontent"));


function showBack(event) {
    dizmo.showBack();
}

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