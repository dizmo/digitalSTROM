//= compat
//= require <flab/Test>
//= require <flab/test/TestLogger>
//= require <flab/Properties>

flab.Test.run(function(T, A) {
	T.Runner.add(new T.Case({

		name: "flab.Properties",

		setUp: function() {
			flab.Config = flab.Properties();
		},

		tearDown: function() { },

		testConfigIsThere: function() {
			A.isNotUndefined(flab.Config, "flag.Config is not defined");
		},

        testEmptyArgument: function() {
            var cfg;
            A.nothingRaised(function() {
                cfg = flab.Properties();
            });
            A.isObject(cfg);

            // test more thane one instance
            cfg.set('a', 2342);
            A.areSame(2342, cfg.get('a'));
            cfg = flab.Properties();
            A.isUndefined(cfg.get('a'));
        },

		testDefaultArgument: function() {
			var cfg = flab.Properties({
				"flat": "ValueOfFlat",
				"nested": {
					"element": "ValueOfNestedElement",
					"another": "ValueOfNestedAnother"
				}
			});

			A.areSame("ValueOfFlat", cfg.get("flat"));
			A.areSame("ValueOfNestedElement", cfg.get("nested.element"));
			A.areSame("ValueOfNestedAnother", cfg.get("nested.another"));
		},

		testDefaultJSONArgument: function() {
			var cfg = flab.Properties('{ "flat": "ValueOfFlat",' +
				'"nested": { "element": "ValueOfNestedElement",' +
				'"another": "ValueOfNestedAnother" } }'
			);

			A.areSame("ValueOfFlat", cfg.get("flat"));
			A.areSame("ValueOfNestedElement", cfg.get("nested.element"));
			A.areSame("ValueOfNestedAnother", cfg.get("nested.another"));
		},

		testFlatSettings: function() {
			var cfg = flab.Properties({});

			A.nothingRaised(function() {
				cfg.set("hello", "World!");
			});

			A.areSame("World!", cfg.get("hello"),
					  "Value returned differs from value set before");
		},

		testClear: function() {
			var cfg = flab.Properties({});

			A.nothingRaised(function() {
				cfg.set("key", "value");
			});
			A.areSame("value", cfg.get("key"));
			A.nothingRaised(function() {
				cfg.clear();
			});
			A.isUndefined(cfg.get("key"));
			A.isUndefined(cfg.get("hello"));
		},

		testHierarchicalSettings: function() {
			var cfg = flab.Properties({});
			cfg.clear();

			A.nothingRaised(function() {
				cfg.set("foo.bar", "FooBar");
				cfg.set("foo.baz", "FooBaz");
			});

			A.areEqual("FooBar", cfg.get("foo.bar"));
			A.areEqual("FooBaz", cfg.get("foo.baz"));
		},

		testOverrideSetting: function() {
			var cfg = flab.Properties({});
			cfg.clear();

			A.nothingRaised(function() {
				cfg.set("foo.bar.baz", "FooBarBaz");
			});
			A.areSame("FooBarBaz", cfg.get("foo.bar.baz"));

			A.nothingRaised(function() {
				cfg.set("foo.bar.baz.eggs.spam", "FooBarBazEggsSpam");
			});
			A.isUndefined(cfg.get("foo.bar.baz.eggs.spam"));
			A.areSame("FooBarBaz", cfg.get("foo.bar.baz"));

			A.nothingRaised(function() {
				cfg.set("foo.bar.baz", "overrideFooBarBaz");
			});
			A.areSame("overrideFooBarBaz", cfg.get("foo.bar.baz"));
		},

		testDataTypes: function() {
			var cfg = flab.Properties({});
			cfg.clear();

			A.nothingRaised(function() {
				cfg.set("data.int", 42);
				cfg.set("data.string", "Hello World");
				cfg.set("data.function", function(x) { return 2*x; });
				cfg.set("data.hash", { key: "value" });
				cfg.set("data.list", [1, 2, 3]);
			});
			A.areEqual(42, cfg.get("data.int"));
			A.areEqual("Hello World", cfg.get("data.string"));
			A.areEqual(14, cfg.get("data.function")(7));
			A.areEqual("value", cfg.get("data.hash").key);
			A.areEqual(1, cfg.get("data.list")[0]);
			A.areEqual(2, cfg.get("data.list")[1]);
			A.areEqual(3, cfg.get("data.list")[2]);
		},

		testHasKey: function() {
			var cfg = flab.Properties({});

			A.assert(!cfg.hasKey('check.here'), "key is available but should not");
			cfg.set("check.here", true);
			A.assert(cfg.hasKey("check.here"), "key is not available, but should be");
		},

		testSubProperties: function() {
			var cfg = flab.Properties({
				a: {
					aa: {
						aaa: 1,
						aab: 2
					},
					ab: {
						aba: 3,
						abb: 4
					}
				},
				b: {
					ba: {
						baa: 5,
						bab: 6,
						bac: 7
					},
					bb: 8,
					bc: 9
				}
			});
			A.areSame(3, cfg.get("a.ab.aba"));
			A.areSame(8, cfg.get("b.bb"));

			var cfga;
			var cfgb;
			A.nothingRaised(function() {
				cfga = cfg.subproperties("a");
				cfgb = cfg.subproperties("b");
			});
			A.areSame(1, cfga.get("aa.aaa"));
			A.areSame(3, cfga.get("ab.aba"));
			A.areSame(6, cfgb.get("ba.bab"));
			A.areSame(9, cfgb.get("bc"));
			var cfgaa;
			A.nothingRaised(function() {
				cfgaa = cfg.subproperties("a.aa");
			});
			A.areSame(2, cfgaa.get("aab"));
			var cfgba;
			A.nothingRaised(function() {
				cfgba = cfgb.subproperties("ba");
			});
			A.areSame(5, cfgba.get("baa"));
		},

		testSubPropertiesFlags: function() {
			var cfg = flab.Properties({
				a: {
					aa: {
						aaa: 1,
						aab: 2
					},
					ab: 3
				}
			});
			var subcfg_clone = cfg.subproperties('a.aa', { clone: true });
			A.areSame(1, subcfg_clone.get("aaa"));
			subcfg_clone.set("aac", 101);
			A.areSame(101, subcfg_clone.get("aac"));
			A.isUndefined(cfg.get("a.aa.aac"));

			var subcfg_noclone = cfg.subproperties('a.aa');
			subcfg_noclone.set("aad", 102);
			A.areSame(102, subcfg_noclone.get("aad"));
			A.areSame(102, cfg.get("a.aa.aad"));
		},

		testSetDefaults: function () {
			var cfg = flab.Properties({
				a: {
					aa: 1,
					ab: 2
				},
				b: {
					ba: 3,
					bb: 4
				},
				c: 5
			});
			A.nothingRaised(function () {
				cfg.setDefaults("", {
					d: 6
				});
			});
			A.areSame(6, cfg.get("d"));
			A.nothingRaised(function () {
				cfg.setDefaults("a.ac", {
					aca: 7,
					acb: {
						acba: 8,
						acbb: 9
					}
				});
			});
			A.areSame(1, cfg.get("a.aa"));
			A.areSame(7, cfg.get("a.ac.aca"));
			A.areSame(8, cfg.get("a.ac.acb.acba"));
			A.areSame(9, cfg.get("a.ac.acb.acbb"));

			A.nothingRaised(function () {
				cfg.setDefaults("b", {
					bb: 10,		// must not override previous 4
					bc: 11
				});
			});
			A.areSame(3, cfg.get("b.ba"));
			A.areSame(4, cfg.get("b.bb"));
			A.areSame(11, cfg.get("b.bc"));
		},

		testRemove: function () {
			var cfg = flab.Properties({
				a: 1,
				b: 2,
				c: {
					ca: 3,
					cb: 4,
					cc: 5
				}
			});
			A.nothingRaised(function () {
				cfg.remove("a");
			});
			A.isUndefined(cfg.get("a"));
			A.areSame(2, cfg.get("b"));
			A.areSame(3, cfg.get("c.ca"));

			A.nothingRaised(function () {
				cfg.remove("c.cc");
			});
			A.isUndefined(cfg.get("c.cc"));
			A.areSame(3, cfg.get("c.ca"));
			A.areSame(4, cfg.get("c.cb"));

			A.nothingRaised(function () {
				cfg.remove("c");
			});
			A.isUndefined(cfg.get("c.cb"));
			A.isUndefined(cfg.get("c.cc"));
			A.isUndefined(cfg.get("c"));
			A.areSame(2, cfg.get("b"));
		},

		testMerge: function() {
			var self = this;

			var initialData = function() {
				return {
					a: [1,2,3],
					b: {
						a: 1,
						b: 2,
						c: {
							a: 1
						}
					},
					c: 1,
					f: function() {}
				};
			};

			// Basics
			var cfg = flab.Properties(initialData());
			cfg.merge({
				b: {
					d: 3,
					c: {
						b: 2,
						c: {
							a: 1
						}
					}
				},
				d: 4
			});
			A.areSame(3, cfg.get('b.d'));
			A.areSame(4, cfg.get('d'));
			A.areSame(2, cfg.get('b.c.b'));
			A.areSame(1, cfg.get('b.c.c.a'));

			// No overwriting occurs
			cfg = flab.Properties(initialData());
			cfg.merge({
				b: 1,
				c: {
					a: 1
				}
			});
			A.areNotSame(1, cfg.get('b'));
			A.areSame(1, cfg.get('c'));

			// Test overwriting
			cfg.merge({
				a: [4, 5, 6],
				b: 1,
				c: {
					a: 1
				},
				f: 1
			}, {overwrite: true} );
			A.areNotSame(1, cfg.get('b'));
			A.areNotSame(1, cfg.get('c'));
			A.areSame(1, cfg.get('c.a'));
			A.areSame(1, cfg.get('f'));
            for (var n = 0; n < 3; ++n) {
                A.areSame(n + 4, cfg.get('a')[n]);
            }

			// Test if key parameter works
			cfg = flab.Properties(initialData());
			cfg.merge({
				b: 1,
				c: {
					a: 1
				}
			}, {key: 'b.c'});
			A.areSame(1, cfg.get('b.c.b'));
			A.areSame(1, cfg.get('b.c.c.a'));

			cfg.merge({
				b: 1,
				c: {
					a: 1
				}
			}, {key: 'b.c.x.y.z'});
			A.areSame(1, cfg.get('b.c.x.y.z.b'));
			A.areSame(1, cfg.get('b.c.x.y.z.c.a'));

			// Check boolean values
			cfg = flab.Properties({
				collections: {
					useOldUpdateApi: true
				}
			});
			cfg.merge({
				collections: {
					useOldUpdateApi: false
				}
			}, { overwrite: true });
			A.areSame(false, cfg.get('collections.useOldUpdateApi'), 'config merged');

			// Check null values
            cfg = flab.Properties({
                parentNode: {
                    nullValue: null
                }
            });
            cfg.merge({
                parentNode: {
                    nullValue: null,
                    anotherNullValue: null
                }
            }, { overwrite: true });
            A.areSame(null, cfg.get('parentNode.nullValue'));
            A.areSame(null, cfg.get('parentNode.anotherNullValue'));

			// More complex boolean check
			cfg = flab.Properties({
				collections: {
					folders: {
						originConfig: {
							editors: {
								image: {
									useOldUpdateApi: true
								}
							}
						}
					}
				}
			});
			cfg.merge({
				collections: {
					folders: {
						originConfig: {
							editors: {
								image: {
									useOldUpdateApi: false
								}
							}
						}
					}
				}
			}, { overwrite: true });
			A.areSame(false, cfg.get('collections.folders.originConfig.editors.image.useOldUpdateApi'), 'config merged');

			// flab.log.debug(cfg.toJSON());
		},

		testPerformance: function() {
			var self = this;

			var cfg = flab.Properties({
				a: {
					b: {
						c: {
							d: {
								e: {
									f: 1
								}
							}
						}
					}
				}
			});
			var failed = false;
			var duration_ms = A.benchmark(function() {
				if (1 !== cfg.get('a.b.c.d.e.f')) {
					failed = true;
				}
			}, 1000);
			A.assert(!failed, 'Get benchmark didn\'t fail');
			A.assert(duration_ms < 100, 'Get benchmark completed in less than 100ms');

			failed = false;
			var count = 0;
			duration = A.benchmark(function() {
				cfg.set('a.b.c.d.e.f', count);
				if (count !== cfg.get('a.b.c.d.e.f')) {
					failed = true;
				}
				count++;
			}, 1000);
			A.assert(!failed, 'Count benchmark didn\'t fail');
			A.assert(duration_ms < 200, 'Count benchmark completed in less than 200ms');
		}
	}));
});
