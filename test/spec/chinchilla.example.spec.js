/* jshint node: true */
/* global define, describe, it, expect */

(function (root, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        define(['chinchilla', 'underscore'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('../../src/chinchilla'), require('underscore'));
    } else {
        factory(root.chinchilla, root._);
    }
}(this, function (chinchilla) {
    'use strict';

    describe('the example in the README', function() {

        it('does everything it says', function () {

            var patronage, familyTree, charlie, chuckFamilyTree, outputLineage, output;

            patronage = [{'name': 'Jake'}, [
                {'name': 'Jake Jr.'},
                {'name': 'T.V.'},
                {'name': 'Charlie'},
                {'name': 'Viola'}
            ]];
            familyTree = chinchilla.load(patronage);

            // add a child, and save the new tree.
            expect(familyTree.modified).toBe(false);
            familyTree = familyTree.add({'name': 'Kim Kil Wam'});
            expect(familyTree.modified).toBe(true);

            // Walks the tree, collecting everyone's name and their father's name
            output = [];
            outputLineage = function(node) {
                var origin = 'origin unknown';
                if (node.parent()) {
                    origin = 'is the child of ' + node.parent().data().name;
                }
                output.push([node.data().name, origin]);
            };
            familyTree.walk(outputLineage);
            
            expect(output[0]).toEqual(['Jake', 'origin unknown']);
            expect(output[1]).toEqual(['Jake Jr.', 'is the child of Jake']);
            expect(output[2]).toEqual(['T.V.', 'is the child of Jake']);
            expect(output[3]).toEqual(['Charlie', 'is the child of Jake']);
            expect(output[4]).toEqual(['Viola', 'is the child of Jake']);
            expect(output[5]).toEqual(['Kim Kil Wam', 'is the child of Jake']);

            // Charlie goes by Chuck now
            charlie = familyTree.get('Charlie');
            chuckFamilyTree = charlie.update({name: 'Chuck'});

            // Make sure Chuck's name is changed in the new tree ...
            expect(chuckFamilyTree.serialize()).toEqual([{'name': 'Jake'}, [
                {'name': 'Jake Jr.'},
                {'name': 'T.V.'},
                {'name': 'Chuck'}, // changed
                {'name': 'Viola'},
                {'name': 'Kim Kil Wam'}
            ]]);

            // ... and *not* in the old tree
            expect(familyTree.serialize()).toEqual([{'name': 'Jake'}, [
                {'name': 'Jake Jr.'},
                {'name': 'T.V.'},
                {'name': 'Charlie'}, // unchanged
                {'name': 'Viola'},
                {'name': 'Kim Kil Wam'}
            ]]);
        });
    });
}));