//= compat
//= require <flab/Test>
//= require <flab/test/TestLogger>
//= require <flab/view/activities/backside>
//= require <flab/l10n/Translate>

flab.Test.run(function(T, A) {
    T.Runner.add(new T.Case({
        name:  'flab.view.activities.backside',

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
				registerForNotifications : function(data) {},
				zone_getArrayOfActivityIds : function(zone , group) {
					var self = this;
					return new Array(5,17,18,19);
				},
			});			
			var connector_stub_instance = new flab_digitalstrom_connector_stub();
			
			group = undefined;
			// minimal stub for the flab.view.backside delegate
			var flab_view_activities_backside_delegate = flab.Class.extend(Object,{
				constructor : function() {
					var self = this;
				},
				groupIdChanged : function(groupID) {
					group = groupID;
				}
			});
			var flab_view_activities_backside_delegate_instance = new flab_view_activities_backside_delegate();

			self.backside_view = new flab.view.activities.backside(flab_view_activities_backside_delegate_instance,connector_stub_instance);
            A.nothingRaised(function() {
				self.backside_view.render_to(jQuery('#backsidecontent'));			
			} , 'render to of backside ');
        }
    }));
});
