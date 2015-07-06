//= compat
//= require <flab/exception/Builder>
//= require <flab/exception/ConstraintViolation>

/**
 * Exception if a namespace could not be found with flab.Namespace.require().
 * This is a bit special as it could not be required by flab/Namespace.js
 * due the dependency of flab.Namespace (see the cycle here?).
 * @class flab.exception.NamespaceNotFoundException
 */
flab.exception.NamespaceNotFoundException = flab.exception.builder(
    'NamespaceNotFoundException',
    flab.exception.ConstraintViolation
);
