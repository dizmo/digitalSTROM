//= compat
//= require <flab/Test>
//= require <flab/logger/Logger>
//= require <flab/logger/loggers/Console>
//= require <flab/logger/loggers/Ajax>

	//logger = new flab.logger.Logger();
	    //.addLogger(new flab.logger.loggers.Ajax({url: '/ajaxlogger', appid: 'mediacenter'}))
		//.addLogger(new flab.logger.loggers.ExtWindow())
	    //.addLogger(new flab.logger.loggers.Console());

flab.Test.run(function(T, A) {

    T.Runner.add(new T.Case({

        name: "flab.logger.Logger",

        setUp: function() { },

        tearDown: function() { },

        testCreateLogger: function() {
            var logger;
            A.nothingRaised(function() {
                logger = new flab.logger.Logger();
            }, "create logger instance");
            A.isNotUndefined(logger);
            A.nothingRaised(function() {
                logger.log("Logging to logger.log");
                logger.debug("Logging to logger.debug");
                logger.info("Logging to logger.info");
                logger.warn("Logging to logger.warn");
                logger.error("Logging to logger.error");
                logger.fatal("Logging to logger.fatal");
            }, "log to empty logger");
        },

        testConsoleLogger: function() {
            var logger,
                consoleLogger;
            logger = new flab.logger.Logger();
            A.nothingRaised(function() {
                consoleLogger = new flab.logger.loggers.Console();
            }, "create console logger");
            A.isNotUndefined(logger);
            A.nothingRaised(function() {
                logger.addLogger(consoleLogger);
            }, "add console logger");
            A.nothingRaised(function() {
                logger.log("Logging to logger.log (console)");
                logger.debug("Logging to logger.debug (console)");
                logger.info("Logging to logger.info (console)");
                logger.warn("Logging to logger.warn (console)");
                logger.error("Logging to logger.error (console)");
                logger.fatal("Logging to logger.fatal (console)");
            }, "log to console logger");
        },

        testAjaxLogger: function() {
            var logger,
                ajaxLogger;
            logger = new flab.logger.Logger();
            A.nothingRaised(function() {
                ajaxLogger = new flab.logger.loggers.Ajax({
                    url: 'fixtures/ajaxlogger.cgi',
                    appid: "testAjaxLogger"
                });
            }, "create ajax logger");
            A.isNotUndefined(logger);
            A.nothingRaised(function() {
                logger.addLogger(ajaxLogger);
            }, "add ajax logger");
            A.nothingRaised(function() {
                logger.log("Logging to logger.log (ajax)");
                logger.debug("Logging to logger.debug (ajax)");
                logger.info("Logging to logger.info (ajax)");
                logger.warn("Logging to logger.warn (ajax)");
                logger.error("Logging to logger.error (ajax)");
                logger.fatal("Logging to logger.fatal (ajax)");
            }, "log to ajax logger");
        },

        testMultiLog: function() {
            var logger;
            A.nothingRaised(function() {
                logger = new flab.logger.Logger();
                A.isNotUndefined(logger);
            }, "create logger");
            A.nothingRaised(function() {
                logger.addLogger(new flab.logger.loggers.Console());
                logger.addLogger(new flab.logger.loggers.Ajax({
                    url: 'fixtures/ajaxlogger.cgi',
                    appid: "testAjaxLogger"
                }));
            });
            A.nothingRaised(function() {
                var n = 25,
                    f = 3.14159265431,
                    d = new Date(),
                    a = [ 'a', 42, n, f, d ],
                    o = { foo: "bar", eggs: "ham", baz: 23 },
                    fu = function() { return "foo"; };
                logger.log("Logging to logger.log", "(multilog)", n, f, d, a, o, fu);
                logger.debug("Logging to logger.debug", "(multilog)", n, f, d, a, o, fu);
                logger.info("Logging to logger.info", "(multilog)", n, f, d, a, o, fu);
                logger.warn("Logging to logger.warn", "(multilog)", n, f, d, a, o, fu);
                logger.error("Logging to logger.error", "(multilog)", n, f, d, a, o, fu);
                logger.fatal("Logging to logger.fatal", "(multilog)", n, f, d, a, o, fu);
            }, "log to multilog logger");
        },

        testConsoleLoggerSpeed: function() {
            var logger,
                duration,
                expected = 500;
            A.nothingRaised(function() {
                logger = new flab.logger.Logger();
                logger.addLogger(new flab.logger.loggers.Console());
                A.isNotUndefined(logger);
            });
            duration = A.benchmark(1, function() {
                for (var i = 0; i < 100; i++) {
                    logger.debug("Speed", "logging", "test", "step", i);
                    logger.info("Speed", "logging", "test", "step", i);
                    logger.warn("Speed", "logging", "test", "step", i);
                }
            });
            logger.debug("Time taken for logging (expected < " + expected + ":", duration);
            A.assert(expected > duration, "Logging time acceptable (< " + expected + " ms)");
        }
    }));
});

