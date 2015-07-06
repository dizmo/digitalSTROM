//= compat
//= require <flab/Namespace>

flab.Namespace.create('flab.l10n');

/**
 * Mixin to add translation functions with context to a class.
 * {@link initTranslations} must be called first before using the
 * <tt>this.tr</tt> and its context providing counterpart
 * <tt>this.ctr</tt>.
 *
 * @type {Object}
 */
flab.l10n.TranslationMixin = {
    initTranslations: function(translations, context) {
        var self = this;
        self.__tr_context = context;
        self.__translations = translations;
    },

    tr: function(s1, s2, s3, s4) {
        var self = this;
        return self.__translations.tr(s1, s2, s3, s4);
    },

    ctr: function(s1, s2, s3) {
        var self = this;
        if (s2 || s3) {
            return self.__translations.tr(s1, self.__tr_context, s2, s3);
        }
        else {
            return self.__translations.tr(s1);
        }
    }
};

