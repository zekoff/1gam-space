/* global Phaser, game, space */
var Planet = function(x, y) {
    Phaser.Sprite.call(this, game, x, y, 'pix');
    game.add.existing(this);
    this.width = 30;
    this.height = 30;
    this.anchor.set(0.5);
    this.tint = 0x00ff00;
    this.inputEnabled = true;
    this.events.onInputUp.add(function() {
        space.hud.showPlanetPanel(this);
    }, this);

    this.type = game.rnd.pick(['Agricultural', 'Industrial']);
    this.economy = game.rnd.pick(['Poor', 'Wealthy']);
    this.government = game.rnd.pick(['Federal', 'Independent']);
    this.terrain = game.rnd.pick(['Rocky', 'Icy', 'Lush', 'Ocean', 'Desert', 'Gas']);
    // roll up hidden effects
};
Planet.prototype = Object.create(Phaser.Sprite.prototype);
Planet.prototype.constructor = Planet;

module.exports = Planet;