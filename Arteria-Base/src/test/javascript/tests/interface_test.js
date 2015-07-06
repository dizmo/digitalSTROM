//= compat
//= require <flab/Test>
//= require <flab/test/TestLogger>
//= require <flab/Class>

//= require <Interface>

flab.Test.run(function(T, A) {
    T.Runner.add(new T.Case({
        name: 'Interface',

        setUp: function() {

        },

        tearDown: function() {

        },

        testInterfaceConstructor: function() {
            var TestInterface = new Interface('TestInterface', ['foo', 'hello']);

            A.isInstanceOf(Interface, TestInterface, 'Interface created');
        },

        testEnsureImplements: function() {
            var TestInterface = new Interface('TestInterface', ['foo', 'hello']),
                TestClass = flab.Class.extend(Object, {
                    foo:   function() {},
                    hello: function() {}
                }),
                instance = new TestClass();

            A.nothingRaised(function(){
               Interface.ensureImplements(instance, TestInterface);
            });

            TestClass = flab.Class.extend(Object, {
                foo:   function() {}
            });
            instance = new TestClass();
            A.raised('Error', function(){
                Interface.ensureImplements(instance, TestInterface);
            }, 'TestClass instance does not implement TestInterface');

            A.raised('Error', function(){
                Interface.ensureImplements(undefined, TestInterface);
            }, 'undefined does not implement TestInterface');

            A.raised('Error', function(){
                Interface.ensureImplements(null, TestInterface);
            }, 'null does not implement TestInterface');

            A.raised('Error', function(){
                Interface.ensureImplements(instance, {});
            }, 'Bogus interface check fails');
        }
    }));
});
