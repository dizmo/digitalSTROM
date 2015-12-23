/* Dependency less namespace helper */
if (typeof window.flab === 'undefined') {
	window.flab = {};
}
if (typeof window.flab.Namespace === 'undefined') {
    /**
     * A static object to create new namespaces.
     *
     * It has no dependencies on any Javascript library.
     *
     * @type {Object}
     * @static
     * @class flab.Namespace
     * @name flab.Namespace
     */
	window.flab.Namespace = /** @lends flab.Namespace */ {
        /**
         * Default separator used in namespace definitions.
         */
        SEPARATOR: '.',

        /**
         * Create new namespace.
         * @param {String} namespace The new namespace to create. Parts of
         *                           the namespace should be separated by the
         *                           default namespace separator.
         */
		create: function(ns) {
			var p = ns.split(window.flab.Namespace.SEPARATOR),
                anchor = window;
			for (var i = 0; i < p.length; i++) {
				if (typeof anchor[p[i]] === 'undefined') {
					anchor[p[i]] = {};
				}
				anchor = anchor[p[i]];
			}
		},

        /**
         * Check if a given namespace or class is available.
         * @param {String} name Name of the required namespace or class.
         * @throws {flab.ClassNotFoundException} an exception if the namespace
         *                                       or class is not available.
         */
        require: function(name) {
            if (name) {
                var p = name.split(window.flab.Namespace.SEPARATOR),
                    anchor = window,
                    vtype;
                for (var i = 0; i < p.length; i++) {
                    vtype = (typeof anchor[p[i]]);
                    if (vtype !== 'function' && vtype !== 'object') {
                        if (window.flab &&
                            window.flab.exception &&
                            window.flab.exception.NamespaceNotFoundException)
                        {
                            throw new flab.exception.NamespaceNotFoundException(
                                "Namespace '" + name + "' not found."
                            );
                        }
                        throw "Namespace '" + name + "' not found.";
                    }
                    anchor = anchor[p[i]];
                }
            }
        }
	};
}

