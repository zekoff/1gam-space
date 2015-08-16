/* global Phaser, game */
var PANEL_SPEED = 500 // ms
var Hud = function() {
    Phaser.Group.call(this, game);
    this.inputMask = game.make.image(0, 0, 'pix');
    this.inputMask.width = 800;
    this.inputMask.height = 600;
    this.inputMask.alpha = 0;
    this.inputMask.fixedToCamera = true;
    this.add(this.inputMask);
    this.multiButton = game.make.image(0, 600, 'pix');
    this.multiButton.width = 60;
    this.multiButton.height = 60;
    this.multiButton.fixedToCamera = true;
    this.multiButton.anchor.set(0, 1);
    this.add(this.multiButton);
    this.statusPanel = game.make.image(0, 600, 'pix');
    this.statusPanel.height = 500;
    this.statusPanel.width = 770;
    this.statusPanel.fixedToCamera = true;
    this.add(this.statusPanel);

    this.multiButton.inputEnabled = true;
    this.multiButton.events.onInputUp.addOnce(this.showStatusPanel,this);
};
Hud.prototype = Object.create(Phaser.Group.prototype);
Hud.prototype.constructor = Hud;
Hud.prototype.showStatusPanel = function() {
    var tween = game.add.tween(this).to({
        y: -500
    }, PANEL_SPEED).start();
    tween.onComplete.add(function() {
        this.multiButton.events.onInputUp.addOnce(this.hideStatusPanel,this);
    }, this);
};
Hud.prototype.hideStatusPanel = function() {
    var tween = game.add.tween(this).to({
        y: 0
    }, PANEL_SPEED).start();
    tween.onComplete.add(function() {
        this.multiButton.events.onInputUp.addOnce(this.showStatusPanel,this);
    }, this);
};

module.exports = Hud;