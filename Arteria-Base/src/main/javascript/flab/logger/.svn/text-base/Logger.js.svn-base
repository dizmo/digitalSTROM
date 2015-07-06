//= compat
//= require <flab/Namespace>
//= require <flab/Class>
//= require <flab/logger/Levels>
//= require <flab/logger/Base>

flab.Namespace.create('flab.logger');

flab.logger.Logger = flab.Class.extend(flab.logger.Base,
    /** @lends flab.logger.Logger.prototype */
{
	/**
	 * A relatively generic logger class for JavaScript. It is recommended to create a
     * global instance of this class which can then be used in the whole application. After
     * creating an instance, one can add actual loggers which log to different targets such
     * as the <code>console</code> object of Firebug/Safari.
     *
     * @example
     * var log = new flab.logger.Logger()
     *		.addLogger(new flab.logger.loggers.Ajax({
                url: "http://workbench.prisma.futurelab.ch/ajaxlogger",
                appid: 'logger-test'
            }))
     *		.addLogger(new flab.logger.loggers.Console());
     * log.log("asdf",{asdf: 'jklö'},', ', [1,2,3,4]);
     * log.debug("asdf: ",{asdf: 'jklö'},', ', [1,2,3,4]);
     * log.info("asdf: ",{asdf: 'jklö'},', ', [1,2,3,4]);
     * log.warn("asdf: ",{asdf: 'jklö'},', ', [1,2,3,4]);
     * log.error("asdf: ",{asdf: 'jklö'},', ', [1,2,3,4]);
     * log.fatal("asdf: ",{asdf: 'jklö'},', ', [1,2,3,4]);
	 *
	 * @constructs
	 */
	constructor: function() {
		var me = this;

		me.loggers = [];

		me.level = flab.logger.Levels.debug;
        flab.logger.Base.superclass.constructor.apply(me, arguments);
	},

	/**
	 * Add a new logger which will be used to process log messages.
	 * @param {BaseLogger} logger A new logger.
	 * @returns {Logger} itself to allow chaining.
	 */
	addLogger: function(logger) {
		var me = this;
		me.loggers.push(logger);
		return me;
	},

	/**
	 * Set the log level.
	 * @param {Number} level The new log level.
	 */
	setLevel: function(level) {
		var me = this;
		if (level >= flab.logger.Levels.debug && level <= flab.logger.Levels.fatal) {
			me.level = level;
		}
	},

	/**
	 * Call logging method for each registered logger.
	 * @param {Number}   level Level from which this function got called.
	 * @param {Function} fun   Method to execute with each logger.
	 * @private
	 */
	log4each: function(level, fun) {
		var me = this,
            loggers = me.loggers,
            len,
            idx;

		if (me.level <= level || level == flab.logger.Levels.none) {
            for (idx = 0, len = loggers.length; idx < len; ++idx) {
                fun(loggers[idx], idx);
            }
		}
	},

	/**
	 * Log some information.
	 * @param {Object[]} msgs Data that should be logged.
	 */
	log: function() {
		var me = this,
		    args = arguments;

		me.log4each(flab.logger.Levels.none, function(logger){
			logger.log.apply(logger, args);
		});
	},

	/**
	 * Log some information on <code>debug</code> level.
	 * @param {Object[]} msgs Data that should be logged.
	 */
	debug: function() {
		var me = this,
		    args = arguments;

		me.log4each(flab.logger.Levels.debug, function(logger){
			logger.debug.apply(logger, args);
		});
	},

	/**
	 * Log some information on <code>info</code> level.
	 * @param {Object[]} msgs Data that should be logged.
	 */
	info: function() {
		var me = this,
		    args = arguments;

		me.log4each(flab.logger.Levels.info, function(logger){
			logger.info.apply(logger, args);
		});
	},

	/**
	 * Log some information on <code>warn</code> level.
	 * @param {Object[]} msgs Data that should be logged.
	 */
	warn: function() {
		var me = this,
		    args = arguments;

		me.log4each(flab.logger.Levels.warn, function(logger){
			logger.warn.apply(logger, args);
		});
	},

	/**
	 * Log some information on <code>error</code> level.
	 * @param {Object[]} msgs Data that should be logged.
	 */
	error: function() {
		var me = this,
		    args = arguments;

		me.log4each(flab.logger.Levels.error, function(logger){
			logger.error.apply(logger, args);
		});
	},

	/**
	 * Log some information on <code>fatal</code> level.
	 * @param {Object[]} msgs Data that should be logged.
	 */
	fatal: function() {
		var me = this,
		    args = arguments;

		me.log4each(flab.logger.Levels.fatal, function(logger){
			logger.fatal.apply(logger, args);
		});
	}
});
