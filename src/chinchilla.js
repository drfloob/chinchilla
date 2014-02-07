/*
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.  
*/

/* global define */

// [UMD/returnExports.js](https://github.com/umdjs/umd/blob/master/returnExports.js)
// setup for AMD, Node.js, and Global usages.
(function (root, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['underscore', '_tree'], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        /* global module, require */
        module.exports = factory(require('underscore'), require('_tree'));
    } else {
        // Browser globals (root is window)
        root.chinchilla = factory(root._, root._tree);
    }
}(this, function (_, _tree) {
    'use strict';

    var Chinchilla, mixins;

    Chinchilla = {
        new: function() {
            var defaults = {
                mixins: mixins
            };
            return _tree.create(defaults);
        },
        load: function(data) {
            var defaults = {
                mixins: mixins
            };
            return _tree.inflate(data, _tree.inflate.byAdjacencyList, defaults);
        }
    };

    mixins = {
        // All tree mixins are shortcuts to tree.root() methods. For
        // example, `tree.get('jake')` is equivalent to
        // `tree.root().get('jake')`.
        'tree': {
            'get': function(attribute, value) {
                return this.root().get(attribute, value);
            },
            'update': function(value) {
                return this.root().update(value);
            },
            'set': function(value) {
                return this.root().set(value);
            },
            'serialize': function() {
                return this.root().serialize();
            }
        },
        'node': {
            // `get` retrieves the first child node whose `attribute`
            // matches the given `value`, or `undefined`. It only
            // looks at immediate children, not their descendants.
            // 
            // It can also be called as just `get(name)`, where
            // attribute defaults to 'name'.
            'get': function(attribute, value) {
                if (_.isUndefined(value)) {
                    value = attribute;
                    attribute = 'name';
                }
                return _.find(this.children(), function(c) {
                    return c[attribute] === value;
                });
            },

            // `update` performs a partial update on the node's
            // data. For example, if the current data is
            // 
            // `{name: 'jake', food: 'sandwich', friend: 'finn'}`
            // 
            // and you call:
            // 
            // `update({food: 'honey'})`
            //
            // the node will end up with the following data:
            //
            // `{name: 'jake', food: 'honey', friend: 'finn'}`
            'update': function(value) {
                return this.data(_.extend(_.extend({}, this.data()), value));
            },

            // `set` performs a full update on the node's data. For
            // example, if the current data is
            // 
            // `{name: 'jake', food: 'sandwich', friend: 'finn'}`
            // 
            // and you call:
            // 
            // `set({food: 'honey'})`
            //
            // the node will end up with the following data:
            //
            // `{food: 'honey'}`
            'set': function(value) {
                return this.data(value);
            },

            // `serialize` shrinks the data down into a small,
            // storable representation that can be reloaded with
            // `chinchilla.load`.
            'serialize': function serialize () {
                var ret = [this.data()];
                if (!_.isEmpty(this.children())) {
                    ret.push(_.flatten(_.map(this.children(), serialize), true));
                }
                return ret;
            }
        }
    };


    return Chinchilla;
}));