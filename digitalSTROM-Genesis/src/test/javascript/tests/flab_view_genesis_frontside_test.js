//= compat
//= require <flab/Test>
//= require <flab/test/TestLogger>
//= require <flab/view/genesis/frontside>
//= require <flab/digitalstrom/connector>

var button;

flab.Test.run(function(T, A) {
    T.Runner.add(new T.Case({
        name:  'flab.view.genesis.frontside',

        setUp: function() {
            var self = this;

        },

        tearDown: function() {
            var self = this;

        },

        test_delegate: function() {
            var self = this;
            // probably we should use a mockup here. anyway... for the moment we use the real connector
            var connector = new flab.digitalstrom.connector();
			connector.setUnittestMode();
			
			var url = document.location.href;
			var parts = url.split('/');
			var baseUrl = parts[2];
			var host = baseUrl + '/test/fixtures';
			connector.setHostName(host);
			
			var button_clicked = 0;
			var usage_clicked = 0;
			var activities_clicked = 0;
			var zone_clicked = 0;
			// minimal stub for the flab.view.frontside delegate
			var flab_view_frontside_delegate = flab.Class.extend(Object,{
				constructor : function() {
					var self = this;
				},
				get_button_widget_for_zone : function(zoneid){
					var self = this;
					button_clicked = zoneid;
					console.log('get_button_widget_for_zone ' , zoneid);
				},
				get_usage_widget_for_zone : function(zoneid){
					var self = this;
					usage_clicked = zoneid;
					console.log('get_usage_widget_for_zone ' , zoneid);
				},
				get_activities_widget_for_zone : function(zoneid){
					var self = this;
					activities_clicked = zoneid;
					console.log('get_activities_widget_for_zone ' , zoneid);
				},
				get_zone_widget_for_zone : function(zoneid){
					var self = this;
					zone_clicked = zoneid;
					console.log('get_zone_widget_for_zone ' , zoneid);					
				}
			});
			var flab_view_frontside_delegate_instance = new flab_view_frontside_delegate();

            A.nothingRaised(function() {
				button = new flab.view.genesis.frontside(flab_view_frontside_delegate_instance , connector);
			},'constructor');
			button.render_to(jQuery('#frontsidecontent'));
			
			connector.requestNewZoneList();
			
			/*self.wait(function() {
				jQuery('#getbuttonwidgetforzone_1503').trigger('click');
				jQuery('#getusagewidgetforzone_1503').trigger('click');
				jQuery('#getactivitieswidgetforzone_1503').trigger('click');
				jQuery('#getzonewidgetforzone_1503').trigger('click');

				A.isTrue(button_clicked == 1503);
				A.isTrue(usage_clicked == 1503);
				A.isTrue(activities_clicked == 1503);
				A.isTrue(zone_clicked == 1503);
			},500);*/
			
        }
    }));
});
