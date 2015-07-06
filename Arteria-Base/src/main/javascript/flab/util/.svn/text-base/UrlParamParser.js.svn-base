//= compat
//= require <flab/Namespace>

flab.Namespace.create('flab.util');

flab.util.UrlParamParser = (function(){
    "use strict";
    var _window_location = window.location,
        _cached_params;
    return {
        /**
         * Processes a URL and tries to parse contained parameters.
         * @param {String} url The URL which should be processed.
         * @result {Object} a hash containing the values found in the URL.
         */
        parse: function(url) {
            var self = this,
                data = {},
                index,
                hindex,
                params,
                param,
                keyvalue,
                key,
                value,
                i,
                len;

            if (typeof url != 'string') {
                throw new Error("parseUrlParams expects an URL string as parameter");
            }

            index = url.indexOf("?");
            if (index > 0) {
                hindex = url.lastIndexOf("#");
                if (hindex > 0) {
                    params = url.substr(index + 1, hindex - index - 1).split("&");
                }
                else {
                    params = url.substr(index + 1).split("&");
                }
                for (i = 0, len = params.length; i < len; ++i) {
                    param = params[i];
                    keyvalue = param.split("=");
                    key = decodeURIComponent(keyvalue[0]);
                    if (keyvalue.length === 2) {
                        value = decodeURIComponent(keyvalue[1]);
                        if (typeof data[key] == 'undefined') {
                            data[key] = value;
                        }
                        else {
                            data[key] = [].concat(data[key]).concat(value);
                        }
                    }
                    else if (keyvalue.length === 1) {
                        data[key] = true;
                    }
                }
            }

            return data;
        },

        /**
         * Processes a URL and tries to parse contained parameters.
         * @param {String} [url] The optional URL which should be processed. If not passed,
         * the function uses <code>window.location.href</code>. In this case the
         * result is cached and returned in future calls.
         * @result {Object} a hash containing the values found in the URL.
         */
        getUrlParams: function(url) {
            var self = this;
            if (typeof url == 'string') {
                return self.parse(url);
            }
            else if (!_cached_params) {
                _cached_params = self.parse(_window_location.href);
            }
            return _cached_params;
        }
    };
}());

