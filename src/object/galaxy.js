/* global Phaser, game */
var Galaxy = function() {
    Phaser.Group.call(this, game);
    this.background = game.make.image(0, 0, 'pix');
    this.background.tint = 0x000000;
    this.background.width = 800;
    this.background.height = 600;
    this.background.fixedToCamera = true;
    this.background.inputEnabled = true;
    this.background.events.onInputUp.add(function() {
        game.camera.unfollow();
        var currentCamX = game.camera.x;
        var currentCamY = game.camera.y;
        game.add.tween(game.camera).to({
            x: currentCamX + game.input.activePointer.x - 400,
            y: currentCamY + game.input.activePointer.y - 300
        }, 400).start();
    });
    this.add(this.background);
    this.farStars = game.make.tileSprite(0, 0, 800, 600, 'starfield');
    this.farStars.tileScale.set(0.4);
    this.farStars.fixedToCamera = true;
    this.add(this.farStars);
};
Galaxy.prototype = Object.create(Phaser.Group.prototype);
Galaxy.prototype.constructor = Galaxy;

module.exports = Galaxy;