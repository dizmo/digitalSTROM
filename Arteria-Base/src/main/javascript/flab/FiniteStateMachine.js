//= compat
//= require <flab/Namespace>
//= require <flab/Class>

flab.Namespace.create("flab.FiniteStateMachine");

flab.FiniteStateMachine = flab.Class.extend(Object,
    /** @lends flab.FiniteStateMachine.prototype */
{

	/**
	 * Finite State Machine implementation.
	 *
	 * Using a very simple declarative JavaScript syntax, you are able to build
	 * basic finite state machines even with support for condition based branching.
	 *
	 * The design proposes to use function on transitions to call custom code.
	 *
	 * The state description has following layout:
	 *
	 * @example
	 * {
	 *     State1: {
	 *         Event1: 'TargetStateName',
	 *         Event2: {
	 *             transitionTo: 'TargetStateName',
	 *             execute: function (fsm, fromState, toState) { ... },
	 *         }
	 *         Event3: {
	 *             condition: function (fsm, fromState) { return 'targetStateName'; },
	 *         }
	 *         EventN: ...
	 *     },
	 *     State2: { ... },
	 *     StateN: { ... }
	 * }
	 *
     * @description
     * Note: Don't use any undocumented parameters in state machine events. You
     * should never use on of the onStateEnter or onStateLeave events to do things
     * that are dependend on transition. Use a transition instead. (Usually you
     * don't need that feature much).
	 *
     * @example
	 * Example state machine: A door bell should ring if the door gets closed
	 *
	 * <code>
	 * var fsm = new flab.FiniteStateMachine('ClosedState', {
	 *     ClosedState: {
	 *         onOpen: 'OpenState'
	 *     },
	 *     OpenState: {
	 *         onClose: {
	 *             transitionTo: 'StateA',
	 *             execute: function() {
	 *                 door.bell();
	 *             }
	 *         }
	 *     }
	 * });
	 * </code>
     *
	 * @param {String} start Name of the starting state.
	 * @param {Object} states State machine description structure
	 * @class flab.FiniteStateMachine
	 * @constructs
	 */
	constructor: function(start, states) {
		var self = this;
		self.states = [];
		self.handlers = {};
		self.registerEvents(
            /**
             * @event onStateEnter
             * Emitted if a state is entered.
             * @note Don't use any undocumented parameters
             * @param {flab.FiniteStateMachine} fsm The finite state machine instance
             * @param {String} state The state that is entered
             */
            'onStateEnter',
            /**
             * @event onStateLeave
             * Emitted whenever a state is left.
             * @note Don't use any undocumented parameters
             * @param {flab.FiniteStateMachine} fsm The finite state machine instance
             * @param {String} state The state that is left
             */
            'onStateLeave',
            /**
             * @event onTransition
             * Emitted during a transition from a state to another
             * @note Don't use any undocumented parameters
             * @param {flab.FiniteStateMachine} fsm The finite state machine instance
             * @param {String} fromState The starting state that this transition origins
             * @param {String} toState The destination state that this transition targets
             */
            'onTransition'
        );
		if ((start !== undefined) && (states !== undefined)) {
			self.build(start, states);
		}
	},

	/** current state */
	state: undefined,
	/** all known states */
	states: undefined,
	/** list of event handlers */
	handlers: undefined,

	/**
	 * Build the state machine after construction.
	 * Replaces any existing state machine description.
	 * @param {String} start Name of the starting state.
	 * @param {Object} states State machine description structure
	 */
	build: function(start, states) {
		var self = this;
		if (start === undefined) {
			throw new Error("Start state not defined");
		}
		if (states === undefined || typeof states != 'object') {
			throw new Error("No states specified");
		}
		self.states = states;
		self.state = start;
		self.emit('onStateEnter', self, start, self.states[start], null);
	},

	/**
	 * Get current state machine state
	 * @returns {String} current state name
	 */
	getState: function() {
		var self = this;
		return self.state;
	},

	/**
	 * Register an event handler for a named event
	 * @param {String} name Event name
	 * @param {Function} handler Event handler to call
	 * @param {Object} context context to call the event handler with
	 */
	registerHandler: function(name, handler) {
		var self = this;
		self.handlers[name].push(handler);
	},

	/**
	 * Send an event to the state machine. The event may trigger
	 * a transition to another state.
	 * @param {String} event The event to send to the state machine
	 */
	processEvent: function(event) {
		var self = this;
		var state = self.states[self.state];
		if (state === undefined) {
			throw new Error("Current state not defined");
		}
		var transition = state[event];
		if (transition === undefined) {
			return;
		}
		var nextStateName, handler;
		if (typeof transition == 'string') {
			nextStateName = transition;
		}
		else {
			if (flab.Utils.isFunction(transition.condition)) {
				nextStateName = transition.condition(self, self.state);
			}
			else {
				nextStateName = transition.transitionTo;
			}
			handler = transition.execute;
		}
		var nextState = self.states[nextStateName];
		if (nextState === undefined) {
			return;
		}
		self.emit('onStateLeave', self, self.state, event);
		if (handler !== undefined) {
			handler(event, self.state, nextStateName);
		}
		var fromState = self.state;
		self.state = nextStateName;
		self.emit('onTransition', self, fromState, nextStateName, event);
		self.emit('onStateEnter', self, nextStateName, nextState, event);
	},

	/**
	 * Register event names
	 * @private
	 */
	registerEvents: function() {
		var self = this;
		for (var i = 0; i < arguments.length; i++) {
			self.handlers[arguments[i]] = [];
		}
	},

	/**
	 * Execute all event handler bound to an event.
	 * @param {String} event Name of an event, must be registered first.
	 * @param {arguments} ... arguments to call event handler
	 */
	emit: function(event) {
		var self = this;
		var args = [];
		for (var n = 1; n < arguments.length; n++) {
			args.push(arguments[n]);
		}
		var handlers = self.handlers[event];
		if (handlers === undefined) {
			throw new Error("No event handler defined for '" + event + "'");
		}
		for (var i = 0; i < handlers.length; i++) {
			var func = handlers[i];
			func.apply(null, args);
		}
	},

	/**
	 * Generate a graphviz visualisation of the state machine
	 */
	generateGraphViz: function() {
		var self = this;
		var lines = [];
		lines.push('digraph fsm {');
		lines.push('  node [ shape=box ];');
		for (var state in self.states) {
			if (self.states.hasOwnProperty(state)) {
			var events = self.states[state];
                for (var e in events) {
                    if (events.hasOwnProperty(e)) {
                        var transition = events[e];
                        if (typeof transition == 'string') {
                            lines.push('  ' + state + ' -> ' + transition + ' [ label="' + e + '" ];');
                        }
                        else if (typeof transition == 'object') {
                            if (transition.condition !== undefined) {
                                /* TODO: this is not easy without external guidance */
                            }
                            else if (transition.transitionTo !== undefined) {
                                lines.push('  ' + state + ' -> ' + transition.transitionTo + ' [ label="' + e + '" ];');
                            }
                            else {
                                throw new Error("unknown transition object at " + state + "/" + e);
                            }
                        }
                        else {
                            throw new Error("unknown transition type");
                        }
                    }
                }
			}
		}
		lines.push('}');
		return lines.join('\n');
	}
});

