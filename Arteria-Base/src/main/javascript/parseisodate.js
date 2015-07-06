/* Fix window.Date to follow ECMAScript-262 v6.0 specification
 * This enables Date.parse() and Date.fromString() to parse ISO-8601
 * dates, using the native browser implementation if available.
 * @see: http://stackoverflow.com/questions/5802461/javascript-which-browsers-support-parsing-of-iso-8601-date-string-with-date-par
 */
(function() {

    var d = window.Date,
        regexIso8601 = /^(\d{4}|\+\d{6})(?:-(\d{2})(?:-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})\.(\d{1,})(Z|([\-+])(\d{2}):(\d{2}))?)?)?)?$/,
        lOff, lHrs, lMin;

    if (d.parse('2011-11-29T15:52:30.5') !== 1322599950500 ||
        d.parse('2011-11-29T15:52:30.52') !== 1322599950520 ||
        d.parse('2011-11-29T15:52:18.867') !== 1322599938867 ||
        d.parse('2011-11-29T15:52:18.867Z') !== 1322581938867 ||
        d.parse('2011-11-29T15:52:18.867-03:30') !== 1322594538867 ||
        d.parse('2011-11-29') !== 1322524800000 ||
        d.parse('2011-11') !== 1320105600000 ||
        d.parse('2011') !== 1293840000000) {

        d.__parse = d.parse;

        lOff = -(new Date().getTimezoneOffset());
        lHrs = Math.floor(lOff / 60);
        lMin = lOff % 60;

        d.parse = function(v) {

            var m = regexIso8601.exec(v);

            if (m) {
                return Date.UTC(
                    m[1],
                    (m[2] || 1) - 1,
                    m[3] || 1,
                    m[4] - (m[8] ? m[9] ? m[9] + m[10] : 0 : lHrs) || 0,
                    m[5] - (m[8] ? m[9] ? m[9] + m[11] : 0 : lMin) || 0,
                    m[6] || 0,
                    ((m[7] || 0) + '00').substr(0, 3)
                );
            }

            return d.__parse.apply(this, arguments);

        };
    }

    d.__fromString = d.fromString;

    d.fromString = function(v) {

        if (!d.__fromString || regexIso8601.test(v)) {
            return new d(d.parse(v));
        }

        return d.__fromString.apply(this, arguments);
    };

})();
