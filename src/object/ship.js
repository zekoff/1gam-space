/* global Phaser, game */
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
    this.rotation += 1 * game.time.physicsElapsed;
};
Ship.prototype.enterOrbit = function(planet) {
    this.anchor.x = 1.5;
    this.orbiting = planet;
};
Ship.prototype.leaveOrbit = function(destination) {
    this.anchor.set(0.5);
    this.orbiting = null;
    this.rotation = game.math.angleBetweenPoints(this, destination) + Math.PI / 2;
};

module.exports = Ship;