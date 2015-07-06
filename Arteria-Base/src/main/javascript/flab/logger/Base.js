//= compat
//= require <json2>
//= require <flab/Namespace>
//= require <flab/Class>

flab.Namespace.create('flab.logger');

/**
 * Base class for actual logger implementations. It does mostly nothing.
 *
 * @class flab.logger.Base
 */
flab.logger.Base = flab.Class.extend(Object,
    /** @lends flab.logger.Base.prototype */
{
	/**
	 * Serializes parameters into a string array representation.
	 * @param {mixed} args Arguments to convert.
	 * @returns {String[]} String representations of the arguments.
	 */
	serialize: function() {
		var self = this;

		function _argNames(fn) {
			var args = fn.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1]
				  .replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '')
				  .replace(/\s+/g, '').split(',');
			return args.length == 1 && !args[0] ? [] : args;
		}

		var result = [];
		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			switch (typeof arg) {
			case 'undefined':
				result.push('undefined');
				break;
			case 'number':
				result.push(arg);
				break;
			case 'object':
				result.push(JSON.stringify(arg));
				break;
			case 'function':
				var name;
				if (arg.name) {
					name = arg.name;
				}
				else {
					name = 'anonymous function';
				}
				result.push(name + "(" + _argNames(arg).join(', ') + ")");
				break;
			case 'string':
				result.push(arg);
				break;
			default:
				result.push(""+arg+"");
				break;
			}
		}
		return result;
	},

	/**
	 * Log some information on no specific level.
	 * @param {Object[]} msgs Data that should be logged.
	 */
	log: function() {},

	/**
	 * Log some information on level <code>debug</code>.
	 * @param {Object[]} msgs Data that should be logged.
	 */
	debug: function() {},

	/**
	 * Log some information on level <code>info</code>.
	 * @param {Object[]} msgs Data that should be logged.
	 */
	info: function() {},

	/**
	 * Log some information on level <code>warn</code>.
	 * @param {Object[]} msgs Data that should be logged.
	 */
	warn: function() {},

	/**
	 * Log some information on level <code>error</code>.
	 * @param {Object[]} msgs Data that should be logged.
	 */
	error: function() {},

	/**
	 * Log some information on level <code>fatal</code>.
	 * @param {Object[]} msgs Data that should be logged.
	 */
	fatal: function() {}
});
