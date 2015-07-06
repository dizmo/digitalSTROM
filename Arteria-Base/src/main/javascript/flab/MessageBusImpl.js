//= compat
//= require <flab/Namespace>
//= require <flab/Class>

flab.Namespace.create("flab");

flab.MessageBusImpl = flab.Class.extend(Object,
    /** @lends flab.MessageBusImpl.prototype */
{
    /**
     * Constructor of the message bus.
     *
     * Class which provides message bus functionality. It is inspired by
     * <a href="http://code.google.com/p/ext-ux-util-messagebus/"><code>Ext.ux.util.MessageBus</code></a> and
     * <a href="http://demo.qooxdoo.org/current/apiviewer/#qx.event.message.Bus"><code>qx.event.messsage.Bus</code></a>
     * as well as the
     * <a href="http://www.openajax.org/member/wiki/OpenAjax_Hub_1.0_Specification_PublishSubscribe">
     * OpenAjax Hub 1.0 Specification PublishSubscribe
     * </a>.
     *
     * The message bus is intended to be instantiated as a singleton. This class only
     * provides an implementation.
     *
     * @constructs
     */
    constructor: function() {
        var me = this;
        me.subscriptions = {};
        me.sid = 0;
        flab.MessageBusImpl.superclass.constructor.apply(me, arguments);
    },

    /**
     * Subscription id. Used to identify certain subscriptions.
     * @private
     */
    sid: undefined,

    /**
     * Current subscriptions.
     * @type Hash
     * @private
     */
    subscriptions: undefined,

    /**
     * Getter for the current subscriptions.
     * @private
     * @return {Object} object containing the current subscriptions.
     */
    getSubscriptions: function() {
        var me = this;
        return me.subscriptions;
    },

    /**
     * Checks if there already is a subscription with the given parameters. If only <code>message</code>
     * is given, matches all subscribers for a given message.
     * @param {String}   message    The message to subscribe to.
     * @param {Function} subscriber Callback method to subscribe.
     * @param {Object}   context    Execution context,
     * @return {Boolean} <code>true</code> if there is a subscriber for the given message
     *                   (and <code>subscriber</code> and <code>context</code>), <code>false</code>
     *                   otherwise.
     */
    checkSubscription: function(message, subscriber, context) {
        var me = this,
            subscriptions = me.getSubscriptions()[message],
            subscription,
            len,
            idx;

        if (!subscriptions || subscriptions.length === 0) {
            return false;
        }

        if (subscriber) {
            for (idx = 0, len = subscriptions.length; idx < len; ++idx) {
                subscription = subscriptions[idx];
                if ((subscription.subscriber === subscriber) &&
                    (subscription.context === (context || null)))
                {
                    return true;
                }
            }
            return false;
        }
        else {
            return true;
        }
    },

    /**
     * Subscribe an object to a message.
     * @param {String}   message    The message to subscribe to.
     * @param {Function} subscriber Callback method to subscribe.
     * @param {Object}   context    Execution context,
     * @return {Subscription} An identifier for the subscription which can be used to
     *                        unsubscribe on success, an exception otherwise.
     */
    subscribe: function(message, subscriber, context) {
        var me = this,
            subscriptions,
            sid;

        if ((typeof message != 'string') || (typeof subscriber != 'function')) {
            throw new Error("'message' must be a string and 'subscriber' a function");
        }

        subscriptions = me.getSubscriptions();
        if (me.checkSubscription(message)) {
            if (me.checkSubscription(message, subscriber, context)) {
                throw new Error("Object already subscribed to message '"+message+"'");
            }

            sid = message + '-' + (me.sid++);
            subscriptions[message].push({
                subscriber: subscriber,
                context:    context || null,
                sid:        sid,
                message:    message
            });
        }
        else {
            sid = message + '-' + (me.sid++);
            subscriptions[message] = [
                {
                    subscriber: subscriber,
                    context:    context || null,
                    sid:        sid,
                    message:    message
                }
            ];
        }

        return sid;
    },

    /**
     * Unsubscribe an object from a message.
     * @param {String|Subscription}   message|subscription    The message to unsubscribe from or the subscription
     *                                                        identifier as returned by <code>subscribe()</code>.
     * @param {Function}              subscriber              Callback method to unsubscribe. Unused if
     *                                                        <code>subscription</code> was passed.
     * @param {Object}                context                 Execution context. Unused if
     *                                                        <code>subscription</code> was passed.
     * @return {Boolean} <code>true</code> if a subscriber was removed.
     */
    unsubscribe: function() {
        var me = this,
            message,
            subscriptions,
            subscription,
            newSubscriptions,
            subscriber,
            context,
            len,
            idx;

        // Process arguments
        if (arguments.length === 1) {
            subscription = me.getSubscription(arguments[0]);
            if (typeof subscription == 'undefined') {
                return false;
            }
            message    = subscription.message;
            subscriber = subscription.subscriber;
            context    = subscription.context;
        }
        else {
            message    = arguments[0];
            subscriber = arguments[1];
            context    = arguments[2];
        }

        // Check arguments
        if ((typeof message != 'string') || (typeof subscriber != 'function')) {
            throw new Error("'message' must be a string and 'subscriber' a function");
        }

        subscriptions = me.getSubscriptions()[message];
        if (subscriptions && subscriptions.length > 0) {
            if (typeof context == 'undefined') {
                context = null;
            }

            newSubscriptions = [];
            for (idx = 0, len = subscriptions.length; idx < len; ++idx) {
                subscription = subscriptions[idx];
                if ((subscription.subscriber !== subscriber) ||
                    (subscription.context !== context))
                {
                    newSubscriptions.push(subscription);
                }
            }
            me.getSubscriptions()[message] = newSubscriptions;

            return subscriptions.length > newSubscriptions.length;
        }
        else {
            return false;
        }
    },

    /**
     * Publish a message.
     * @param {String} message The message to publish.
     * @param {Mixed}  [args]  Some optional message arguments. Will be passed to the subscriber.
     * @return {Boolean} if the message was published to any subscribers.
     */
    publish: function(message) {
        var me = this,
            subscriptions = me.getSubscriptions()[message],
            args = Array.prototype.slice.call(arguments),
            subscription,
            len,
            idx;

        args.splice(0, 1);

        if (subscriptions && subscriptions.length > 0) {
            for (idx = 0, len = subscriptions.length; idx < len; ++idx) {
                subscription = subscriptions[idx];
                subscription.subscriber.apply(subscription.context, args);
            }
            return true;
        }
        else {
            return false;
        }
    },

    /**
     * Get a subscription for a given subscription identifier as returned by <code>subscribe</code>.
     * @private
     * @param {Subscription} sid The subscription identifier.
     * @return {Object} the subscription if found, <code>undefined</code> otherwise.
     */
    getSubscription: function(sid) {
        var me = this,
            subscriptions,
            subscription,
            values,
            len,
            idx;

        if (typeof sid != 'string') {
            throw new Error("Invalid subscription identifier passed");
        }

        subscriptions = me.getSubscriptions();
        values = [];
        for (subscription in subscriptions) {
            if (subscriptions.hasOwnProperty(subscription)) {
                values.push(subscriptions[subscription]);
            }
        }
        values = flab.Utils.flatten(values);
        for (idx = 0, len = values.length; idx < len; ++idx) {
            if (values[idx].sid === sid) {
                return values[idx];
            }
        }
    }
});
