//= compat
//= require <flab/Test>
//= require <flab/test/TestLogger>
//= require <flab/Class>

flab.Test.run(function(T, A) {
    T.Runner.add(new T.Case({

        name: "flab.Test",

        setUp : function () {
            this.data = 1;
        },

        tearDown : function () {
            delete this.data;
        },

        testSetup: function () {
            A.areEqual(1, this.data, "setUp has set something up");
            A.areEqual(1, A._getCount(), "assertion counted");
        },

        testAssertionsMerged: function () {
            A.array.contains(28, [1,2,3,28,4], "array contains");
            A.object.hasKey('asdf', {asdf: 42}, "object hasKey");
            A.date.datesAreEqual(new Date(), new Date(), 'datesAreEqual');
            A.assert(true, 'assert');
        },

        testAssertObjectCan: function () {
            var obj = { testMethodA: function() { return 1; } };
            var cls = function() { this.value = 2; };
            cls.prototype.testMethodB = function() { return this.value; };
            var instance = new cls();
            A.object.can("testMethodA", obj);
            A.object.can("testMethodB", instance);
            A.areEqual(1, obj.testMethodA());
            A.areEqual(2, instance.testMethodB());
        },

        testAssertNothingRaised: function() {
            var v,
                a = 0;
            A.nothingRaised(function() {
                v = 'AB12';
            }, "Nothing is raised");
            A.areEqual('AB12', v, "The code withing the nothingRaised() block was executed");
            try {
                A.nothingRaised(function() {
                    v = 'CD34';
                    throw new Error("Forced exception");
                    v = 'EF56';
                });
                A.fail("This line must not be executed");
            }
            catch (e) {
                A.isObject(e);
                A.areEqual('CD34', v, "The code withing nothingRaised() block was executed");
            }
        },

        testAssertRaised: function() {
            var E1, E2;
            E1 = function() {
                this.name = "E1";
                this.message = "Example exception 1";
            };
            E1.prototype = new Error();
            E2 = flab.Class.extend(Error, {
                name: 'flab.E2',
                constructor: function(msg) {
                    this.message = msg;
                    this.code = 42;
                }
            });

            A.raised(E1, function() { throw new E1(); }, "Catch exception type E1");
            A.raised("E1", function() { throw new E1(); }, "Catch exception name E1");
            A.raised(E2, function() { throw new E2("Test"); }, "Catch exception type E2");
            A.raised("flab.E2", function() { throw new E2("Test"); }, "Catch exception name E2");
            A.raised("A string exception 123", function() { throw "A string exception 123"; });
            A.raised("", function() { throw ""; }, "Empty string");
            A.raised(Error, function() { throw new E1(); });

            var testHasNotFailed = false;
            try {
                A.raised("NotAvailableExceptionName_7287838278", function() {});
                testHasNotFailed = true;
            }
            catch (e1) {
                A.isInstanceOf(YUITest.AssertionError, e1, "e1 is instance of AssertionError");
                A.areEqual('Assert Error', e1.name);
            }
            if (testHasNotFailed) {
                A.fail("The test should have failed");
            }
            testHasNotFailed = false;
            try {
                A.raised("NotAvailableExceptionName_7287838279", function() { throw new Error("FooBar"); });
                testHasNotFailed = true;
            }
            catch (e2) {
                A.isInstanceOf(YUITest.AssertionError, e2, "e2 is instance of AssertionError");
                A.areEqual('ComparisonFailure', e2.name);
            }
            if (testHasNotFailed) {
                A.fail("The test should have failed");
            }
            testHasNotFailed = false;
            try {
                A.raised(E1, function() { throw new Error("This is a base error object"); });
                testHasNotFailed = true;
            }
            catch (e3) {
                A.isInstanceOf(YUITest.AssertionError, e3, "e3 is instance of AssertionError");
                A.areEqual('UnexpectedValue', e3.name);
            }
            if (testHasNotFailed) {
                A.fail("The test should have failed");
            }
        },

        testAssertIsNullOrUndefined: function() {
            var myNull = null;
            var myUndef;
            A.isNullOrUndefined(myNull);
            A.isNullOrUndefined(myUndef);
            A.isNullOrUndefined();
            var testHasNotFailed = false;
            try {
                A.isNullOrUndefined(0);
                testHasNotFailed = true;
            }
            catch (e1) {
                A.isInstanceOf(YUITest.UnexpectedValue, e1);
            }
            try {
                A.isNullOrUndefined(1);
                testHasNotFailed = true;
            }
            catch (e2) {
                A.isInstanceOf(YUITest.UnexpectedValue, e2);
            }
            try {
                A.isNullOrUndefined("");
                testHasNotFailed = true;
            }
            catch (e3) {
                A.isInstanceOf(YUITest.UnexpectedValue, e3);
            }
            try {
                A.isNullOrUndefined(false);
                testHasNotFailed = true;
            }
            catch (e4) {
                A.isInstanceOf(YUITest.UnexpectedValue, e4);
            }
            try {
                A.isNullOrUndefined(true);
                testHasNotFailed = true;
            }
            catch (e5) {
                A.isInstanceOf(YUITest.UnexpectedValue, e5);
            }
            if (testHasNotFailed) {
                A.fail("The test should have failed");
            }
        },

        testAssertIsNotNullOrUndefined: function() {
            var myNull = null;
            var myUndef;
            A.isNotNullOrUndefined(0);
            A.isNotNullOrUndefined(1);
            A.isNotNullOrUndefined("");
            A.isNotNullOrUndefined(false);
            A.isNotNullOrUndefined(true);
            var testHasNotFailed = false;
            try {
                A.isNotNullOrUndefined(myNull);
                testHasNotFailed = true;
            }
            catch (e1) {
                A.isInstanceOf(YUITest.UnexpectedValue, e1);
            }
            try {
                A.isNotNullOrUndefined(myUndef);
                testHasNotFailed = true;
            }
            catch (e2) {
                A.isInstanceOf(YUITest.UnexpectedValue, e2);
            }
            try {
                A.isNotNullOrUndefined();
                testHasNotFailed = true;
            }
            catch (e3) {
                A.isInstanceOf(YUITest.UnexpectedValue, e3);
            }
            if (testHasNotFailed) {
                A.fail("The tests should have failed");
            }
        },

        testAssertMatch: function() {
            var testHasNotFailed = false;
            A.match("foo[A-Z]ba.", "fooXbar");
            try {
                A.match("ba.[A-Z]foo", "doh!");
                testHasNotFailed = true;
            }
            catch (e1) {
                A.isInstanceOf(YUITest.ComparisonFailure, e1);
            }
            if (testHasNotFailed) {
                A.fail("The test should have failed");
            }
        },

        testAssertIsNotInstanceOf: function() {
            var clsA = function() { };
            var clsB = function() { };
            var i1 = new clsA();
            var i2 = new clsA();
            var i3 = new clsB();
            var n = new Number(42); // new Number is required for this test to work

            A.isInstanceOf(clsA, i1);
            A.isInstanceOf(clsA, i2);
            A.isInstanceOf(clsB, i3);
            A.isInstanceOf(Number, n);
            A.isNotInstanceOf(clsB, i1);
            A.isNotInstanceOf(Number, i1);
            A.isNotInstanceOf(clsB, i2);
            A.isNotInstanceOf(clsA, i3);
            A.isNotInstanceOf(Number, i1);

            var testHasNotFailed = false;
            try {
                A.isNotInstanceOf(clsA, i1);
                testHasNotFailed = true;
            }
            catch (e1) {
                A.isInstanceOf(YUITest.ComparisonFailure, e1);
            }
            try {
                A.isNotInstanceOf(clsA, i2);
                testHasNotFailed = true;
            }
            catch (e2) {
                A.isInstanceOf(YUITest.ComparisonFailure, e2);
            }
            try {
                A.isNotInstanceOf(clsB, i3);
                testHasNotFailed = true;
            }
            catch (e3) {
                A.isInstanceOf(YUITest.ComparisonFailure, e3);
            }
            try {
                A.isNotInstanceOf(Number, n);
                testHasNotFailed = true;
            }
            catch (e4) {
                A.isInstanceOf(YUITest.ComparisonFailure, e4);
            }
            if (testHasNotFailed) {
                A.fail("The test should have failed");
            }
        },

        testAssertVisible: function() {
            var mainEl = document.body.appendChild(document.createElement('div'));
            var subEl = mainEl.appendChild(document.createElement('div'));
            subEl.appendChild(document.createTextNode("Test Element for visibility"));
            var hiddenEl = mainEl.appendChild(document.createElement('div'));
            var hiddenTxt = hiddenEl.appendChild(document.createTextNode("Hidden Test Element"));
            // IE7 workaround to set style property
            if (hiddenEl.style && typeof hiddenEl.style.setAttribute === 'object') {
                hiddenEl.style.setAttribute('display', 'none');
            }
            else {
                hiddenEl.setAttribute('style', 'display: none');
            }

            A.isVisible(mainEl);
            A.isVisible(subEl);
            A.isNotVisible(hiddenEl);
            A.isNotVisible(hiddenTxt);

            var testHasNotFailed = false;
            try {
                A.isVisible(hiddenEl);
                testHasNotFailed = true;
            }
            catch (e1) {
                A.isInstanceOf(YUITest.AssertionError, e1);
            }
            try {
                A.isVisible(hiddenTxt);
                testHasNotFailed = true;
            }
            catch (e2) {
                A.isInstanceOf(YUITest.AssertionError, e2);
            }
            try {
                A.isNotVisible(mainEl);
                testHasNotFailed = true;
            }
            catch (e3) {
                A.isInstanceOf(YUITest.AssertionError, e3);
            }
            try {
                A.isNotVisible(subEl);
                testHasNotFailed = true;
            }
            catch (e4) {
                A.isInstanceOf(YUITest.AssertionError, e4);
            }
            if (testHasNotFailed) {
                A.fail("The tests should have failed");
            }
        },

        testIsInRange: function() {
            A.isInRange(0, 2, 1, "0 <= 1 <= 2");
            A.isInRange(0, 1, 1, "0 <= 1 <= 1");
            A.isInRange(0, 1, 0, "0 <= 0 <= 1");
            A.isInRange(0, 1, 0.5, "0 <= 0.5 <= 1");
            A.isInRange(-1, 1, 0, "-1 <= 0 <= 1");
            A.isInRange(-1, 1, -1.0, "-1 <= -1.0 <= 1");
            A.isInRange(-1, 1, 1.0, "-1 <= 1.0 <= 1");
            A.isInRange(501.75, 503.14, 502.762, "501.75 <= 502.762 <= 503.14");
            A.isInRange(-1e6, -1e5, -1.5e5, "-1e6 <= -1.5e5 <= -1e5");
            A.isInRange(0, 0, 0, "0 <= 0 <= 0");
            A.isInRange(1, 1, 1, "1 <= 1 <= 1");
            A.isInRange(-1.3, -1.3, -1.3, "-1.3 <= -1.3 <= -1.3");
            A.isInRange(46782.4782, 46782.4782, 46782.4782, "46782.4782 <= 46782.4782 <= 46782.4782");

            function shouldFail(lower, higher, value) {
                var testHasNotFailed = false;
                try {
                    A.isInRange(lower, higher, value, [lower, '<=', value, '<=', higher].join(' '));
                    testHasNotFailed = true;
                }
                catch (e) {
                    A.isInstanceOf(YUITest.ComparisonFailure, e);
                }
                if (testHasNotFailed) {
                    A.fail([
                        "The test for", lower, '<=', value, '<=', higher, "should have failed"
                    ].join(' '));
                }
            }

            shouldFail(0, 2, -1);
            shouldFail(0, 2, 3);
            shouldFail(-1, 0, -2);
            shouldFail(-1, 1, 1.0001);
            shouldFail(-1, 1, -1.0001);
            shouldFail(500.47, 1047.823, 2001.926);
            shouldFail(-500, 1047, -572);
            shouldFail(0, 0, 0.000001);
            shouldFail(0, 0, -0.000001);
            shouldFail(1, 1, 0.999999);
            shouldFail(1, 1, 1.000001);
            shouldFail(-1.3, -1.3, -1.299999);
            shouldFail(-1.3, -1.3, -1.300001);
            shouldFail(46782.4782, 46782.4782, 0);
            shouldFail(46782.4782, 46782.4782, 1e10);
        },

        testBenchmark: function() {
            var duration,
                numberOfLoops = 7,
                counter = 0;
            duration = A.benchmark(numberOfLoops, function(n) {
                var start = (new Date()),
                    x = 0;
                while (((new Date()) - start) < 1) {
                    x += n;
                }
                ++counter;
            });
            A.areSame(numberOfLoops, counter, "Benchmark was executed three times");
            flab.log.debug("duration:", duration);
            A.assert(duration >= numberOfLoops,
                     "Duration is greater or equal to number of loops time one millisecond");
        }
    }));

    T.Runner.add(new T.Case({
        name: "flab.test.WaitTime",

        setUp : function () { },

        tearDown : function () {
            flab.test.WaitTime.setTimeFactor(1.0);
        },

        testDefaultTimeFactor: function() {
            A.areEqual(1.0, flab.test.WaitTime.getTimeFactor());
            flab.test.WaitTime.setTimeFactor(null);
            A.areEqual(1.0, flab.test.WaitTime.getTimeFactor());
        },

        testSetTimeFactor: function() {
            var me = this,
                f = 3.14;
            A.areNotEqual(f, flab.test.WaitTime.getTimeFactor());
            flab.test.WaitTime.setTimeFactor(f);
            A.areEqual(f, flab.test.WaitTime.getTimeFactor());
        },

        testTimeForTask: function() {
            var me = this;
            flab.test.WaitTime.setTimeFactor(1.0);
            A.areEqual(10, flab.test.WaitTime.timeForTask('aMoment'));
            A.areEqual(500, flab.test.WaitTime.timeForTask('static'));
            A.areEqual(5000, flab.test.WaitTime.timeForTask('complexTask'));

            flab.test.WaitTime.setTimeFactor(2.5);
            A.areEqual(10, flab.test.WaitTime.timeForTask('aMoment'));
            A.areEqual(1250, flab.test.WaitTime.timeForTask('static'));
            A.areEqual(12500, flab.test.WaitTime.timeForTask('complexTask'));

            flab.test.WaitTime.setTimeFactor(0.1);
            A.areEqual(10, flab.test.WaitTime.timeForTask('aMoment'));
            A.areEqual(50, flab.test.WaitTime.timeForTask('static'));
            A.areEqual(500, flab.test.WaitTime.timeForTask('complexTask'));
        },

        testListTasks: function() {
            var me = this,
                list = flab.test.WaitTime.listTasks();
            A.assert(list);
            A.array.containsItems([
                "amoment",
                "render",
                "loadstatic",
                "loadscript",
                "loadimage",
                "loadandrender",
                "image",
                "renderimage",
                "complextask"
            ], list);
        },

        testWaitTimeOnFlabTest: function() {
            var me = this;
            A.object.hasKey('timeForTask', me);
            A.areEqual(1500, me.timeForTask('loadImage'));
        }
    }));

    T.Runner.add(new T.Case({
        name: "YUITest",

        testYUITest: function() {
            var n = 6573;
            A.areEqual(47, 47);
            A.areNotEqual(1, 2);
            A.areNotSame(n, "6573");
            A.areSame(n, n);
            A.isArray([]);
            A.isBoolean(false);
            A.isFalse(false);
            A.isFunction(function() { });
            A.isInstanceOf(Object, {});
            A.isNaN(NaN);
            A.isNotNaN(0);
            A.isNotNull(0);
            A.isNotUndefined({});
            A.isNull(null);
            A.isNumber(1);
            A.isObject({});
            A.isString("");
            A.isTrue(true);
            A.isTypeOf("number", 1);
            A.isUndefined();
            A.throwsError(Error, function() { throw new Error("fail"); });
        },

        testWaitResume: function() {
            var me = this,
                s = 0,
                start = (new Date()).getTime(),
                t;
            setTimeout(function() {
                me.resume(function() {
                    t = (new Date()).getTime();
                    A.areEqual(1, s);
                    A.isInRange(1, 1000, t - start, "Timeout in expected range");
                    s += 3;
                });
            }, 100);
            ++s;
            me.wait(5000);
            t = (new Date()).getTime();
            A.areEqual(1, s);
            A.isInRange(0, 5, t - start, "No delay");
        }
    }));
});
