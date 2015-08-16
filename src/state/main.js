/* global game, space */
var Ship = require('../object/ship');
var Planet = require('../object/planet');
var Galaxy = require('../object/galaxy');
var Hud = require('../object/hud');

var state = {};

state.create = function() {
    space.galaxy = new Galaxy();

    var i, planet;
    for (i = 0; i < 100; i++)
        planet = new Planet(game.rnd.between(500, game.world.width - 500), game.rnd.between(500, game.world.height - 500));

    space.ship = new Ship();
    space.ship.enterOrbit(planet);
    game.camera.follow(space.ship);

    space.hud = new Hud();
};

module.exports = state;