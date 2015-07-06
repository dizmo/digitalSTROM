//= compat
//= require <flab/Test>
//= require <flab/test/TestLogger>
//= require <flab/view/zone/backside>

flab.Test.run(function(T, A) {
    T.Runner.add(new T.Case({
        name:  'flab.view.zone.backside',

        setUp: function() {
            var self = this;

        },

        tearDown: function() {
            var self = this;

        },

        test: function() {
            var self = this;

			var flab_digitalstrom_connector_stub = flab.Class.extend(Object, {
				constructor: function() {
					var self = this;
				},
				registerForNotifications : function(data) {}
			});			
			var connector_stub_instance = new flab_digitalstrom_connector_stub();
			
			group = undefined;
			// minimal stub for the flab.view.backside delegate
			var flab_view_zone_backside_delegate = flab.Class.extend(Object,{
				constructor : function() {
					var self = this;
				}
			});
			var flab_view_zone_backside_delegate_instance = new flab_view_zone_backside_delegate();
			A.nothingRaised(function() {
				self.backside_view = new flab.view.zone.backside(flab_view_zone_backside_delegate_instance,connector_stub_instance);
			},'constructor');
			A.nothingRaised(function() {
				self.backside_view.render_to(jQuery('#backsidecontent'));
			},'render_to');
        }
    }));
});
