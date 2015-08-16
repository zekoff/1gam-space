/* global Phaser, game */
var Planet = function(x,y) {
    Phaser.Sprite.call(this,game,x,y,'pix');
    game.add.existing(this);
    this.width = 30;
    this.height = 30;
    this.anchor.set(0.5);
    this.tint = 0x00ff00;
    this.inputEnabled = true;
};
Planet.prototype = Object.create(Phaser.Sprite.prototype);
Planet.prototype.constructor = Planet;

module.exports = Planet;