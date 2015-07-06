//= compat
//= require <flab/Namespace>

flab.Namespace.create('flab');

/**
 * Provide a class constructor function independed of used Javascript toolkit.
 * @static
 */
flab.Class = (function(_w) {
    if (_w.Ext && typeof _w.Ext.extend === 'function' && typeof _w.Ext.override === 'function') {
        /* use existing implementation from Ext JS 3 */
        return /** @lends flab.Class */ {
            extend: _w.Ext.extend,
            override: _w.Ext.override
        };
    }
    return /** @lends flab.Class */ {
    /**
     * Class constructor function.
     *
     * Copies the Ext.extend function behaviour. If the Ext lib is included this
     * is replaced with the genuine Ext.extend function.
     *
     * Usage:
     * flab.Class.extend(BaseClass, { members });
     *
     * Class characteristics: The constructor is named 'constructor'. The
     * class function get a field named 'superclass' that points to its
     * parent class'
     *
     * @example
     *
     * MyBase = flab.Class.extend(Object, {
     *   constructor: function(a) {
     *      this.name = "MyBase";
     *      this.a = a;
     *   },
     *   getName: function() { return this.name; },
     *   getArg: function() { return this.a; },
     *   setArg: function(v) { this.a = v; }
     * });
     *
     * MyChild = flab.Class.extend(MyBase, {
     *   constructor: function(a, b) {
     *      MyChild.superclass.constructor.call(this, a);
     *      this.name = "MyChild";
     *      this.b = b;
     *   }
     * });
     *
     * b = new MyBase(23);
     * c = new MyChild(42, 31);
     * b.name();    // returns "MyBase"
     * c.name();    // returns "MyChild"
     * b.getArg();  // returns 23;
     * c.getArg();  // returns 42;
     *
     * @param {Function} base Baseclass or class member definition object
     * @param {Object} defs the class member definition object
     * @return {Function} Return the constructor function for the new class
     */
    extend: (function(){
        // inline overrides
        var oc = Object.prototype.constructor,
            inline_overwrite = function(o){
                for (var m in o) {
                    this[m] = o[m];
                }
            };
        return function(sb, sp, overrides) {
            if (typeof sp === 'object') {
                overrides = sp;
                sp = sb;
                if (overrides.constructor != oc) {
                    sb = overrides.constructor;
                }
                else {
                    sb = function() { sp.apply(this, arguments); };
                }
            }
            var F = function() {},
                sbp,
                spp = sp.prototype;

            F.prototype = spp;
            sbp = sb.prototype = new F();
            sbp.constructor=sb;
            sb.superclass=spp;
            if (spp.constructor == oc) {
                spp.constructor = sp;
            }
            sb.override = function(o) {
                flab.Class.override(sb, o);
            };
            sbp.superclass = sbp.supr = function() {
                return spp;
            };
            sbp.override = inline_overwrite;
            flab.Class.override(sb, overrides);
            sb.extend = function(o) { return flab.Class.extend(sb, o); };
            return sb;
        };
    }()),

    /**
     * Overrides methods of a class
     *
     * Copies the Ext.override function behaviour. If the Ext lib is included this
     * is replaced with the genuine Ext.override function.

     * @param {Function} origclass original constructor function
     * @param {Object} overrides object containing methods and fields to override
     */

    override: (function() {
        var ua = navigator.userAgent.toLowerCase(),
            isIE = !(/opera/).test(ua) && (/msie/).test(ua),
            inline_apply = function(o, c) {
                if (o && c && typeof c == 'object') {
                    for (var p in c) {
                        o[p] = c[p];
                    }
                }
                return o;
            };

        return function(origclass, overrides) {
            if (overrides) {
                var p = origclass.prototype;
                inline_apply(p, overrides);
                if (isIE && overrides.hasOwnProperty('toString')){
                    p.toString = overrides.toString;
                }
            }
        };
    }())
};
}(window));
