/* global game */

var state = {};

var ship;
var farStars;
var nearStars;
var lastDragPoint = null;

state.create = function() {
    game.input.maxPointers = 1;

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
    
    var fakePlanet = game.add.sprite(400, 300, 'pix');
    fakePlanet.width = 80;
    fakePlanet.height = 80;
    fakePlanet.tint = 0x00FF00;
    
    ship = game.add.sprite(0, 0, 'ship');
    ship.inputEnabled = true;
    ship.input.enableDrag();
};

state.update = function() {
    var ptr = game.input.activePointer;
    if (ptr.isDown && lastDragPoint) {
        var xDrag = ptr.position.x - lastDragPoint.x;
        var yDrag = ptr.position.y - lastDragPoint.y;
        nearStars.tilePosition.x += 2 / 3 * xDrag;
        nearStars.tilePosition.y += 2 / 3 * yDrag;
        farStars.tilePosition.x += 1 / 3 * xDrag;
        farStars.tilePosition.y += 1 / 3 * yDrag;
    }
    lastDragPoint = ptr.position.clone();
};

module.exports = state;