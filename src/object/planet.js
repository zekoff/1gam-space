/* global Phaser, game, space */
var Trade = require('../trade');

var Planet = function(id, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'unscanned');
    game.add.existing(this);
    this.id = id;
    this.width = 30;
    this.height = 30;
    this.anchor.set(0.5);
    this.tint = 0xccccff;
    this.inputEnabled = true;
    this.events.onInputUp.add(function() {
        space.hud.showPlanetPanel(this);
    }, this);
    this.discoveries = [];

    // RNG properties
    this.graphicId = 'planet' + game.rnd.between(1, 18);
    this.graphicAngle = game.rnd.between(-180, 180);
    this.name = game.rnd.pick(this.PLANET_NAME_PREFIXES) + " " +
        game.rnd.pick(this.PLANET_NAMES) + " " + game.rnd.pick(this.PLANET_NAME_SUFFIXES);
    this.type = game.rnd.between(0, 1);
    this.economy = game.rnd.between(0, 1);
    this.government = game.rnd.between(0, 1);
    this.terrain = game.rnd.between(0, 1);
    this.size = this.area = game.rnd.between(0, 2);
    var minDiscoveries = this.area;
    var maxDiscoveries = Math.ceil((this.PLANET_AREAS[this.area] / 100) / 2);
    var numberOfDiscoveries = game.rnd.between(minDiscoveries, maxDiscoveries);
    var i;
    for (i = 0; i < numberOfDiscoveries; i++)
        this.discoveries.push({
            unlockAt: game.rnd.between(1, this.PLANET_AREAS[this.area]),
            id: game.rnd.between(0, this.PLANET_DISCOVERIES.length - 1)
        });
    // End RNG properties
};
Planet.prototype = Object.create(Phaser.Sprite.prototype);
Planet.prototype.constructor = Planet;
Planet.prototype.PLANET_NAME_PREFIXES = [
    'Alpha',
    'Bravo',
    'Delta',
    'Echo',
    'Epsilon',
    'Gamma',
    'Kilo',
    'Omega',
    'Phi',
    'Sierra',
    'Zulu'
];
Planet.prototype.PLANET_NAMES = [
    'Centauri',
    'Rogesh',
    'Helix',
    'Grammarye',
    'Athena',
    'Thantar',
    'Joyuex',
    'Terra',
    'Femora',
    'Boros',
    'Veras',
    'Exeter',
    'Gliese',
    'Mu Arae',
    'Eridanus',
    'Cetus',
    'Hydrus',
    'Cygnus',
    'Lyra',
    'Kepler',
    'Galileo',
    'Newton'
];
Planet.prototype.PLANET_NAME_SUFFIXES = [
    'I',
    'II',
    'III',
    'IV',
    'V',
    'VI',
    'VII',
    'VIII',
    'IX',
    'X',
    'Minor',
    'Major',
    'Prima',
    'Secundus',
    'Tertia'
];
Planet.prototype.PLANET_TYPES = ['Agricultural', 'Industrial'];
Planet.prototype.PLANET_ECONOMIES = ['Poor', 'Wealthy'];
Planet.prototype.PLANET_GOVERNMENT = ['Federal', 'Independent'];
Planet.prototype.PLANET_TERRAIN = ['Inviting', 'Treacherous'];
Planet.prototype.PLANET_SIZES = ['Small', 'Medium', 'Large'];
Planet.prototype.PLANET_AREAS = [100, 300, 1000];
Planet.prototype.PLANET_DISCOVERIES = [
    'Ancient Ruins',
    'Unusual Rock Formation',
    'Extensive Cave Networks',
    'Unclassified Plant Life',
    'New Animal Species',
    'Abundant Natural Resources',
    'Toxic Lakes',
    'Stone Pillars',
    'Fossilized Remains',
    'Precursor Temple',
    'Unknown Minerals',
    'Evidence of Terraforming',
    'Precursor Sculptures',
    'Ancient Records',
    'Magnetic Anomaly',
    'Crystal Spires',
    'Artificial Caves'
];
Planet.prototype.getDescription = function() {
    var desc = "";
    desc += "This is a " + this.PLANET_SIZES[this.size].toLowerCase() + " " +
        this.PLANET_TYPES[this.type].toLowerCase() + " planet of about " +
        this.PLANET_AREAS[this.area] + " square miles. ";
    desc += "The terrain appears to be " + this.PLANET_TERRAIN[this.terrain].toLowerCase() + ". ";
    desc += "It is ruled by a " + this.PLANET_ECONOMIES[this.economy].toLowerCase() +
        " " + this.PLANET_GOVERNMENT[this.government] + " government.";
    return desc;
};
Planet.prototype.getDiscoveries = function() {
    var discoveries = [];
    this.discoveries.forEach(function(discovery) {
        if (space.data.exploration[this.id].explored >= discovery.unlockAt)
            discoveries.push(this.PLANET_DISCOVERIES[discovery.id]);
    }, this);
    return discoveries;
};
Planet.prototype.getSpecialFeature = function() {
    var name = this.economy == 1 ? "REFINERY" : "SHIPYARD";
    var description = "This planet is host to a " + name + ". ";
    var func;
    if (this.economy == 1) {
        // Wealthy planets have refineries
        var tradeGood = Trade.getTradeGood(this);
        var neededGood = this.type;
        description += "This refinery will produce " + Trade.TRADE_GOOD_NAMES[tradeGood] +
            " from raw materials, if you have them.";
        func = function() {
            if (!space.data.cargo) {
                space.hud.resultsPanel.showPanel("No Cargo", "test_icon", "You have no cargo. The refinery requires " + Trade.TRADE_GOOD_NAMES[neededGood] + " to refine " + Trade.TRADE_GOOD_NAMES[tradeGood] + ".");
                return;
            }
            if (space.data.cargo.id != neededGood) {
                space.hud.resultsPanel.showPanel("Unusable Cargo", "test_icon", "You are carrying " + Trade.TRADE_GOOD_NAMES[space.data.cargo.id] + ". The refinery can only refine " + Trade.TRADE_GOOD_NAMES[tradeGood] + " from " + Trade.TRADE_GOOD_NAMES[neededGood] + ".");
                return;
            }
            var unitPriceToRefine = (Trade.TRADE_GOOD_PRICES[tradeGood] - Trade.TRADE_GOOD_PRICES[neededGood]) / 5;
            print(unitPriceToRefine);
            var totalCost = unitPriceToRefine * space.data.cargo.quantity;
            if (totalCost > space.data.credits) {
                space.hud.resultsPanel.showPanel("Insufficient Funds", "test_icon", "You do not have enough money to convert your cargo of " + Trade.TRADE_GOOD_NAMES[neededGood] + " to " + Trade.TRADE_GOOD_NAMES[tradeGood] + ".");
                return;
            }
            space.data.cargo.id = tradeGood;
            space.data.cargo.purchasedAt = space.ship.orbiting.id;
            space.data.credits -= totalCost;
            space.hud.resultsPanel.showPanel("Refined " + Trade.TRADE_GOOD_NAMES[tradeGood], "test_icon", "You paid " + totalCost + " to have your cargo of " + Trade.TRADE_GOOD_NAMES[neededGood] + " refined into " + Trade.TRADE_GOOD_NAMES[tradeGood] + ".");
            space.hud.dockedPanel.updatePanel();
        };
    }
    else {
        // Poor planets have shipyards
        var BASE_COST = 10000;
        if (space.data.upgradeLevel < 9) {
            var cost = BASE_COST * (space.data.upgradeLevel + 1);
            description += "The shipyard will add " + space.ship.UPGRADE_NAMES[space.data.upgradeLevel] +
                " to your ship for only only " + cost + " credits.";
            func = function() {
                if (space.data.credits < cost) {
                    space.hud.resultsPanel.showPanel("Insufficient Funds", "test_icon", "You don't have enough money to purchase this upgrade.");
                    return;
                }
                switch (space.data.upgradeLevel) {
                    case 1:
                    case 5:
                        space.data.travelRange *= 2;
                        break;
                    case 2:
                    case 6:
                        space.data.maxCargo *= 2;
                        break;
                    case 3:
                    case 7:
                        space.data.shipSpeed *= 2;
                        break;
                    default:
                        break;
                }
                space.data.credits -= cost;
                space.hud.resultsPanel.showPanel("Purchased " + space.ship.UPGRADE_NAMES[space.data.upgradeLevel],
                    "test_icon", "You've purchased " + space.ship.UPGRADE_NAMES[space.data.upgradeLevel] + " for " + cost + " credits. " + space.ship.UPGRADE_DESCRIPTIONS[space.data.upgradeLevel]);
                space.data.upgradeLevel++;
                space.hud.dockedPanel.updatePanel();
                print(space.data.upgradeLevel);
            };
        }
        else {
            description += "There are no more ship upgrades to purchase.";
            func = function() {
                space.hud.resultsPanel.showPanel("No Upgrades Left", "test_icon", "You've already purchased all available upgrades.");
            };
        }
    }
    return {
        name: name,
        description: description,
        func: func
    };
};

module.exports = Planet;