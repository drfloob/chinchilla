/* global define, describe, it, expect */

(function (root, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['chinchilla', 'underscore'], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        /* global module, require */
        module.exports = factory(require('../../src/chinchilla'), require('underscore'));
    } else {
        // Browser globals (root is window)
        factory(root.chinchilla, root._);
    }
}(this, function (chinchilla, _) {
    'use strict';

    describe('fake', function() {
        it('doesn\'t do anything', function() {
            expect([_, chinchilla]).not.toBeFalsy();
        });
    });

}));