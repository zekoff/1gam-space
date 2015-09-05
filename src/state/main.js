/* global game, space */
var Ship = require('../object/ship');
var Planet = require('../object/planet');
var Galaxy = require('../object/galaxy');
var Hud = require('../object/hud');

var state = {};

state.create = function() {
    space.galaxy = new Galaxy();
    space.planets = [];
    for (var i = 0; i < space.data.exploration.length; i++)
        space.planets.push(new Planet(i, game.rnd.between(500, game.world.width - 500),
            game.rnd.between(500, game.world.height - 500)));
    space.ship = new Ship();
    space.ship.enterOrbit(space.planets[0]);
    game.camera.follow(space.ship);
    space.hud = new Hud();

    space.hud.resultsPanel.showPanel("Mission Start", "test_icon", "You emerge from " +
        "hyperspace at a random planet. Your one year mission begins now. Godspeed, captain!");
};

state.update = function() {
    space.hud.timeLeftText.setText("Days remaining: " + space.data.daysLeft.toFixed(0));
    space.hud.moneyText.setText("Credits: " + space.data.credits);
    if (space.data.daysLeft <= 0) game.state.start('gameover');
};

module.exports = state;