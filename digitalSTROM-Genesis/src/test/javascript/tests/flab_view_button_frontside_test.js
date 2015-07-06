//= compat
//= require <flab/Test>
//= require <flab/test/TestLogger>
//= require <flab/view/button/frontside>
//= require <flab/digitalstrom/connector>

flab.Test.run(function(T, A) {
    T.Runner.add(new T.Case({
        name:  'flab.view.button.frontside',

        setUp: function() {
            var self = this;

        },

        tearDown: function() {
            var self = this;

        },

        test: function() {
            var self = this;
            // probably we should use a mockup here. anyway... for the moment we use the real connector
            var connector = new flab.digitalstrom.connector();
			connector.setUnittestMode();
			
			var url = document.location.href;
			var parts = url.split('/');
			var baseUrl = parts[2];
			var host = baseUrl + '/test/fixtures';
			connector.setHostName(host);

			var button_clicked;
			var flab_view_button_frontside_delegate = flab.Class.extend(Object,{
				constructor : function() {
					var self = this;
				},
				buttonPressed : function(button_id){
					var self = this;
					button_clicked = button_id;
					console.log('buttonPressed ' , button_id);
				}
			});
			var flab_view_button_frontside_delegate_instance = new flab_view_button_frontside_delegate();

			var frontside;
            A.nothingRaised(function() {
				frontside = new flab.view.button.frontside(flab_view_button_frontside_delegate_instance , connector);
			},'constructor');
            A.nothingRaised(function() {
				frontside.render_to(jQuery('#frontsidecontent'));
			},'render_to');
			
			// check if all the buttons return the right identifier
			jQuery('.mainbuttonicontop').trigger('click');
			A.isTrue(button_clicked == 'increase');
			jQuery('.mainbuttoniconLeft').trigger('click');
			A.isTrue(button_clicked == 'left');
			jQuery('.mainbuttoniconPush').trigger('click');
			A.isTrue(button_clicked == 'push');
			jQuery('.mainbuttoniconRight').trigger('click');
			A.isTrue(button_clicked == 'right');
			jQuery('.mainbuttoniconDown').trigger('click');
			A.isTrue(button_clicked == 'decrease');
			
			jQuery('#frontsidecontent')[0].innerHTML = '';
		}
    }));
});
