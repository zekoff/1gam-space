/* global Phaser, game, space */
var Ship = function() {
    Phaser.Sprite.call(this, game, 0, 0, 'ship');
    this.scale.set(0.4);
    this.anchor.set(0.5);
    game.add.existing(this);
    this.orbiting = false;
};
Ship.prototype = Object.create(Phaser.Sprite.prototype);
Ship.prototype.constructor = Ship;
Ship.prototype.update = function() {
    if (!this.orbiting) return;
    this.rotation += .5 * game.time.physicsElapsed;
};
Ship.prototype.enterOrbit = function(planet) {
    this.x = planet.x;
    this.y = planet.y;
    this.anchor.x = 1.5;
    this.orbiting = planet;
};
Ship.prototype.leaveOrbit = function(destination) {
    this.anchor.set(0.5);
    this.orbiting = null;
    this.rotation = game.math.angleBetweenPoints(this, destination) + Math.PI / 2;
};
Ship.prototype.travelTo = function(planet) {
    this.leaveOrbit(planet);
    space.hud.inputMask.inputEnabled = true;
    var tween = game.add.tween(this).to({
        x: planet.x,
        y: planet.y
    }, 1000).start();
    tween.onComplete.add(function() {
        space.hud.inputMask.inputEnabled = false;
        this.enterOrbit(planet);
    }, this);
};

module.exports = Ship;