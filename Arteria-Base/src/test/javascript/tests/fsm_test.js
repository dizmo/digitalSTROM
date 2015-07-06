//= compat
//= require <flab/Test>
//= require <flab/test/TestLogger>
//= require <flab/FiniteStateMachine>

flab.Test.run(function(T, A) {
    T.Runner.add(new T.Case({

        name: "flab.FiniteStateMachine",

        setUp: function() { },
        
        tearDown: function() { },
        
        testConstructor: function() {
            A.nothingRaised(function() {
                var fsm = new flab.FiniteStateMachine();
            });
        },

        testBuild: function() {
            var fsm = new flab.FiniteStateMachine();

            A.nothingRaised(function() {
                fsm.build('StateA', {
                    StateA: {
                        onNext: 'StateB'
                    },
                    StateB: {
                        onNext: 'StateA'
                    }
                });
            });
        },

        testConstructorAndBuild: function() {
            var self = this;

            A.nothingRaised(function() {
                var fsm = new flab.FiniteStateMachine('StateA', {
                    StateA: {
                        onNext: 'StateB'
                    },
                    StateB: {
                        onNext: 'StateA'
                    }
                });
            });
        },

        testStateTransitions: function() {
            var fsm = new flab.FiniteStateMachine();

            fsm.build('StateA', {
                StateA: {
                    onNext: 'StateB'
                },
                StateB: {
                    onNext: 'StateA'
                }
            });

            A.nothingRaised(function() {
                fsm.processEvent('onNext');
            });
            A.areSame('StateB', fsm.getState());

            A.nothingRaised(function() {
                fsm.processEvent('onNext');
            });
            A.areSame('StateA', fsm.getState());

            /* test unknown event */
            A.nothingRaised(function() {
                fsm.processEvent('fooBarBazSpamEggsHam');
            });
        },

        testComplexStateTransitions: function() {
            var fsm = new flab.FiniteStateMachine();
            fsm.build('StateA', {
                StateA: {
                    onNext: 'StateB',
                    onGoLast: 'StateD'
                },
                StateB: {
                    onNext: 'StateC',
                    onGoSelf: 'StateB'
                },
                StateC: {
                    onNext: 'StateD'
                },
                StateD: {
                    onNext: 'StateA',
                    onBack: 'StateC'
                }
            });

            /* proceed once forward */
            fsm.processEvent('onNext');
            A.areSame('StateB', fsm.getState());
            fsm.processEvent('onNext');
            A.areSame('StateC', fsm.getState());
            fsm.processEvent('onNext');
            A.areSame('StateD', fsm.getState());
            fsm.processEvent('onNext');
            A.areSame('StateA', fsm.getState());

            /* test other events to jump for and back */
            fsm.processEvent('onGoLast');
            A.areSame('StateD', fsm.getState());
            fsm.processEvent('onBack');
            A.areSame('StateC', fsm.getState());

            /* test for this state unhandled events */
            fsm.processEvent('onBack');
            A.areSame('StateC', fsm.getState());
            fsm.processEvent('onGoLast');
            A.areSame('StateC', fsm.getState());

            /* finally jump forward to last element */
            fsm.processEvent('onNext');
            A.areSame('StateD', fsm.getState());

            /* test transition to self */
            fsm.processEvent('onNext');
            fsm.processEvent('onNext');
            fsm.processEvent('onGoSelf');
            A.areSame('StateB', fsm.getState());
        },

        testEnterLeaveEvent: function() {
            var fsm = new flab.FiniteStateMachine();
            fsm.build('StateA', {
                StateA: {
                    onNext: 'StateB'
                },
                StateB: {
                    onNext: 'StateA'
                }
            });
            var context = { events: [] };
            A.nothingRaised(function() {
                fsm.registerHandler('onStateEnter', function(fsm, state) {
                    context.events.push(state);
                });
                fsm.registerHandler('onStateLeave', function(fsm, state) {
                    context.events.push(state);
                });
                fsm.registerHandler('onTransition', function(fsm, fromState, toState) {
                    context.events.push(fromState + '-' + toState);
                });
            });

            A.array.isEmpty(context.events);

            fsm.processEvent('onNext');
            fsm.processEvent('onNext');
            fsm.processEvent('fooBarBazSpamEggsHam');
            fsm.processEvent('onNext');

            A.array.itemsAreSame(['StateA', 'StateA-StateB', 'StateB',
                            'StateB', 'StateB-StateA', 'StateA',
                            'StateA', 'StateA-StateB', 'StateB'], context.events);
        },

        testTransitionFunction: function() {
            var state = 'untouched';
            var fsm = new flab.FiniteStateMachine();
            fsm.build('StateA', {
                StateA: {
                    onGoB: {
                        transitionTo: 'StateB',
                        execute: function() {
                            state = 'toB';
                        }
                    },
                    onGoC: {
                        transitionTo: 'StateC',
                        execute: function() {
                            state = 'toC';
                        }
                    }
                },
                StateB: {
                    onBack: 'StateA'
                },
                StateC: {
                    onBack: 'StateA'
                }
            });

            A.areSame('untouched', state);
            fsm.processEvent('onGoB');
            A.areSame('toB', state);

            state = 'reset';
            fsm.processEvent('onBack');
            A.areSame('reset', state);

            fsm.processEvent('onGoC');
            A.areSame('toC', state);

            state = 'reset';
            fsm.processEvent('onBack');
            A.areSame('reset', state);
        },

        testTransitionCondition: function() {
            var ctx = {};
            var fsm = new flab.FiniteStateMachine();
            fsm.build('StateA', {
                StateA: {
                    onNext: {
                        condition: function (fsm, state) {
                            return ctx.target;
                        }
                    }
                },
                StateB: {
                    onBack: 'StateA'
                },
                StateC: {
                    onBack: 'StateA'
                }
            });

            ctx.target = 'StateC';
            fsm.processEvent('onNext');
            A.areSame('StateC', fsm.getState());

            fsm.processEvent('onBack');

            ctx.target = 'StateB';
            fsm.processEvent('onNext');
            A.areSame('StateB', fsm.getState());
        },

        testGraphVizOutput: function() {
            var fsm = new flab.FiniteStateMachine('StateA', {
                StateA: {
                    onNext: 'StateB'
                },
                StateB: {
                    onPrev: 'StateA',
                    onNext: 'StateC',
                    onTest: {
                        transitionTo: 'StateTest',
                        execute: function() {}
                    }
                },
                StateC: {
                    onPrev: {
                        transitionTo: 'StateB',
                        execute: function() {}
                    }
                },
                StateTest: {
                    onAgain: 'StateTest'
                }
            });

            var dot;
            A.nothingRaised(function() {
                dot = fsm.generateGraphViz();
            });

            A.assert(typeof dot == 'string');
            A.areNotSame(0, dot.length);
            if (window.console && window.console.debug) {
                console.debug(dot);
            }

            var pre = document.createElement('pre');
            var txt = document.createTextNode(dot);
            pre.appendChild(txt);
            document.body.appendChild(pre);
        }
    }));
});
