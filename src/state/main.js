/* global game, space, Phaser */
var Ship = require('../object/ship');
var Planet = require('../object/planet');
var Galaxy = require('../object/galaxy');
var Hud = require('../object/hud');

var state = {};

state.create = function() {
    // game.world.resize(3000, 3000);

    space.galaxy = new Galaxy();

    var i, planet;
    for (i = 0; i < 100; i++) {
        planet = new Planet(game.rnd.between(500, game.world.width - 500), game.rnd.between(500, game.world.height - 500));
        planet.events.onInputUp.add(function() {
            space.ship.leaveOrbit(this);
            space.hud.inputMask.inputEnabled = true;
            var twn = game.add.tween(space.ship).to({
                x: this.x,
                y: this.y
            },1000).start();
            twn.onComplete.add(function(ship) {
                space.hud.inputMask.inputEnabled = false;
                ship.enterOrbit(this);
            }, this);
        }, planet);
    }

    space.ship = new Ship();
    space.ship.x = planet.x;
    space.ship.x = planet.x;
    space.ship.enterOrbit(planet);
    game.camera.follow(space.ship);
    
    space.hud = new Hud();    
};

module.exports = state;