//= compat
//= require <flab/exception/Builder>
//= require <flab/exception/DataError>

/**
 * Exception for any parse error. Usually from JSON or XML document.
 * @param {String} jsonText The unparsed JSON, XML or whatever text
 * @class flab.exception.ParseError
 */
flab.exception.ParseError = flab.exception.builder(
    'ParseError',
    flab.exception.DataError
);
flab.exception.ParseError.prototype.initialize = function(message, documentText) {
    this.documentText = documentText;
};
