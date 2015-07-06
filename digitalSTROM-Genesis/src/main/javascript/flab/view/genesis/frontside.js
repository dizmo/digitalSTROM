//= compat
//= require <flab/Namespace>
//= require <flab/Class>
//= require <flab/l10n/Translate>

flab.Namespace.create('flab.view.genesis');

flab.view.genesis.frontside = flab.Class.extend(Object, /** @lends flab.view.genesis.frontside.prototype */{
	/**
	 * This is the view Class for the frontside of the genesis widget of the digitalSTROM Kastellan implementation. 
	 * @param {flab.view.genesis.frontside.delegate} delegate      delegate of this view class
	 * @param {flab.digitalstrom.connector} connector              digitalSTROM connector instance
	 * @extends Object
	 * @constructs
	 */
	constructor: function(delegate,connector) {
		var self = this;
		self.delegate = delegate;
		self.connector = connector;
		self.connector.registerForNotifications(self);
	},
	
	/**
	 * will render the default components of this view to the jQuery Element given
	 * @param {jQueryElement} element      the element where the view should be renderd in
	 */
	render_to : function(element) {
		var self = this;
		self.element = element;
		self.element.html('<div class="dss_default_front"></div>');
		jQuery('.dss_default_front').html(
			'<div class="front_status"></div>'+
			'<div class="front_settings_link" onclick="showBack();">' + flab.tr('Settings') + '</div>'
		);
	},

	showStateConnecting : function() {
		var me = this;
		jQuery('.front_status').html(flab.tr('connecting...'));
	},

	// flab.digitalstrom.connector delegate
	/**
	 * will be called by the digitalSTROM connector if an invalid hostname has been entered. 
	 * The Function will reset the input field in the userinterface. 
	 */
	invalidHostName : function() {
		var me = this;
		//me.element.find('input')[0].value = '';
		jQuery('.front_status').html(flab.tr('Invalid hostname'));
	},
	
	/** 
	 * will be called by the digitalStROM connector if we have a token. 
	 * the connector will then try to enable the token using the default username and password
	 */
	didRequestApplicationToken : function() {
		var me = this;
		jQuery('.front_status').html(flab.tr('Trying to enable token...'));
	},
	
	/** 
	 * will be called by the digitalStROM connector if we could not login with the default username passwort
	 */
	couldNotLoginWithDefaultCredentials : function() {
		var me = this;
		var hostname = me.connector.getHostname();
		var parts = hostname.split(':');
		hostname = parts[0];
		jQuery('.front_status').html(flab.tr('Please enable the Token in the dss userinterface') + 
			' <a href="#" onclick="widget.openURL(\'https://' + hostname + '\')">' + hostname + '</a> ' );
	},


	/**
	 * will be called by the digitalSTROM connector if a new zonelist is available.
	 * the function will then update the UI with the new list. 
	 * @param {Object} data      the list of zones. 
	 */
	updateZoneList : function(data) {
		var self = this;
		console.log('updateZoneList front ', data);
		self.element.html('<div class="frontside_zone_list_container">\
				<ul id="frontside_zone_list" class="fl_front_list"></ul>\
			</div>\
			<div id="group_select_scrollbar_front" class="select_scrollbar_container"><div id="group_select_slider_front"></div></div>\
			<div class="frontside_widget_placeholder"><div class="dss_default_front"></div></div>\
			<div class="frontside_widget_list_container" style="display:none;">\
				<ul id="frontside_widget_list" class="fl_front_list"></ul>\
			</div>');
		
		var zone_list_ul = jQuery('#frontside_zone_list');
		var widget_list_ul = jQuery('#frontside_widget_list');

		zone_list_ul.empty();
		widget_list_ul.empty();

		for (var i = 0 ; i < data.apartment.zones.length ; i++) {
			var zone = data.apartment.zones[i];
			var display_name = self.connector.get_display_name_for_zone(zone);
			console.log('will append zone with name ' , display_name);
			jQuery('#frontside_zone_list').append('<li id="frontzoneid_' + zone.id + '">' + display_name + '</li>');
		}
		
		jQuery('#frontside_zone_list li').bind('click' , function(button){
			var parts = button.target.id.split('_');
			console.log('parts ' , parts);
			jQuery('#frontzoneid_'+self.zoneid).removeClass('current');
			self.zoneid = parts[1];
			jQuery('#frontzoneid_'+self.zoneid).addClass('current');
			console.log('self.zoneid' , self.zoneid);
			console.log('jQuery(\'.frontside_widget_list_container\') = ' , jQuery('.frontside_widget_list_container'));
			jQuery('.frontside_widget_placeholder').hide();
			jQuery('.frontside_widget_list_container').show();
		});
		
		widget_list_ul.append(
			'<li class="get_button_widget_for_zone" id="getbuttonwidgetforzone"><div class="addwidget"></div>' + flab.tr('Button') + '</li>'
		);
		if (!(self.delegate.canGlobalUsage && self.delegate.canGlobalUsage() == false)) {
			console.log('will append usage widget');
			widget_list_ul.append(
				'<li class="get_usage_widget_for_zone" id="getusagewidgetforzone"><div class="addwidget"></div>' + flab.tr('Usage') + '</li>'
			);
		}
		widget_list_ul.append(
			'<li class="get_activities_widget_for_zone" id="getactivitieswidgetforzone"><div class="addwidget"></div>' + flab.tr('Activities') + '</li>\
			<li class="get_zone_widget_for_zone" id="getzonewidgetforzone"><div class="addwidget"></div>' + flab.tr('Devices') + '</li>'
		);
		
		jQuery('#frontside_widget_list li').bind('click' , function(button){
			var parts = button.target.id.split('_');
			var elements = jQuery("#frontzoneid_" + self.zoneid);
			console.log('elements = ' , elements);
			var displayname = jQuery("#frontzoneid_" + self.zoneid)[0].innerHTML;
			console.log('displayname = ' , displayname)
			if (button.target.className == 'get_button_widget_for_zone') {
				self.delegate.get_button_widget_for_zone(self.zoneid , displayname);
			}
			if (button.target.className == 'get_usage_widget_for_zone') {
				self.delegate.get_usage_widget_for_zone(self.zoneid , displayname);
			}
			if (button.target.className == 'get_activities_widget_for_zone') {
				self.delegate.get_activities_widget_for_zone(self.zoneid , displayname);
			}
			if (button.target.className == 'get_zone_widget_for_zone') {
				self.delegate.get_zone_widget_for_zone(self.zoneid , displayname);
			}
		});

		jQuery("#group_select_slider_front").slider({
			orientation: "vertical",
			value : 100,
			slide: function( event, ui ) {
				var ul_height = (jQuery("ul#frontside_zone_list li").length) * 62; //jQuery("ul.select").outerHeight();
				var scrolling_height = 245; // not nice... 
				var max_offset = ul_height - scrolling_height;
				var position = (100 - ui.value)/100;
				console.log('max_offset = ' , max_offset);
				console.log('position = ' , position);
				var ul_offeset = max_offset * position;
				console.log('ul_offeset = ' , ul_offeset);
				jQuery("ul#frontside_zone_list").css('position' , 'relative');
				jQuery("ul#frontside_zone_list").css( 'top' ,  '-' + Math.round(ul_offeset) + 'px');
			}
		});

	}
});






























