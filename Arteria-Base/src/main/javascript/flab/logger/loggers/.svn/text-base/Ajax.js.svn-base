//= compat
//= require <flab/Namespace>
//= require <flab/Class>
//= require <flab/logger/Base>
//= require <flab/logger/Levels>

flab.Namespace.create('flab.logger.loggers');

flab.logger.loggers.Ajax = flab.Class.extend(flab.logger.Base,
    /** @lends flab.logger.loggers.Ajax.prototype */
{
	/**
	 * Logger class which uses Ajax to send log messages to a server-side handler.
	 *
	 * @param {Object} config         Object with configuration for the logger.
	 *                                field with the .
	 * @param {String} config.url     Url of the server-side handler.
	 * @param {String} [config.appid] Optional application identifier.
	 *
	 * @extends flab.logger.Base
     * @constructs
	 */
	constructor: function(config) {
		var me = this;

		if (!config.url) {
			throw new Error("No url passed");
		}

		me.handler = config.url;
		me.appid = config.appid;

        flab.logger.Base.superclass.constructor.apply(me, arguments);
	},

	/**
	 * Send message to server.
	 * @param {Number} level Log level of the messages.
	 * @param {mixed}  msgs  Strings to send to the server.
	 * @private
	 */
	sendMessage: function(level,msgs) {
		var me = this,
            msgcomps= [],
            idx,
            len;

		if (!msgs || msgs.length === 0) {
			throw new Error("No messages passed");
		}

        for (idx = 0, len = msgs.length; idx < len; ++idx) {
            msgcomps.push(encodeURIComponent(msgs[idx]));
        }

        me._doAjaxRequest("level=" + level
			            + (me.appid ? "&appid=" + me.appid : "")
			            + "&msg=" + msgcomps.join('&msg=')
		);
	},

    _doAjaxRequest: (function() {
        if (window.Ext && window.Ext.Ajax && window.Ext.Ajax.request) {
            return function(params) {
                Ext.Ajax.request({
                    method: 'GET',
                    url: me.handler + '?' + params
                });
            };
        }
        else if (window.Ajax && window.Ajax.Request) {
            return function(params) {
                var me = this,
                    request = new Ajax.Request(me.handler, {
                        parameters: params
                    });
            };
        }
        else {
            return function(params) {};
        }
    }()),

	log: function() {
		var me = this;
		me.sendMessage(
            flab.logger.Levels.none,
            me.serialize.apply(me, arguments)
		);
	},

	debug: function() {
		var me = this;
		me.sendMessage(
            flab.logger.Levels.debug,
            me.serialize.apply(me, arguments)
		);
	},

	info: function() {
		var me = this;
		me.sendMessage(
            flab.logger.Levels.info,
            me.serialize.apply(me, arguments)
		);
	},

	warn: function() {
		var me = this;
		me.sendMessage(
            flab.logger.Levels.warn,
            me.serialize.apply(me, arguments)
        );
	},

	error: function() {
		var me = this;
		me.sendMessage(
            flab.logger.Levels.error,
            me.serialize.apply(me, arguments)
        );
	},

	fatal: function() {
		var me = this;
		me.sendMessage(
            flab.logger.Levels.fatal,
            me.serialize.apply(me, arguments)
		);
	}
});
