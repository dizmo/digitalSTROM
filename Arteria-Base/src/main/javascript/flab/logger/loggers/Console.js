//= compat
//= require <flab/Namespace>
//= require <flab/Class>
//= require <flab/logger/Base>

flab.Namespace.create('flab.logger.loggers');

/**
 * Logger class which uses the console object of Firebug, Safari,
 * Webkit, IE8, and Opera to print log messages.
 * @extends flab.logger.Base
 * @class
  */
flab.logger.loggers.Console = (function() {
    /*
     * This is a class builder, that compiles the right logger class depending
     * on available functions. After the class function and its prototype is
     * created there are no runtime checks necessary to use the correct console
     * logger function.
     */
    var _console = window.console,      // use own console variable withing this closure
        _opera = window.opera,          // use own opera variable withing this closure
        hasConsoleLog        = false,
        hasConsoleLogApply   = false,
        hasConsoleDebug      = false,
        hasConsoleDebugApply = false,
        hasConsoleInfo       = false,
        hasConsoleInfoApply  = false,
        hasConsoleWarn       = false,
        hasConsoleWarnApply  = false,
        hasConsoleError      = false,
        hasConsoleErrorApply = false,
        hasConsoleFatal      = false,
        hasConsoleFatalApply = false,
        emptyFn = function(){},
        isFunctionObject = function(candidate) {
            return (typeof candidate == 'function' || typeof candidate == 'object');
        },
        _cls = {
            initialize: emptyFn,
            log: emptyFn,
            debug: emptyFn,
            info: emptyFn,
            warn: emptyFn,
            error: emptyFn,
            fatal: emptyFn
        };

    if (typeof _console != 'undefined') {
        hasConsoleLog        = isFunctionObject(_console.log);
        hasConsoleLogApply   = hasConsoleLog   && isFunctionObject(_console.log.apply);

        hasConsoleDebug      = isFunctionObject(_console.debug);
        hasConsoleDebugApply = hasConsoleDebug && isFunctionObject(_console.debug.apply);

        hasConsoleInfo       = isFunctionObject(_console.info);
        hasConsoleInfoApply  = hasConsoleInfo  && isFunctionObject(_console.info.apply);

        hasConsoleWarn       = isFunctionObject(_console.warn);
        hasConsoleWarnApply  = hasConsoleWarn  && isFunctionObject(_console.warn.apply);

        hasConsoleError      = isFunctionObject(_console.error);
        hasConsoleErrorApply = hasConsoleError && isFunctionObject(_console.error.apply);

        hasConsoleFatal      = isFunctionObject(_console.fatal);
        hasConsoleFatalApply = hasConsoleFatal && isFunctionObject(_console.fatal.apply);
    }
    else if (_opera && typeof _opera.postError === 'function') {
        /** @inner */
        _cls.log = function() {
            _opera.postError(this.serialize.apply(this, arguments));
        };
    }

    if (hasConsoleLogApply) {
        /** @inner */
        _cls.log = function() { _console.log.apply(_console, arguments); };
    }
    else if (hasConsoleLog) {
        /** @inner */
        _cls.log = function() { _console.log(this.serialize.apply(this, arguments)); };
    }

    if (hasConsoleDebugApply) {
        /** @inner */
        _cls.debug = function() { _console.debug.apply(_console, arguments); };
    }
    else if (hasConsoleDebug) {
        /** @inner */
        _cls.debug = function() { _console.debug(this.serialize.apply(this, arguments)); };
    }
    else {
        /** @inner */
        _cls.debug = function() { this.log.apply(this, arguments); };
    }

    if (hasConsoleInfoApply) {
        /** @inner */
        _cls.info = function() { _console.info.apply(_console, arguments); };
    }
    else if (hasConsoleInfo) {
        /** @inner */
        _cls.info = function() { _console.info(this.serialize.apply(this, arguments)); };
    }
    else {
        /** @inner */
        _cls.info = function() { this.debug.apply(this, arguments); };
    }

    if (hasConsoleWarnApply) {
        /** @inner */
        _cls.warn = function() { _console.warn.apply(_console, arguments); };
    }
    else if (hasConsoleWarn) {
        /** @inner */
        _cls.warn = function() { _console.warn(this.serialize.apply(this, arguments)); };
    }
    else {
        /** @inner */
        _cls.warn = function() { this.info.apply(this, arguments); };
    }

    if (hasConsoleErrorApply) {
        /** @inner */
        _cls.error = function() { _console.error.apply(_console, arguments); };
    }
    else if (hasConsoleError) {
        /** @inner */
        _cls.error = function() { _console.error(this.serialize.apply(this, arguments)); };
    }
    else {
        /** @inner */
        _cls.error = function() { this.warn.apply(this, arguments); };
    }

    if (hasConsoleFatalApply) {
        /** @inner */
        _cls.fatal = function() { _console.fatal.apply(_console, arguments); };
    }
    else if (hasConsoleFatal) {
        /** @inner */
        _cls.fatal = function() { _console.fatal(this.serialize.apply(this, arguments)); };
    }
    else {
        /** @inner */
        _cls.fatal = function() { this.error.apply(this, arguments); };
    }

    return flab.Class.extend(flab.logger.Base, _cls);
}());

