/* global Phaser, game, space */
var Functions = require('../functions');
var PANEL_SPEED = 500; // ms
var DEBUG_TEXT_STYLE = {
    font: 'bold 20pt sans',
    fill: 'white',
    backgroundColor: 'black',
    wordWrap: true,
    wordWrapWidth: 550,
    align: 'center'
};

/**
 * Main HUD
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
    this.resultsPanel = new ResultsPanel();
    this.resultsPanel.hidePanel();
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
Hud.prototype.showDockedPanel = function() {
    this.inputMask.inputEnabled = true;
    game.camera.unfollow();
    game.add.tween(game.camera).to({
        x: space.ship.x - 50,
        y: space.ship.y - 50
    }, PANEL_SPEED).start();
    game.add.tween(this.dockedPanel).to({
        x: 0,
        y: 0
    }, PANEL_SPEED).start();
};
Hud.prototype.hideDockedPanel = function() {
    var tween = game.add.tween(this.dockedPanel).to({
        y: 600,
        x: 800
    }, PANEL_SPEED).start();
    game.add.tween(game.camera).to({
        x: space.ship.x - 400,
        y: space.ship.y - 300
    }, PANEL_SPEED).start();
    tween.onComplete.add(function() {
        this.multiButton.events.onInputUp.addOnce(this.showStatusPanel, this);
        this.inputMask.inputEnabled = false;
        game.camera.follow(space.ship);
    }, this);
};

/**
 * Planet info panel
 */
var PlanetPanel = function() {
    Phaser.Group.call(this, game);
    var background = game.make.image(0, 30, 'pix');
    background.width = 500;
    background.height = 570;
    background.anchor.set(1, 0);
    background.fixedToCamera = true;
    this.add(background);
    this.description = game.make.text(0, 150, "", DEBUG_TEXT_STYLE);
    this.description.anchor.set(1, 0);
    this.description.fixedToCamera = true;
    this.add(this.description);
    this.explorePercentage = game.make.text(0, 400, "", DEBUG_TEXT_STYLE);
    this.explorePercentage.anchor.set(1, 0);
    this.explorePercentage.fixedToCamera = true;
    this.add(this.explorePercentage);
};
PlanetPanel.prototype = Object.create(Phaser.Group.prototype);
PlanetPanel.prototype.constructor = PlanetPanel;
/*
Create button for panel based on whether it should travel, dock, or is out of
range, and populate display with text description of planet.
*/
PlanetPanel.prototype.setTargetPlanet = function(planet) {
    if (space.data.exploration[planet.id].scanned)
        this.description.setText(planet.getDescription());
    else this.description.setText("???");
    this.explorePercentage.setText("Explored: " +
        Math.floor(space.data.exploration[planet.id].explored /
            planet.PLANET_AREAS[planet.area] * 100) + "%");
    this.targetPlanet = planet;
    if (this.targetPlanet === space.ship.orbiting) {
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

        return;
    }
    var inRange = space.ship.inRangeOf(this.targetPlanet);
    if (inRange) {
        this.travelButton = game.make.button(-300, 60, 'pix', function() {
            space.hud.hidePanel();
            space.hud.onPanelHidden.addOnce(function() {
                space.ship.travelTo(this.targetPlanet);
            }, this);
        }, this);
        this.travelButton.width = 50;
        this.travelButton.height = 30;
        this.travelButton.tint = 0x00ff00;
        this.travelButton.fixedToCamera = true;
        this.add(this.travelButton);
        return;
    }
    this.travelButton = game.make.button(-300, 60, 'pix', function() {
        print('out of range');
        space.hud.resultsPanel.showPanel();
    }, this);
    this.travelButton.width = 50;
    this.travelButton.height = 30;
    this.travelButton.tint = 0x404040;
    this.travelButton.fixedToCamera = true;
    this.add(this.travelButton);

};

/**
 * Status panel
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

/**
 * Docked panel
 */
var DockedPanel = function() {
    var dockedWrapper = game.add.group();
    dockedWrapper.fixedToCamera = true;
    Phaser.Group.call(this, game);
    dockedWrapper.add(this);
    this.x = 800;
    this.y = 600;
    var background = game.make.image(0, 0, 'pix');
    background.height = 600;
    background.width = 800;
    background.tint = 0xdddddd;
    background.inputEnabled = true;
    background.events.onInputUp.add(function() {
        space.hud.hideDockedPanel();
    }, this);
    this.add(background);

    this.buyButton = game.make.text(200, 200, "BUY", DEBUG_TEXT_STYLE);
    this.buyButton.anchor.set(.5, 0);
    this.buyButton.inputEnabled = true;
    this.buyButton.events.onInputUp.add(Functions.buy, this);
    this.add(this.buyButton);
    this.sellButton = game.make.text(200, 260, "SELL", DEBUG_TEXT_STYLE);
    this.sellButton.anchor.set(.5, 0);
    this.sellButton.inputEnabled = true;
    this.sellButton.events.onInputUp.add(Functions.sell, this);
    this.add(this.sellButton);

    this.exploreButton = game.make.text(200, 320, "EXPLORE", DEBUG_TEXT_STYLE);
    this.exploreButton.anchor.set(1.1, 0);
    this.exploreButton.inputEnabled = true;
    this.exploreButton.events.onInputUp.add(Functions.explore, this);
    this.add(this.exploreButton);
    this.hireButton = game.make.text(200, 320, "HIRE PARTY", DEBUG_TEXT_STYLE);
    this.hireButton.anchor.set(-.1, 0);
    this.hireButton.inputEnabled = true;
    this.hireButton.events.onInputUp.add(Functions.hireExplorers, this);
    this.add(this.hireButton);

    this.specialButton = game.make.text(200, 580, "SPECIAL", DEBUG_TEXT_STYLE);
    this.specialButton.anchor.set(0.5, 1);
    this.specialButton.inputEnabled = true;
    this.add(this.specialButton);
};
DockedPanel.prototype = Object.create(Phaser.Group.prototype);
DockedPanel.prototype.constructor = DockedPanel;

/**
 * Results panel.
 */
var ResultsPanel = function() {
    Phaser.Group.call(this, game);
    var inputMask = game.make.image(0, 0, 'pix');
    inputMask.width = 800;
    inputMask.height = 600;
    inputMask.alpha = 0;
    inputMask.fixedToCamera = true;
    this.add(this.inputMask = inputMask);
    var background = game.make.image(100, 100, 'pix');
    background.width = 600;
    background.height = 400;
    background.tint = 0xffaaff;
    background.fixedToCamera = true;
    this.add(background);
    this. okButton = game.make.button(400, 450, 'pix', this.hidePanel, this);
    this.okButton.anchor.set(0.5);
    this.okButton.width = 100;
    this.okButton.height = 40;
    this.okButton.tint = 0x00ff00;
    this.okButton.fixedToCamera = true;
    this.okButton.inputEnabled = false;
    this.add(this.okButton);
    this.onDismissed = new Phaser.Signal();
    this.title = game.make.text(400, 150, "TEST", DEBUG_TEXT_STYLE);
    this.title.anchor.set(0.5);
    this.title.fixedToCamera = true;
    this.add(this.title);
    this.icon = game.make.image(400, 200, null);
    this.icon.anchor.set(0.5);
    this.icon.fixedToCamera = true;
    this.add(this.icon);
    this.text = game.make.text(400, 250, "TESTING", DEBUG_TEXT_STYLE);
    this.text.anchor.set(0.5, 0);
    this.text.fixedToCamera = true;
    this.add(this.text);
};
ResultsPanel.prototype = Object.create(Phaser.Group.prototype);
ResultsPanel.prototype.constructor = ResultsPanel;
ResultsPanel.prototype.showPanel = function(title, icon, text) {
    this.title.setText(title);
    this.icon.loadTexture(icon);
    this.icon.width = 40;
    this.icon.height = 40;
    this.text.setText(text);
    this.inputMask.inputEnabled = true;
    this.okButton.inputEnabled = true;
    this.alpha = 1;
};
ResultsPanel.prototype.hidePanel = function() {
    this.inputMask.inputEnabled = false;
    this.okButton.inputEnabled = false;
    this.alpha = 0;
    this.onDismissed.dispatch();
};

module.exports = Hud;