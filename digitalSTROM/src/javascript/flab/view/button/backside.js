//= compat
//= require flab/Namespace
//= require flab/Class
//= require jquery/jeditable
//= require flab/l10n/Translate

flab.Namespace.create('flab.view.button');

flab.view.button.backside = flab.Class.extend(Object, /** @lends flab.view.button.backside.prototype */{
	/**
	 * This is the view Class for the backside of the button widget of the digitalSTROM Kastellan implementation. 
	 * @param {flab.view.button.backside.delegate} delegate        delegate of this view class
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
		me.hasBeenRendered = false;
		me.lastSliderValue = 100;
	},
	
	setDisplayName : function(name) {
		var me = this;
		me.dislayName = name;
		if (me.hasBeenRendered) {
			me.render_to(me.element);
		}
	},
	
	setZoneId : function(zoneid) {
		var me = this;
		me.zoneid = zoneid;
		if (me.hasBeenRendered) {
			me.render_to(me.element);
		}
	},
	
	/**
	 * will render the default components of this view to the jQuery Element given
	 * @param {jQueryElement} element      the element where the view should be renderd in
	 */
	render_to : function(element) {
		var me = this;
		me.element = element;

		var groups = me.connector.zone_getGroupDescriptions(undefined);
		var listContent = '';
		for (var i = 0 ; i < groups.length ; i++ ) {
				listContent = listContent + '<li id="group_null_view5_' + groups[i].id + '" class="' + groups[i].classid + 
						'"><div class="comboicon ' + groups[i].classid + '"></div>' + flab.tr(groups[i].text) + ' ' + me.dislayName + '</li>';
		}

		var html_string = '\
		<div class="field_group_title">' + flab.tr('Choose button type') + '</div>\
		<div class="select_trigger" id="group_select_trigger"><div class="comboicon yellow"></div>' + flab.tr('Light') + ' ' + me.dislayName + '</div>\
		<div id="group_select_scrollbar" class="select_scrollbar_container" style="display:none;"><div id="group_select_slider"></div></div>\
		<div class="scrolling_container" id="group_select" style="display:none;z-index: 100;">\
			<div class="scrolling" id="group_select_scrolling">\
				<ul class="select">'
				   + listContent;
		if (me.zoneid == 0) {
			html_string = html_string + '\
					<li id="group_walk_view1_7" class="green"><div class="comboicon green"></div>' + flab.tr('Walk') + ' ' + me.dislayName + '</li>\
					<li id="group_bell_view1_5" class="red"><div class="comboicon red"></div>' + flab.tr('Panic') + ' ' + me.dislayName + '</li>\
					<li id="group_bell_view1_7" class="green"><div class="comboicon green"></div>' + flab.tr('Bell') + ' ' + me.dislayName + '</li>';
		}
		html_string = html_string + '\
				</ul>\
			</div>\
		</div>';
		
		me.element.html(html_string);
/*
	<li id="group_0" class="broadcast">' + flab.tr('broadcast') + '</li>\
	<li id="group_4" class="cyan">' + flab.tr('cyan') + '</li>\
	<li id="group_5" class="magenta">' + flab.tr('magenta') + '</li>\
	<li id="group_6" class="red">' + flab.tr('red') + '</li>\
	<li id="group_7" class="green">' + flab.tr('green') + '</li>\
	<li id="group_8" class="black">' + flab.tr('black') + '</li>\
	<li id="group_9" class="white">' + flab.tr('white') + '</li>\
	<li id="group_10" class="display">' + flab.tr('display') + '</li>\
*/

		me.element.find('#group_select_trigger').bind('click' , function(){
			jQuery("#group_select_slider").slider({
				orientation: "vertical",
				value : me.lastSliderValue,
				slide: function( event, ui ) {
					me.lastSliderValue = ui.value;
					me.updateScrollAreaWithValue(ui.value);
				}
			});
			me.updateScrollAreaWithValue(me.lastSliderValue);
			jQuery('#group_select').slideDown('fast').show();
			jQuery('#group_select_scrollbar').slideDown('fast').show();
			me.element.find('ul > li').bind('click' , function(liElement){
				console.log('liElement = ' , liElement);
				var idParts = liElement.currentTarget.id.split('_')
				var groupID = idParts.pop();
				var view = idParts.pop();
				var icon = idParts.pop();
				me.delegate.groupIdChanged(groupID , view , icon);
				jQuery('#group_select_trigger')[0].innerHTML = liElement.currentTarget.innerHTML;
				jQuery('#group_select').slideUp('fast')
				jQuery('#group_select_scrollbar').slideUp('fast')
			});
		});
		me.hasBeenRendered = true;
	},
	
	updateScrollAreaWithValue : function(value) {
		var me = this;
		
		var ul_height = (jQuery("ul.select li").length + 1) * 30;
		var scrolling_height = jQuery("#group_select").outerHeight();
		var max_offset = ul_height - scrolling_height;
		var position = (100 - value)/100;
		var ul_offeset = max_offset * position;
		jQuery("ul.select").css( 'marginTop' , '-' + ul_offeset + 'px');
	}
	
});
