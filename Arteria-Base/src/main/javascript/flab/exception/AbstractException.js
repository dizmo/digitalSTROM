//= compat
//= require <flab/exception/Builder>
//= require <flab/exception/ExceptionBase>

/**
 * Exception to protect abstract methods.
 * @param {String} methodName name of the abstract method called
 * @param {String} className location of the abstract method (class)
 * @class flab.exception.AbstractException
 */
flab.exception.AbstractException = flab.exception.builder(
    'AbstractException',
    flab.exception.ExceptionBase
);
flab.exception.AbstractException.prototype.initialize = function(message, methodName, className) {
    this.methodName = methodName;
    this.className = className;
};
