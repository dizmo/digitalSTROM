//= compat
//= require <flab/Test>
//= require <flab/test/TestLogger>
//= require <flab/view/genesis/backside>

flab.Test.run(function(T, A) {
    T.Runner.add(new T.Case({
        name:  'flab.view.genesis.backside',

        setUp: function() {
            var self = this;

        },

        tearDown: function() {
            var self = this;

        },

        test_delegate: function() {
            var self = this;
			var did_request_appartment_name = false;
			var did_request_zone_list = false;
			var host_username_password = '';
			
			// minimal stub for the digitalstrom connector class
			var flab_digitalstrom_connector_stub = flab.Class.extend(Object, {
				constructor: function() {
					var self = this;
				},
				registerForNotifications : function(data) {},
				requestAppartmentName : function() {
					did_request_appartment_name = true;
				},
				requestNewZoneList : function() {
					did_request_zone_list = true;
				}
			});			
			var connector_stub_instance = new flab_digitalstrom_connector_stub();
			
			// minimal stub for the flab.view.backside delegate
			var flab_view_backside_delegate = flab.Class.extend(Object,{
				constructor : function() {
					var self = this;
				},
				hostnameDidChange : function(hostname) {
					host = hostname;
				}
			});
			var flab_view_backside_delegate_instance = new flab_view_backside_delegate();
			
			self.backside_view = new flab.view.genesis.backside(flab_view_backside_delegate_instance,connector_stub_instance);
			self.backside_view.render_to(jQuery('#backsidecontent'));
			
			self.wait(function() {
				self.backside_view.setHostName('host');
				// we don't realy need to wait here. In this unittest we don't have anynchronous requests
				self.wait(function() {
					A.isTrue(host == 'host' , 'host has the correct value');
					jQuery('#backsidecontent')[0].innerHTML = '';
				},500);
			},500);
        }
    }));
});
