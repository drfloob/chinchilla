An immutable "hash tree", or hierarchical dictionary. Generally
useful, intended to integrate with [facebook/react][react] (TBD).  See
[drfloob/_tree][drf_tree] for implementation details and full API.
Chinchilla augments `_tree` with some sugar, making it act more like a
hash tree.  Chinchilla also standardizes on a serial object
representation, and implements basic JS-object (de)serialization.


## Example

Behavior is identical to the example in drfloob/_tree

```javascript
var patronage, familyTree, charlie, chuckFamilyTree, printLineage;

patronage = [{'name': 'Jake'}, [
    {'name': 'Jake Jr.'},
    {'name': 'T.V.'},
    {'name': 'Charlie'},
    {'name': 'Viola'}
]];
familyTree = chinchilla.load(patronage);

// add a child, and save the new tree.
familyTree = familyTree.add({'name': 'Kim Kil Wam'});

// Prints the tree with everyone's name and their father's name
printLineage = function(node) {
    var origin = ', origin unknown';
    if (node.parent()) {
        origin = 'is the child of ' + node.parent().data().name;
    }
    console.log(node.data().name, origin);
};
familyTree.walk(printLineage);

// Charlie goes by Chuck now
charlie = familyTree.get('Charlie');
chuckFamilyTree = charlie.update({name: 'Chuck'});

// Make sure Chuck's name is changed in the new tree ...
chuckFamilyTree.walk(printLineage);

// ... and *not* in the old tree
familyTree.walk(printLineage);


// serialization, jasmine test notation
expect(chuckFamilyTree.serialize()).toEqual([{'name': 'Jake'}, [
    {'name': 'Jake Jr.'},
    {'name': 'T.V.'},
    {'name': 'Chuck'},
    {'name': 'Viola'}
]]);
```



## Why "Chinchilla"?

Named after the unique "Chinchilla Red" petrified wood, native to
Australia. What could be a better name for an immutable tree?


[react]: https://github.com/facebook/react
[drf_tree]: https://github.com/drfloob/_tree
