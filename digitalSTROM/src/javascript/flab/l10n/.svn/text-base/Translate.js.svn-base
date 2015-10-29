//= compat
//= require <flab/Namespace>
//= require <flab/l10n/Translation>

flab.Namespace.create('flab.l10n');

/**
 * Global translation instance.
 * @type {flab.l10n.Translation}
 * @static
 * @see flab.l10n.Translation
 * @name flab.l10n.Translate
 */
flab.l10n.Translate = new flab.l10n.Translation(flab.l10n.data);

/**
 * Translate string to target language using gettext.
 *
 * The behaviour heavily depends on the arguments:
 * @arg If only one argument is specified and it contains a string, this
 *      string is translated
 * @arg If two arguments are specified, then the first is the context and
 *      the second the text to translate
 * @arg If three arguments are specified, then the first must be a number,
 *      the second the singular and the third the plural
 * @arg If four arguments are specified, then the first must be a number,
 *      the second a context, the third the singular and the fourth the
 *      plural form
 *
 * @param {String|Number} s1 Number for plural form or context or text
 * @param {String} s2 Context, singular or text
 * @param {String} s3 Singular or plural
 * @param {String} s4 Plural
 * @see flab.l10n.Translation
 * @see flab.l10n.Translation.tr
 */
flab.tr = function() {
    var t = flab.l10n.Translate;
    return t.tr.apply(t, arguments);
};

