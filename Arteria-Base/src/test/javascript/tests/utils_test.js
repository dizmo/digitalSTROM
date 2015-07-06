//= compat
//= require <flab/Test>
//= require <flab/test/TestLogger>
//= require <flab/Utils>

flab.Test.run(function(T, A) {
	T.Runner.add(new T.Case({

		name: "flab.Utils",

		setUp : function () {

		},

		tearDown : function () {

		},

		testBbox: function() {
			var self = this;

			var bbox = flab.Utils.bbox(1024, 1024, 1024);
			A.areEqual(bbox.width,  1024, 'width ok');
			A.areEqual(bbox.height, 1024, 'height ok');

			bbox = flab.Utils.bbox(1024, 1024, {width: 1024, height: 1024});
			A.areEqual(bbox.width,  1024, 'width ok');
			A.areEqual(bbox.height, 1024, 'height ok');

			bbox = flab.Utils.bbox(400, 200, {width: 200, height: 200});
			A.areEqual(bbox.width,  200, 'width ok');
			A.areEqual(bbox.height, 100, 'height ok');

			bbox = flab.Utils.bbox(200, 400, {width: 100, height: 50});
			A.areEqual(bbox.width,  25, 'width ok');
			A.areEqual(bbox.height, 50, 'height ok');
		},

		testShortString: function() {
			var self = this;

			var str = 'Bühne.jpg';
			A.areEqual('Bü...', flab.Utils.shortString(str, 5), 'string ok');

			A.areEqual('', flab.Utils.shortString(null, 5), 'null results in empty string');
			A.areEqual('', flab.Utils.shortString(undefined, 5), 'undefined results in empty string');
			A.areEqual('', flab.Utils.shortString({}, 5), 'object results in empty string');
		},

		testClipString: function() {
			var self = this;

			var str = 'Bühne.jpg';
			A.areEqual('Bü...jpg', flab.Utils.clipString(str, 8), 'clip ok');

			// Markup (user should know what she does, so no special handling)
			A.areEqual('<h...h1>', flab.Utils.clipString('<h1>foobar</h1>', 8), 'clip html ok');
			A.areEqual('&l...gt;', flab.Utils.clipString('&lt;h1&gt;foobar&lt;/h1&gt;', 8), 'clip entity ok');
		},

		testUcFirst: function() {
			var self = this;

			A.areEqual('', flab.Utils.ucfirst(''), 'empty string ok');
			A.areEqual('Asdf', flab.Utils.ucfirst('asdf'), 'string ok');
			A.areEqual('Asdf', flab.Utils.ucfirst('Asdf'), 'string not changed');
		},

		testDecodeEntities: function() {
			var self = this;

			var str = 'B&#xfc;hne.jpg';
			A.areEqual('Bühne.jpg', flab.Utils.decodeEntities(str), 'entity decode ok');
		},

		testGetUrlParams: function() {
			var self = this;

			var testdata = [
				{
					url:    "http://www.example.com/foo/bar.php",
					result: {

					}
				},
				{
					url:    "http://www.example.com/foo/bar.php?asdf=foo&qwer=bar",
					result: {
						asdf: 'foo',
						qwer: 'bar'
					}
				},
				{
					url:    "http://www.example.com/foo/bar.php?asdf=foo&qwer=bar&foo",
					result: {
						asdf: 'foo',
						qwer: 'bar',
						foo:  true
					}
				}
			];

			for (var i = 0, l = testdata.length; i < l; ++i) {
				var data = testdata[i];
				var result = flab.Utils.getUrlParams(data.url);
				for (var key in data.result ) {
					A.areEqual(result[key], data.result[key], key + ' ok');
				}
			}

			// Array values
			testdata = {
				url:    "http://www.example.com/foo/bar.php?asdf=foo&qwer=bar&qwer=baz",
				result: {
					asdf: 'foo',
					qwer: ['bar', 'baz']
				}
			};
			var result = flab.Utils.getUrlParams(testdata.url);
			A.areEqual(result.asdf, testdata.result.asdf, 'asdf ok');
			A.array.itemsAreEqual(result.qwer, testdata.result.qwer, 'qwer ok');
		},

		testUnescapeMarkup: function() {
			var self = this;

			A.areEqual(
				'<h1>foo & bar</h1>',
				flab.Utils.unescapeMarkup('&lt;h1&gt;foo &amp; bar&lt;/h1&gt;'),
				'unescape ok'
			);

			A.areEqual(
				'',
				flab.Utils.unescapeMarkup(null),
				'unescaping null yields empty string'
			);

			A.areEqual(
				'',
				flab.Utils.unescapeMarkup(undefined),
				'unescaping undefined yields empty string'
			);
		},

		testEscapeMarkup: function() {
			var self = this;

			A.areEqual('&lt;h1&gt;foo &amp; bar&lt;/h1&gt;',
					   flab.Utils.escapeMarkup('<h1>foo & bar</h1>'),
					   'escape ok');
		},

		testEscapeCombinations: function() {
			var self = this;

			var str = '&lt;h1&gt;foo &amp; bar&lt;/h1&gt;';
			A.areEqual(str,
					   flab.Utils.escapeMarkup(flab.Utils.unescapeMarkup(str)),
					   'unescape escape ok');
			A.areEqual(str,
					   flab.Utils.escapeMarkup(flab.Utils.unescapeMarkup('<h1>foo & bar</h1>')),
					   'unescape escape ok');

			str = '<h1>foo & bar</h1>';
			A.areEqual(str,
					   flab.Utils.unescapeMarkup(flab.Utils.escapeMarkup(str)),
					   'escape unescape ok');
		},

		testArrayToHash: function() {
			var self = this;

			var testdata = [
				{
					input:    [],
					expected: {}
				}, {
					input:    ['a', 2, 'b', 3, 'c', 4],
					expected: {
						a: 2,
						b: 3,
						c: 4
					}
				}, {
					input:    ['a', 42],
					expected: {
						a: 42
					}
				}, {
					input: [1, 2, 3],
					expected: {
						1: 2,
						3: null
					}
				}
			];

			for (var i = 0; i < testdata.length; i++) {
				var data   = testdata[i];
				var result = flab.Utils.arrayToHash(data.input);
				var key;
				for (key in data.expected) {
					A.areSame(
						data.expected[key],
						result[key],
						key + ' ok'
					);
				}
				for (key in result) {
					A.areSame(
						true,
						key in data.expected,
						'key ' + key + ' contained in expected result'
					);
				}
			}
		},

		testSetDefaults: function() {
			var me = this,
				original,
				defaults,
				original_copy,
				defaults_copy,
				original_keys,
				copy_keys,
				result;

			function _clone(o) {
				var r = {},
					n;
				for (n in o) {
					r[n] = o[n];
				}
				return r;
			}

			function _keys(o, sorted) {
				var r = [],
					n;
				for (n in o) {
					r.push(n);
				}
				if (sorted) {
					r.sort();
				}
				return r;
			}

			original = {
				a: 11,
				b: 22,
				c: 33
			};
			defaults = {
				a: 23,
				x: 42
			};

			original_copy = _clone(original);
			defaults_copy = _clone(defaults);
			result = flab.Utils.setDefaults(original_copy, defaults_copy);
			// result is as expected
			A.isObject(result);
			A.areSame(result.a, original.a, "field a is same");
			A.areSame(result.b, original.b, "field b is same");
			A.areSame(result.c, original.c, "field c is same");
			A.areSame(result.x, defaults.x, "field x is same");
			// copy of original isn't modified
			original_keys = _keys(original, true);
			copy_keys = _keys(original_copy, true);
			A.areEqual(original_keys.length, copy_keys.length, "original length is equal");
			A.array.itemsAreEqual(original_keys, copy_keys);
			// copy of defaults isn't modified
			original_keys = _keys(defaults, true);
			copy_keys = _keys(defaults_copy, true);
			A.areEqual(original_keys.length, copy_keys.length, "defaults length is equal");
			A.array.itemsAreEqual(original_keys, copy_keys);

			// test case where nothing is defined
			result = flab.Utils.setDefaults();
			A.isObject(result);
			A.areEqual(0, _keys(result).length, "object is empty");

			// test case where object is not defined
			result = flab.Utils.setDefaults(undefined, defaults_copy);
			A.isObject(result);
			original_keys = _keys(defaults_copy);
			copy_keys = _keys(result);
			A.areEqual(original_keys.length, copy_keys.length, "first undefined length is equal");
			A.array.itemsAreEqual(original_keys, copy_keys);

			// test case where defaults is not defined
			result = flab.Utils.setDefaults(original_copy);
			A.isObject(result);
			original_keys = _keys(original);
			copy_keys = _keys(result);
			A.areEqual(original_keys.length, copy_keys.length, "defaults undefined length is equal");
			A.array.itemsAreEqual(original_keys, copy_keys);
		},

		testCharCodeList: function() {
			// following are conversions from real code
			A.array.itemsAreEqual([13], flab.Utils.charCodeList([13]));
			A.array.itemsAreEqual([27], flab.Utils.charCodeList([27]));
			A.array.itemsAreEqual([32], flab.Utils.charCodeList([32]));
			A.array.itemsAreEqual([8], flab.Utils.charCodeList([8]));
			A.array.itemsAreEqual([65, 76], flab.Utils.charCodeList("al"));
			A.array.itemsAreEqual([67, 190], flab.Utils.charCodeList("c."));
			A.array.itemsAreEqual([68, 74], flab.Utils.charCodeList("dj"));
			A.array.itemsAreEqual([78], flab.Utils.charCodeList("n"));
			A.array.itemsAreEqual([83, 0, 222, 242, 246], flab.Utils.charCodeList("sö"));
			A.array.itemsAreEqual([86, 109, 189], flab.Utils.charCodeList("v-"));
			A.array.itemsAreEqual([88, 188], flab.Utils.charCodeList("x,"));

			// the interface allows also for this, check corner cases
			A.array.itemsAreEqual([], flab.Utils.charCodeList([]));
			A.array.itemsAreEqual([], flab.Utils.charCodeList(""));
			A.array.itemsAreEqual([65, 65], flab.Utils.charCodeList(['A', 'A']));
			A.array.itemsAreEqual([97, 97], flab.Utils.charCodeList(['a', 'a']));
			A.array.itemsAreEqual([57, 190, 56, 49, 77, 47, 83, 94, 50],
								  flab.Utils.charCodeList("9.81m/s^2"));

			// now we do some exploiting the implementation, this is what the code
			// do atm but it's likely not intended this way
			A.array.itemsAreEqual([196], flab.Utils.charCodeList("\xc4"));
			A.array.itemsAreEqual([0, 222, 242, 246], flab.Utils.charCodeList("ö"));
			A.array.itemsAreEqual([0, 222, 242, 246], flab.Utils.charCodeList("Ö"));
			A.array.itemsAreEqual([196], flab.Utils.charCodeList("ä"));
			A.array.itemsAreEqual([196], flab.Utils.charCodeList("Ä"));
			A.array.itemsAreEqual([220], flab.Utils.charCodeList("ü"));
			A.array.itemsAreEqual([220], flab.Utils.charCodeList("Ü"));
			A.array.itemsAreEqual([0, 222, 242, 246], flab.Utils.charCodeList(["Ö"]));
			A.array.itemsAreEqual([246], flab.Utils.charCodeList(["ö"]));
			A.array.itemsAreEqual([196], flab.Utils.charCodeList(["Ä"]));
			A.array.itemsAreEqual([228], flab.Utils.charCodeList(["ä"]));
			A.isTrue(isNaN(flab.Utils.charCodeList([""])));
		},

		testIsArray: function() {
			A.isTrue(flab.Utils.isArray([]));
			A.isFalse(flab.Utils.isArray());
			A.isFalse(flab.Utils.isArray({}));
			A.isFalse(flab.Utils.isArray(1));
			A.isFalse(flab.Utils.isArray(""));
			A.isFalse(flab.Utils.isArray(true));
			A.isFalse(flab.Utils.isArray(false));
			A.isFalse(flab.Utils.isArray(null));
			A.isFalse(flab.Utils.isArray(function(){}));
			A.isTrue(flab.Utils.isArray([0, 1, 2]));
			A.isTrue(flab.Utils.isArray([undefined]));
			A.isTrue(flab.Utils.isArray([]));
		},

		testIsFunction: function() {
			A.isTrue(flab.Utils.isFunction(function(){}), "A function is-a function");
			A.isFalse(flab.Utils.isFunction(), "undefined is-not-a function");
			A.isFalse(flab.Utils.isFunction({}), "Object is-not-a function");
			A.isFalse(flab.Utils.isFunction(1), "Number is-not-a function");
			A.isFalse(flab.Utils.isFunction(""), "String is-not-a function");
			A.isFalse(flab.Utils.isFunction(true), "'true' is-not-a function");
			A.isFalse(flab.Utils.isFunction(false), "'false' is-not-a function");
			A.isFalse(flab.Utils.isFunction(null), "'null' is-not-a function");
			/* We like to check for buildtin functions, but - as usual - IE has
			 * a different understanding of buildin function's type and thinks they
			 * are objects. It's not possible to test this in simple way and instead
			 * to make the test more complex we'll simply skip it.
			 *
			 * A.isTrue(flab.Utils.isFunction(window.close),
			 *        "window.close is-a function");
			 * A.isTrue(flab.Utils.isFunction(document.body.getAttribute),
			 *        "document.body.getAttribute is-a function");
			 */
		},

		testFlatten: function() {
			var tests,
				test,
				idx,
				len,
				result,
				emptyObj = {},
				nonEmptyObj = {a: [23, 42]};
			tests = [
				{
					name: "empty array",
					input: [],
					result: []
				},
				{
					name: "two empty nested arrays",
					input: [[]],
					result: []
				},
				{
					name: "three empty nested arrays",
					input: [[[]]],
					result: []
				},
				{
					name: "flat array with a single entry",
					input: ["alone"],
					result: ["alone"]
				},
				{
					name: "flat array with three entries",
					input: [1, 2, 3],
					result: [1, 2, 3]
				},
				{
					name: "recursive incrementing nested arrays",
					input: [1, [ 2 , [ 3, [ 4 ]]]],
					result: [1, 2, 3, 4]
				},
				{
					name: "recursive decrementing nested arrays",
					input: [[[[ 1 ], 2], 3], 4],
					result: [1, 2, 3, 4]
				},
				{
					name: "one level nested array with multiple entries",
					input: [[1, 2], [3], [4, 5, 6]],
					result: [1, 2, 3, 4, 5, 6]
				},
				{
					name: "flat array with complex types",
					input: [1, nonEmptyObj, "hugo", "", undefined, null, emptyObj, true],
					result: [1, nonEmptyObj, "hugo", "", undefined, null, emptyObj, true]
				},
				{
					name: "nested array with complex types",
					input: [[1, nonEmptyObj], ["hugo", ""], [undefined], [null]],
					result: [1, nonEmptyObj, "hugo", "", undefined, null]
				}
			];
			for (idx = 0, len = tests.length; idx < len; ++idx) {
				test = tests[idx];
				result = flab.Utils.flatten(test.input);
				A.areEqual(result.length, test.result.length, "" + idx + ". test length " + test.name);
				A.array.itemsAreEqual(test.result, result, "" + idx + ". test equal " + test.name);
			}
		},

		testMap: function() {
			var data = [11, 21, 31, 41, 51, 61, 71],
				indexes = [0, 1, 2, 3, 4, 5, 6],
				ok,
				a,
				r;
			a = data.slice(0);
			r = flab.Utils.map(a, function(v) {
				return v;
			});
			A.areEqual(data.length, a.length, "Source array isn't modified");
			A.array.itemsAreEqual(data, a, "Source array isn't modified");
			A.areEqual(data.length, r.length, "Result array is copy of source");
			A.array.itemsAreEqual(data, r, "Result array is copy of source");

			r = flab.Utils.map(a, function(v, idx) {
				return idx;
			});
			A.areEqual(indexes.length, r.length, "Result array contains same amount of indexes");
			A.array.itemsAreEqual(indexes, r, "Result array contains the smae indexes");

			ok = true;
			r = flab.Utils.map(a, function(v, idx, o) {
				if (v != (idx * 10 + 11)) {
					ok = false;
				}
				if (a !== o) {
					ok = false;
				}
				return v;
			});
			A.isTrue(ok, 'Parameters match specification');

			A.nothingRaised(function() {
				ok = true;
				r = flab.Utils.map([], function(v) {
					ok = false;
				});
			});
			A.isTrue(ok, "Callback was called at least once with an empty array");
		},

		testFoldl: function() {
			var self = this;

			A.areEqual(0, flab.Utils.foldl(function() {}, 0, []), 'identity returned');

			A.areEqual(2, flab.Utils.foldl(function(a, b) { return a / b; }, 64, [4,2,4]), 'folded');

			A.areEqual(true, flab.Utils.foldl(function(a, b) { return a && b; }, true, [true, true]), 'folded');
			A.areEqual(false, flab.Utils.foldl(function(a, b) { return a && b; }, true, [true, false]), 'folded');
		},

		testFilter: function() {
			var self = this;

			A.array.itemsAreEqual([], flab.Utils.filter([], function() {return true;}), 'empty input');
			A.array.itemsAreEqual([1], flab.Utils.filter([1], function() {return true;}), 'non-empty input, true');
			A.array.itemsAreEqual([], flab.Utils.filter([1], function() {return false;}), 'non-empty input, false');
			A.array.itemsAreEqual([2], flab.Utils.filter([1, 2], function(e) {return (e / 2) === 1;}), 'non-empty input, actual filtering');
		},

		testAll: function() {
			var self = this;

			A.areEqual(undefined, flab.Utils.all(function() {}, []), 'empty list');
			A.isTrue(flab.Utils.all(function(item) {return item;}, [true]), 'empty list');
			A.isFalse(flab.Utils.all(function(item) {return item;}, [false]), 'empty list');
			A.isTrue(flab.Utils.all(function(item) {return item;}, [true, true]), 'empty list');
			A.isFalse(flab.Utils.all(function(item) {return item;}, [false, true]), 'empty list');
			A.isFalse(flab.Utils.all(function(item) {return item;}, [false, false]), 'empty list');
		},
		
		testEmptyAndPrimitivCloning: function() {
			var self = this;
			
			// test primitives, empty arrays ,objects and function
			A.areEqual(1, flab.Utils.clone(1), 'Number is cloned correctly');
			A.areEqual('test', flab.Utils.clone('test'), 'String is cloned correctly');
			A.areEqual(true, flab.Utils.clone(true), 'Boolean is cloned correctly');
			A.areEqual(undefined, flab.Utils.clone(undefined), 'Undefined is cloned correctly');
			A.areEqual(null, flab.Utils.clone(null), 'Null is cloned correctly');
			
			A.areEqual(
				'[object Array]', Object.prototype.toString.call(flab.Utils.clone([])), 
				'Empty array is cloned correctly'
			);
			A.areEqual(
				[].length, flab.Utils.clone([]).length, 
				'Empty array is cloned correctly'
			);
			A.areEqual(
				'[object Object]', Object.prototype.toString.call(flab.Utils.clone({})), 
				'Empty object is cloned correctly'
			);
			A.areEqual(
				'[object Function]', Object.prototype.toString.call(flab.Utils.clone(new Function() )),
				'Function is cloned correctly'
			);
		},
		
		testDeepCloning: function() {
			var self = this;
			
			var arr = [ [ 1, 2, 3 ], [ 5, 6, 7, 8 ], 9 ],
			    obj = {
			       success: true,
			       message: 'test message',
			       data: [{
			         node: { id : 1} 
			       }]
			    },
			    clArr = flab.Utils.clone(arr),
			    clObj = flab.Utils.clone(obj);
			
			A.isTrue(
				Object.prototype.toString.call(arr) == Object.prototype.toString.call(clArr), 
				'clone and origin array have same prototype'
			);
			A.array.itemsAreSame(
				flab.Utils.flatten(arr), flab.Utils.flatten(clArr), 
				'clone and origin array have same items'
			);
			
			A.isTrue(
				Object.prototype.toString.call(obj) == Object.prototype.toString.call(clObj), 
				'clone and origin objects have same prototype'
			);
			A.object.hasKeys(['success', 'message', 'data'], clObj, 'cloned object has the main properties');
			A.areEqual(true, clObj['success'], "cloned object has correct success value");
			A.areEqual('test message', clObj['message'], "cloned object has correct message value");
			A.areEqual(1, clObj.data[0]['node']['id'], "cloned object has correct node id");
			A.isTrue(clObj.data.length == 1, "cloned object has data array");
			A.object.hasKeys(['node'], clObj.data[0], "cloned object has 'node' property in data array ");
			A.object.hasKeys(['id'], clObj.data[0]['node'], "cloned object has 'id' property in node data ");
			A.areEqual(1, clObj.data[0]['node']['id'], "cloned object has correct node id");
		}
	}));
});
