//= compat
//= require <flab/Test>
//= require <flab/test/TestLogger>
//= require <flab/exception/ExceptionBase>
//= require <flab/exception/ConstraintViolation>
//= require <flab/exception/ConfigOptionError>
//= require <flab/exception/DataError>
//= require <flab/exception/ParseError>
//= require <flab/exception/AbstractException>

flab.Test.run(function(T, A) {
    "use strict";

    var _EXCEPTION_LIST = [
        'AbstractException',
        'ConfigOptionError',
        'ConstraintViolation',
        'DataError',
        'ExceptionBase',
        'ParseError'
    ];

    T.Runner.add(new T.Case({
        name:  'exceptions',

        setUp: function() { },

        tearDown: function() { },

        testExceptions: function() {
            var me = this;
            me.iterateExceptions(function(name, constructor) {
                A.isFunction(constructor, "Constructor available for " + name);
            });
        },

        testThrow: function() {
            var me = this;
            me.iterateExceptions(me.checkThrow);
        },

        checkThrow: function(name, constructor) {
            var me = this;
            try {
                throw new constructor('Message for ' + name);
            }
            catch (e) {
                A.areEqual(name, e.name);
                A.areEqual("Message for " + name, e.message);

                A.isInstanceOf(Error, e,
                    "Exception " + name + " is subclass of Error"
                );
                A.isInstanceOf(flab.exception.ExceptionBase, e,
                    "Exception " + name + " is subclass of ExceptionBase"
                );
            }
        },

        testAbstractException: function() {
            var me = this;
            function _a() {
                throw new flab.exception.AbstractException("msg", "_a", "MyObj");
            }
            try {
                _a();
            }
            catch (e) {
                A.isInstanceOf(flab.exception.AbstractException, e);
                A.areEqual('_a', e.methodName);
                A.areEqual('MyObj', e.className);
            }
        },

        testParseError: function() {
            var me = this;
            try {
                throw new flab.exception.ParseError("Faked parse error", '{ bad: "json" }');
            }
            catch (e) {
                A.isInstanceOf(flab.exception.ParseError, e);
                A.isNotNullOrUndefined(e.documentText);
                A.areEqual('string', typeof e.documentText);
            }
        },

        iterateExceptions: function(cb, args) {
            var me = this,
                exc, i, l, c;

            for (i = 0, l = _EXCEPTION_LIST.length; i < l; ++i) {
                exc = _EXCEPTION_LIST[i];
                c = flab.exception[exc];
                cb.call(me, exc, c);
            }
        }
    }));
});
