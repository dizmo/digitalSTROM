//= compat
//= require <flab/Test>
//= require <flab/test/TestLogger>
//= require <flab/view/button/backside>

flab.Test.run(function(T, A) {
    T.Runner.add(new T.Case({
        name:  'flab.view.button.backside',

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
			var flab_view_button_backside_delegate = flab.Class.extend(Object,{
				constructor : function() {
					var self = this;
				},
				groupIdChanged : function(groupID) {
					group = groupID;
				}
			});
			var flab_view_button_backside_delegate_instance = new flab_view_button_backside_delegate();

			self.backside_view = new flab.view.button.backside(flab_view_button_backside_delegate_instance,connector_stub_instance);
			self.backside_view.render_to(jQuery('#backsidecontent'));
			
			jQuery('#group_select_trigger').trigger('click');
			self.wait(function() {
				jQuery('#group_null_view5_2').trigger('click');
				self.wait(function() {
					A.isTrue(group == '2');
					jQuery('.backside_container').remove();
				},500);
			} , 500);
        }
    }));
});
