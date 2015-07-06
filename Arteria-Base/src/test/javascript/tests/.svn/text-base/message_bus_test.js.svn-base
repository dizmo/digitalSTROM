//= compat
//= require <flab/Test>
//= require <flab/test/TestLogger>
//= require <flab/MessageBusImpl>

flab.Test.run(function(T, A) {

    var subscribe = function() {
        return typeof flab.MessageBus.subscribe.apply(flab.MessageBus, arguments) == 'string';
    };

    T.Runner.add(new T.Case({

        name: "flab.MessageBusImpl",

        setUp: function() {
            flab.MessageBus = new flab.MessageBusImpl();
        },

        tearDown: function() { },

        testSubscribe: function() {
            var self = this;

            A.isFalse(flab.MessageBus.checkSubscription('foo'));
            A.isFalse(flab.MessageBus.checkSubscription('bar'));

            A.isTrue(subscribe('foo', function() { }, self));
            A.isTrue(flab.MessageBus.checkSubscription('foo'));
            A.isFalse(flab.MessageBus.checkSubscription('bar'));

            var fun = function() {};
            A.isTrue(subscribe('foo', fun, self));
            A.isTrue(flab.MessageBus.checkSubscription('foo', fun, self));
            A.raised("Error", function() {
                subscribe('foo', fun, self);
            });

            A.isTrue(subscribe('bar', function() { }));
            A.isTrue(flab.MessageBus.checkSubscription('bar'));
        },

        testUnsubscribe: function() {
            var self = this;

            var fun = function() {};
            A.isTrue(subscribe('foo', fun, self));
            A.isTrue(flab.MessageBus.checkSubscription('foo', fun, self));

            A.isTrue(flab.MessageBus.unsubscribe('foo', fun, self));
            A.isFalse(flab.MessageBus.checkSubscription('foo', fun, self));

            var sid = flab.MessageBus.subscribe('foo', fun);
            A.isTrue(flab.MessageBus.checkSubscription('foo', fun, null));
            A.isTrue(flab.MessageBus.unsubscribe(sid));
            A.isFalse(flab.MessageBus.checkSubscription('foo'));
            A.isFalse(flab.MessageBus.unsubscribe(sid));
        },

        testPublish: function() {
            var self = this;

            var i = 0;
            var fun = function() {
                i++;
            };

            A.isFalse(flab.MessageBus.publish('foo', 1, 2));
            A.isTrue(subscribe('foo', fun, self));
            A.isTrue(flab.MessageBus.publish('foo', 1, 2));
            A.areSame(1, i);

            var j = 0;
            var fun2 = function(a,b) {
                j = a + b;
            };
            A.isTrue(subscribe('foo', fun2, self));
            A.isTrue(flab.MessageBus.publish('foo', 1, 2));
            A.areSame(2, i);
            A.areSame(3, j);

            i = 0;
            A.isTrue(subscribe('bar', fun));
            A.isTrue(flab.MessageBus.publish('bar'));
            A.areSame(1, i);
        },

        testCheckSubscription: function() {
            var self = this;

            var fun = function() {};
            A.isFalse(flab.MessageBus.checkSubscription('foo'));
            A.isFalse(flab.MessageBus.checkSubscription('foo', fun));
            A.isFalse(flab.MessageBus.checkSubscription('foo', fun, self));

            A.isTrue(subscribe('foo', fun));
            A.isTrue(flab.MessageBus.checkSubscription('foo'));
            A.isTrue(flab.MessageBus.checkSubscription('foo', fun));
            A.isFalse(flab.MessageBus.checkSubscription('foo', fun, self));

            A.isTrue(subscribe('foo', fun, self));
            A.isTrue(flab.MessageBus.checkSubscription('foo'));
            A.isTrue(flab.MessageBus.checkSubscription('foo', fun));
            A.isTrue(flab.MessageBus.checkSubscription('foo', fun, self));
        },

        testGetSubscription: function() {
            var self = this;

            var fun = function() {};
            var sid = flab.MessageBus.subscribe('foo', fun);
            var subscription = flab.MessageBus.getSubscription(sid);

            A.areSame(fun, subscription.subscriber);
            A.areSame(sid, subscription.sid);
            A.areSame('foo', subscription.message);
            A.isTrue(flab.MessageBus.unsubscribe(sid));
            A.isFalse(flab.MessageBus.checkSubscription('foo'));
            A.isUndefined(flab.MessageBus.getSubscription(sid));
        }
    }));
});
