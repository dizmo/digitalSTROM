//= compat
//= require <flab/Namespace>
//= require <flab/logger/GlobalLogger>

flab.Namespace.create('flab.test');

/**
 * @function
 * Check if an element is visible within a page.
 * The visibility check is done with help of <tt>document.elementFromPoint(x, y)</tt>.
 * This should work at least in Firefox and IE.
 *
 * This code was adapted from the code of StackOverflow user Tobias:
 * http://stackoverflow.com/questions/704758/how-to-check-if-an-element-is-really-visible-with-javascript
 * see also http://www.quirksmode.org/dom/tests/elementfrompoint.html
 *
 * Note: don't use this function outside of tests. It's not intended for production
 * level code.
 *
 * @param {DOMElement} element The element to check
 * @param {Object} options Options to influence how the check is done
 * @param {Boolean} options.checkEachPixel whether to make a rough check (false)
 *                                         or to check every pixel (slow) (true)
 * @return {Boolean} whether the element is visible or not
 *
 */
flab.test.isDomElementVisible = (function() {
    var _doc = document,
        _fn;

    function _on_top_each_pixel(r, orig_element) {
        for (var x = Math.floor(r.left), x_max = Math.ceil(r.right); x <= x_max; x++) {
            for (var y = Math.floor(r.top), y_max = Math.ceil(r.bottom); y <= y_max; y++) {
                if (_doc.elementFromPoint(x, y) === orig_element) {
                    return true;
                }
            }
        }
        return false;
    }

    function _on_top_fast_range(r, orig_element) {
        var x = (r.left + r.right) / 2,
            y = (r.top + r.bottom) / 2;
        return (_doc.elementFromPoint(x, y) === orig_element);
    }

    function _is_dom_element_visible(element, options) {
        if (element.offsetWidth === 0 || element.offsetHeight === 0) {
            return false;
        }
        var height = _doc.documentElement.clientHeight,
            rects = element.getClientRects(),
            on_top;

        if (options && options.checkEachPixel) {
            on_top = _on_top_each_pixel;
        }
        else {
            on_top = _on_top_fast_range;
        }

        for (var i = 0, l = rects.length; i < l; i++) {
            var r = rects[i],
                in_viewport = (r.top > 0) ? (r.top <= height) : (r.bottom > 0 && r.bottom <= height);
            if (in_viewport && on_top(r, element)) {
                return true;
            }
        }
        return false;
    }

    function _check_feature() {
        try {
            var el = _doc.createElement('div'),
                txt = _doc.createTextNode("visible"),
                shouldBeVisible,
                shouldBeInvisible,
                fatEl,
                invisibleEl;
            el.appendChild(txt);
            _doc.body.appendChild(el);
            try {
                shouldBeVisible = _is_dom_element_visible(el);
                el.removeChild(txt);

                el.setAttribute('style', 'overflow: hidden; width: 1px; height: 1px;');
                fatEl = _doc.createElement('div');
                fatEl.setAttribute('style', 'width: 100px, height: 100px;');
                el.appendChild(fatEl);
                invisibleEl = _doc.createElement('div');
                invisibleEl.appendChild(txt);
                shouldBeInvisible = !_is_dom_element_visible(invisibleEl);
            }
            finally {
                _doc.body.removeChild(el);
            }
            return shouldBeVisible && shouldBeInvisible;
        }
        catch (e) {
            return false;
        }
    }

    function _unsupported() {
        flab.log.warn("flab.test.isDomElementVisible DOM visibility is not supported");
    }

    if (_check_feature()) {
        _fn = _is_dom_element_visible;
        _fn.isSupported = true;
    }
    else {
        _fn = _unsupported;
        _fn.isSupported = false;
    }

    return _fn;
}());
