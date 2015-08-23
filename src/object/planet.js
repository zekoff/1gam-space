/* global Phaser, game, space */
var Planet = function(id, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'unscanned');
    game.add.existing(this);
    this.id = id;
    this.width = 40;
    this.height = 40;
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
    // TODO replace with code to randomly generate number of discoveries
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
    'Toxic Lakes'
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

module.exports = Planet;