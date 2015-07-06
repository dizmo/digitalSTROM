//= compat
//= require <flab/Test>
//= require <flab/test/TestLogger>
//= require <flab/digitalstrom/connector>

flab.Test.run(function(T, A) {
    T.Runner.add(new T.Case({
        name:  'flab.digitalstrom.connector',

        setUp: function() {
            var self = this;

        },

        tearDown: function() {
            var self = this;

        },

        test_constructor: function() {
            var self = this;
            var connector;
            A.nothingRaised(function() {
				connector = new flab.digitalstrom.connector();
			});
			A.isNotUndefined(connector);
        },
        
        test_store_hostname : function() {
        	var self = this;
        	
            var connector;
            A.nothingRaised(function() {
				connector = new flab.digitalstrom.connector();
			});
			A.isNotUndefined(connector);
        	connector.setHostName('theHost');
        	A.isTrue(connector.host == 'theHost', 'could set hostname');
        },
        
        test_requestNewZoneList : function() {
        	var self = this;
			var requested_zone_list_data = undefined;
			
			// stub implementing the required parts of the flab.digitalstrom.connector delegate
			flab.digitalstrom.connector_delegate = flab.Class.extend(Object, {
				constructor: function() {
					var self = this;
				},
				updateZoneList : function(data) {
					var self = this;
					requested_zone_list_data = data;
				}
			});

            var connector;
            A.nothingRaised(function() {
				connector = new flab.digitalstrom.connector();
			});
			A.isNotUndefined(connector);
            A.nothingRaised(function() {
				connector.setUnittestMode();
			});
			
			var url = document.location.href;
			var parts = url.split('/');
			var baseUrl = parts[2];
			var host = baseUrl + '/test/fixtures';
            A.nothingRaised(function() {
	        	connector.setHostName(host);
	        });

			var delegate_instance;
            A.nothingRaised(function() {
				delegate_instance = new flab.digitalstrom.connector_delegate();
			});
			A.isNotUndefined(delegate_instance);

			A.nothingRaised(function() {
				connector.registerForNotifications(delegate_instance);
			});

			A.nothingRaised(function() {
				connector.requestNewZoneList();
			});
			
			self.wait(function() {
				A.isNotUndefined(requested_zone_list_data);
			},500);
        },

        test_requestAppartmentName : function() {
        	var self = this;
			var appartmentName_data = undefined;
			
			// stub implementing the required parts of the flab.digitalstrom.connector delegate
			flab.digitalstrom.connector_delegate = flab.Class.extend(Object, {
				constructor: function() {
					var self = this;
				},
				updateAppartmentName : function(data) {
					var self = this;
					appartmentName_data = data.name;
				}
			});

            var connector;
            A.nothingRaised(function() {
				connector = new flab.digitalstrom.connector();
			});
			A.isNotUndefined(connector);
            A.nothingRaised(function() {
				connector.setUnittestMode();
			});
			
			var url = document.location.href;
			var parts = url.split('/');
			var baseUrl = parts[2];
			var host = baseUrl + '/test/fixtures';
            A.nothingRaised(function() {
	        	connector.setHostName(host);
	        });

			var delegate_instance;
            A.nothingRaised(function() {
				delegate_instance = new flab.digitalstrom.connector_delegate();
			});
			A.isNotUndefined(delegate_instance);

			A.nothingRaised(function() {
				connector.registerForNotifications(delegate_instance);
			});

			A.nothingRaised(function() {
				connector.requestAppartmentName();
			});
			
			self.wait(function() {
				A.isNotUndefined(appartmentName_data , "could load the appartment name");
				A.isTrue(appartmentName_data == 'dSS' , "could load the correct appartment name");
			},500);
        }

    }));
});
