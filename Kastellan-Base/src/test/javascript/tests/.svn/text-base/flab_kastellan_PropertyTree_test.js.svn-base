//= compat
//= require <flab/Test>
//= require <flab/test/TestLogger>
//= require <flab/kastellan/PropertyTree>

flab.Test.run(function(T, A) {
    T.Runner.add(new T.Case({
        name:  'flab.kastellan.PropertyTree',

        setUp: function() {
            var self = this;

        },

        tearDown: function() {
            var self = this;

        },

        test: function() {
            var self = this;
            
			var pTree = new flab.kastellan.PropertyTree('fixtures/Settings.xml');
			
			pTree.setGlobalPreferenceForKey('test' , '/asdf/fdsa');
			A.isTrue('test' == pTree.globalPreferenceForKey('/asdf/fdsa'));
			
			pTree.setGlobalPreferenceForKey(['test' , 'bla'] , '/asdf/fdsa');
			A.isTrue(typeof pTree.globalPreferenceForKey('/asdf/fdsa') == "object");
			var arr = pTree.globalPreferenceForKey('/asdf/fdsa');
			A.isTrue(arr[0] == 'test');
			A.isTrue(arr[1] == 'bla');
			
			var originalValue = pTree.globalPreferenceForKey("shaspa/persistent/cache/devicevalue/Btn1");
			A.isTrue(originalValue == 255);
			pTree.setGlobalPreferenceForKey(42 , "shaspa/persistent/cache/devicevalue/Btn1");
			A.isTrue(originalValue == 42);
        }
        
    }));
});
