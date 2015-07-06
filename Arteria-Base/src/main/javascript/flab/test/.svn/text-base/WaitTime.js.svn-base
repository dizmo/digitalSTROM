//= compat
//= require <flab/Namespace>
flab.Namespace.create('flab.test');

/**
 * Extension to {@link flab.Test} to allow to specify relative times to the
 * {@link flab.Test.wait} function instead of hardcoded milliseconds.
 * @type Object
 */
flab.test.WaitTime = (function(){
    var _location = window.location,
        _factors = {
                'amoment': 1,           // time to defer a task a very small moment
                'render': 500,          // time to render a component
                'loadstatic': 500,      // time to load static data
                'loadscript': 1250,     // time to load a CGI or other script
                'loadimage': 1500,      // time to load an image
                'loadandrender': 2000,  // time to load and show an image
                'loadfromremote': 3000, // time to load from far away servers
                'image': 1500,          // time to show or resize an image
                'renderimage': 1500,    // time for rendering images
                'complextask': 5000,    // use only for very complex tasks
                'additional' : 1000     // use this to add additional wait time
        },
        _timeFactor;

    function _parseUrlParams(params, name) {
        var a,
            i,
            l,
            v,
            f,
            h = {};
        if ((typeof params === 'string') && params.charAt(0) === '?') {
            a = params.substr(1).split(/&/);
            for (i = 0, l = a.length; i < l; ++i) {
                v = a[i].split(/[=]/, 2);
                h[v[0]] = v[1];
            }
            f = h[name];
            if (f) {
                f = parseFloat(f);
                if (f) {
                    return f;
                }
            }
        }
        return 1.0;
    }

    return /** @lends flab.test.WaitTime */ {
        /**
         * Return time in milliseconds required for a specific tasks. The time
         * returned is usually confortably big enough even for slow systems
         * (like the virtualized test environment). But you can add an URL
         * parameter named <em>waitTimeFactor</em> to change this. Usually
         * you'll be ok with 0.5 or even less.
         * <dl>
         * <dt>amoment</dt><dd>time to defer a task a very small moment</dd>
         * <dt>render</dt><dd>time to render a component</dd>
         * <dt>loadstatic</dt><dd>time to load static data</dd>
         * <dt>loadscript</dt><dd>time to load a CGI or other script</dd>
         * <dt>loadimage</dt><dd>time to load an image</dd>
         * <dt>loadandrender</dt><dd>time to load and show an image</dd>
         * <dt>loadfromremote</dt><dd>time to load from far away servers</dd>
         * <dt>image</dt><dd>time to show or resize an image</dd>
         * <dt>renderimage</dt><dd>time for rendering images</dd>
         * <dt>complextask</dt><dd>use only for very complex tasks</dd>
         * <dt>additional</dt><dd>use this to add additional wait time</dd>
         * </dl>
         * @param {String} what String describing your task. Choose from the
         *                      list of predefined values.
         * @return {Number} Milliseconds assigned for the task, already scaled.
         */
        timeForTask: function(what) {
            var f = flab.test.WaitTime.getTimeFactor(),
                t = _factors[what.toLowerCase()] || 500;
            return Math.max(10, Math.round(f * t));
        },

        /**
         * Return a list of all available tasks known.
         * @return {Array} List of tasks
         */
        listTasks: function() {
            var a = [],
                t;
            for (t in _factors) {
                if (_factors.hasOwnProperty(t)) {
                    a.push(t);
                }
            }
            return a;
        },

        /**
         * Return the time factor. If non is provided in URL nor was set
         * programmatically it returnes the default of 1.0.
         * @return {Float} Factor applied to times
         */
        getTimeFactor: function() {
            if (!_timeFactor) {
                _timeFactor = _parseUrlParams(_location.search, 'waitTimeFactor');
            }
            return _timeFactor;
        },

        /**
         * Don't blindly use this in unit test code nor application code!
         * This can be used to load the factor by other means, e.g. from
         * Ajax actions (instead of URL parameters) etc.
         * @param {Float} factor New factor to set.
         */
        setTimeFactor: function(factor) {
            _timeFactor = factor;
        }
    };
}());

