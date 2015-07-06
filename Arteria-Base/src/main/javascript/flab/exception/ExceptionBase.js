//= compat
//= require <flab/Namespace>
//= require <flab/exception/Builder>

flab.Namespace.create('flab.exception');

/**
 * Base exception for futureLAB exception tree.
 * Don't throw this directly, always use a subclass.
 * @class flab.exception.ExceptionBase
 */
flab.exception.ExceptionBase = flab.exception.builder('ExceptionBase');
