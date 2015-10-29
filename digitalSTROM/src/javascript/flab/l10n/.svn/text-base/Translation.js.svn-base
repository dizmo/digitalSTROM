//= compat
//= require <flab/Namespace>
//= require <flab/Class>

flab.Namespace.create('flab.l10n');
flab.Namespace.require('Gettext');  // need JS-Gettext (jsgettext.berlios.de)

/**
 * Translation class intended to be initialized once for all users as static object.
 *
 * @type {Object}
 * @class flab.l10n.Translation
 * @see flab.l10n.Translate
 */
flab.l10n.Translation = flab.Class.extend(Object,
    /** @lends flab.l10n.Translation.prototype */
{
    constructor: function(translations) {
        var self = this;
        if (translations) {
            self.language = translations.language;
            self.data = {
                'messages': translations.localizations
            };
        }
        else {
            self._warn("No localizations defined");
            self.data = {
                'language': 'en',
                'messages': {
                    "": {
                        "Project-Id-Version": "Untranslated 1.0",
                        "Report-Msgid-Bugs-To": "info@futurelab.ch",
                        "Last-Translator": "futureLAB AG <info@futurelab.ch>",
                        "POT-Creation-Date": "2010-01-01 00:00+0000",
                        "PO-Revision-Date": "2010-01-01 00:00+0000",
                        "Content-Type": "text/plain; charset=UTF-8",
                        "Language-Team": "English",
                        "MIME-Version": "1.0",
                        "Content-Transfer-Encoding":"8bit",
                        "Plural-Forms": "nplurals=2; plural=(n != 1);"
                    }
                }
            };
        }
        self.initGettext();
    },

    initGettext: function() {
        var self = this;
        self.__gettext = new Gettext({
            domain: 'messages',
            locale_data: self.data || {}
        });
        if (!self.__gettext) {
            self._warn("Cannot initialize gettext");
        }
    },

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
     * @param {String|Number} a1 Number for plural form or context or text
     * @param {String} a2 Context, singular or text
     * @param {String} a3 Singular or plural
     * @param {String} a4 Plural
     * @see flab.tr
     */
    tr: function(a1, a2, a3, a4) {
        var self = this;
        switch (arguments.length) {
            case 1: return self.__gettext.gettext(a1);
            case 2: return self.__gettext.pgettext(a1, a2);
            case 3: return self.__gettext.ngettext(a2, a3, a1);
            case 4: return self.__gettext.npgettext(a2, a3, a4, a1);
            default:
                self._warn("tr() function called without arguments");
                return ''; // when nothing passed, return an empty string
        }
    },

    get: function(code, obj) {
        var self = this,
            tr,
            tmpl;
        if (!self.__legacy) {
            self._warn("Deprecated method flab.l10n.Translation.get called");
            self.__legacy = true;
        }
        tr = self.__gettext.gettext(code);
        if (!tr) {
            throw new Error("Code '" + code + "' not translated by gettext");
        }
        if (tr == code) {
            self._warn("Warning: possible untranslated string for key: " + code);
        }
        if (tr.match(/^new\s+(Ext\.X?)?Template\(.*\)$/)) {
            var evil = eval;
            tmpl = evil(tr);
            if (typeof tmpl.apply == 'function') {
                tr = tmpl.apply(obj);
            }
            else if (typeof tmpl.evaluate == 'function') {
                tr = tmpl.evaluate(obj);
            }
            else {
                self._warn("A translated string looks like a template but isn't one");
                return tr;
            }
        }
        return tr;
    },

    getLanguage: function() {
        var self = this;
        return self.language;
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
});

