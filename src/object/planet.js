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
    this.graphicId = 'planet' + game.rnd.between(1, 18);
    this.graphicAngle = game.rnd.between(-180, 180);
    this.type = game.rnd.between(0, 1);
    this.economy = game.rnd.between(0, 1);
    this.government = game.rnd.between(0, 1);
    this.terrain = game.rnd.between(0, 1);
    this.size = this.area = game.rnd.between(0, 2);
    this.discoveries = [];
    // TODO replace with code to randomly generate number of discoveries
    this.discoveries.push({
        unlockAt: game.rnd.between(1, this.PLANET_AREAS[this.area]),
        id: game.rnd.between(0, this.PLANET_DISCOVERIES.length - 1)
    });
};
Planet.prototype = Object.create(Phaser.Sprite.prototype);
Planet.prototype.constructor = Planet;
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

module.exports = Planet;