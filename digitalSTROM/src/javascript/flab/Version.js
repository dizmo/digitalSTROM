//= compat
//= require flab/Namespace

flab.Namespace.create('flab');

/**
 * Static object which provides access to a version number
 *
 * @type {Object}
 * @static
 * @class flab.Version
 */
flab.Version = (function() {

	return /** @lends flab.Version */ {
		/**
		 * Returns the Version software as a String
		 */
		Version: function() {
			var self = this;
			if (window.flab.versionstore) {
				return window.flab.versionstore;
			} else {
				self._warn('no version defined!');
				return '';
			}
		},

		/**
		 * It's not sure a logger exists at this moment, so be careful
		 * @private
		 */
		_warn: function() {
			if (window.flab && flab.log) {
				flab.log.warn.apply(flab.log, arguments);
			}
			else if (window.console && window.console.warn) {
				if (typeof window.console.warn.apply == 'function') {
					console.warn.apply(console, arguments);
				}
				else {
					var a = [];
					for (var i = 0; i < arguments.length; i++) {
						a.push("" + arguments[i]);
					}
					console.warn(a.join(" "));
				}
			}
		}
	};
}());
