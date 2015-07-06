//= compat
//= require <flab/Test>
//= require <flab/test/TestLogger>
//= require <flab/test/CheckVisibility>

flab.Test.run(function(T, A) {
    T.Runner.add(new T.Case({
        name:  'check_visibility',

        setUp: function() {},

        tearDown: function() {},

        testFeature: function() {
            var self = this,
                msg;
            if (flab.test.isDomElementVisible.isSupported) {
                A.isTrue(flab.test.isDomElementVisible.isSupported);
                msg = "flab.test.isDomElementVisible is supported in this browser";
            }
            else {
                A.isFalse(flab.test.isDomElementVisible.isSupported);
                msg = "flab.test.isDomElementVisible is not supported in this browser";
            }
            flab.log.debug(msg);
            self.addInfo(msg);
        },

        testVisibility: function() {
            var self = this;
                el = document.getElementById('visible_inner');
            if (flab.test.isDomElementVisible.isSupported) {
                A.isTrue(flab.test.isDomElementVisible(el), "Element is visible");
                A.isTrue(flab.test.isDomElementVisible(el, { checkEachPixel: true }),
                         "Every pixel is visible");
            }
            else {
                A.isTrue(true);
            }
        },

        testInvisibility: function() {
            var self = this,
                el = document.getElementById('invisible_inner');
            if (flab.test.isDomElementVisible.isSupported) {
                A.isFalse(flab.test.isDomElementVisible(el), "Element is invisible");
                A.isFalse(flab.test.isDomElementVisible(el, { checkEachPixel: true }),
                          "At least one pixel is invisible");
            }
            else {
                A.isTrue(true);
            }
        },

        addInfo: function(msg) {
            var self = this,
                el = document.createElement('p'),
                txt = document.createTextNode(msg);
            el.appendChild(txt);
            document.body.appendChild(el);
        }
    }));
});
