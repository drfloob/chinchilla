/* jshint node: true */
/* global define, describe, it, expect, beforeEach */

(function (root, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        define(['chinchilla', 'underscore'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('../../src/chinchilla'), require('underscore'));
    } else {
        factory(root.chinchilla, root._);
    }
}(this, function (chinchilla, _) {
    'use strict';

    describe('chinchilla', function() {
        describe('.new', function() {
            it('returns something we can work with', function() {
                var data = chinchilla.new();

                expect(data.get).toBeDefined();
                expect(data.data).toBeDefined();
                expect(data.update).toBeDefined();
                expect(data.serialize).toBeDefined();

                expect(data.root().get).toBeDefined();
                expect(data.root().data).toBeDefined();
                expect(data.root().update).toBeDefined();
                expect(data.root().serialize).toBeDefined();

                expect(data.root().data()).toBe('🐭');
                expect(data.root().children().length).toBe(0);

            });
            

            it('can be added to', function () {
                var data = chinchilla.new(),
                kid = {name: 'bort'},
                data2;

                data2 = data.add(kid);
                expect(data2.root().children().length).toBe(1);
                expect(data2.get('bort')).toBeDefined();
                expect(data2.get('bort').data()).toEqual(kid);
            });

            it('can be serialized', function () {
                expect(chinchilla.new().serialize()).toEqual(['🐭']);
                expect(chinchilla.new().add({name: 'foo'}).serialize()).toEqual(['🐭', [{name: 'foo'}]]);
            });
        });

        describe('.load', function () {
            it('returns something we can work with', function() {
                var data = chinchilla.load(['🐭']);

                expect(data.get).toBeDefined();
                expect(data.data).toBeDefined();
                expect(data.update).toBeDefined();
                expect(data.serialize).toBeDefined();

                expect(data.root().get).toBeDefined();
                expect(data.root().data).toBeDefined();
                expect(data.root().update).toBeDefined();
                expect(data.root().serialize).toBeDefined();

                expect(data.root().data()).toBe('🐭');
                expect(data.root().children().length).toBe(0);

            });
            
            it('parses a root child correctly', function () {
                var data = chinchilla.load(['🐭', [{name: 'bort'}]]);
                expect(data.root().children().length).toBe(1);
                expect(data.get('bort')).toBeDefined();
                expect(data.get('bort').data()).toEqual({name: 'bort'});
            });

            it('maintains the given order (not that anyone should care)', function () {
                var obj, data;
                obj = ['🐭', [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,'bort',25]];
                data = chinchilla.load(obj);
                expect(data.serialize()).toEqual(obj);
            });

            it('can be added to', function () {
                var data = chinchilla.load(['🐭', [{name: 'bort'}]]),
                kid = {name: 'foo'},
                data2;

                data2 = data.add(kid);
                expect(data2.root().children().length).toBe(2);
                expect(data2.get('foo')).toBeDefined();
                expect(data2.get('foo').data()).toEqual(kid);
            });


            it('can be serialized', function () {
                expect(chinchilla.load(['🐭']).serialize()).toEqual(['🐭']);
                expect(chinchilla.load(['🐭', [{name: 'foo'}]]).add({name: 'bort'}).serialize()).toEqual(['🐭', [{name: 'foo'}, {name: 'bort'}]]);
            });
        });
    });


    describe('a chinchilla tree', function () {
        var data, node;
        beforeEach(function() {
            data = chinchilla.new();
            node = null;
        });

        describe('.add', function () {
            describe('takes single unserialized inputs', function () {
                
                function checkAddValue(value) {
                    data = data.add(value);
                    node = data.findNodeByData(value);
                    expect(node).toBeDefined();
                    expect(node.data()).toBe(value);
                }

                it('such as 1', function () {
                    checkAddValue(1);
                });
                it('such as 1.618', function () {
                    checkAddValue(1.618);
                });
                it('such as \'a\'', function () {
                    checkAddValue('a');
                });
                it('such as {name: \'bort\'}', function () {
                    checkAddValue({name: 'bort'});
                });
            });

            describe('takes serialized nodes', function () {

                function checkAddSerial(serial) {
                    data = data.add(serial);
                    node = data.findNodeByData(serial[0]);
                    expect(node).toBeDefined();
                    expect(node.data()).toBe(serial[0]);
                }

                it('such as [1]', function () {
                    checkAddSerial([1]);
                });
                it('such as [1.618]', function () {
                    checkAddSerial([1.618]);
                });
                it('such as [\'a\']', function () {
                    checkAddSerial(['a']);
                });
                it('such as [{name: \'bort\'}]', function () {
                    checkAddSerial([{name: 'bort'}]);
                });
                

                describe('with children', function () {

                    function checkSerialChildren(children) {
                        _.each(children, function(k) {
                            node = data.findNodeByData(k);
                            expect(node).toBeDefined();
                            expect(node.data()).toBe(k);
                        });
                    }
                    
                    it('such as [1, [2]]', function () {
                        var val = [1, [2]];
                        checkAddSerial(val);
                        checkSerialChildren(val[1]);
                    });
                    it('such as [1.618, [2]]', function () {
                        var val = [1.618, [2]];
                        checkAddSerial(val);
                        checkSerialChildren(val[1]);
                    });
                    it('such as [\'a\', [\'b\']]', function () {
                        var val = ['a', ['b']];
                        checkAddSerial(val);
                        checkSerialChildren(val[1]);
                    });
                    it('such as [{name: \'bort\'}, [{name: \'foo\'}, {name: \'bar\', age: 42}]]', function () {
                        var val = [{name: 'bort'}, [{name: 'foo'}, {name: 'bar', age: 42}]];
                        checkAddSerial(val);
                        checkSerialChildren(val[1]);
                    });
                });
            });

        });

        describe('.serialize', function () {
            it('can serialize a new tree', function () {
                expect(chinchilla.new().serialize()).toEqual(['🐭']);
            });

            it('can serialize a trivial loaded tree', function () {
                expect(chinchilla.load(['🐭']).serialize()).toEqual(['🐭']);
            });

            it('can serialize a tree after adding one item', function () {
                expect(chinchilla.new().add('x').serialize()).toEqual(['🐭', ['x']]);
            });

            it('can serialize a complex tree, and reload the serial result', function () {
                var serial, data;
                serial = ['🐭', [1, [2, [3], 4], 5]];
                expect(chinchilla.load(serial).serialize()).toEqual(serial);
                
                // the `new` counterpart to the above
                data = chinchilla.new()
                    .add([1, [2, [3], 4]])
                    .add(5);

                expect(data.serialize()).toEqual(serial);
            });
        });

        describe('.data', function () {
            it('returns the root data', function () {
                data = chinchilla.load(['bort']);
                expect(data.data()).toEqual('bort');
            });

            it('overwrites the root data', function () {
                data = chinchilla.new();
                expect(data.data()).toEqual('🐭');

                data = data.data('obliterated');
                expect(data.data()).toEqual('obliterated');
            });
        });

        describe('.update', function () {
            it('merges into existing data, overwriting same-name keys', function () {
                // setup
                data = data.data({name: 'bort'});

                data = data.update({age: 42});
                expect(data.data()).toEqual({name: 'bort', age: 42});

                data = data.update({age: 39, liar: true});
                expect(data.data()).toEqual({name: 'bort', age: 39, liar: true});
            });

            it('fails for non-object data', function () {
                expect(_.partial(data.data, {name: 'bort'})).toThrow();

                data = data.data(1);
                expect(_.partial(data.data, {name: 'bort'})).toThrow();

                data = data.data(1.618);
                expect(_.partial(data.data, {name: 'bort'})).toThrow();

                data = data.data('a');
                expect(_.partial(data.data, {name: 'bort'})).toThrow();

                data = data.data([1,2,3]);
                expect(_.partial(data.data, {name: 'bort'})).toThrow();
            });
        });

        describe('.get', function () {
            it('searches immediate child objects for a matching "name"', function () {
                var obj = ['root', [{name: '1'}, {name: '2'}, {name: '3'}, [{name: '4'}]]];
                data = chinchilla.load(obj);
                
                expect(data.get('1').data()).toBe(obj[1][0]);
                expect(data.get('2').data()).toBe(obj[1][1]);
                expect(data.get('3').data()).toBe(obj[1][2]);
                expect(data.get('4')).toBeUndefined();
            });

            it('searches for any given attribute value', function () {
                var obj = ['root', [{n: '1'}, {n: '2'}, {n: '3'}, [{n: '4'}]]];
                data = chinchilla.load(obj);
                
                expect(data.get('n', '1').data()).toBe(obj[1][0]);
                expect(data.get('n', '2').data()).toBe(obj[1][1]);
                expect(data.get('n', '3').data()).toBe(obj[1][2]);
                expect(data.get('n', '4')).toBeUndefined();
            });

            it('does not explode when children are non-objects', function () {
                var obj = ['root', [1,'a',1.618,/e/]];
                data = chinchilla.load(obj);

                expect(data.get(1)).toBeUndefined();
                expect(data.get('a')).toBeUndefined();
                expect(data.get(1.618)).toBeUndefined();
                expect(data.get(/e/)).toBeUndefined();
            });
        });

    });

    describe('subtree modified', function () {
        var data;
        beforeEach(function() {
            data = chinchilla.load(['🐭', [1,2,3,[4,5,[6,7,8,9]],10,11,[12,13,14,[15,[16,17,18,[19,20,21]],22],23,'bort'],25]]);
        });
        
        describe('.data', function() {
            var node;
            beforeEach(function () {
                node = data.findNodeByData(20);
                data = node.data('changed');
            });
            it('flags all parent nodes', function () {
                node = data.findNode(node);
                expect(node.modified).toBe(true);

                _.each([18,15,14,11,'🐭'], function(val) {
                    node = data.findNodeByData(val);
                    expect(node.modified).toBe(true);
                });
            });
            it('does not flag any other node', function () {
                _.each([1,2,3,4,5,6,7,8,9,10,  12,13,    16,17,  19,  21,22,23,'bort',25], function(val) {
                    var node = data.findNodeByData(val);
                    expect(node.modified).toBe(false);
                });
            });
        });


        describe('.parseAndAddChild', function() {
            var node;
            beforeEach(function() {
                node = data.findNodeByData(20);
                data = node.parseAndAddChild(['a', ['b', 'c']]);
            });
            it('flags all parent nodes', function () {
                node = data.findNode(node);
                expect(node.modified).toBe(true);

                _.each([20,18,15,14,11,'🐭'], function(val) {
                    node = data.findNodeByData(val);
                    expect(node.modified).toBe(true);
                });
            });
            it('flags all child nodes', function () {
                _.each(['a', 'b', 'c'], function(val) {
                    node = data.findNodeByData(val);
                    expect(node.modified).toBe(true);
                });
            });
            it('does not flag any other node', function () {
                _.each([1,2,3,4,5,6,7,8,9,10,  12,13,    16,17,  19,  21,22,23,'bort',25], function(val) {
                    var node = data.findNodeByData(val);
                    expect(node.modified).toBe(false);
                });
            });
        });


        describe('.addChildNode', function() {
            var node;
            beforeEach(function() {
                var data2 = chinchilla.load(['a', ['b', 'c']]);
                node = data.findNodeByData(20);
                data = node.addChildNode(data2.root());
            });
            it('flags all parent nodes', function () {
                node = data.findNode(node);
                expect(node.modified).toBe(true);

                _.each([20,18,15,14,11,'🐭'], function(val) {
                    node = data.findNodeByData(val);
                    expect(node.modified).toBe(true);
                });
            });
            it('flags all child nodes', function () {
                _.each(['a', 'b', 'c'], function(val) {
                    node = data.findNodeByData(val);
                    expect(node.modified).toBe(true);
                });
            });
            it('does not flag any other node', function () {
                _.each([1,2,3,4,5,6,7,8,9,10,  12,13,    16,17,  19,  21,22,23,'bort',25], function(val) {
                    var node = data.findNodeByData(val);
                    expect(node.modified).toBe(false);
                });
            });
        });


        describe('.remove', function() {
            var node;
            beforeEach(function() {
                node = data.findNodeByData(20);
                data = node.remove();
            });
            it('flags all parent nodes', function () {
                node = data.findNode(node);
                expect(node).toBeFalsy();

                _.each([18,15,14,11,'🐭'], function(val) {
                    node = data.findNodeByData(val);
                    expect(node.modified).toBe(true);
                });
            });
            it('does not flag any other node', function () {
                _.each([1,2,3,4,5,6,7,8,9,10,  12,13,    16,17,  19,  21,22,23,'bort',25], function(val) {
                    var node = data.findNodeByData(val);
                    expect(node.modified).toBe(false);
                });
            });
        });


    });

}));