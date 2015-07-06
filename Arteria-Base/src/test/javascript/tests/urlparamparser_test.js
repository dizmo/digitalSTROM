//= compat
//= require <flab/Test>
//= require <flab/test/TestLogger>
//= require <flab/util/UrlParamParser>

flab.Test.run(function(T, A) {
    function _keys(o) {
        var keys = [];
        for (var k in o) {
            if (o.hasOwnProperty(k)) {
                keys.push(k);
            }
        }
        return keys;
    }

    T.Runner.add(new T.Case({
        name:  'flab_util_UrlParamParser',

        setUp: function() { },

        tearDown: function() { },

        testGetUrlParamsNoArgument: function() {
            var self = this,
                params;
            A.nothingRaised(function() {
                params = flab.util.UrlParamParser.getUrlParams();
            });
            A.isObject(params);
        },

        testParseUrlParams: function() {
            var self = this,
                params = null,
                keys;
            A.raised("Error", function() {
                flab.util.UrlParamParser.parse();
            });
            A.nothingRaised(function() {
                params = flab.util.UrlParamParser.parse(
                    "http://example.com/d/a"
                );
            });
            A.isObject(params);
            keys = _keys(params);
            A.areEqual(0, keys.length);

            params = null;
            A.nothingRaised(function() {
                params = flab.util.UrlParamParser.parse(
                    "http://example.com/d/a#anchor"
                );
            });
            A.isObject(params);
            keys = _keys(params);
            A.areEqual(0, keys.length);

            params = null;
            A.nothingRaised(function() {
                params = flab.util.UrlParamParser.parse(
                    "http://example.com/d/a?a"
                );
            });
            A.isObject(params);
            keys = _keys(params);
            A.areEqual(1, keys.length);
            A.isTrue(params.a);

            params = null;
            A.nothingRaised(function() {
                params = flab.util.UrlParamParser.parse(
                    "http://example.com/d/a?abc=def"
                );
            });
            A.isObject(params);
            keys = _keys(params);
            A.areEqual(1, keys.length);
            A.areEqual(params.abc, "def");

            params = null;
            A.nothingRaised(function() {
                params = flab.util.UrlParamParser.parse(
                    "http://example.com/d/a?abc=def&xy=42&value=23"
                );
            });
            A.isObject(params);
            keys = _keys(params);
            A.areEqual(3, keys.length);
            A.areEqual(params.abc, "def");
            A.areEqual(params.xy, "42");
            A.areEqual(params.value, "23");
        },

        testParseUrlParamsWithAnchor: function() {
            var self = this,
                params = null,
                keys;
            A.nothingRaised(function() {
                params = flab.util.UrlParamParser.parse(
                    "http://example.com/d/a?k=v#anchor"
                );
            });
            A.isObject(params);
            keys = _keys(params);
            A.areEqual(1, keys.length);
            A.areEqual(params.k, "v");

            params = null;
            A.nothingRaised(function() {
                params = flab.util.UrlParamParser.parse(
                    "http://example.com/d/a?key=value&truty#anchor"
                );
            });
            A.isObject(params);
            keys = _keys(params);
            A.areEqual(2, keys.length);
            A.isTrue(params.truty);
            A.areEqual(params.key, "value");
        },

        testComplexUrl: function() {
            var self = this,
                params = null,
                keys;
            A.nothingRaised(function() {
                params = flab.util.UrlParamParser.getUrlParams(
                    "https://fr4t:wXz3%20EE@some-strange.host.example.com:8080" +
                    "/a%20Path/SomeAction" +
                    "?lat=0.472&show&_hidden=%C3%84n%20W%C3%A4rt#some:anchor_value"
                );
            });
            A.isObject(params);
            flab.log.debug("params:", params);
            keys = _keys(params);
            A.areEqual(3, keys.length);
            A.areEqual(params.lat, "0.472");
            A.isTrue(params.show);
            A.areEqual(params._hidden, "Än Wärt");
        }

    }));
});
