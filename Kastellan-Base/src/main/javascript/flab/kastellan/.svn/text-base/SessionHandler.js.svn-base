//= compat
//= require <flab/Namespace>
//= require <flab/Class>
//= require <flab/kastellan/WidgetContainer/Controller>

flab.Namespace.create('flab.kastellan');

flab.kastellan.SessionHandler = flab.Class.extend(Object, {
	constructor: function(url) {
		var me = this;
		me.itemInfo = [];
		me.items = [];
		me.BackId2item = [];
		jQuery.ajax(url,{
			async : false,
			dataType : 'text',
			success : function(data) {
				var lines = data.split("\n");
				for (var i = 0 ; i < lines.length ; i++) {
					var line = lines[i];
					if (line.match(/^Container/)) { /* we don't parse this yet */ }
					if (line.match(/^SceneLast/)) { /* we don't parse this yet */ }
					if (line.match(/^Item/)) {
						var itemNum = line.replace(/^Item_(\d*).*/ , "$1");
						var key = line.replace(/^Item_\d*(.*)=.*/ , "$1");
						var value = line.replace(/^Item_\d*.*=(.*)/ , "$1");
						value = unescape(value.replace(/@ByteArray\((.*)\)/ , "$1"));
						if (me.itemInfo[itemNum] == undefined) {
							me.itemInfo[itemNum] = [];
						}
						me.itemInfo[itemNum][key] = value;
					}
				}
				for (var item in me.itemInfo) {
					me.items.push(item);
					console.log('pushing to backid2item backid = ' , me.itemInfo[item]['PgId'] , ' item = ' , item);
					me.BackId2item[me.itemInfo[item]['PgId']] = item;
				}
			}
		});
	},
	
	startWidgets : function() {
		var me = this;
		
		var Widgets = [];		
		for (var i in me.itemInfo) {
			var item = me.itemInfo[i];
			var instance1 = item['PgId'];
			Widgets[instance1] = new flab.kastellan.WidgetContainer.Controller(jQuery('.kastellan_main_container'));
			Widgets[instance1].startWidget('../Widgets/' + item['Widget'] , 'class2' , instance1 );
			var x = item['PosX']/1 - item['SizeX']/1;
			var y = item['PosY']/1;
			console.log('x = ' , x , ' y = ' , y);
			if (item['BackId']) {
				console.log('backid = ' , item['BackId']);
				console.log('me.BackId2item = ' , me.BackId2item[item['BackId']]);
				var parentItem = me.itemInfo[me.BackId2item[item['BackId']]];
				console.log('parent x = ' , parentItem['PosX']);
				console.log('parent y = ' , parentItem['PosY']);
				console.log('parent width = ' , parentItem['SizeX']);
				x = parentItem['PosX']/1 - parentItem['SizeX']/1 + x + item['SizeX']/1;
				y = parentItem['PosY']/1 + y;
				Widgets[instance1].move2Front();
				// x = x - (me.itemInfo[me.BackId2item[item['BackId']]]['PosX']/1 - me.itemInfo[me.BackId2item[item['BackId']]]['SizeX']);
				// y = y - me.itemInfo[me.BackId2item[item['BackId']]]['PosY']/1;
			}
			console.log('after x = ' , x , ' y = ' , y);
			if (item['Iconified'] == 'true') {
				Widgets[instance1].minimize();
			}
			Widgets[instance1].moveTo((x/1 + 3000/1),(y/1 + 3000/1));
		}
		return Widgets;
	},
	
	start_first_activity_widget : function() {
		var me = this;
		
		var didStartWidget = false;
		var Widgets = [];		
		for (var i in me.itemInfo) {
			var item = me.itemInfo[i];
			var instance1 = item['PgId'];
			if (item['Widget'] == 'ch.futurelab.widget.digitalSTROM.activities' && !didStartWidget) {
				Widgets[instance1] = new flab.kastellan.WidgetContainer.Controller(jQuery('.kastellan_main_container'));
				Widgets[instance1].startWidget('../Widgets/' + item['Widget'] , 'class2' , instance1 );
				var x = item['PosX']/1 - item['SizeX']/1;
				var y = item['PosY']/1;
				console.log('x = ' , x , ' y = ' , y);
				Widgets[instance1].moveTo(0,0);
				didStartWidget = true;me.itemInfo
			}
		}
		return Widgets;
	}
});
