//= compat
//= require <flab/l10n/Translation>
//= require <flab/Namespace>
flab.Namespace.create('flab.l10n');

/**
 * Provide empty translations for Test environments.
 * This must be required first in test runner file, before any other
 * files are required.
 */

flab.l10n.data = {
  "language": "en",
  "localizations": {
    "": {
      "Report-Msgid-Bugs-To": "",
      "Content-Transfer-Encoding": "8bit",
      "Content-Type": "text/plain; charset=UTF-8",
      "Language": "en",
      "POT-Creation-Date": "2010-10-10 10:08+0200",
      "Project-Id-Version": "Test 1.0",
      "Plural-Forms": "nplurals=2; plural=(n != 1);",
      "Last-Translator": "Tester <engineers@futurelab.ch>",
      "MIME-Version": "1.0",
      "Language-Team": "German <translators@futurelab.ch>",
      "PO-Revision-Date": "2010-10-10 10:09+0100"
    }
  }
};
flab.l10n.Translate = new flab.l10n.Translation(flab.l10n.data);
flab.tr = function() {
    var t = flab.l10n.Translate;
    return t.tr.apply(t, arguments);
};
