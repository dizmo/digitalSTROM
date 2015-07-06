//= compat
//= require <flab/Namespace>
//= require <flab/Test>
//= require <flab/test/TestLogger>
//= require <flab/l10n/Translation>
//= require <flab/test/EmptyTranslations>

flab.Namespace.create('flab.l10n');

flab.l10n.data = {
  "language": "de",
  "localizations": {
    "": {
      "Report-Msgid-Bugs-To": "",
      "Content-Transfer-Encoding": "8bit",
      "Content-Type": "text\/plain; charset=UTF-8",
      "POT-Creation-Date": "2010-04-14 13:57+0200",
      "Project-Id-Version": "Gettext Unit Test 1.0",
      "Plural-Forms": "nplurals=2; plural=(n != 1);",
      "Last-Translator": "Andreas Stricker <astricker@futurelab.ch>",
      "MIME-Version": "1.0",
      "Language-Team": "German <translators@futurelab.ch>",
      "PO-Revision-Date": "2010-04-14 13:58+0200"
    },
    "Next": [
      null,
      "Weiter"
    ],
    "context\u0004Context example": [
      null,
      "Kontext-Beispiel"
    ],
    "{0} item": [
      "{0} items",
      "{0} Ding",
      "{0} Dinge"
    ],
    "context\u0004{0} context item": [
      "context\u0004{0} context items",
      "{0} Kontext-Ding",
      "{0} Kontext-Dinge"
    ]
  }
};
flab.l10n.Translate = new flab.l10n.Translation(flab.l10n.data);

flab.Test.run(function(T, A) {
    T.Runner.add(new T.Case({

        name: "flab.l10n.Translate",

        setUp: function() { },

        tearDown: function() { },

        testTranslate: function() {
            A.nothingRaised(function() {
                A.areSame("--- This String should not get translated. ---",
                            flab.l10n.Translate.tr("--- This String should not get translated. ---"));
                A.areSame("Weiter", flab.l10n.Translate.tr("Next"));
            });
        },

        testContext: function() {
            var probe = "--- This String should not get translated. ---";
            A.areSame(probe, flab.l10n.Translate.tr("context", probe));
            A.areSame("Kontext-Beispiel", flab.l10n.Translate.tr("context", "Context example"));
        },

        testPlural: function() {
            var singular = "--- Test for untranslated {0} item ---",
                plural = "--- Test for untranslated {0} items ---",
                result;
            A.nothingRaised(function() {
                result = flab.l10n.Translate.tr(1, singular, plural);
            });
            A.areSame(singular, result);
            A.areSame("{0} Ding", flab.l10n.Translate.tr(1, "{0} item", "{0} items"));
            A.nothingRaised(function() {
                result = flab.l10n.Translate.tr(100, singular, plural);
            });
            A.areSame(plural, result);
            A.areSame("{0} Dinge", flab.l10n.Translate.tr(10, "{0} item", "{0} items"));
        },

        testPluralWithContext: function() {
            var singular = "Test for {0} item",
                plural = "Test for {0} items",
                result;
            A.nothingRaised(function() {
                result = flab.l10n.Translate.tr(1, "context", singular, plural);
            });
            A.areSame(singular, result);
            A.areSame("{0} Kontext-Ding",
                      flab.l10n.Translate.tr(1, "context", "{0} context item", "{0} context items"));
            A.nothingRaised(function() {
                result = flab.l10n.Translate.tr(100, "context", singular, plural);
            });
            A.areSame(plural, result);
            A.areSame("{0} Kontext-Dinge",
                      flab.l10n.Translate.tr(11, "context", "{0} context item", "{0} context items"));
        },

        testFlabTr: function() {
            A.areSame("", flab.tr(""));
            A.areSame("", flab.tr("context", ""));
            A.areSame("", flab.tr(1, "", ""));
            A.areSame("", flab.tr(1, "context", "", ""));
        }
    }));
});
