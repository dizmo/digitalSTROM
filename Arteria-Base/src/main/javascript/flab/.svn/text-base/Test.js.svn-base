//= compat
//= require <flab/Namespace>
//= require <flab/Utils>
//= require <flab/test/WaitTime>

flab.Namespace.create('flab');

(function(Y) {
    "use strict";

    /**
     * Test helper object for futureLAB unit tests. It is built around
     * <a href="http://yuilibrary.com/yui/docs/test/">YUI 3: Test</a>.
     *
     * Usage example:
     * <pre><code>
     *  //= require &lt;flab/Test&gt;
     *  //= require &lt;flab/test/TestLogger&gt;
     *
     *  flab.Test.run(function(T, A) {
     *      T.Runner.add(new T.Case({
     *
     *          name: "My Test",
     *
     *          testFoo: function () {
     *              A.areEqual(1, 1, "1 is 1");
     *          }
     *      }));
     *  });
     * </pre></code>
     *
     * The <code>A</code> object that gets passed to your closure provides all the assertions from
     * <a href="http://yuilibrary.com/yui/docs/api/classes/Test.Assert.html"><code>Assert</code></a>,
     * <code>Y.assert</code> and also the following references to assertion objects from YUI test:
     * <ul>
     *   <li><code>array</code>:
     *     <a href="http://yuilibrary.com/yui/docs/api/classes/Test.ArrayAssert.html">
     *       <code>ArrayAssert</code>
     *     </a>
     *   </li>
     *   <li><code>object</code>:
     *     <a href="http://yuilibrary.com/yui/docs/api/classes/Test.ObjectAssert.html">
     *       <code>ObjectAssert</code>
     *     </a>
     *   </li>
     *   <li><code>date</code>:
     *     <a href="http://yuilibrary.com/yui/docs/api/classes/Test.DateAssert.html">
     *       <code>DateAssert</code>
     *     </a>
     *   </li>
     * </ul>
     *
     * @class flab.Test
     * @static
     */
    flab.Test = (function() {
        var T                   = Y,
            A                   = Y.Assert;

        // Add timeForTask method to YUITest.TestCase
        T.TestCase.prototype.timeForTask = flab.test.WaitTime.timeForTask;

        // Enhance the Assert object
        A.object = Y.ObjectAssert;
        A.array  = Y.ArrayAssert;
        A.date   = Y.DateAssert;
        A.assert = Y.assert;

        /**
         * @method assert
         * Assert that a condition is true. Use this only if no better
         * assertion function match your needs.
         * @param {Boolean} Condition that must be true
         * @param {String} message (Optional) The message to display if the assertion fails.
         * @memberOf flab.Test
         * @static
         */
        A.assert = (typeof Y.assert === 'function') ? Y.assert : function (actual, message) {
                Y.Assert._increment();
                if (!actual) {
                    throw new Y.UnexpectedValue(
                        Y.Assert._formatMessage(message, "Assertion should evaluate to true."),
                        actual
                    );
                }
        };

        /**
         * @method object.can
         * Asserts that an objects provides a method (function) of specified name)
         * @param {String} method Name of the method the object is expected to provide.
         * @param {Object} obj The object that is expected to have the method
         * @memberOf flab.Test
         * @static
         **/
        A.object.can = function(method, obj, message) {
            Y.Assert._increment();
            if (!(method in obj && (typeof obj[method] === 'function'))) {
                throw new Y.Assert.ComparisonFailure(
                    Y.Assert._formatMessage(message, "Object has no such method"),
                    method, (typeof obj[method])
                );
            }
        };

        /**
         * @method nothingRaised
         * Asserts that no exception is thrown within the function func.
         * @param {Function} func A function containing the code to execute without exception
         * @param {String} message (Optional) The message to display if the assertion fails.
         * @memberOf flab.Test
         * @static
         **/
        A.nothingRaised = function(func, message) {
            Y.Assert._increment();
            try {
                func();
            }
            catch (e) {
                /* if both a stacktrace and the logger is available, log a stack trace
                 * note that we don't want an explicit dependency to flab.log here */
                if (e && e.stack && flab && flab.log && flab.log.info) {
                    flab.log.info("Assert.nothingRaised(): Stacktrace:\n" + e.stack);
                }
                throw new Y.UnexpectedValue(
                    Y.Assert._formatMessage(message, "An exception was thrown when nothing was expected."),
                    e
                );
            }
        };

        /**
         * Asserts that a specific exception is thrown.
         * @param {Object|String} exceptionType class or string of the exception expected to be thrown
         * @param {Function} func A function containing the code to throw the exception
         * @param {String} message (Optional) The message to display if the assertion fails.
         * @method raised
         * @memberOf flab.Test
         * @static
         **/
        A.raised = function(exceptionType, func, message) {
            var nothingRaised = false;
            Y.Assert._increment();
            try {
                func();
                nothingRaised = true;
            }
            catch (e) {
                if (typeof exceptionType === 'string') {
                    if (typeof e !== 'string') {
                        if (e.name !== exceptionType) {
                            throw new Y.ComparisonFailure(
                                Y.Assert._formatMessage(message, "The expected exception name was not raised"),
                                exceptionType, e
                            );
                        }
                    }
                    else if (exceptionType !== e) {
                        throw new Y.ComparisonFailure(
                            Y.Assert._formatMessage(message, "The expected string exception was not raised"),
                            exceptionType, e
                        );
                    }
                }
                else if (!(e instanceof exceptionType)) {
                    throw new Y.UnexpectedValue(
                        Y.Assert._formatMessage(message, "The expected exception was not raised"),
                        exceptionType, e
                    );
                }
                if (nothingRaised) {
                    throw new Y.AssertionError(
                        Y.Assert._formatMessage(message, "Strange: code after exception is still executed")
                    );
                }
                return;
            }
            throw new Y.AssertionError(Y.Assert._formatMessage(message, "Exception expected but none was raised."));
        };

        /**
         * @method isNullOrUndefined
         * Asserts that a value is either not defined or null.
         * @param {Object} actual The value to test.
         * @param {String} message (Optional) The message to display if the assertion fails.
         * @memberOf flab.Test
         * @static
         **/
        A.isNullOrUndefined = function(actual, message) {
            Y.Assert._increment();
            if ((actual !== null) && (typeof actual !== 'undefined')) {
                throw new Y.UnexpectedValue(
                    Y.Assert._formatMessage(message, "Value is whether null nor undefined"),
                    actual
                );
            }
        };

        /**
         * @method isNotNullOrUndefined
         * Asserts that a value is neither undefined nor null.
         * @param {Object} actual The value to test.
         * @param {String} message (Optional) The message to display if the assertion fails.
         * @memberOf flab.Test
         * @static
         **/
        A.isNotNullOrUndefined = function(actual, message) {
            Y.Assert._increment();
            if ((actual === null) || (typeof actual === 'undefined')) {
                throw new Y.UnexpectedValue(
                    Y.Assert._formatMessage(message, "Value is null or undefined"), actual
                );
            }
        };

        /**
         * @method match
         * Asserts that the regular expression expected matches the actual value.
         * @param {String} Regular expression for the check
         * @param {String} actual The value to test with the expression.
         * @param {String} message (Optional) The message to display if the assertion fails.
         * @memberOf flab.Test
         * @static
         **/
        A.match = function(expected, actual, message) {
            Y.Assert._increment();
            if (!(new RegExp(expected)).exec(actual)) {
                throw new Y.ComparisonFailure(
                    Y.Assert._formatMessage(message, "RegExp did not match"), expected, actual
                );
            }
        };

        /**
         * @method isNotInstanceOf
         * Asserts that an instance is not a class or subclass of a expected type.
         * @param {Class} expected The expected class type.
         * @param {Object} actual The value to test.
         * @param {String} message (Optional) The message to display if the assertion fails.
         * @memberOf flab.Test
         * @static
         **/
        A.isNotInstanceOf = function(expected, actual, message) {
            Y.Assert._increment();
            if (actual instanceof expected) {
                throw new Y.ComparisonFailure(
                    Y.Assert._formatMessage(message, "Value is an instance of unexpected type."),
                    expected, actual
                );
            }
        };

        /**
         * Helper function for {@link isVisible} and {@link isNotVisible} assertions
         * @param {Dom|String} element DOM element or id of an element
         * @return {Boolean} Whether the element has the style display: none (false) or not (true)
         * @private
         **/
        function isVisible(element) {
            if (typeof element === 'string') {
                element = document.getElementById(element);
            }
            if (element === null) {
                return false;
            }
            if (element.style && element.style.display == 'none') {
                return false;
            }
            if (!element.parentNode) {
                return true;
            }
            return isVisible.call(this, element.parentNode);
        }

        /**
         * @method isVisible
         * Asserts that a DOM element has not the CSS style display: none
         * @param {Dom|String} element The DOM element to test or an id of a DOM element
         * @param {String} message (Optional) The message to display if the assertion fails.
         * @memberOf flab.Test
         * @obsolete
         * @static
         **/
        A.isVisible = function(element, message) {
            Y.Assert._increment();
            if (!isVisible(element)) {
                throw new Y.AssertionError(Y.Assert._formatMessage(message, "Element is not visible"));
            }
        };

        /**
         * @method isNotVisible
         * Asserts that a DOM element has the CSS style display: none
         * @param {Dom|String} element The DOM element to test of an id of a DOM element
         * @param {String} message (Optional) The message to display if the assertion fails.
         * @memberOf flab.Test
         * @obsolete
         * @static
         **/
        A.isNotVisible = function(element, message) {
            Y.Assert._increment();
            if (isVisible(element)) {
                throw new Y.AssertionError(Y.Assert._formatMessage(message, "Element is visible"));
            }
        };

        /**
         * @method isInRange
         * Assert that a value is between a lower and a higher bound.
         * @param {Number} expectedLower Expected lower value
         * @param {Number} expectedHigher Expected higher value
         * @memberOf flab.Test
         * @obsolete
         * @static
         */
        A.isInRange = function(expectedLower, expectedHigher, actual, message) {
            Y.Assert._increment();
            var lower = expectedLower,
                higher = expectedHigher;
            if (typeof expectedLower === 'array') {
                lower = arguments[0];
                higher = arguments[1];
            }
            if (actual < lower) {
                throw new Y.ComparisonFailure(
                    Y.Assert._formatMessage(message, "Value is smaller than the lower limit"),
                    lower, actual
                );
            }
            if (actual > higher) {
                throw new Y.ComparisonFailure(
                    Y.Assert._formatMessage(message, "Value is bigger than the higher limit"),
                    higher, actual
                );
            }
        };

        /**
         * @method benchmark
         * Helper to benchmark operations.
         * @param {Number} times of time the operation is executed
         * @param {Function} operation A function to execute. Get the number of iterations left.
         * @return Time in milliseconds the execution of times operations took.
         * @memberOf flab.Test
         * @static
         */
        A.benchmark = function(times, operation) {
            var begin = new Date(),
                duration,
                n;
            for (n = times || 1; n > 0; n--) {
                operation(n);
            }
            duration = ((new Date()) - begin);
            return duration;
        };

        function _id(name) {
            return document.getElementById(name);
        }

        function _setContent(el, text) {
            if (el.hasChildNodes()) {
                while (el.firstChild) {
                    el.removeChild(el.firstChild);
                }
            }
            el.appendChild(document.createTextNode(text));
        }

        function _create(type, attributes, content) {
            var a,
                e = document.createElement(type);
            if (content) {
                e.appendChild(document.createTextNode(content));
            }
            if (attributes) {
                for (a in attributes) {
                    if (attributes.hasOwnProperty(a)) {
                        e.setAttribute(a, attributes[a]);
                    }
                }
            }
            return e;
        }

        function _addText(container, txt) {
            var parts = (txt || '').split(/\n/),
                i;
            for (i = 0; i < parts.length; ++i) {
                if (i > 0) {
                    container.appendChild(document.createElement('br'));
                }
                container.appendChild(document.createTextNode(parts[i]));
            }
        }

        var testlog = _id('testlog');

        // Setup test log table
        var summary = _create('div', { 'class': 'logsummary' });
        testlog.appendChild(summary);

        // Setup log summary
        var testtable = _create('table', { 'class': 'logtable' });
        testlog.appendChild(testtable);
        var thead = _create('thead');
        var tr = _create('tr');
        thead.appendChild(tr);
        tr.appendChild(_create('th', null, 'Status'));
        tr.appendChild(_create('th', null, 'Test'));
        tr.appendChild(_create('th', null, 'Message'));
        testtable.appendChild(thead);

        var testlogbody = _create('tbody');
        testtable.appendChild(testlogbody);

        var _totalAssertions = 0;

        // Setup event listeners
        var testEventHandler = function(args) {
            var cls,
                status,
                currentResultRow,
                td,
                span,
                msg = A._getCount() + ' assertions';

            // keep track of total assertions
            _totalAssertions += A._getCount();

            if (args.type === 'pass') {
                status = 'passed';
            }
            else if (args.type === 'fail') {
                status = 'failed';
                msg    = msg + '\n\n' + args.error.getMessage();
            }
            else if (args.type === 'ignore') {
                status = 'ignored';
            }

            currentResultRow = _create('tr', { 'class': status });

            td = _create('td');
            span = _create('span', { 'class': 'test-name' }, args.testName);
            td.appendChild(span);
            if (args.testCase.name) {
                span = _create('span', { 'class': 'testcase-name' }, args.testCase.name);
                td.appendChild(span);
            }
            currentResultRow.appendChild(td);

            td = _create('td', null, status);
            currentResultRow.appendChild(td);

            td = _create('td');
            _addText(td, msg);
            currentResultRow.appendChild(td);

            testlogbody.appendChild(currentResultRow);
        };

        T.TestRunner.subscribe(Y.TestRunner.TEST_PASS_EVENT, testEventHandler);
        T.TestRunner.subscribe(Y.TestRunner.TEST_FAIL_EVENT,  testEventHandler);
        T.TestRunner.subscribe(Y.TestRunner.TEST_IGNORE_EVENT, testEventHandler);

        T.TestRunner.subscribe(Y.TestRunner.COMPLETE_EVENT, function() {
            var results = T.TestRunner.getResults();

            /*logger.log(results);
            logger.log(T.TestRunner.getResults(T.TestFormat.XML));
            logger.log(T.TestRunner.getResults(T.TestFormat.JUnitXML));*/

            _setContent(summary,
                results.total + ' tests, '
                + _totalAssertions + ' assertions, '
                + results.failed + ' failures, '
                + '0 errors, '
                + results.duration + 'ms'
            );

            var params = flab.Utils.getUrlParams();
            var resultsUrl = params.resultsURL;
            if (resultsUrl) {
                // Report test results if a resultsURL was passed
                var reporter = new T.Reporter(resultsUrl, T.TestFormat.JUnitXML);
                reporter.addField('tests',      results.total);
                reporter.addField('assertions', _totalAssertions);
                reporter.addField('failures',   results.failed);
                reporter.addField('errors',     0);
                var coverageReport = T.TestRunner.getCoverage(function(coverage) {
                    return T.CoverageFormat.JSON(coverage);
                });
                reporter.addField('coverage',   coverageReport);
                reporter.report(results);
            }
        });

        return /** @lends flab.Test */ {

            /**
             * Run the tests that get defined in the <code>test</code> closure. The closure
             * gets passed the <code>Y.Test</code> object and an extended version of the
             * <code>Y.Assert</code> object which can be used to create and register tests.
             * The tests are then executed and the results reported.
             * @param {Function} test The closure which should be executed to create the test
             *                        cases.
             */
            run: function(test) {
                var self = this;

                _setContent(summary, 'Running...');

                test({
                    Runner: T.TestRunner,
                    Case: T.TestCase
                }, A);

                T.TestRunner.run();
            }
        };
    }());
}(YUITest));

/*
    UnitTestJS to YUITest translations:

    assertEnumEqual             -> A.array.itemsAreEqual
    assertEqual                 -> A.areEqual
    assertHashEqual             -> A.object.hasKeys
    assertIdentical             -> A.areSame
    assertInstanceOf            -> A.isInstanceOf
    assertMatch                 -> match
    assertNotEqual              -> A.areNotEqual
    assertNotInstanceOf         -> isNotInstanceOf
    assertNotNull               -> A.isNotNull
    assertNotNullOrUndefined    -> isNotNullOrUndefined
    assertNotUndefined          -> A.isNotUndefined
    assertNotVisible            -> isNotVisible
    assertNothingRaised         -> nothingRaised
    assertNull                  -> A.isNull
    assertRaise                 -> raised
    assertRespondsTo            -> A.object.can
    assertUndefined             -> A.isUndefined
    benchmark                   -> A.benchmark
*/

