//= compat
//= require <flab/Test>
//= require <flab/test/TestLogger>
//= require <flab/Namespace>

flab.Test.run(function(T, A) {
    T.Runner.add(new T.Case({

        name: "flab.Test",

        testNamespace: function() {
            A.nothingRaised(function() {
                flab.Namespace.create("NobodyWouldThinkOfThis");
            });
            A.areSame('object', typeof window.NobodyWouldThinkOfThis);
            var counter = 0;
            for (var x in window.NobodyWouldThinkOfThis) {
                ++counter;
            }
            A.areSame(0, counter, "Nothing defined in test namespace");
        },

        testNamespaces: function() {
            for (var i = 0; i < 10; i++) {
                flab.Namespace.create("TestNamespace" + i);
            }
            for (i = 0; i < 10; i++) {
                A.isNotNullOrUndefined(window["TestNamespace" + i]);
            }
        },

        testNotOverride: function() {
            flab.Namespace.create("NotOverrideThisNamespace");
            NotOverrideThisNamespace.Magic = 0xdeadbeaf;
            flab.Namespace.create("NotOverrideThisNamespace");
            A.areSame(0xdeadbeaf, NotOverrideThisNamespace.Magic);
        },

        testHierarchy: function() {
            A.nothingRaised(function() {
                flab.Namespace.create("TestHierarchy.a.b.c.d");
                flab.Namespace.create("TestHierarchy.a.x.y");
                flab.Namespace.create("TestHierarchy.a.x.y.z");
            });
            // also do not override anything
            A.nothingRaised(function() {
                TestHierarchy.a.x.y.z.Magic = 0xb01dface;
                flab.Namespace.create("TestHierarchy.a.x");
                flab.Namespace.create("TestHierarchy.a.x.y");
            });
            A.areSame(0xb01dface, TestHierarchy.a.x.y.z.Magic);
        },

        testRequire: function() {
            A.raised("Namespace 'TestNamespaceRequire' not found.", function() {
                flab.Namespace.require("TestNamespaceRequire");
            });
            flab.Namespace.create("TestNamespaceRequire");
            A.nothingRaised(function() {
                flab.Namespace.require("TestNamespaceRequire");
            });

            // the same with a hierarchy
            A.raised("Namespace 'TestNamespaceRequire.a.b.c' not found.", function() {
                flab.Namespace.require("TestNamespaceRequire.a.b.c");
            });
            flab.Namespace.create("TestNamespaceRequire.a.b.c");
            A.nothingRaised(function() {
                flab.Namespace.require("TestNamespaceRequire.a.b.c");
            });
        }
    }));
});
