//= compat
//= require <json2>
//= require <flab/Namespace>
//= require <flab/Utils>

flab.Namespace.create("flab");

/**
 * A Javascript properties implementation. It was inspired by the
 * Perl-based <code>Arteria::Properties</code> class and provides a
 * remotely similar interface. It uses string-based keys for access
 * to actual values. The values are stored in a hierarchical structure
 * which is reflected in the keys where '.' is used as a separator
 * between the different levels.
 *
 * Stolen with permission from Manfred from:
 * <a href="http://www.nfred.ch/cgi-bin/viewvc.cgi/ToDoList/trunk/htdocs/js/ch/nfred/Config.js?revision=732&root=svn">
 *  http://www.nfred.ch/cgi-bin/viewvc.cgi/ToDoList/trunk/htdocs/js/ch/nfred/Config.js?revision=732&root=svn
 * </a>
 *
 * @param {Object|String} initial The initial configuration.
 * @class flab.Properties
 */
flab.Properties = function(initial) {
    /**
     * The actual configuration root hash.
     * @private
     */
    var _config = {};

    /*
     * Set the initial configuration. If a string gets passed, it gets
     * interpreted as a JSON string.
     */
    if (initial) {
        if (typeof initial == 'string') {
            initial = JSON.parse(initial);
        }
        _config = initial;
    }

    /*
     * Function which does the actual merge.
     * @param {Object} source  Source object where values are coming from.
     * @param {Object} target  Target object where values might be overwritten.
     * @param {Object} options Some options.
     */
    function _merge(source, target, options) {
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                // Field not defined, yet
                if (typeof target[key] == 'undefined') {
                    target[key] = source[key];
                }
                else {
                    // Field defined, overwrite if told so
                    if (options.overwrite) {
                        var targetValue = target[key];
                        if (typeof targetValue == 'string' ||
                            typeof targetValue == 'number' ||
                            flab.Utils.isArray(targetValue) ||
                            typeof targetValue == 'function' ||
                            targetValue === true ||
                            targetValue === false ||
                            targetValue === null)
                        {
                            target[key] = source[key];
                        }
                        else {
                            _merge(source[key], target[key], options);
                        }
                    }
                    else {
                        _merge(source[key], target[key], options);
                    }
                }
            }
        }
    }

    return /** @lends flab.Properties.prototype */ {
        /**
         * Get the configuration value for a given key.
         * @param {String} key Key the value should be retrieved for.
         * @returns {Mixed} the stored value or <code>undefined</code>
         *                  if no value was set.
         */
        get: function(key) {
            var node = _config,
                path,
                idx,
                len;
            if (typeof key != 'string') {
                throw new Error("Key must be a string");
            }
            path = key.split('.');
            for (idx = 0, len = path.length; idx < len; ++idx) {
                node = node[path[idx]];
                if (typeof node == 'undefined') {
                    break;
                }
            }
            return node;
        },

        /**
         * Check whether the key is in configuration and defined.
         * @param {String} key Key to be checked for availability.
         * @return {Boolean} Whether the key is found or not
         * @retval true if found
         * @retval false if not found or undefined
         */
        hasKey: function(key) {
            var value;
            if (typeof key != 'string') {
                throw new Error("Key must be a string");
            }
            value = this.get(key);
            return (typeof value != 'undefined');
        },

        /**
         * Return a property object for the part identified by key.
         * @param {String} key Key to get the properties subtree.
         * @param {Hash} flags Additional flags: 'clone': true to create a shallow copy
         * @return {flab.Properties} Subproperties or undefined
         * @retval {undefined} undefined if this is not a subtree
         * @retval {flab.Properties} property object for subtree
         */
        subproperties: function(key, flags) {
            var value,
                tmp,
                k;
            if (typeof key != 'string') {
                throw new Error("Key must be a string");
            }
            value = this.get(key);
            if (typeof flags != 'undefined') {
                if (flags.clone) {
                    tmp = {};
                    for (k in value) {
                        tmp[k] = value[k];
                    }
                    value = tmp;
                }
            }
            if (typeof value != 'undefined') {
                return flab.Properties(value);
            }
            else {
                return;
            }
        },

        /**
         * Set the configuration value for a given key.
         * @param {String} key   Key for the value.
         * @param {String} value The configuration value.
         */
        set: function(key, value) {
            var node = _config,
                parent_node,
                path,
                idx,
                len,
                i,
                k;
            if (typeof key != 'string') {
                throw new Error("Key must be a string");
            }

            path = key.split('.');
            for (idx = 0, len = path.length - 1; idx < len; ++idx) {
                k = path[idx];
                parent_node = node;
                node = node[k];
                if (typeof node == 'undefined') {
                    node = {};
                    parent_node[k] = node;
                }
            }
            node[path[path.length - 1]] = value;
        },

        /**
         * Set defaults in a config object.
         * @param {String} key Key to config object which should be modified.
         * @param {Object} defaults The defaults which should be set in the object.
         */
        setDefaults: function(key, defaults) {
            var values = _config,
                k;
            if (typeof key != 'string') {
                throw new Error("Key must be a string");
            }

            if (key !== '') {
                values = this.get(key);
                if (typeof values == 'undefined') {
                    values = {};
                    this.set(key, values);
                }
            }
            if (typeof defaults == 'object') {
                for (k in defaults) {
                    if (defaults.hasOwnProperty(k)) {
                        if (typeof values[k] == 'undefined') {
                            values[k] = defaults[k];
                        }
                    }
                }
            }
        },

        /**
         * Removed specified key from configuration. If the key is a whole
         * subtree the whole subtree gets also removed.
         * @param {String} key Key to config object which should be removed
         */
        remove: function(key) {
            var node = _config,
                path,
                idx,
                len;
            if (typeof key != 'string') {
                throw new Error("Key must be a string");
            }

            path = key.split('.');
            for (idx = 0, len = path.length - 1; idx < len; ++idx) {
                node = node[path[idx]];
                if (typeof node == 'undefined') {
                    break;
                }
            }
            if (typeof node != 'undefined') {
                delete node[path[path.length - 1]];
            }
        },

        /**
         * Empty configuration object.
         * (Used for unit tests)
         */
        clear: function() {
            for (var k in _config) {
                if (_config.hasOwnProperty(k)) {
                    delete _config[k];
                }
            }
        },

        /**
         * Merge another object into the properties. Tries to be intelligent about merging, in that
         * it does not overwrite contained objects but only adds new key/value pairs, recursively. It will
         * optionally overwrite existing arrays and simple values though.
         * @param {Object}  data              The object to merge.
         * @param {Object}  options           Some options for the merge.
         * @param {Boolean} options.overwrite Overwrite existing simple values and arrays.
         * @param {String}  options.key       Location in the properties where merging should start.
         */
        merge: function(data, options) {

            options = options || {};
            var target = _config;
            if (typeof options.key == 'string') {
                target = this.get(options.key);
                if (typeof target == 'undefined') {
                    target = {};
                    this.set(options.key, target);
                }
            }

            _merge(data, target, options);
        }
    };
};
