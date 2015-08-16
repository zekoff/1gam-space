/* global Phaser, game, space */
var PANEL_SPEED = 500; // ms

/**
Main HUD
*/
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
    this.add(this.statusPanel = new StatusPanel());
    this.add(this.planetPanel = new PlanetPanel());
    this.multiButton.inputEnabled = true;
    this.multiButton.events.onInputUp.addOnce(this.showStatusPanel, this);
    this.onPanelHidden = new Phaser.Signal();

    this.dockedPanel = new DockedPanel();
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
    }, PANEL_SPEED).start();
    tween.onComplete.add(function() {
        this.multiButton.events.onInputUp.addOnce(this.showStatusPanel, this);
        this.inputMask.inputEnabled = false;
        game.camera.follow(space.ship);
        this.onPanelHidden.dispatch();
    }, this);
};
Hud.prototype.showPlanetPanel = function(planet) {
    this.planetPanel.setTargetPlanet(planet);
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
Hud.prototype.showDockedPanel = function() {
    this.inputMask.inputEnabled = true;
    game.camera.unfollow();
    game.add.tween(game.camera).to({
        x: space.ship.x - 50,
        y: space.ship.y - 50
    }, PANEL_SPEED).start();
    game.add.tween(this.dockedPanel).to({
        x: -800,
        y: -600
    }, PANEL_SPEED).start();
};
Hud.prototype.hideDockedPanel = function() {
    var tween = game.add.tween(this.dockedPanel).to({
        y: 0,
        x: 0
    }, PANEL_SPEED).start();
    game.add.tween(game.camera).to({
        x: space.ship.x - 400,
        y: space.ship.y - 300
    }, PANEL_SPEED).start();
    tween.onComplete.add(function() {
        this.multiButton.events.onInputUp.addOnce(this.showStatusPanel, this);
        this.inputMask.inputEnabled = false;
        game.camera.follow(space.ship);
        // this.onPanelHidden.dispatch();
    }, this);
};

/**
Planet info panel
*/
var PlanetPanel = function() {
    Phaser.Group.call(this, game);
    var background = game.make.image(0, 30, 'pix');
    background.width = 500;
    background.height = 570;
    background.anchor.set(1, 0);
    background.fixedToCamera = true;
    this.add(background);
    // this.travelButton = game.make.button(-300, 60, 'pix', function() {
    //     space.hud.hidePanel();
    //     space.hud.onPanelHidden.addOnce(function() {
    //         space.ship.travelTo(this.targetPlanet);
    //     }, this);
    // }, this);
    this.travelButton = game.make.button(-300, 60, 'pix', function() {
        space.hud.hidePanel();
        space.hud.onPanelHidden.addOnce(function() {
            space.hud.showDockedPanel();
        }, this);
    }, this);
    this.travelButton.width = 50;
    this.travelButton.height = 30;
    this.travelButton.tint = 0x0000ff;
    this.travelButton.fixedToCamera = true;
    this.add(this.travelButton);
};
PlanetPanel.prototype = Object.create(Phaser.Group.prototype);
PlanetPanel.prototype.constructor = PlanetPanel;
PlanetPanel.prototype.setTargetPlanet = function(planet) {
    this.targetPlanet = planet;
};

/**
Status panel
*/
var StatusPanel = function() {
    Phaser.Group.call(this, game);
    var background = game.make.image(0, 600, 'pix');
    background.height = 500;
    background.width = 770;
    background.fixedToCamera = true;
    this.add(background);
};
StatusPanel.prototype = Object.create(Phaser.Group.prototype);
StatusPanel.prototype.constructor = StatusPanel;

/*
Docked panel
*/
var DockedPanel = function() {
    Phaser.Group.call(this, game);
    var background = game.make.image(800, 600, 'pix');
    background.height = 600;
    background.width = 800;
    background.fixedToCamera = true;
    background.tint = 0xdddddd;
    background.inputEnabled = true;
    background.events.onInputUp.add(function() {
        space.hud.hideDockedPanel();
    }, this);
    this.add(background);
};
DockedPanel.prototype = Object.create(Phaser.Group.prototype);
DockedPanel.prototype.constructor = DockedPanel;

module.exports = Hud;