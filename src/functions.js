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
};

Functions.hireExplorers = function() {
    print('hired explorers');
};

module.exports = Functions;