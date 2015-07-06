//= compat
//= require <flab/Test>
//= require <flab/test/TestLogger>
//= require <flab/controller/genesis>

flab.Test.run(function(T, A) {
    T.Runner.add(new T.Case({
        name:  'flab.controller.genesis',

        setUp: function() {
            var self = this;

        },

        tearDown: function() {
            var self = this;
        },

        test_load_zone_list: function() {
            var self = this;
            var genesis;
            A.nothingRaised(function() {
				genesis = new flab.controller.genesis(jQuery("#frontcontent1") , jQuery("#backcontent1"));
            }, "Create constructor");
            A.isNotUndefined(genesis);
			genesis.setUnittestMode();
			
			self.wait(function() {
				// get host from url
				var url = document.location.href;
				var parts = url.split('/');
				var baseUrl = parts[2];
				var host = baseUrl + '/test/fixtures';
				console.log('host = ' , host);
	
	            A.nothingRaised(function() {
					genesis.backside_view.setHostName(host);
				},"could set host");
				self.wait(function() {
					// assuming the token has been validated
					jQuery('.authentokenbutton').trigger('click');
					self.wait(function() {
						var lis = jQuery('#backside_zone_list > li');
						A.isTrue(lis.length == 6, "found 6 zones ");
						// click an edit button 
						jQuery(jQuery('.zone_edit_button')[2]).trigger('click');
						var inputs = jQuery('#backside_zone_list > li input');
						A.isTrue(inputs.length == 1, "found 1 input field");
						var delets = jQuery('#backside_zone_list > li .delete');
						// we can not delete this zone, because there are still devices inside
						A.isTrue(delets.length == 0, "found 1 delete button");
						var submits = jQuery('#backside_zone_list > li span form button');
						A.isTrue(submits.length == 2, "found submit and cancel button");
						
						// click the ok button 
						jQuery(submits[0]).trigger('click');
						var inputs = jQuery('#backside_zone_list > li input');
						A.isTrue(inputs.length == 0, "found 0 input field");
						var delets = jQuery('#backside_zone_list > li .delete');
						A.isTrue(delets.length == 0, "found 0 delete button");
						var submits = jQuery('#backside_zone_list > li span form button');
						A.isTrue(submits.length == 0, "found 0 submit or cancel buttons");
	
						// click an edit button again
						jQuery(jQuery('.zone_edit_button')[2]).trigger('click');
						var inputs = jQuery('#backside_zone_list > li input');
						A.isTrue(inputs.length == 1, "found 1 input field");
						var delets = jQuery('#backside_zone_list > li .delete');
						A.isTrue(delets.length == 0, "found 0 delete button");
						var submits = jQuery('#backside_zone_list > li span form button');
						A.isTrue(submits.length == 2, "found submit and cancel button");
	
						// click the delete button
						jQuery(delets[0]).trigger('click');
						self.wait(function() {	
							var inputs = jQuery('#backside_zone_list > li input');
							console.log('inputs = ' , inputs);
							A.isTrue(inputs.length == 0, "found 0 input field");
							var delets = jQuery('#backside_zone_list > li .delete');
							A.isTrue(delets.length == 0, "found 0 delete button");
							var submits = jQuery('#backside_zone_list > li span form button');
							A.isTrue(submits.length == 0, "found 0 submit button");
							
							// click the add zone button
							jQuery('.add_zone_button').trigger('click');
							/*jQuery("#backcontent1")[0].innerHTML = '';
							jQuery("#frontcontent1")[0].innerHTML = '';*/
						},500);
					},500);
				}, 500);
			}, 500);
        }
        
    }));
});
