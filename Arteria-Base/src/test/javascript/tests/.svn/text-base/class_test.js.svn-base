//= compat
//= require <flab/Test>
//= require <flab/test/TestLogger>
//= require <flab/Class>

/*
 * flab.Class uses an own implementation unless Ext JS 3 is available. If Ext JS
 * is available it uses its Ext.extend and Ext.override functions.
 */

flab.Test.run(function(T, A) {
    T.Runner.add(new T.Case({
        name: "flab.Class",

        testExtendBaseNoConstructor: function() {
            var Base,
                b;
            A.nothingRaised(function() {
                Base = flab.Class.extend(Object, {
                    getMagic: function() { return 0xdeadbeaf; }
                });
            }, "Create constructor");
            A.isNotUndefined(Base);
            A.nothingRaised(function() {
                b = new Base();
            }, "Create instance");
            A.areSame(0xdeadbeaf, b.getMagic());
        },

        testExtendBaseWithConstructor: function() {
            var Base,
                b1,
                b2;
            A.nothingRaised(function() {
                Base = flab.Class.extend(Object, {
                    constructor: function(a) {
                        this.a = a;
                        this.magic = 0xf001;
                    },
                    getMagic: function() { return this.magic; },
                    getArg: function() { return this.a; }
                });
            });
            A.isNotUndefined(Base);
            A.nothingRaised(function() {
                b1 = new Base(23);
                b2 = new Base(42);
            });
            A.areSame(0xf001, b1.getMagic());
            A.areSame(23, b1.getArg());

            A.areSame(0xf001, b2.getMagic());
            A.areSame(42, b2.getArg());
        },

        testSubclass: function() {
            var Base = flab.Class.extend(Object, {
                constructor: function(a) {
                    this.id = "Base";
                    this.setA(a);
                },
                setA: function(v) { this.a = v; },
                getA: function() { return this.a; }
            });
            var Sub = flab.Class.extend(Base, {
                constructor: function(a, b) {
                    Sub.superclass.constructor.call(this, a);
                    this.id = "Sub";
                    this.setB(b);
                },
                setB: function(v) { this.b = v; },
                getB: function() { return this.b; }
            });

            var a, b;
            A.nothingRaised(function() {
                a = new Base(101);
                b = new Sub(102, 103);
            });
            A.isNotUndefined(a);
            A.isNotUndefined(b);
            A.areSame(101, a.getA());
            A.areSame(102, b.getA());
            A.areSame(103, b.getB());
            A.isInstanceOf(Base, a);
            A.isInstanceOf(Base, b);
            A.isNotInstanceOf(Sub, a);
            A.isInstanceOf(Sub, b);
        },

        testHierarchie: function() {
            var Base = flab.Class.extend(Object, {
                constructor: function() {
                    this.attr_base = true;
                    this.attr = 0;
                },
                base: function() { return true; },
                inherit: function() { return 'Base'; }
            });
            var ChildOfBase = flab.Class.extend(Base, {
                constructor: function() {
                    ChildOfBase.superclass.constructor.call(this);
                    this.attr_childOfBase = true;
                    this.attr = 1;
                },
                childOfBase: function() { return true; },
                inherit: function() { return 'ChildOfBase'; }
            });
            var ChildOfChildOfBase = flab.Class.extend(ChildOfBase, {
                constructor: function() {
                    ChildOfChildOfBase.superclass.constructor.call(this);
                    this.attr_childOfChildOfBase = true;
                    this.attr = 2;
                },
                childOfChildOfBase: function() { return true; },
                inherit: function() { return 'ChildOfChildOfBase'; }
            });
            var SiblingOfChildOfBase = flab.Class.extend(Base, {
                constructor: function() {
                    SiblingOfChildOfBase.superclass.constructor.call(this);
                    this.attr_siblingOfChildOfBase = true;
                    this.attr = 3;
                },
                siblingOfChildOfBase: function() { return true; },
                inherit: function() { return 'SiblingOfChildOfBase'; }
            });
            var ChildOfSiblingOfChildOfBase = flab.Class.extend(SiblingOfChildOfBase, {
                constructor: function() {
                    ChildOfSiblingOfChildOfBase.superclass.constructor.call(this);
                    this.attr_childOfSiblingOfChildOfBase = true;
                    this.attr = 4;
                },
                childOfSiblingOfChildOfBase: function() { return true; },
                inherit: function() { return 'ChildOfSiblingOfChildOfBase'; }
            });

            var base,
                child1, child2,
                childOfChild1, childOfChild2;

            A.nothingRaised(function() {
                base = new Base();
                child1 = new ChildOfBase();
                childOfChild1 = new ChildOfChildOfBase();
                child2 = new SiblingOfChildOfBase();
                childOfChild2 = new ChildOfSiblingOfChildOfBase();
            });

            A.isInstanceOf(Base, base);
            A.isInstanceOf(Base, child1);
            A.isInstanceOf(Base, childOfChild1);
            A.isInstanceOf(Base, child2);
            A.isInstanceOf(Base, childOfChild2);

            A.isInstanceOf(ChildOfBase, child1);
            A.isInstanceOf(ChildOfBase, childOfChild1);
            A.isNotInstanceOf(ChildOfBase, child2);
            A.isNotInstanceOf(ChildOfBase, childOfChild2);

            A.isInstanceOf(SiblingOfChildOfBase, child2);
            A.isInstanceOf(SiblingOfChildOfBase, childOfChild2);
            A.isNotInstanceOf(SiblingOfChildOfBase, child1);
            A.isNotInstanceOf(SiblingOfChildOfBase, childOfChild1);

            A.isInstanceOf(ChildOfChildOfBase, childOfChild1);
            A.isInstanceOf(ChildOfSiblingOfChildOfBase, childOfChild2);

            A.isNotInstanceOf(ChildOfChildOfBase, childOfChild2);
            A.isNotInstanceOf(ChildOfSiblingOfChildOfBase, childOfChild1);

            A.areSame(true, base.attr_base);
            A.areSame(true, child1.attr_childOfBase);
            A.areSame(true, childOfChild1.attr_childOfChildOfBase);
            A.areSame(true, child2.attr_siblingOfChildOfBase);
            A.areSame(true, childOfChild2.attr_childOfSiblingOfChildOfBase);

            A.areSame(0, base.attr);
            A.areSame(1, child1.attr);
            A.areSame(2, childOfChild1.attr);
            A.areSame(3, child2.attr);
            A.areSame(4, childOfChild2.attr);

            A.areSame('Base', base.inherit());
            A.areSame('ChildOfBase', child1.inherit());
            A.areSame('ChildOfChildOfBase', childOfChild1.inherit());
            A.areSame('SiblingOfChildOfBase', child2.inherit());
            A.areSame('ChildOfSiblingOfChildOfBase', childOfChild2.inherit());
        }
    }));
});
