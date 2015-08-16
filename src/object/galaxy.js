/* global Phaser, game */
var Galaxy = function() {
    Phaser.Group.call(this,game);
    // game.add.existing(this);
    this.background = game.make.image(0,0,'pix');
    this.background.tint = 0x000000;
    this.background.width = 800;
    this.background.height = 600;
    this.add(this.background);
    this.farStars = game.make.tileSprite(0,0,800,600, 'starfield');
    this.farStars.tileScale.set(0.4);
    this.farStars.fixedToCamera = true;
    this.add(this.farStars);
};
Galaxy.prototype = Object.create(Phaser.Group.prototype);
Galaxy.prototype.constructor = Galaxy;

module.exports = Galaxy;