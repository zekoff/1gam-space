/* global Phaser, game, space */
var Functions = require('../functions');
var Trade = require('../trade');

var PANEL_SPEED = 500; // ms
var DEBUG_TEXT_STYLE = {
    font: 'bold 20pt sans',
    fill: 'white',
    backgroundColor: 'black',
    wordWrap: true,
    wordWrapWidth: 550,
    align: 'center'
};
var DOCKED_BUTTON_STYLE = {
    font: 'bold 20pt sans',
    fill: 'white',
    backgroundColor: '#000040',
    wordWrap: true,
    wordWrapWidth: 550,
    align: 'center'
};
var PLANET_DESCRIPTION_TEXT_STYLE = {
    font: 'bold 14pt sans-serif',
    fill: 'white',
    backgroundColor: 'black',
    wordWrap: true,
    wordWrapWidth: 400,
    align: 'center'
};
var PLANET_NAME_TEXT_STYLE = {
    font: 'bold 24pt serif',
    fill: 'white',
    backgroundColor: 'black',
    wordWrap: true,
    wordWrapWidth: 400,
    align: 'center',
    fontVariant: 'small-caps'
};
var DOCK_INFO_TEXT_STYLE = {
    font: '12pt sans-serif',
    fill: 'black',
    // backgroundColor: 'black',
    wordWrap: true,
    wordWrapWidth: 190,
    align: 'center'
};
var STATUS_PANEL_TEXT = {
    font: 'bold 14pt sans-serif',
    fill: 'black',
    // backgroundColor: 'black',
    wordWrap: true,
    wordWrapWidth: 650,
    align: 'left'
};

/**
 * Main HUD
 */
var Hud = function() {
    Phaser.Group.call(this, game);
    this.timeLeftText = game.make.text(550, 10, "TIME LEFT", DEBUG_TEXT_STYLE);
    this.timeLeftText.anchor.set(0.5, 0);
    this.timeLeftText.fixedToCamera = true;
    this.add(this.timeLeftText);
    this.moneyText = game.make.text(250, 10, "MONEY", DEBUG_TEXT_STYLE);
    this.moneyText.anchor.set(0.5, 0);
    this.moneyText.fixedToCamera = true;
    this.add(this.moneyText);

    this.inputMask = game.make.image(0, 0, 'pix');
    this.inputMask.width = 800;
    this.inputMask.height = 600;
    this.inputMask.alpha = 0;
    this.inputMask.fixedToCamera = true;
    this.add(this.inputMask);
    this.multiButton = game.make.image(0, 600, 'multi_button_ship');
    this.multiButton.width = 100;
    this.multiButton.height = 100;
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
    this.statusPanel.updatePanel();
    this.inputMask.inputEnabled = true;
    var tween = game.add.tween(this).to({
        y: -500
    }, PANEL_SPEED).start();
    tween.onComplete.add(function() {
        this.multiButton.events.onInputUp.addOnce(this.hidePanel, this);
    }, this);
    this.multiButton.loadTexture('multi_button_close');
    this.multiButton.height = 100;
    this.multiButton.width = 100;
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
    this.multiButton.loadTexture('multi_button_close');
    this.multiButton.height = 100;
    this.multiButton.width = 100;
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
    this.multiButton.loadTexture('multi_button_ship');
    this.multiButton.height = 100;
    this.multiButton.width = 100;
};
Hud.prototype.showDockedPanel = function() {
    this.dockedPanel.updatePanel();
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
    background.tint = 0xe2e2e2;
    background.width = 500;
    background.height = 570;
    background.anchor.set(1, 0);
    background.fixedToCamera = true;
    this.add(background);
    this.name = game.make.text(0, 0, "", PLANET_NAME_TEXT_STYLE);
    this.name.anchor.set(1, 0);
    this.name.fixedToCamera = true;
    this.add(this.name);
    this.description = game.make.text(0, 150, "", PLANET_DESCRIPTION_TEXT_STYLE);
    this.description.anchor.set(1, 0);
    this.description.fixedToCamera = true;
    this.add(this.description);
    this.explorePercentage = game.make.text(0, 400, "", PLANET_DESCRIPTION_TEXT_STYLE);
    this.explorePercentage.anchor.set(1, 0);
    this.explorePercentage.fixedToCamera = true;
    this.add(this.explorePercentage);
    this.discoveries = game.make.text(0, 450, "", PLANET_DESCRIPTION_TEXT_STYLE);
    this.discoveries.anchor.set(1, 0);
    this.discoveries.fixedToCamera = true;
    this.add(this.discoveries);
};
PlanetPanel.prototype = Object.create(Phaser.Group.prototype);
PlanetPanel.prototype.constructor = PlanetPanel;
/*
Create button for panel based on whether it should travel, dock, or is out of
range, and populate display with text description of planet.
*/
PlanetPanel.prototype.setTargetPlanet = function(planet) {
    if (space.data.exploration[planet.id].scanned) {
        this.name.setText(planet.name);
        this.description.setText(planet.getDescription());
        // print(planet.getDiscoveries());
        var discoveries = planet.getDiscoveries();
        this.discoveries.setText("Discoveries: " +
            (discoveries.length > 0 ? discoveries.join(", ") : "None"));
    }
    else {
        this.name.setText("???");
        this.description.setText("???");
        this.discoveries.setText("???");
    }
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
    background.tint = 0xe2e2e2;
    background.height = 500;
    background.width = 770;
    background.fixedToCamera = true;
    this.add(background);
    var heading = game.make.text(300, 600 + 30, "SHIP STATUS", DEBUG_TEXT_STYLE);
    heading.fixedToCamera = true;
    this.add(heading);
    this.cargoText = game.make.text(50, 600 + 80, "asf", STATUS_PANEL_TEXT);
    this.cargoText.fixedToCamera = true;
    this.add(this.cargoText);
    this.upgradeText = game.make.text(50, 600 + 160, "asdf", STATUS_PANEL_TEXT);
    this.upgradeText.fixedToCamera = true;
    this.add(this.upgradeText);
    this.skillsText = game.make.text(50, 600 + 320, "asdf", STATUS_PANEL_TEXT);
    this.skillsText.fixedToCamera = true;
    this.add(this.skillsText);
    this.creditsText = game.make.text(120, 600 + 400, "asdf", STATUS_PANEL_TEXT);
    this.creditsText.fixedToCamera = true;
    this.add(this.creditsText);
    this.timeText = game.make.text(370, 600 + 400, "asdf", STATUS_PANEL_TEXT);
    this.timeText.fixedToCamera = true;
    this.add(this.timeText);
};
StatusPanel.prototype = Object.create(Phaser.Group.prototype);
StatusPanel.prototype.constructor = StatusPanel;
StatusPanel.prototype.updatePanel = function() {
    print('updating status panel');
    this.cargoText.setText(space.data.cargo == null ? "Cargo: None" : "Cargo: " +
        space.data.cargo.quantity + " units of " + Trade.TRADE_GOOD_NAMES[space.data.cargo.id]);
    var upgradeList = [];
    var i;
    for (i = 0; i < space.data.upgradeLevel; i++) upgradeList.push(space.ship.UPGRADE_NAMES[i]);
    this.upgradeText.setText(space.data.upgradeLevel == 0 ? "Upgrades: None" : "Upgrades: " + upgradeList.join(", "));
    var skillsList = [];
    skillsList.push("Negotiation(" + space.data.negotiationSkill + ")");
    skillsList.push("Exploration(" + space.data.explorationSkill + ")");
    skillsList.push("Piloting(" + space.data.pilotingSkill + ")");
    this.skillsText.setText("Skills: " + skillsList.join(", "));
    this.creditsText.setText("Credits: " + space.data.credits);
    this.timeText.setText("Days remaining: " + space.data.daysLeft.toFixed(0));
};

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
    var background = game.make.image(0, 0, 'docked_bg');
    background.height = 600;
    background.width = 800;
    background.inputEnabled = true;
    background.events.onInputUp.add(function() {
        space.hud.hideDockedPanel();
    }, this);
    this.add(background);

    this.nameText = game.make.text(550, 10, "", PLANET_NAME_TEXT_STYLE);
    this.nameText.anchor.set(0.5, 0);
    this.add(this.nameText);
    this.descriptionText = game.make.text(550, 60, "", PLANET_DESCRIPTION_TEXT_STYLE);
    this.descriptionText.anchor.set(0.5, 0);
    this.add(this.descriptionText);

    this.creditsText = game.make.text(300, 200, "", DOCK_INFO_TEXT_STYLE);
    this.creditsText.anchor.set(0.5, 0);
    this.add(this.creditsText);
    this.timeText = game.make.text(600, 200, "", DOCK_INFO_TEXT_STYLE);
    this.timeText.anchor.set(0.5, 0);
    this.add(this.timeText);

    this.buyButton = game.make.text(100, 250, "BUY", DOCKED_BUTTON_STYLE);
    this.buyButton.anchor.set(.5, 0);
    this.buyButton.inputEnabled = true;
    this.buyButton.events.onInputUp.add(Functions.buy, this);
    this.add(this.buyButton);
    this.buyText = game.make.text(100, 300, "", DOCK_INFO_TEXT_STYLE);
    this.buyText.anchor.set(0.5, 0);
    this.add(this.buyText);
    this.sellButton = game.make.text(300, 250, "SELL", DOCKED_BUTTON_STYLE);
    this.sellButton.anchor.set(.5, 0);
    this.sellButton.inputEnabled = true;
    this.sellButton.events.onInputUp.add(Functions.sell, this);
    this.add(this.sellButton);
    this.sellText = game.make.text(300, 300, "", DOCK_INFO_TEXT_STYLE);
    this.sellText.anchor.set(0.5, 0);
    this.add(this.sellText);

    this.exploreButton = game.make.text(500, 250, "EXPLORE", DOCKED_BUTTON_STYLE);
    this.exploreButton.anchor.set(0.5, 0);
    this.exploreButton.inputEnabled = true;
    this.exploreButton.events.onInputUp.add(Functions.explore, this);
    this.add(this.exploreButton);
    this.exploreText = game.make.text(500, 300, "Launch a 3-day expedition into the " +
        "unexplored wilderness of this planet.", DOCK_INFO_TEXT_STYLE);
    this.exploreText.anchor.set(0.5, 0);
    this.add(this.exploreText);
    this.hireButton = game.make.text(700, 250, "SENSOR SCAN", DOCKED_BUTTON_STYLE);
    this.hireButton.anchor.set(0.5, 0);
    this.hireButton.inputEnabled = true;
    this.hireButton.events.onInputUp.add(Functions.scan, this);
    this.add(this.hireButton);
    this.hireText = game.make.text(700, 300, "Purchase a sensor scan of unexplored " +
        "area on this planet for 5000 credits.", DOCK_INFO_TEXT_STYLE);
    this.hireText.anchor.set(0.5, 0);
    this.add(this.hireText);

    this.specialButton = game.make.text(100, 580, "SPECIAL", DOCKED_BUTTON_STYLE);
    this.specialButton.anchor.set(0.5, 1);
    this.specialButton.inputEnabled = true;
    this.specialText = game.make.text(200, 580, "", DOCK_INFO_TEXT_STYLE);
    this.specialText.anchor.set(0, 1);
    this.add(this.specialText);
    this.add(this.specialButton);

    this.exploredText = game.make.text(600, 450, "", DOCK_INFO_TEXT_STYLE);
    this.exploredText.anchor.set(0.5);
    this.add(this.exploredText);
    this.discoveriesText = game.make.text(600, 500, "", DOCK_INFO_TEXT_STYLE);
    this.discoveriesText.anchor.set(0.5);
    this.add(this.discoveriesText);
};
DockedPanel.prototype = Object.create(Phaser.Group.prototype);
DockedPanel.prototype.constructor = DockedPanel;
DockedPanel.prototype.updatePanel = function() {
    var planet = space.ship.orbiting;
    this.nameText.setText(planet.name);
    this.descriptionText.setText(planet.getDescription());
    this.creditsText.setText("Credits: " + space.data.credits);
    this.timeText.setText("Days remaining: " + space.data.daysLeft.toFixed(0));
    this.buyText.setText(Trade.getBuyText(planet));
    this.sellText.setText(Trade.getSellText(planet));
    this.exploredText.setText("Explored: " + Math.floor(space.data.exploration[planet.id].explored /
        planet.PLANET_AREAS[planet.area] * 100) + "%");
    var discoveries = planet.getDiscoveries();
    this.discoveriesText.setText("Discoveries: " +
        (discoveries.length > 0 ? discoveries.join(", ") : "None"));
    var specialFeature = planet.getSpecialFeature();
    this.specialButton.setText(specialFeature.name);
    this.specialText.setText(specialFeature.description);
    this.specialButton.events.onInputUp.removeAll();
    this.specialButton.events.onInputUp.add(specialFeature.func);
};

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
    this.okButton = game.make.button(400, 450, 'pix', this.hidePanel, this);
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