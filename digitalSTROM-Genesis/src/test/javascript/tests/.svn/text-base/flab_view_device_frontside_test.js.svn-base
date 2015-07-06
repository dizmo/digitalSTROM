//= compat
//= require <flab/Test>
//= require <flab/test/TestLogger>
//= require <flab/view/device/frontside>
//= require <flab/digitalstrom/connector>

flab.Test.run(function(T, A) {
    T.Runner.add(new T.Case({
        name:  'flab.view.device.frontside',

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

			var flab_view_device_frontside_delegate = flab.Class.extend(Object,{
				constructor : function() {
					var self = this;
				}
			});
			var flab_view_device_frontside_delegate_instance = new flab_view_device_frontside_delegate();

			var frontside;
            A.nothingRaised(function() {
				frontside = new flab.view.device.frontside(flab_view_device_frontside_delegate_instance , connector);
			},'constructor');
            A.nothingRaised(function() {
				frontside.render_to(jQuery('#frontsidecontent'));
			},'render_to');			
		}
    }));
});
