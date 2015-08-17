/* global space */
var Functions = {};

Functions.buy = function() {
    print(space.ship.orbiting);
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