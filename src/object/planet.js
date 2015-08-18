/* global Phaser, game, space */
var Planet = function(id, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'pix');
    game.add.existing(this);
    this.id = id;
    this.width = 30;
    this.height = 30;
    this.anchor.set(0.5);
    this.tint = 0x00ff00;
    this.inputEnabled = true;
    this.events.onInputUp.add(function() {
        space.hud.showPlanetPanel(this);
    }, this);

    this.type = game.rnd.pick(['Agricultural', 'Industrial']);
    this.economy = game.rnd.pick(['Poor', 'Wealthy']);
    this.government = game.rnd.pick(['Federal', 'Independent']);
    this.terrain = game.rnd.pick([
        'Rocky', 'Icy', 'Garden', 'Ocean', 'Desert', 'Gas', 'Forest', 'Jungle',
        'Desolate', 'Temperate', 'Lava', 'Flat', 'Mountainous'
    ]);
    this.size = game.rnd.pick(['Small', 'Medium', 'Large']);
    // roll up hidden effects and points of interest
    var hiddenEffects = [
        'Cached Goods',
        'Shipwreck',
        'Well-Charted'
    ];
    var pointsOfInterest = [
        'Ancient Ruins',
        'Rich History',
        'Unusual Rock Formation',
        'Extensive Cave Networks',
        'Unclassified Plant Life',
        'New Animal Species',
        'Abundant Natural Resources',
        'Toxic Lakes'
    ];
    // TODO attach some of these things to planets, greater chance per planet size
};
Planet.prototype = Object.create(Phaser.Sprite.prototype);
Planet.prototype.constructor = Planet;

module.exports = Planet;