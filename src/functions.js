/* global space */
var Functions = {};

Functions.buy = function() {
    var planet = space.ship.orbiting;
    print(planet.type);
    print(planet.economy);
    print(planet.government);
    print(planet.terrain);
};

Functions.sell = function() {
    print('selling goods');
};

Functions.explore = function() {
    print('exploring');
    var resultsList;
    // figure out range of exploration results based on player skill
    var exploreResult = 200;
    resultsList.push({
        title: "Expedition Result",
        icon: "test_icon",
        text: "You explored 200 sq. miles of the planet's surface.",
        result: function() {
            space.data.exploration[space.ship.orbiting.id].explored += exploreResult;
        }
    });
    // can't explore a planet you're not orbiting
    // if you're orbiting a planet, you've scanned it
    // so, can assume that there is an exploration object available
    var currentExploration = space.data.exploration[space.ship.orbiting.id].explored;
    // if you uncovered something during this explore, add to results
};

Functions.hireExplorers = function() {
    print('hired explorers');
};

/* ideas for planet random encounters:
Cached Goods
Shipwreck
Well-charted
*/

module.exports = Functions;