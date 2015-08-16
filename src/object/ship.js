/* global Phaser, game, space */
var DEBUG_MAX_TRAVEL_RANGE = 300;
var Ship = function() {
    Phaser.Sprite.call(this, game, 0, 0, 'ship');
    this.scale.set(0.4);
    this.anchor.set(0.5);
    game.add.existing(this);
    this.orbiting = false;
    this.onTravelComplete = new Phaser.Signal();
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
    }, 4000).start();
    tween.onComplete.add(function() {
        space.hud.inputMask.inputEnabled = false;
        this.enterOrbit(planet);
        this.onTravelComplete.dispatch();
    }, this);
};
Ship.prototype.inRangeOf = function(planet) {
    return Phaser.Math.distance(this.x, this.y, planet.x, planet.y) < DEBUG_MAX_TRAVEL_RANGE;
};

module.exports = Ship;