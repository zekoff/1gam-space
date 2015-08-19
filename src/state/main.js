/* global game, space */
var Ship = require('../object/ship');
var Planet = require('../object/planet');
var Galaxy = require('../object/galaxy');
var Hud = require('../object/hud');
var Data = require('../data');

var state = {};

state.create = function() {
    space.data = Data.newData();
    space.galaxy = new Galaxy();

    space.planets = [];
    for (var i = 0; i < 100; i++)
        space.planets.push(new Planet(i, game.rnd.between(500, game.world.width - 500),
            game.rnd.between(500, game.world.height - 500)));

    space.ship = new Ship();
    space.ship.enterOrbit(space.planets[0]);
    game.camera.follow(space.ship);

    space.hud = new Hud();
};

module.exports = state;