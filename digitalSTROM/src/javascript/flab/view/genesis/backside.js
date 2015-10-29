//= compat
//= require flab/Namespace
//= require flab/Class
//= require jquery/jeditable
//= require flab/l10n/Translate

flab.Namespace.create('flab.view.genesis');

flab.view.genesis.backside = flab.Class.extend(Object, /** @lends flab.view.genesis.backside.prototype */{
	/**
	 * This is the view Class for the backside of the genesis widget of the digitalSTROM Kastellan implementation.
	 * @param {flab.view.genesis.backside.delegate} delegate       delegate of this view class
	 * @param {flab.digitalstrom.connector} connector              digitalSTROM connector instance
	 * @extends Object
	 * @constructs
	 */
	constructor: function(delegate,connector) {
		var me = this;
		me.delegate = delegate;
		me.connector = connector;
		me.connector.registerForNotifications(me);

		me.hostname = undefined;
		me.authToken = undefined;
		me.lastSliderValue = 100;
	},

	/**
	 * will render the default components of this view to the jQuery Element given
	 * @param {jQueryElement} element      the element where the view should be renderd in
	 */
	render_to : function(element) {
		var me = this;
		me.element = element;
		me.element.html('' +
			me.getAuthentificationHtml() +
			'<div id="group_select_scrollbar" class="select_scrollbar_container"><div id="group_select_slider_back"></div></div>\
			<div class="scrolling_container" style="display:none;">\
				<div class="scrolling">\
					<ul id="backside_zone_list"></ul>\
				</div>\
			</div>\
			<div class="backside_special_container add_zone_button_container" style="display:none;">\
				<ul class="special_container_list">\
					<li class="special_container_list_item add_zone_button"><div class="icon save_activity"></div><span>' + flab.tr('Add zone') + '</span></li>\
				</ul>\
			</div>');
		me.enableAuthentificationListeners();
	},

	enableAuthentificationListeners : function() {
		var me = this;
		me.element.find('input').bind('change' , function(input) {
			me.hostname = input.target.value;
			console.log('hostname did change! ' , me.hostname );
			me.showStateConnecting();
			me.delegate.hostnameDidChange(me.hostname);
		});
	},

	getAuthentificationHtml : function() {
		var me = this;
		return '<div class="field_group_title">' + flab.tr('Hostname') + '</div>\
			<input class="space_after" type="text" name="host" style="width: 165px;"></input>\
			<button class="okTextbutton" style="position:relative;top:0px;">ok</button><br/>\
			<div class="infobox problem authentokenbuttoncontainer" style="display:none;width:162px;">\
				<span class="statusInfoText">' + flab.tr('Inactive token:')+'</span>\
			</div>\
			<button class="authentokenbutton" disabled="disabled" style="display:none;float:right;position:relative;top:-28px;"></button>';
	},

	showStateConnecting : function() {
		var me = this;
		// hide previously visible zone list
		jQuery('.scrolling_container').hide();
		jQuery('.add_zone_button_container').hide();
		// show the connecting state
		jQuery('.statusInfoText').html(flab.tr('connecting...'));
		jQuery('.authentokenbuttoncontainer').show().removeClass('infobox2').addClass('infobox');;
		jQuery('.authentokenbutton').hide();
	},

	// flab.digitalstrom.connector delegate
	/**
	 * will be called by the digitalSTROM connector if an invalid hostname has been entered.
	 * The Function will reset the input field in the userinterface.
	 */
	invalidHostName : function() {
		var me = this;
		//me.element.find('input')[0].value = '';
		jQuery('.statusInfoText').html(flab.tr('Invalid hostname'));
		jQuery('.authentokenbuttoncontainer').show().removeClass('infobox2').addClass('infobox');;
		jQuery('.authentokenbutton').hide();
	},

	/**
	 * will be called by the digitalStROM connector if we have a token.
	 * the connector will then try to enable the token using the default username and password
	 */
	didRequestApplicationToken : function() {
		var me = this;
		jQuery('.statusInfoText').html(flab.tr('Trying to enable token...'));
		jQuery('.authentokenbuttoncontainer').show().removeClass('infobox2').addClass('infobox');
		jQuery('.authentokenbutton').hide();
	},

	/**
	 * will be called by the digitalStROM connector if we could not login with the default username passwort
	 */
	couldNotLoginWithDefaultCredentials : function() {
		var me = this;
		var hostname = me.connector.getHostname();
		var parts = hostname.split(':');
		hostname = parts[0];
		jQuery('.statusInfoText').html(flab.tr('Please enable the Token in the dss userinterface') +
			' <a href="https://'+hostname+'">' + hostname + '</a> ' );
		jQuery('.authentokenbuttoncontainer').show().removeClass('infobox').addClass('infobox2');
		jQuery('.authentokenbutton').show().removeAttr('disabled').bind('click', function(button){
			me.connector.checkIfAuthTokenIsValid();
		});
	},

	/**
	 * will be called by the digitalSTROM connector if an application token could be loaded.
	 * the function will enable the button to check if the token is valid
	 * @param {String} token      the authentication token for the application
	 */
	updateApplicationToken : function(token) {
		var me = this;
	},

	couldNotEnableToken : function() {
		var me = this;
		me.couldNotLoginWithDefaultCredentials();
	},
	/**
	 * will be called by the digitalSTROM connector if a new zonelist is available.
	 * the function will then update the UI with the new list.
	 * @param {Object} data      the list of zones.
	 */
	updateZoneList : function(data) {
		var me = this;
		console.log('data = ' , data);
		jQuery('.authentokenbuttoncontainer').hide();
		jQuery('.authentokenbutton').hide();
		jQuery('.scrolling_container').show();

		var zone_list_ul = jQuery('#backside_zone_list');
		zone_list_ul.empty();
		me.used_ids = [];
		console.log('data = ' , data);
		for (var i = 0 ; i < data.apartment.zones.length ; i++) {
			var zone = data.apartment.zones[i];
			me.used_ids[zone.id] = true;
			var display_name = me.connector.get_display_name_for_zone(zone);
			var deletable = ' deletable';
			if (data.apartment.zones[i].devices.length > 0) {
				// we can not delete a zone if it still contains devices
				deletable = '';
			}
			zone_list_ul.append('<li id="zoneid_' + zone.id + '"><span class="editable' + deletable + '">' + display_name + '</span>\
								<button id="zoneidedit_' + zone.id + '"  class="zone_edit_button"></button></li>');
		}
		jQuery('.add_zone_button_container').show();

		// we implement the edit function here
		// event is 'flclick' to disable the auto edit function onclick
		jQuery('.editable').editable(
			function(value, settings) {
				var element = jQuery(this);
				var parts = element[0].parentElement.id.split('_');
				var zoneid = parts[1];
				jQuery('#zoneid_' + zoneid).removeClass('editing');
				jQuery('#zoneid_' + zoneid + ' > .delete').remove();
				jQuery('#zoneid_' + zoneid + ' > .zone_edit_button').show();
				// TODO: tell the dss to save the new name
				console.log('save new name "' + value + '" for zone with id "' + zoneid + '"');
				me.delegate.set_zone_name(zoneid , value);
				return(value);
			}, {
				submit  : '&nbsp;',
				cancel : '&nbsp;',
				event : 'flclick',
				width : 108,
				onreset : function() {
					var element = jQuery(this);
					console.log('element = ' , element);
					console.log('jQuery(element[0])[0].parentElement = ' , jQuery(element[0])[0].parentElement);
					console.log('jQuery(element[0])[0].parentElement.parentElement = ' , jQuery(element[0])[0].parentElement.parentElement);
					var parts = jQuery(element[0])[0].parentElement.parentElement.id.split('_');
					var zoneid = parts[1];
					console.log('zoneid = ' , zoneid);
					jQuery('#zoneid_' + zoneid).removeClass('editing');
					jQuery('#zoneid_' + zoneid + ' > .delete').remove();
					jQuery('#zoneid_' + zoneid + ' > .zone_edit_button').show();
				},
				onblur : 'ignore' // enable this to style the 'editable' UI components
			}
		);
		jQuery('.add_zone_button').unbind('click');
		jQuery('.add_zone_button').bind('click' , function(button){
			var new_id = 1;
			// not really nice... but I think this will terminate...
			while(me.used_ids[new_id]) {
				new_id = new_id + 1;
			}
			me.lastSliderValue = 0;
			me.connector.zone_add(new_id);
		});

		// edit button is added here. this will trigger the flclick event
		jQuery('.zone_edit_button').bind('click' , function(button){
			var parts = button.target.id.split('_');
			var zoneid = parts[1];
			jQuery('#zoneid_' + zoneid).addClass('editing');
			jQuery('#zoneid_' + zoneid + ' > .zone_edit_button').hide();
			var deletable = jQuery('#zoneid_' + zoneid + ' > .editable').hasClass('deletable');
			if (deletable) {
				jQuery('#zoneid_' + zoneid + ' > .editable').before('<button class="delete"></button>');
				jQuery('#zoneid_' + zoneid + ' > .delete').bind('click' , function(toDelete) {
					jQuery('#zoneid_' + zoneid).remove();
					console.log('delete zone with id = ' , zoneid);
					me.connector.zone_remove(zoneid);
				});
			}
			jQuery('#zoneid_' + zoneid + ' > .editable').trigger('flclick');
			if (!deletable) {
				// we need a wider input field in case we can not delete a zone
				jQuery('#zoneid_' + zoneid + ' > .editable input').css('width' , '134px');
			}
		});

		var initValue = me.lastSliderValue;
		console.log('initValue' , initValue);
		jQuery("#group_select_slider_back").slider({
			orientation: "vertical",
			value : initValue,
			slide: function( event, ui ) {
				me.lastSliderValue = ui.value;
				me.updateScrollAreaWithValue(ui.value);
			}
		});
		me.updateScrollAreaWithValue(me.lastSliderValue);
	},

	updateScrollAreaWithValue : function(value) {
		var me = this;
		var ul_height = (jQuery("ul#backside_zone_list li").length) * 26; //jQuery("ul.select").outerHeight();
		var scrolling_height = 100;
		var max_offset = ul_height - scrolling_height;
		var position = (100 - value)/100;
		var ul_offeset = max_offset * position;
		jQuery("ul#backside_zone_list").css( 'marginTop' , '-' + ul_offeset + 'px');
	},

	/**
	 * will be called by the digitalSTROM connector if a new appartment Name is available
	 * the function will then update the UI with the new list.
	 * @param {Object} data      appartment name
	 */
	updateAppartmentName : function(data) {
		var me = this;
		console.log('updateAppartmentName ' , data);
	},
	// end of flab.digitalstrom.connector delegate


	/**
	 * calling this function will set the instance of the class in unittest mode.
	 * some behaviour of the class could be different in this case. At the moment this is only used in the
	 * digitalstrom connector class, to use http instead of https.
	 * @private
	 */
	setUnittestMode : function() {
		var me = this;
		me.unittestMode = true;
	},

	/**
	 * will set the hostname value in the input field. This is used in unittests mainly
	 * @param {String} hostname
	 */
	setHostName : function(hostname) {
		var me = this;
		jQuery('input[name|="host"]')[0].value = hostname;
		me.element.find('input').trigger('change');
	},
	/**
	 * will set the hostname value in the input field. This is used in unittests mainly.
	 * this function will not trigger a onchange event after editing the value of the input field.
	 * @param {String} hostname
	 */
	setHostNameNoEvent : function(hostname) {
		var me = this;
		jQuery('input[name|="host"]')[0].value = hostname;
	}
});
