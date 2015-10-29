//= compat
//= require <flab/Namespace>
//= require <flab/Class>
//= require <jquery/jeditable>

flab.Namespace.create('flab.view.activities');

flab.view.activities.backside = flab.Class.extend(Object, /** @lends flab.view.activities.backside.prototype */{
	/**
	 * This is the view Class for the backside of the activities widget of the digitalSTROM Kastellan implementation. 
	 * @param {flab.view.activities.backside.delegate} delegate    delegate of this view class
	 * @param {flab.digitalstrom.connector} connector              digitalSTROM connector instance
	 * @extends Object
	 * @constructs
	 */
	constructor: function(delegate,connector) {
		var me = this;
		me.delegate = delegate;
		me.connector = connector;
		me.connector.registerForNotifications(me);
		me.icons = [];
		me.lastSliderValue = 100;
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
						'"><div class="comboicon ' + groups[i].classid + '"></div>' + flab.tr(groups[i].text) + '</li>';
		}

		me.element.html('\
		<div class="field_group_title">' + flab.tr('Choose scene type') + '</div>\
		<div class="select_trigger" id="group_select_trigger"><div class="comboicon yellow"></div>' + flab.tr('Light') + '</div>\
		<div id="group_select_scrollbar" class="select_scrollbar_container" style="display:none;"><div id="group_select_slider"></div></div>\
		<div class="scrolling_container" id="group_select" style="display:none;position:absolute;">\
			<div class="scrolling" id="group_select_scrolling">\
				<ul class="select">' 
					+  listContent + 
				'</ul>\
			</div>\
		</div>\
		<div class="backside_list_container">\
			<ul id="activities_list_backside"></ul>\
		</div>\
		');
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
				me.delegate.groupIdChanged(groupID);
				jQuery('#group_select_trigger')[0].innerHTML = liElement.currentTarget.innerHTML;
				jQuery('#group_select').slideUp('fast')
				jQuery('#group_select_scrollbar').slideUp('fast')
			});
		});

		me.reset();
	},
	
	updateScrollAreaWithValue : function(value) {
		var me = this;
		var ul_height = (jQuery("ul.select li").length + 1) * 30; //jQuery("ul.select").outerHeight();
		var scrolling_height = jQuery("#group_select").outerHeight();
		var max_offset = ul_height - scrolling_height;
		var position = (100 - value)/100;
		var ul_offeset = max_offset * position;
		jQuery("ul.select").css( 'marginTop' , '-' + ul_offeset + 'px');
	},
	
	// flab.digitalstrom.connector delegate
	/**
	 * will be called by the digitalSTROM connector after an activity name has been updated
	 * @param {String} zone       the zone in which the activity name has been updated
	 * @param {String} group      the group in which the activity name has been updated
	 * @param {String} activitiy  the activity of which the name has been updated
	 * @param {String} name       the new activity name
	 */
	updateActivityName : function(zone , group , activity , name) {
		var me = this;
		console.log('zone , group , activity , name = ' , zone , group , activity , name);
		console.log('obj back = ' , jQuery('#activity_' + activity + ' > .editable'));
		jQuery('#activity_' + activity + ' > .editable')[0].innerHTML = name;
	},
	// end of flab.digitalstrom.connector delegate

	/**
	 * will be called to clean up the Userinterface if for example the groupid changed, and all the 
	 * activity names have to be reloaded
	 */
	reset : function() {
		var me = this;
		jQuery("#activities_list_backside")[0].innerHTML = '';
		var activities = me.connector.zone_getArrayOfActivityIds();
		for (var i = 0 ; i < activities.length; i++){
			jQuery('#activities_list_backside').append('<li id="activity_' + activities[i] + '" class="activity_li">\
				<span class="theIconContainer"><button class="theIcon"></button></span><span class="editable" id="activityEditableSpan_' + activities[i] + '"></span>\
				<button id="activityedit_' + activities[i] + '"  class="activity_edit_button"></button>\
				<button id="activitysave_' + activities[i] + '"  class="activity_save_button"></button>\
			</li>');
			// icon pulldown menu
			me.render_iconPullDown(activities[i]);
		}
		me.enableIconClickEvents();
		jQuery('.editable').editable(
			function(value, settings) { 
				var element = jQuery(this);
				var parts = element[0].parentElement.id.split('_');
				var activityid = parts[1];
				jQuery('#activity_' + activityid).removeClass('editing');
				jQuery('#activity_' + activityid + ' > .activity_edit_button').show();
				jQuery('#activity_' + activityid + ' > .activity_save_button').show();
				me.disable_iconPullDownClick(activityid);
				console.log('save new name "' + value + '" for activity with id "' + activityid + '"');
				me.delegate.setNameForActivity(activityid , value)
				return(value);
			}, {
				submit  : '&nbsp;',
				cancel : '&nbsp;',
				event : 'flclick',
				height : 11,
				width : 100,
				onreset : function() {
					var element = jQuery(this);
					var parts = jQuery(element[0])[0].parentElement.id.split('_');
					var activityid = parts[1];
					console.log('activityid = ' , activityid);
					jQuery('#activity_' + activityid).removeClass('editing');
					jQuery('#activity_' + activityid + ' > .activity_edit_button').show();
					jQuery('#activity_' + activityid + ' > .activity_save_button').show();
					me.enable_iconPullDownClick(activityid);
				},
				onblur : 'ignore' // enable this to style the 'editable' UI components
			}
		);
		jQuery('.activity_edit_button').bind('click' , function(button){
			var parts = button.target.id.split('_');
			var activityid = parts[1];
			jQuery('#activity_' + activityid).addClass('editing');
			jQuery('#activity_' + activityid + ' > .activity_edit_button').hide();
			jQuery('#activity_' + activityid + ' > .activity_save_button').hide();
			jQuery('#activity_' + activityid + ' > .editable').trigger('flclick');
			me.enable_iconPullDownClick(activityid);
		});

		jQuery('.activity_save_button').bind('click' , function(button){
			var parts = button.target.id.split('_');
			var activityid = parts[1];
			me.delegate.saveScene(activityid);
		});
	},
	
	didSaveScene : function(zone , scene , group) {
		var me = this;
		jQuery('#activities_list_backside li').removeClass('selected');
	},

	updateIcon : function(activity , icon) {
		var me = this;
		console.log('updateIcon : activity = ' , activity , ' icon ' , icon);
		jQuery("#activity_" + activity + ' .theIcon').removeClass('icon' + me.icons[activity]);
		me.icons[activity] = icon;
		jQuery("#activity_" + activity + ' .theIcon').addClass('icon' + me.icons[activity]);
	},
	
	/**
	 * will render a pulldown menu for a specific activity
	 * @param{String} activity    the activity id for which we want to select an icon
	 * @private
	 */
	render_iconPullDown : function(activity) {
		var me = this;
		jQuery('#activity_' + activity).append(me.getIconHTML(activity));
	},
	
	enable_iconPullDownClick : function(activity) {
		var me = this;
		jQuery('#activity_' + activity + ' .theIconContainer').bind('click' , function(button){
			console.log('click on icon button of activity' , activity)
			jQuery('#activity_' + activity + ' .iconpulldownmenu').show();
		});
	},
	
	disable_iconPullDownClick : function(activity) {
		var me = this;
		jQuery('#activity_' + activity + ' .theIconContainer').unbind('click');
	},
	
	/**
	 * will enable a click event for an icon
	 * @param{String} id    the id of the icon
	 * @private
	 */
	enableIconClickEvents : function() {
		var me = this;
		jQuery('.pulldownicon').bind('click' , function(button){
			console.log('button = ' , button);
			var parts = button.target.id.split('_');
			var icon = parts[2];
			var activity = parts[1];
			console.log('setIconForActivity icon = ' , icon , 'activity = ' , activity);
			me.delegate.setIconForActivity(icon , activity);
			jQuery('#activity_' + activity + ' > .iconpulldownmenu').hide();
		});
	},
	
	/**
	 * will generate the html code for an icon
	 * @param{String} id    the id of the icon
	 * @private
	 */
	getIconHTML : function(id) {
		var me = this;
		var ret = '<div class="iconpulldownmenu"><div>';
		for (var i = 0; i < 10 ; i++) {
			ret = ret + '<div class="pulldownicon"><div class="icon' + i + '" id="icon_' + id + '_' + i + '"></div></div>';
		}
		var ret = ret + '</div></div>';
		return ret;
	}
});
