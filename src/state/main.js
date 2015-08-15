/* global game */
var Ship = require('../object/ship');

var state = {};

var ship;
var farStars;
var nearStars;
var lastDragPoint = null;

state.create = function() {
    game.input.maxPointers = 1;
    game.world.resize(2000, 2000);

    var background = game.add.image(0, 0, 'pix');
    background.tint = 0x000000;
    background.height = 600;
    background.width = 800;
    farStars = game.add.tileSprite(0, 0, 800, 600, 'starfield');
    farStars.tileScale.set(0.4);
    farStars.fixedToCamera = true;
    nearStars = game.add.tileSprite(0, 0, 800, 600, 'starfield');
    nearStars.tilePosition.set(32);
    nearStars.tileScale.set(0.8);
    nearStars.fixedToCamera = true;

    var i, fakePlanet;
    for (i = 0; i < 100; i++) {
        fakePlanet = game.add.sprite(game.rnd.between(0, game.world.width), game.rnd.between(0, game.world.height), 'pix');
        fakePlanet.width = 30;
        fakePlanet.height = 30;
        fakePlanet.anchor.set(0.5);
        fakePlanet.tint = 0x00FF00;
        fakePlanet.inputEnabled = true;
        fakePlanet.events.onInputUp.add(function() {
            ship.leaveOrbit(this);
            game.add.tween(game.camera).to({
                x: this.x - 400,
                y: this.y - 300
            }).start();
            var twn = game.add.tween(ship).to({
                x: this.x,
                y: this.y
            }).start();
            twn.onComplete.add(function(ship) {
                ship.enterOrbit(fakePlanet);
            });
            twn.start();
        }, fakePlanet);
    }

    ship = new Ship();
    // ship = game.add.sprite(0, 0, 'ship');
    // ship.scale.set(0.4);
    // ship.anchor.set(0.5);
    // ship.inputEnabled = true;
    // ship.input.enableDrag();
};

state.update = function() {
    // var ptr = game.input.activePointer;
    // if (ptr.isDown && lastDragPoint) {
    //     var xDrag = ptr.position.x - lastDragPoint.x;
    //     var yDrag = ptr.position.y - lastDragPoint.y;
    //     nearStars.tilePosition.x += 2 / 3 * xDrag;
    //     nearStars.tilePosition.y += 2 / 3 * yDrag;
    //     farStars.tilePosition.x += 1 / 3 * xDrag;
    //     farStars.tilePosition.y += 1 / 3 * yDrag;
    //     game.camera.x -= xDrag;
    //     game.camera.y -= yDrag;
    // }
    // lastDragPoint = ptr.position.clone();
};

module.exports = state;