/* global Phaser, game, space */
var PANEL_SPEED = 500; // ms
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
    this.planetPanel = game.make.image(0, 30, 'pix');
    this.planetPanel.width = 500;
    this.planetPanel.height = 570;
    this.planetPanel.anchor.set(1, 0);
    this.planetPanel.fixedToCamera = true;
    this.add(this.planetPanel);

    this.multiButton.inputEnabled = true;
    this.multiButton.events.onInputUp.addOnce(this.showStatusPanel, this);
};
Hud.prototype = Object.create(Phaser.Group.prototype);
Hud.prototype.constructor = Hud;
Hud.prototype.showStatusPanel = function() {
    this.inputMask.inputEnabled = true;
    var tween = game.add.tween(this).to({
        y: -500
    }, PANEL_SPEED).start();
    tween.onComplete.add(function() {
        this.multiButton.events.onInputUp.addOnce(this.hidePanel, this);
    }, this);
};
Hud.prototype.hidePanel = function() {
    var tween = game.add.tween(this).to({
        y: 0,
        x: 0
    }, PANEL_SPEED).start();
    game.add.tween(game.camera).to({
        x: space.ship.x - 400,
        y: space.ship.y - 300
    }, PANEL_SPEED).start();;
    tween.onComplete.add(function() {
        this.multiButton.events.onInputUp.addOnce(this.showStatusPanel, this);
        this.inputMask.inputEnabled = false;
        game.camera.follow(space.ship);
    }, this);
};
Hud.prototype.showPlanetPanel = function(planet) {
    this.multiButton.events.onInputUp.removeAll();
    game.camera.unfollow();
    game.add.tween(game.camera).to({
        x: planet.x - 650,
        y: planet.y - 300
    }, PANEL_SPEED).start();
    this.inputMask.inputEnabled = true;
    var tween = game.add.tween(this).to({
        x: 500
    }, PANEL_SPEED).start();
    tween.onComplete.add(function() {
        this.multiButton.events.onInputUp.addOnce(this.hidePanel, this);
    }, this);
};

module.exports = Hud;