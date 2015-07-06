/**
 * This class implements interfaces for JavaScript using Duck Typing. It was taken
 * and slightly adapted from the examples on http://jsdesignpatterns.com/.
 *
 * @param {String}   name    Name of the interface.
 * @param {String[]} methods Methods a class has to provide in order to implement the interface.
 * @class Interface
 */
var Interface = function(name, methods) {
    if (arguments.length != 2) {
        throw new Error("Interface constructor called with " + arguments.length
          + "arguments, but expected exactly 2.");
    }

    this.name = name;
    this.methods = [];
    for (var i = 0, len = methods.length; i < len; i++) {
        if (typeof methods[i] !== 'string') {
            throw new Error("Interface constructor expects method names to be "
              + "passed in as a string.");
        }
        this.methods.push(methods[i]);
    }
};

/**
 * Ensure that a given object implements the given interfaces.
 * @static
 * @param {Object}    object    The object which should be checked.
 * @param {Interface} interface Interfaces the object must implement. Can
 *                              be passed multiple times.
 * @throws an exception if any interface is not implemented by the object.
 */
Interface.ensureImplements = function(object) {
    if (arguments.length < 2) {
        throw new Error("Function Interface.ensureImplements called with " +
          arguments.length  + "arguments, but expected at least 2.");
    }

    if (typeof object === 'undefined' || object === null) {
        throw new Error("Function Interface.ensureImplements expects the first "
          +"parameter 'object' to be defined and not null.");
    }

    for (var i = 1, len = arguments.length; i < len; i++) {
        var iface = arguments[i];
        if (! (iface instanceof Interface)) {
            throw new Error("Function Interface.ensureImplements expects arguments "
              + "two and above to be instances of Interface.");
        }

        for (var j = 0, methodsLen = iface.methods.length; j < methodsLen; j++) {
            var method = iface.methods[j];
            if (!object[method] || typeof object[method] !== 'function') {
                throw new Error("Function Interface.ensureImplements: object "
                  + "does not implement the " + iface.name
                  + " interface. Method " + method + " was not found.");
            }
        }
    }
};
