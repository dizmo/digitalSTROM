//------------------------------------------------------------------------------------
//                             The Kastellan widget object
//------------------------------------------------------------------------------------
//
// When a widget is instantiated and passed control the Kastellan viewer creates a widget
// object and populates its properties with information about itself and its environment
window.resizeTo = function(width, height) {
	widget.frame.resizeTo(width, height);
}

function gup( name )
{
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return results[1];
}

getWidgetIdentifier = function() {
	return gup('instanceId');
}

var kastellan = function() {};
var widget = new function()
 {
    //------------------------------------------------------------------------------------
    // Standard widget properties as provided by Dashboard. For more documentation please
    // refer to the document «Dashboard Reference» from Apple
    //------------------------------------------------------------------------------------
    // Contains a unique identifier for this instance of the widget
    this.identifier = getWidgetIdentifier();

    // Contains the event handler to be called upon the finish of a widget drag
    this.ondragstart = undefined;

    // Contains the event handler to be called upon the finish of a widget drag
    this.ondragend = undefined;

    // Contains the event handler to be called when the Dashboard layer is hidden
    this.onhide = undefined;

    // Contains the function to be called when your widget is removed from the Dashboard layer
    this.onremove = undefined;

    // Contains the function to be called when the Dashboard layer is shown
    this.onshow = undefined;

    // Contains the function to be called when a Dashboard sync is complete.
    this.onsync = undefined;
    
    this.getLanguage = function() {
    	return 'de';
    }
    
    this.installedWidgets = function() {
    	return 'new_id';
    }

    //------------------------------------------------------------------------------------
    // Additional widget properties as provided by the Kastellan viewer. For more docu-
    // mentation please refer to the document ---TBD--- from futureLAB
    //------------------------------------------------------------------------------------

    // Contains the function to be called if there is a widget that is being dragged around by the user and that
	// gets close enough to another one so that they might be snapped together if they are compatible.
    // Used to be "this.startPreparingInterface"
    this.onsnapstart = undefined;

    // Der Dragprozess ist abgeschlossen, und die Verbindung kann nun mittels widget.bindToPreference(key) erstellt werden.
    // Used to be "this.finishPreparingInterface"
    this.onsnapend = undefined;

    // Die Informationsübertragen von dem genannten Widget sollte nun stoppen. Alle entsprechenden
    // Verbindungen sollten von dem angerufenen Widget getrennt werden. Dies wird mit widget.unbindPreference(key)
    // gemacht. Der key ist der gleiche wie der bei widget.bindToPreference(key) benutze.
    // Used to be "this.stopAnyInterface"
    this.onsnapsplit = undefined;

    //------------------------------------------------------------------------------------
    // Standard widget methods as provided by Dashboard. For more documentation please
    // refer to the document «Dashboard Reference» from Apple
    //------------------------------------------------------------------------------------
    // Launches the application with the specified application reference
    this.openApplication = function(appRef)
    {
		// ---TBD---
        // The content of appRef is depending on the environment under which Kastellan is running
        // With oldstyle Mac OS X widgets this will usually be a bundle identifier
        // On Windows and Linux and in new style widgets on OS X this will usually be the path to an 
        // executalbe file.
        // The function will return true or false depending on the success of the request
    }

    // Opens the specified URL in the user’s preferred browser.
    this.openURL = function(url) {}

    // Notifies Dashboard that you are about to perform a transition to or from its reverse side
    this.prepareForTransition = function(transition) {
    	//parent.prepareForTransition(transition);
    }

    // Runs an animation to toggle between your widget’s reverse and contents
    this.performTransition = function() {}

    // Changes the location of the widget close box
    this.setCloseBoxOffset = function(x, y) {}
    // Does nothing under Kastellan as closing a widget is done in the surrounding frame


    // Executes a command-line utility ---TBD---
    this.system = function(command, endHandler) {}

    //------------------------------------------------------------------------------------
    // Additional widget methods as provided by the Kastellan viewer. For more documenta-
    // tion please refer to the document ---TBD--- from futureLAB
    //------------------------------------------------------------------------------------

	// ---TBD--- Explanation
    this.bindToPreference = function(key, callback) {}

    // Löscht alle Einträge in den Preferences von diesem Widget.
    this.removeOwnTree = function() {}

    // Löscht einen Eintrag aus den Preferences. Dabei wird kein Preference-Baum entfernt.
    this.removeTreeEntry = function(key) {}
	// ---TBD--- Not needed, setPreferenceKey with “null” as its value does this (see Dashbord
	// Reference: Specifying “nul” for the preference parameter removes the specified key from
	// the preferences).

    // For debugging purposes only: Write "text" to the jsTextLog.txt log file. For finished
    // versions of widgets the Javascript command "alert" should be used instead
    this.textLog = function(text) {}
}

// From http://ejohn.org/blog/javascript-getters-and-setters/
// Extend targetobj with all getter and setter methods of sourceobj
function extend (targetobj, sourceobj) {
    for ( var item in sourceobj ) {
        var getter = sourceobj.__lookupGetter__(item);
		var setter = sourceobj.__lookupSetter__(item);
       
        if ( getter || setter ) {
            if ( getter )
                targetobj.__defineGetter__(item, getter);
            if ( setter )
                targetobj.__defineSetter__(item, setter);
         } else
             targetobj[item] = sourceobj[item];
    }
    return targetobj;
}

// Add all methods of the widgetInstance class to the widget object
extend(widget, new widgetInstance(widget.identifier));

// Gives access to the properties and methods of  the widgetViewer object that represents the Viewer
// containing this widget
// ---TBD--- make sure to create just one instance (throughout Kastellan) of the widgetViewer object if possible
widget.viewer = new widgetViewer();

//------------------------------------------------------------------------------------
//                             The Kastellan widget instance class
//------------------------------------------------------------------------------------
function widgetInstance(_instanceId)
// The widgetInstance class gives access to a widget's properties. This is a "synthetical"
// superclass of the class that is used to instantiate the "widget" object as described above.
// the widgetInstance object has been kept as lightweight as possible as there may be a lot of
// instances around reflecting the hierarchy of widgets in the Viewer. In the most typical case the
// only property stored in the object will be the _instanceId of the widget that is represented by
// the object
 {
   // The identifier is read only. Using a getter protects it
    // var someVar = widget.identifier;
    // Returns the preference associated with the specified key.
    this.preferenceForKey = function(key) {
    	return parent.pTree.preferenceForKey(_instanceId , key );
    };
    this.setPreferenceForKey = function(value, key) {
    	return parent.pTree.setPreferenceForKey(_instanceId , value , key );
    };

    this.globalPreferenceForKey = function(key) {
    	return parent.pTree.globalPreferenceForKey(key );
    };
    this.setGlobalPreferenceForKey = function(value, key) {
    	return parent.pTree.setGlobalPreferenceForKey( value , key );
    };
    
	this.setIconName = function(icon) {
		return parent.setIconName(_instanceId, icon );
	};

	this.bindToPreference = function(theKey, funcRef) {
		console.log('bindToPreference = ' , theKey, funcRef);
    	return parent.pTree.bindToPreference( _instanceId , theKey , funcRef , this.bindToPreference.caller);
	};
	
	this.resizeTo = function(valueX, valueY) {
		console.log('widget.resizeTo');
		window.resizeTo(valueX, valueY);
	};
	
	this.unbindPreference = function() {
    };
    
    this.instantiateWidget = function() {
    	console.error('TODO: instantiateWidget');
    };
    this.classIdForInstance = function() {
    	return parent.pTree.classIdForInstance(_instanceId);
    };
    		

    this.__defineGetter__("identifier",
    function() {
        return _instanceId;
    });

    this.__defineSetter__("identifier",
    function(newIdentifier) {
    	_instanceId = newIdentifier;
    });

	var _classId = '';
    this.__defineSetter__("classid",
    function(newClassId) {
    	_classId = newClassId;
    });

	// The widget bundle object provides access to all the properties and methods of the bundle that was
	// orginally used to create this widget instance. For more details refer to the description of
	// the widgetBundle class below.
	// Use a "getter" method here to make sure we only setup the widgetBundle object once it is really used
	// as most widgetInstance objects will probably never access this data.
	// var someVar = widget.bundle;
	var _bundle = undefined;
    this.__defineGetter__("bundle",
    function() {
        return _bundle ? _bundle : new widgetBundle(_instanceId, _classId);
    });

	// The widget frame object provides access to all the properties and methods of the frame surrounding
	// this widget instance. For more details refer to the description of the widgetFrame class below
	// Use a "getter" method here to make sure we only setup the widgetBundle object once it is really used
	// as most widgetInstance objects will probably never access this data.
	// var someVar = widget.bundle;
	var _frame = undefined;
    this.__defineGetter__("frame",
    function() {
        return _frame ? _frame : new widgetFrame(_instanceId, _classId);
    });

    // The widget instance object of this widget's parent in the logical and geometrical hierachy.
	// The parent widget instance can also be changed. If parent is "null" the Kastellen viewer is
	// the parent of the widget.
	// IMPORTANT: Changing the (logical) parent of a widget instance has no automatic effect on the 
	// geometrical widget hierarchy and therefore may easily break the seemingly physical
	// correspondence between gemoetrical and logical widget hierarchy. It is your responsibility
	// to reestablish this correspondace by geometrically moving the widget to the new parent widget.	
    // var someVar = widget.parent;
    this.__defineGetter__("parent",
    function() {
		var parentId = widget.preferenceForKey(_instanceId + "/kastellan/parent");
		return parentId ? new widgetInstance(parentId) : null;
    });
    // widget.parent = someVar;
    this.__defineSetter__("parent",
    function(newParent) {
		widget.setPreferenceForKey(newParent.identifier, _instanceId + "/kastellan/parent");
    });

    // Contains an array of widget instance objects for all the widgets which
	// are immediate descendants of this widget in the geometrical hierachy.
    // var someVar = widget.children;
    this.__defineGetter__("children",
    function() {
		var instanceList = [];
		var idstr = widget.preferenceForKey(_instanceId + "/kastellan/children");
		if (idstr) {
			var idList = idstr.split(" ");
			for (var item in idList) {
				instanceList.push(new widgetInstance(idList[item]));
			}
		}
		return instanceList;
    });

	// Remove this widget instance 
	// ---NOTE--- used to be widget.closeWidget
	// ---TBD--- what should the verb to be used be: Close? Remove? ...
    // widget.remove();
	this.remove = function() {
		widget.closeWidget(_instanceId);
	}
}


//------------------------------------------------------------------------------------
//                             The Kastellan widget bundle class
//------------------------------------------------------------------------------------
// typical usage: widget.bundle = new widgetBundle
function widgetBundle(_instanceId, _widgetclass)
// the widgetBundle class gives a widget access to the properties  of the bundle that was used to
// instantiate it
 {
	// _instanceId and _widgetclass will be needed to grab some data about the widgets bundle
	// like getting the sourceURL for example

    // The unique bundle id of the the widget's bundle which was used instantiate it
    var _bundleId = widget.bundleIdForInstance(_instanceId);

    // The current version as read from the Info.plist property of this widget's bundle
    this.version = widget.currentBundleVersion(_bundleId)
    // ---NOTE--- used to be widget.currentBundleVersion()
	// ---TBD--- must add bundleID parameter as this will be a prerequisite for the Genesis Widget
	// to display local versions in listing)

    // Provides the URL of te original location from which this widget bundle (that was used to
	// instantiate this widget) was loaded
    // ---NOTE--- used to be widget.url
    this.sourceURL = widget.preferenceForKey(_instanceId + "/kastellan/url");

	// Returns the human readable original name of this widget bundle
	this.name = widget.getWidgetName(_bundleId);
	
	// Returns the URL of the icon file of this widget bundle (by bundleID) to the caller.
	// Returns undefined if no icon file is available. This is how the Genesis widget will
	// get the icons in order to display nice list of available widget bundles including
	// their default icons
	// ---NOTE--- used to be widget.getIconLink(bundleID)
	this.iconURL = widget.getIconLink(_bundleId);

	// --- TBD --- Note that order of arguments is reverse from setPreferenceForKey 
	// why do we need to pass a key value pair when instantiating a new widget?
	// wouldn't the instanceId returned be enough?
	// Lädt das an der angegebener Url vorhandene Widget und gibt die neue
	// instanceId dieses Widgets wieder zurück. Das Widget wird per default an der
	// Stelle erzeugt, an der die Maus zum Zeitpunkt des Erstellens war.
	// Wenn key und value angegeben sind, wird ein entsprechender Preferences
	// Eintrag gemacht, als Untereintrag zu denen des Widgets.
	this.addExternalWidget = function(widgetUrl, key, preference) {}

	// Installiert ein Update, welches als Parameter übergeben wurde. Dies ist üblicherweise eine
	// durch loadWidgetUpdate() herunter geladene Datei, welche dem callBack mitgeteilt worden ist.
	this.installWidget = function(tempFileName) {}
	// seems to be the same as widget.installUpdate(tempFileName)

	// Lädt eine Datei von der gegebenen Url auf den Computer. Dies soll eine zip Datei mit
	// mindestens einem Widget sein. Der Callback wird der Name der heruntergeladenen Datei übergeben,
	// das ist nicht der Name, welcher in der Url genutzt wurde. Der Name, welcher der Callback übergeben
	// wurde muss installUpdate() übergeben werden, damit das Update installiert wird.
	this.loadWidget = function(url, callback) {}
	// seems to be the same as loadWidgetUpdate()

	// Removes a widget completly from system. All instances of this widget bundle will be closed.
	// ---NOTE--- used to be widget.uninstallWidget
	this.removeBundle = function(bundleId) {}
}


//------------------------------------------------------------------------------------
//                             The Kastellan widget frame class
//------------------------------------------------------------------------------------
// typical usage: widget.frame = new widgetFrame
function widgetFrame(_instanceId, _widgetclass)
// --- the widgetFrame class gives a widget access to the frame surrounding it
 {
 	this.resizeTo = function(width, height) {
 		parent.resizeWidgetTo(_instanceId , width, height );
 	}
	// lesend und schreibend. Die X und Y Position der Mitte des Widgets kann damit gelesen oder geschrieben
	// werden. Dabei gilt immer die Position relativ zum Parent. Wenn das Widget keinen Parent hat, wird die
	// Position in der Scene zurückgegeben.
	// ---TBD--- check parameter passing of an array object in setter and getter methods
	// var pointArr = widget.frame.position;
	this.__defineGetter__("position",
	function() {
		var x = widget.preferenceForKey(_instanceId + "/kastellan/posX");
		return [x, widget.preferenceForKey(_instanceId + "/kastellan/posY")];
	});
	// widget.frame.position = (xval, yval);
	this.__defineSetter__("position",
	function(point) {
		widget.setPreferenceForKey(point[0], _instanceId + "/kastellan/posX");
		widget.setPreferenceForKey(point[1], _instanceId + "/kastellan/posY");
	});

	// ---NOTE--- used to be bgHeight
	// var someVar = widget.frame.height;
	this.__defineGetter__("height",
	function() {
		return widget.preferenceForKey(_instanceId + "/kastellan/bgHeight");
	});

	// ---NOTE--- used to be bgWidth
    // var someVar = widget.frame.width;
    this.__defineGetter__("width",
    function() {
        return widget.preferenceForKey(_instanceId + "/kastellan/bgWidth");
    });

    // Enthält den Zoom Faktor des Widgets im Kastellan Viewer.
    // Dieser ist relativ zum Parent bzw wenn kein Parent vorhanden ist den zur Scene. 1.0 ist dabei 100%.
    // Die gleichen Keys können auch genutzt werden, um die entsprechenden Daten zur Laufzeit auszulesen.
    // Zusätzlich gibt es noch children zum auslesen der InstanceID's der Kinder eines Widgets.
    // var someVar = widget.frame.zoom;
    this.__defineGetter__("zoom",
    function() {
        return widget.preferenceForKey(_instanceId + "/kastellan/zoom");
    });
    // widget.frame.zoom = someVar;
    this.__defineSetter__("zoom",
    function(zoom) {
        widget.setPreferenceForKey(zoom, _instanceId + "/kastellan/zoom");
    });

	// ---TBD--- Will most likely be used for "presenter widgets"
    // _showFrame

	// ---TBD--- As we have the feature we can as well use it
    // _autohideTitleBar

    // If true the user may close this frame and the widget it hosts. If false the frame menu item and the backside
    // button to close the widget will not be shown
    // var someVar = widget.frame.allowClose;
    this.__defineGetter__("allowClose",
    function() {
        return widget.preferenceForKey(_instanceId + "/kastellan/allowclose");
    });
    // widget.frame.allowClose = someVar;
    this.__defineSetter__("allowClose",
    function(allowClose) {
        widget.setPreferenceForKey(allowClose, _instanceId + "/kastellan/allowclose");
    });

    // If true the user may zoom this frame and the widget it hosts using the built-in zooming capabilities of the Kastellan viewer
    // If false the default zoom handle on the lower left corner of the frame will not be shown
    // var someVar = widget.frame.allowZoom;
    this.__defineGetter__("allowZoom",
    function() {
        return widget.preferenceForKey(_instanceId + "/kastellan/allowzoom");
    });
    // widget.frame.allowZoom = someVar;
    this.__defineSetter__("allowZoom",
    function(allowZoom) {
        widget.setPreferenceForKey(allowZoom, _instanceId + "/kastellan/allowzoom");
    });

    // If true the user may resize this frame and the widget it hosts using the built-in resizing capabilities of the Kastellan
    // viewer. If false the default resize handle on the lower right corner of the frame will not be shown
    // ---TBD--- key must be added, read & write
    // var someVar = widget.frame.allowResize;
    this.__defineGetter__("allowResize",
    function() {
        return widget.preferenceForKey(_instanceId + "/kastellan/allowresize");
    });
    // widget.frame.allowResize = someVar;
    this.__defineSetter__("allowResize",
    function(allowResize) {
        widget.setPreferenceForKey(allowClose, _instanceId + "/kastellan/allowresize");
    });

    // If true the user may turn this frame and the widget it hosts around to access its back which usually
    // holds some settings items. If false the Settings menu item in the Frame Menu will not be active
    // ---TBD--- key must be added, read & write
    // var someVar = widget.frame.allowBackside;
    this.__defineGetter__("allowBackside",
    function() {
        return widget.preferenceForKey(_instanceId + "/kastellan/allowbackside");
    });
    // widget.frame.allowBackside = someVar;
    this.__defineSetter__("allowBackside",
    function(allowBackside) {
        widget.setPreferenceForKey(allowBackside, _instanceId + "/kastellan/allowbackside");
    });

    // The rotation angle (relative to its parent widget) at which this frame and the widget it hosts is currently drawn
	// ---NOTE--- used to be angle
    // var someVar = widget.frame.rotationAngle;
    this.__defineGetter__("rotationAngle",
    function() {
        return widget.preferenceForKey(_instanceId + "/kastellan/angle");
    });
    // widget.frame.rotationAngle = someVar;
    this.__defineSetter__("rotationAngle",
    function(rotationAngle) {
        widget.setPreferenceForKey(rotationAngle, _instanceId + "/kastellan/angle");
    });

    // Zeigt an, ob es dem Widget erlaubt ist, das Hintergrundbild, falls gesetzt, selber darzustellen.
	// ---NOTE--- obsolete, if the widget wants to draw the background image itself it may do so
    // by accessing the body element of the widget's DOM tree using
    // document.getElementsByTagName("body")[0].background = "file://...";
    // the widget can always just draw a picture in the widget area of the frame
    // The path of the image currently shown as the background of this frame
	// ---TBD--- -> remove bgAllow

	// - lesend und schreibend. Der Pfad zu dem Hintergrundbild, welches dem Widget zugewiesen
	// sein soll. Dieses wird dann ggf. geladen und angezeigt.
    // ---NOTE--- used to be bgPath	
    // var someVar = widget.frame.imageURL;
    this.__defineGetter__("imageURL",
    function() {
        return widget.preferenceForKey(_instanceId + "/bgPath/kastellan");
    });
    // widget.frame.imageURL = someVar;
    this.__defineSetter__("imageURL",
    function(imageURL) {
        widget.setPreferenceForKey(imageURL, _instanceId + "/bgPath/kastellan");
    });

    // Gibt die Breite des Hintergrundbildes wieder.
	// used to be bgWidth
    this.__defineGetter__("imageWidth",
    function() {
        return widget.preferenceForKey(_instanceId + "/bgWidth/kastellan");
    });

    // Gibt die Höhe des Hintergrundbildes an, wobei dort schon die Höhe der Titelzeile abgezogen ist.
	// used to be bgWidth
    this.__defineGetter__("imageHeigth",
    function() {
        return widget.preferenceForKey(_instanceId + "/bgHeight/kastellan");
    });

    // The path of the image currently shown as the icon of this frame
    // ---NOTE--- used to be setIconName
 	// ---TBD--- As it should be possible to get and set the icon of each widget instance separately
	// it would make sense to implement this based on _instanceId and based on a corresponding
	// key (imageurl) to read and write. widget.setIconName can be removed in exchange
	// ---NOTE--- used to be widget.getIconLink
	// var someVar = widget.frame.iconURL;
    this.__defineGetter__("iconURL",
    function() {
        return widget.preferenceForKey(_instanceId + "/iconurl/kastellan");
    });
	// used to be widget.setIconName (kind of, see widgetBundle object)
    // widget.frame.iconURL = someVar;
    this.__defineSetter__("iconURL",
    function(iconURL) {
        widget.setPreferenceForKey(iconURL, _instanceId + "/iconurl/kastellan");
    });

    // Add a menu item to the frame menu of the frame of this item. If the menuItemId given is not
	// available or < zero, a new menu entry is added to the settingsmenu extension. The function
	// specified as a "callback" is executed whenever the user selects the menu item added.
	// This is available only for the widget object itself
    // ---NOTE--- There were two methods doing almost the same: addMenuItem & setMenuItem. We are using
	// the paramters and the code of setMenuItem with the name of addMenuItem.
	// ---TBD--- What is the difference between positive and negative menuItemIds? What is the
	// menuItemId used for? Position in the menu items? Identification to delete it later? In this
	// case the id should be assigned by the method and returned as the return value
    this.addMenuItem = function(menuItemId, iconUrl, text, callback) {
		if (widget.identifier == _instanceId) { /* allow this for our own widget instance only */
			widget.setMenuItem(menuItemId, iconUrl, text, callback);
		}
	}

    // Removes one of the widget-added menu items in the widgets menu.
	// This is available only for the widget object itself
    this.removeMenuItem = function(menuItemId) {
		if (widget.identifier == _instanceId) { /* allow this for our own widget instance only */
			widget.removeMenuItem(menuItemId);
		}
	}

    // The name that is shown in the frame surrounding this widget
	// Do not cache this as it might be changed by the user without us noticing it
    this.title = widget.preferenceForKey(_instanceId + "/title/kastellan");
    this.setTitle = function(title) {
    	parent.flab_setTitle(_instanceId , title);
    	// widget.setPreferenceForKey(title , _instanceId + "/title/kastellan");
    }
}


//------------------------------------------------------------------------------------
//                             The Kastellan widget viewer class
//------------------------------------------------------------------------------------
// typical usage: widget.viewer = new widgetViewer
function widgetViewer()
// --- the widgetViewer class gives a widget access to the viewer environment that holds it
 {
    //------------------------------------------------------------------------------------
    // Kastellan viewer properties. For more documentation please refer to the document
    // ---TBD--- from futureLAB
    //------------------------------------------------------------------------------------
    // Provides the version number of the Kastellan viewer under which your widget is currently running.
    // Format of the version string ---TBD ---
    this.version = "0.1.0.1-189";

    // Provides a version string identifing the OS plattform on which the Kastellan viewer is running.
    // The format of the string is plattform dependent
    this.osVersion = undefined;

    // Provides the type of OS  on which the Kastellan viewer is running.
    // This will one of "OS X", "Linux" or "Windows"
    this.osType = undefined;

    // Aktueller Darstellungswinkel des Viewers
    this.angle = widget.globalPreferenceForKey("viewer/angle");

    // Die Scene position, welche gerade in der Mitte des Viewers liegt.
    this.posX = undefined;
 
   // Koordinatensystem: Einheiten? Nullpunkt? Achsenorientierung (in welche Richtung nehmen die Zaheln zu?)
    this.posY = undefined;

    // Eine Liste von Widget Instance ID's aller Widgets welche auf dem Viewer liegen.
    this.widgets = [];

    // Current zoomlevel of the viewer
    this.zoom = 0;

    // Provides the system language as two letter ISO 639 (lower case) string
    this.sysLanguage = widget.getLanguage();
    // used to be the widget.getLanguage() method

	// ---TBD--- should this go here (the list will replicated many times) or to the viewer object?
	// Return a list of bundle identifiers (in format {"a.a.a.a","b. b.b.b"}) for all installed widget
	// used to be widget.installedWidgets
	this.availableBundles = widget.installedWidgets();

	// Listet alle Verzeichnisse, welche im PlugIn an dem relative Pfad relPath liegen. Im relPath sind
	// keine '..' erlaubt, auch werden Symlinks weder verfolgt noch aufgelistet. Als rückgabe bekommt man
	// einen String, welcher alle gefunden Verzeichnisse auflistet "{ 'verz1' , 'verz2' , 'verz3' }".
	kastellan.prototype.directoriesAt = function(relPath) {}

	// Listet alle Dateien, welche im PlugIn an dem relative Pfad relPath liegen. Im relPath sind
	// keine '..' erlaubt, auch werden Symlinks weder verfolgt noch aufgelistet. Als rückgabe bekommt
	// man einen String, welcher alle gefunden Dateien auflistet "{ 'file1.lsd' , 'file2.xtc' , 'file3.thc' }".
	kastellan.prototype.filesAt = function(relPath) {}

	// Überträgt eine Datei auf den genannten FTP server mit entsprechenden Informationen. Am Ende wird
	// die Callback aufgerufen, mit einer Zahl als Information ob alles geklappt hat.
	// Return codes :
	// 0 No error occurred
	// 1 There was  an unknown error
	// 2 The host name lookup failed
	// 3 The server refused the connection
	// 4 Tried to send a command, but there is no connection to a server
	kastellan.prototype.ftpPut = function(callBackName, host, name, content, path, port, username, password) {}
}




//------------------------------------------------------------------------------------
//                                 The dashcode object
//------------------------------------------------------------------------------------
dashcode = function() {}
dashcode.getLocalizedString = function(key) {
	return key;
}

/*
// dashcode Properties

dashcode.setupParts.called

 dashcode.inDesign

// dashcode Methods
// setupParts(string)
// Uses the dashcodePartsSpec dictionary, declared in the automatically generated file setup.js to instantiate
// all the parts in the project.
 dashcode.setupParts();

dashcode.setupPart(elementOrId, creationFunction, viewClass, specDict, relativeController);

dashcode.setupDataSource(identifier, specDict);

dashcode.getDataSource(dataSourceName);

dashcode.preProcessBindings(partSpec);

// getLocalizedString(string)
// Pulls a string out an array named localizedStrings.  Each language project directory in this widget
// contains a file named "localizedStrings.js", which, in turn, contains an array called localizedStrings.
// This method queries the array of the file of whichever language has highest precedence, according to
// your preference set in the language toolbar item
//
// string: the key to the array
dashcode.getLocalizedString(string);

// createInstancePreferenceKey(key)
// Returns a unique preference key that is based on a instance of an opened widget.
// The returned value can then be used in widget.setPreferenceForKey()
// and widget.preferenceForKey() so that the value that is set or retrieved is
// only for a particular opened widget.
//
// key: preference key
dashcode.createInstancePreferenceKey(key);

// getElementHeight(mainElement)
// Get the height of a part even if it's hidden (by 'display: none').
//
// mainElement: Part element
dashcode.getElementHeight(mainElement);

// getElementWidth(mainElement)
// Get the width of a part even if it's hidden (by 'display: none').
//
// mainElement: Part element
dashcode.getElementWidth(mainElement);

// getElementSize(mainElement)
// Get the size of a DOM element even if it's hidden (by 'display: none').
//
// mainElement: DOM element
dashcode.getElementSize(mainElement);

// getElementSizesWithAncestor(elements, ancestor)
// Get the size of an array of DOM elements under a common ancestor even if they're hidden (by 'display: none').
//
// elements: Array of DOM element
// ancestor: Common DOM ancestor. 'display' will temporarily be flipped to 'block' for all hidden ancestors of this element.
dashcode.getElementSizesWithAncestor(elements, ancestor);

dashcode.getElementDocumentOffset(element);

dashcode.pointInElement(x, y, element);

// cloneTemplateElement(element, isTemplate)
// Clone an element and initialize the parts it contains. The new element is simply returned and not added to the DOM.
//
// element: element to clone
// isTemplate: true if this is the template element
dashcode.cloneTemplateElement(element, isTemplate, relativeController);

// This Method is Deprecated
// processClonedTemplateElement(element, templateElements, isTemplate, preserveIds)
// Recursively process a newly cloned template element to remove IDs and initialize parts.
//
// element: element to process
// templateElements: list of references to template objects to populate
// isTemplate: true if this is the template element
// preserveIds: true to preserve the original id in a tempId attribute
dashcode.processClonedTemplateElement(element, templateElements, isTemplate, preserveIds, relativeController, bindController);

// Old function names for backwards compatibility
var setupParts = dashcode.setupParts;
var getLocalizedString = dashcode.getLocalizedString;
var createInstancePreferenceKey = dashcode.createInstancePreferenceKey;
var getElementHeight = dashcode.getElementHeight;
var getElementWidth = dashcode.getElementWidth;
var getElementSize = dashcode.getElementSize;

*/
