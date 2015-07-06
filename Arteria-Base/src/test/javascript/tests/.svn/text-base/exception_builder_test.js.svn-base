//= compat
//= require <flab/Test>
//= require <flab/test/TestLogger>
//= require <flab/exception/Builder>

flab.Test.run(function(T, A) {
    "use strict";
    T.Runner.add(new T.Case({
        name:  'flab.exception.Builder',

        setUp: function() { },

        tearDown: function() { },

        testBuilder: function() {
            var me = this,
                E1;
            A.nothingRaised(function() {
                E1 = flab.exception.builder('E1');
            }, "Construct with implicit Error parent");
            A.isFunction(E1);
            try {
                throw new E1("test message");
            }
            catch (e) {
                A.isObject(e);
                A.isInstanceOf(Error, e);
                A.isInstanceOf(E1, e);
                A.areEqual("E1", e.name);
                A.areEqual("test message", e.message);
            }

            E1 = null;
            A.nothingRaised(function() {
                E1 = flab.exception.builder('E1', Error);
            }, "Construct with explicit Error parent");
            A.isFunction(E1);
        },

        testHierarchy: function() {
            var me = this,
                exceptionClasses,
                root,
                l3;
            A.nothingRaised(function() {
                exceptionClasses = me.createTestExceptions();
            });
            try {
                throw new exceptionClasses.ERoot("root msg");
            }
            catch (e1) {
                root = e1;
            }
            try {
                throw new exceptionClasses.EL3("level 3 msg");
            }
            catch (e2) {
                l3 = e2;
            }
            A.isInstanceOf(Error, root);
            A.isInstanceOf(exceptionClasses.ERoot, root);
            A.isNotInstanceOf(exceptionClasses.EL1A, root);
            A.isNotInstanceOf(exceptionClasses.EL1B, root);
            A.isNotInstanceOf(exceptionClasses.EL2A, root);
            A.isNotInstanceOf(exceptionClasses.EL2B, root);

            A.isInstanceOf(Error, l3);
            A.isInstanceOf(exceptionClasses.ERoot, l3);
            A.isInstanceOf(exceptionClasses.EL1A, l3);
            A.isInstanceOf(exceptionClasses.EL2A, l3);
            A.isNotInstanceOf(exceptionClasses.EL1B, l3);
            A.isNotInstanceOf(exceptionClasses.EL2B, l3);
        },

        testInitializer: function() {
            var me = this,
                EInit = flab.exception.builder('EInit');
            EInit.prototype.initialize = function(message, a1, a2, a3) {
                this.argcount = arguments.length;
                this.a1 = a1;
                this.a2 = a2;
                this.a3 = a3;
            };
            try {
                throw new EInit("My Message", 11, 12, 13);
            }
            catch (e) {
                A.areEqual('EInit', e.name);
                A.areEqual(4, e.argcount);
                A.areEqual("My Message", e.message);
                A.areEqual(11, e.a1);
                A.areEqual(12, e.a2);
                A.areEqual(13, e.a3);
            }
        },

        createTestExceptions: function() {
            var me = this,
                exceptionClasses = {};
            exceptionClasses.ERoot = flab.exception.builder('ERoot');
            exceptionClasses.EL1A = flab.exception.builder('EL1A', exceptionClasses.ERoot);
            exceptionClasses.EL1B = flab.exception.builder('EL1B', exceptionClasses.ERoot);
            exceptionClasses.EL2A = flab.exception.builder('EL2A', exceptionClasses.EL1A);
            exceptionClasses.EL2B = flab.exception.builder('EL2B', exceptionClasses.EL1B);
            exceptionClasses.EL3 = flab.exception.builder('EL3', exceptionClasses.EL2A);
            return exceptionClasses;
        }
    }));
});
