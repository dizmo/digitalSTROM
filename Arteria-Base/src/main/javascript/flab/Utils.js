//= compat
//= require <flab/Namespace>
//= require <flab/util/UrlParamParser>

flab.Namespace.create('flab');

/**
 * Static object which provides some utility functions.
 *
 * @type {Object}
 * @static
 * @class flab.Utils
 */
flab.Utils = (function() {
    "use strict";
    var _uniqueId = 0,
        _toString = Object.prototype.toString;

    return /** @lends flab.Utils */ {
        /**
         * Shorten a String to a given length, append dots.
         * This function will decode Markup before shortening the string
         * and encode it again afterwards.
         * @param {String} str String to shorten.
         * @param {Number} len Maximal length.
         * @return {String} the shortened string.
         */
        shortStringDecodeEncodeMarkup: function(str, length) {
            return flab.Utils.escapeMarkup(flab.Utils.shortString(flab.Utils.unescapeMarkup(str, length)));
        },

        /**
         * Shorten a String to a given length, append dots.
         * @param {String} str String to shorten.
         * @param {Number} len Maximal length. Defaults to 13.
         * @return {String} the shortened string, or an empty string if the input
         *                  did not look like a string value.
         */
        shortString: function(str, length) {
            if (typeof length != 'number') {
                length = 13;
            }
            if (typeof str !== 'string') {
                return '';
            }
            if (str.length > length) {
                return str.substr(0, length-3) + '...';
            }
            return str;
        },

        /**
         * Decodes entities in a string.
         * @param {String} str String with entity encoded characters.
         * @return {String} the decoded string.
         */
        decodeEntities: function(str) {
            return str.replace(/&#x([0-9a-z]+);/ig, function(str, codept) {
                return flab.Utils.fromCharCode(parseInt(codept, 16));
            });
        },

        /**
         * Convert a code point to a string. This method should be UTF-16 compatible. See also
         * https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/String/fromCharCode
         * @param {Number} codept The code point.
         * @return {String} the string representing the given code point.
         */
        fromCharCode: function(codePt) {
            if (codePt > 0xFFFF) {
                codePt -= 0x10000;
                return String.fromCharCode(0xD800 + (codePt >> 10), 0xDC00 + (codePt & 0x3FF));
            }
            else {
                return String.fromCharCode(codePt);
            }
        },

        /**
         * Replace a part of the string by dots, such that beginning and end still
         * exist. I.e. 'Hello, World!' is converted to 'Hel...ld!' if the final
         * length should be 9.
         * @param {String} str    String to process.
         * @param {Number} length Final, maximal length of the string.
         * @return {String} the shortened string.
         */
        clipString: function(str, length) {
            if (typeof length != 'number' || length === 0) {
                length = 15;
            }
            if (str.length > length && str.length > 7 && length > 7) {
                return str.substr(0, length-6) + '...'+str.substr(str.length-3,str.length);
            }
            return str;
        },

        /**
         * Turn the first character of a string into an uppercase character.
         * @param {String} string The string to process.
         * @returns {String} the modified string.
         */
        ucfirst: function(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        },

        /**
         * Convert a number to a string with a suitable [kMG]B suffix.
         * @param {Number} size     The size to convert.
         * @param {Number} decimals Number of decimal places to round the number to.
         * @return {String} The given size in human readable format.
         */
        number2bytes: function(size,decimals) {
            var factor = 1;
            if (typeof decimals == 'number') {
                factor = Math.pow(10,decimals);
            }
            var sizestr = "";
            if (size < 1024) {
                sizestr = size+" B";
            }
            else if (size < 1024*1024) {
                sizestr = Math.round(size/1024*factor)/factor+" kB";
            }
            else if (size < 1024*1024*1024) {
                sizestr = Math.round(size/(1024*1024)*factor)/factor+" MB";
            }
            else {
                sizestr = Math.round(size/(1024*1024*1024)*factor)/factor+" GB";
            }
            return sizestr;
        },

        /**
         * Get the size of a rectangle such that it would fit into a square with
         * a given edge length.
         *
         * @param {Number} width  Width of the image.
         * @param {Number} height Height of the image.
         * @param {Mixed}  size   If a number, used as the edge length of the square.
         *                        May also be an object with <code>width</code> and
         *                        <code>height</code> fields, which will be used as
         *                        bounding box.
         *
         * @return {Object} Fitted size.
         */
        bbox: function(width,height,size) {
            var self = this;

            if (typeof size == 'undefined') {
                throw new Error("No size for bounding box passed");
            }

            width = parseInt(width, 10);
            height = parseInt(height, 10);

            var bbWidth;
            var bbHeight;
            if (typeof size === 'number' && isFinite(size)) {
                bbWidth  = size;
                bbHeight = size;
            }
            else {
                bbWidth  = size.width;
                bbHeight = size.height;
            }

            var bbAspectRatio = bbWidth / bbHeight;
            var aspectRatio   = width / height;

            var scaleFactor = bbAspectRatio >= aspectRatio ? bbHeight / height : bbWidth / width;

            return {
                width:  Math.round(width  * scaleFactor),
                height: Math.round(height * scaleFactor)
            };
        },

        /**
         * Fit a rectangle into another one while keeping its aspect ratio.
         * @param {Number} width   Width of rectangle to fit in.
         * @param {Number} height  Height of rectangle to fit in.
         * @param {Number} bwidth  Width of rectangle to fit the other one in.
         * @param {Number} bheight Height of rectangle to fit the other one in.
         * @returns {Object} the width/height that fits in.
         */
        fitIn: function(width, height, bwidth, bheight) {
            var self = this;

            var factor = width / height;
            var bfactor = bwidth / bheight;

            var fwidth;
            var fheight;

            if (factor > bfactor) {
                fwidth = bwidth;
                fheight = bwidth / factor;
            }
            else {
                fheight = bheight;
                fwidth = bheight * factor;
            }

            return {
                width:  fwidth,
                height: fheight
            };
        },

        /**
         * Get a default size for a window. Size is based on the viewport size and defaults to w*0.5, h*0.5.
         * @param {Number} [factor] Optional factor to use in the calculation instead of 0.5.
         * @return {Object} width and height of the default window.
         */
        getDefaultWindowSize: function(factor) {
            var self = this;
            if (typeof factor != 'number') {
                factor = 0.95;
            }
            return {
                width:       Math.floor(document.viewport.getWidth()*factor),
                height:      Math.floor(document.viewport.getHeight()*factor)
            };
        },

        /**
         * Set defaults in a config object.
         * @param {Object} config   Config object which should be modified.
         * @param {Object} defaults The defaults which should be set in the object.
         *
         * @return {Object} the modified config object.
         */
        setDefaults: function(config, defaults) {
            var self = this,
                copy,
                name;

            if (typeof config == 'undefined') {
                config = {};
            }
            else {
                copy = {};
                for (name in config) {
                    if (config.hasOwnProperty(name)) {
                        copy[name] = config[name];
                    }
                }
                config = copy;
            }

            if (typeof defaults == 'object') {
                for (name in defaults) {
                    if ((typeof config[name] == 'undefined') &&
                        defaults.hasOwnProperty(name))
                    {
                        config[name] = defaults[name];
                    }
                }
            }

            return config;
        },

        /**
         * Test for an array type.
         *
         * There is no easy cross browser check for array type.
         * @param {Object} o Object to test for array type
         * @returns {Boolean} whether the object is an array
         */
        isArray: ('isArray' in Array) ? Array.isArray : function(o) {
            return _toString.call(o) === '[object Array]';
        },

        /**
         * Test for a function.
         *
         * There is no easy cross browser check for function type.
         * @param {Function} f Item to test for function type
         * @returns {Boolean} whether the item is a function
         */
        isFunction: (typeof document !== 'undefined' &&
                     typeof document.getElementsByTagName('body') === 'function')
        ? function(f) {
            return _toString.call(f) === '[object Function]';
        }
        : function(f) {
            return typeof f === 'function';
        },

        /**
         * Flatten an array into a single array.
         *
         * Note: This is simple implementation, if ExtJS is available use its
         * implementation instead.
         */
        flatten: function(a) {
            var result = [],
                idx,
                len;
            if (!a) {
                return;
            }
            for (idx = 0, len = a.length; idx < len; ++idx) {
                if (flab.Utils.isArray(a[idx])) {
                    result = result.concat(flab.Utils.flatten(a[idx]));
                }
                else {
                    result.push(a[idx]);
                }
            }
            return result;
        },

        /**
         * Map function.
         *
         * Replace with Ext.Array.map once Ext 4 is in use.
         */
        map: function(a, fn, scope) {
            var r = [],
                idx = 0,
                len = a.length;
            for (; idx < len; ++idx) {
                r.push(fn.call(scope, a[idx], idx, a));
            }
            return r;
        },

        /**
         * <code>foldl</code> function. Takes the second argument and the first
         * item from the list and applies the function to them, then feeds the
         * function with this result and the next item from the list, and so on.
         *
         * @param {Function} f    Function to apply.
         * @param {Mixed}    n    Neutral element, will be returned if list is empty.
         * @param {Mixed}    list The list which should be folded.
         * @returns the result of the <code>foldl</code> function applied to the given arugments.
         */
        foldl: function(f, n, list) {
            var result = n,
                length = list.length;
            for (var i = 0; i < length; i++) {
                result = f(result, list[i]);
            }
            return result;
        },

        /**
         * Filter the array and return only those elements for which the filter
         * function returns <code>true</code>.
         * @param {Mixed[]}  list The list which should be filtered.
         * @param {Function} f    The function to call on the list elements.
         * @returns the list elements the function returned <code>true</code> for.
         */
        filter: function(list, f) {
            var result = [],
                length = list.length;
            for (var i = 0; i < length; i++) {
                if (f(list[i])) {
                    result.push(list[i]);
                }
            }
            return result;
        },

        /**
         * Checks if <code>f</code> returns <code>true</code> for all items in
         * <code>list</code>.
         * @param {Function} f    Function to apply to each item.
         * @param {Mixed[]}  list The list.
         * @returns {Boolean} <code>true</code> if all items returned a
         *                    <code>true</code> value when applying <code>f</code>
         *                    to them. If the list was empty, it will return
         *                    <code>undefined</code>.
         */
        all: function(f, list) {
            if (list.length === 0) {
                return undefined;
            }
            for ( var i = 0; i < list.length; i++) {
                if (! f(list[i])) {
                    return false;
                }
            }
            return true;
        },

        /**
         * Convert a string to an array of char codes.
         * @param {String|Array} keys The string to convert or an array of characters/numeric key codes.
         * @returns {Number[]} the array with char codes.
         */
        charCodeList: function(keys) {
            var self = this,
                result,
                list,
                idx,
                len;

            function convert(chr) {
                if (typeof chr == 'number') {
                    return chr;
                }
                else {
                    switch (chr) {
                    case ',':
                        return 188;
                    case '.':
                        return 190;
                    case '-':
                        return [109,189];
                    case 'Ö':
                        return [0,222,242,246];
                    default:
                        return chr.charCodeAt(0);
                    }
                }
            }

            function strToArray(s) {
                var r = [],
                    idx = 0,
                    len = s.length;
                for (; idx < len; ++idx) {
                    r.push(s.charAt(idx));
                }
                return r;
            }

            if (typeof keys == 'string') {
                list = strToArray(keys.toUpperCase());
            }
            else {
                list = keys;
            }

            result = [];
            for (idx = 0, len = list.length; idx < len; ++idx) {
                result.push(convert(list[idx]));
            }
            return flab.Utils.flatten(result);
        },

        /**
         * Unescape markup that was escaped in Album::Webapp::Response::JSON.
         * @param {String} str The string were markup should be unescaped.
         * @return {String} the unescaped string or an empty string if the input
         *                  was not a string (eg. <code>null</code>).
         */
        unescapeMarkup: function(str) {
            var self = this;

            if (typeof str !== 'string') {
                return '';
            }
            else {
                return str.replace(/&lt;/g, '<').replace(/&amp;/g, '&').replace(/&gt;/g, '>');
            }
        },

        /**
         * Escape the worst parts of markup.
         * @param {String} str The string where markup should be escaped.
         */
        escapeMarkup: function(str) {
            var self = this;
            if (typeof str == 'undefined') {
                return str;
            }
            else {
                return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            }
        },

        /**
         * Get a new, unique id string.
         * @param {String} [prefix] An optional prefix for the id.
         */
        getId: function(prefix) {
            var self = this;

            ++_uniqueId;

            if (typeof prefix == 'undefined') {
                return 'fl'+_uniqueId;
            }
            else {
                return ''+prefix+_uniqueId;
            }
        },

        /**
         * Find a class that is identified by a string.
         * @param {String} cls The class to look up.
         * @return {Object} the class identified by the string.
         */
        findClass: function(cls) {
            var self = this;

            if (typeof cls != 'string') {
                throw new Error("Require 'cls' parameter not passed or not a string");
            }

            return cls.split('.').inject(window, function(acc, n) {
                if (acc && acc[n] && (acc[n] instanceof Object)) {
                    return acc[n];
                }
            });
        },

        /**
         * This is deprecated. Use {@link flab.util.UrlParamParser.getUrlParams}
         * instead.
         * @deprecated
         * @param {String} [url] The optional URL which should be processed. If not passed,
         * the function uses <code>window.location.href</code>.
         * @result {Object} a hash containing the values found in the URL.
         */
        getUrlParams: function(url) {
            return flab.util.UrlParamParser.getUrlParams(url);
        },

        /**
         * Converts an array to a hash. Basically the same as
         *
         * <code><pre>
         * my @array = ('foo', 1, 'bar', 2);
         * my %hash = @array;
         * </pre></code>
         *
         * in Perl. That is, the element at even index will be a key while the
         * elements at uneven indices will be values.
         * @param {Mixed[]} array The array to convert.
         * @returns {Object} the array data, in <code>Object</code> ('hash') form.
         */
        arrayToHash: function(array) {
            var self = this;

            var data = {};
            for (var i = 0, l = array.length; i < l;) {
                data[array[i++]] = (i < l) ? array[i++] : null;
            }
            return data;
        },

        /**
         * Clones the given object. In contrast to Ext.util.MixedCollection's clone method,
         * it copies all properties deeply.
         * @param {Object/Array} origin The origin object or array to clone
         * @return {Object/Array} The deep clone of an object or an array
         *
         */
        clone: function(origin) {
            var me = this;

            // return undefined, null or primitives
            if (!origin || (typeof origin !== 'object')) {
                return origin;
            }
            // check if the origin object supports clone function
            if (typeof origin.clone === 'function') {
                return origin.clone();
            }

            var copy = me.isArray(origin) ? [] : {},
                property = null,
                value    = null;

            // copy recursively all properties defined in origin object
            for (property in origin) {
                if (origin.hasOwnProperty(property)) {
                    value = origin[property];
                    if (value && (typeof value === 'object')) {
                        copy[property] = me.clone(value);
                    }
                    else {
                        copy[property] = value;
                    }
                }
            }
            return copy;
        }
    };
}());
