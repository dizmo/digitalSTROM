//= compat
//= require <flab/Namespace>

flab.Namespace.create('flab.exception');

/**
 * Exception builder to simplify the definition of new Error
 * object classes.
 * @param {String} name Exception name, available as e.name
 * @param {Function} parentException parent exception class constructor function,
 *                                   if not specified Error is used.
 * @return {Function} Constructor for the exception, ready to be thrown.
 * If the generated exception class contains an initialize function, it is called
 * from constructor with the whole argument list of the constructor. This allows
 * to throw exception with additional data.
 */
flab.exception.builder = function(name, parentException) {
    "use strict";
    var constructor = function(message) {
        this.name = name;
        this.message = message;
        if (this.initialize && (typeof this.initialize === 'function')) {
            this.initialize.apply(this, arguments);
        }
    };
    if (typeof parentException === 'undefined') {
        parentException = Error;
    }
    constructor.prototype = new parentException();
    constructor.prototype.constructor = constructor;
    return constructor;
};
