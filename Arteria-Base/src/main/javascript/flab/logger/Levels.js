//= compat
//= require <flab/Namespace>

flab.Namespace.create('flab.logger');

/**
 * Static logger object holding the constants for the different log levels.
 *
 * @type {Object}
 * @static
 * @class flab.logger.Levels
 */
flab.logger.Levels = (function() {
	return {
		/**
		 * No log-level.
		 */
		none: 0,
		/**
		 * Debug level.
		 */
		debug: 1,

		/**
		 * Info level.
		 */
		info: 2,

		/**
		 * Warn level.
		 */
		warn: 3,

		/**
		 * Error level.
		 */
		error: 4,

		/**
		 * Level for fatal errors.
		 */
		fatal: 5,

		/**
		 * Convert a given level to a string.
		 * @param {Number} level Level to convert.
		 * @returns {String} a string representation for the level.
		 */
		level2string: function(level) {
			var me = this;

			for (var l in me) {
				if (me.hasOwnProperty(l) && (typeof me[l] == 'number') && (me[l] == level)) {
					return l;
				}
			}
			return "";
		}
	};
}());
