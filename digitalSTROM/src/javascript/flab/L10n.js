//= compat
//= require flab/Namespace
//= require flab/l10n/Translate

flab.Namespace.create('flab');

/**
 * Static object which contains localization information.
 *
 * @deprecated
 * @type {flab.l10n.Translation}
 * @static
 * @class flab.L10n
 */
flab.L10n = flab.l10n.Translate;

/**
 * Translate a given code/key.
 * @deprecated
 * @static
 * @param {String} code  Key for which the localized string should be retrieved.
 * @param {Object} [obj] Object used in evaluation of the template if the translation uses one.
 * @return {String} the localized string.
 */
function l10n(code,obj) {
	return flab.l10n.Translate.get(code,obj);
}

/**
 * Translate a given code/key if possible. Return code if no translation was possible.
 * @deprecated
 * @static
 * @param {String} code  Key for which the localized string should be retrieved.
 * @param {Object} [obj] Object used in evaluation of the template if the translation uses one.
 * @return {String} the localized string if translation was possible, the code otherwise.
 */
function tryL10n(code,obj) {
	try {
		return flab.l10n.Translate.get(code,obj);
	}
	catch (e) {
		return code;
	}
}



/**
 * @namespace Package which provides localization classes.
 *
 * @name flab.l10n
 */
flab.Namespace.create("flab.l10n");

(function() {
    /*
     * Emit deprecated warning if this file is included
     * It's not sure a logger exists at this moment, so be careful
     */
    var msg = "require <flab/L10n> is deprecated," +
              " please change it to require <flab/l10n/Translate>." +
              " flab/L10n will be removed soon.";
    if (flab && flab.log && (typeof flab.log.warn === 'function')) {
        flab.log.warn(msg);
    }
    else if (window.flab && window.flab.log && flab.log.warn) {
        flab.log.warn(msg);
    }
    else if (window.console && window.console.warn) {
        console.warn(msg);
    }
}());

