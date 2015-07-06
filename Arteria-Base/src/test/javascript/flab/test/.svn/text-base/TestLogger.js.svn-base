//= compat
//= require <flab/logger/Logger>
//= require <flab/logger/loggers/Console>

// include flab.log logger
//= require <flab/logger/GlobalLogger>

// the global "logger" object is for backwards compatibility, don't use it in new code
if (typeof window.logger == 'undefined') {
    window.logger = new flab.logger.Logger()
        .addLogger(new flab.logger.loggers.Console());
        //.addLogger(new flab.logger.loggers.Ajax({url: flab.Config.logger.url, appid: flab.Config.logger.appid}))
}


