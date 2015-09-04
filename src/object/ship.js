/* global Phaser, game, space */
var Functions = require('../functions');
var TRAVEL_TIME_FACTOR = 0.5;

var Ship = function() {
    Phaser.Sprite.call(this, game, 0, 0, 'ship');
    this.scale.set(0.25);
    this.anchor.set(0.5);
    game.add.existing(this);
    this.orbiting = false;
    this.onTravelComplete = new Phaser.Signal();

    this.rangeMarker = game.add.image(0, 0, 'range_marker');
    this.rangeMarker.tint = 0xff8000;
    this.rangeMarker.anchor.set(0.5);
    this.rangeMarker.update = function() {
        this.x = space.ship.x;
        this.y = space.ship.y;
        this.angle -= 2 * game.time.physicsElapsed;
        this.height = space.ship.getTravelRange() * 2;
        this.width = space.ship.getTravelRange() * 2;
    };
};
Ship.prototype = Object.create(Phaser.Sprite.prototype);
Ship.prototype.constructor = Ship;
Ship.prototype.UPGRADE_NAMES = [
    'Long-Range Scanners',
    'External Fuel Tanks',
    'Smuggler Compartments',
    'Military-Grade Engines',
    'Grappling Beams',
    'Cold Fusion Reactors',
    'Localized Space Folders',
    'Telewarp Drives',
    'Stealth Rigging'
];
Ship.prototype.UPGRADE_DESCRIPTIONS = [
    'A long-range scanner allows you to perform a basic scan of any planet in travel range each time you enter orbit.',
    'Adding shielded fuel tanks to the outside of your ship effectively doubles your range.',
    'Hollowed-out walls and floors in your cargo hold give you twice the storage capacity.',
    'This fancy new engine doubles your travel speed with no extra fuel cost.',
    'A grappling beam allows you to grab debris as you travel if you have an empty cargo hold.',
    'The latest in fuel cell technology, this reactor doubles your range again, to 4x compared to basic fuel cells.',
    'A device that warps spacetime to effectively double your cargo capacity again, to 4x compared to a basic hold.',
    'This prototype engine doubles your speed yet again, to 4x compared to the basic trader engine.',
    'Illegal stealth rigging for your ship allows you to avoid all unwanted encounters during travel.'
];
Ship.prototype.getTravelRange = function() {
    return space.data.travelRange;
};
Ship.prototype.update = function() {
    if (!this.orbiting) return;
    this.rotation += .5 * game.time.physicsElapsed;
};
Ship.prototype.enterOrbit = function(planet) {
    this.x = planet.x;
    this.y = planet.y;
    this.anchor.x = 1.5;
    this.orbiting = planet;
    this.scanPlanet(planet);
    if (space.data.upgradeLevel >= 1) {
        var i;
        for (i = 0; i < space.planets.length; i++)
            if (this.inRangeOf(space.planets[i]))
                this.scanPlanet(space.planets[i]);
    }
};
Ship.prototype.leaveOrbit = function(destination) {
    this.anchor.set(0.5);
    this.orbiting = null;
    this.rotation = game.math.angleBetweenPoints(this, destination) + Math.PI / 2;
};
Ship.prototype.travelTo = function(planet) {
    var distance = Phaser.Math.distance(this.orbiting.x, this.orbiting.y, planet.x, planet.y);
    this.leaveOrbit(planet);
    space.hud.inputMask.inputEnabled = true;
    var shipSpeed = space.data.shipSpeed;
    var currentDaysLeft = space.data.daysLeft;
    game.add.tween(space.data).to({
        daysLeft: currentDaysLeft - (distance / shipSpeed * TRAVEL_TIME_FACTOR)
    }, (distance / shipSpeed) * 1000, Phaser.Easing.Linear.None).start();
    var tween = game.add.tween(this).to({
        x: planet.x,
        y: planet.y
    }, (distance / shipSpeed) * 1000).start();
    tween.onComplete.add(function() {
        space.hud.inputMask.inputEnabled = false;
        this.enterOrbit(planet);
        Functions.travelResults(distance);
        this.onTravelComplete.dispatch();
    }, this);
};
Ship.prototype.inRangeOf = function(planet) {
    return Phaser.Math.distance(this.x, this.y, planet.x, planet.y) < space.data.travelRange;
};
Ship.prototype.scanPlanet = function(planet) {
    if (space.data.exploration[planet.id].scanned) return;
    planet.loadTexture(planet.graphicId);
    var size;
    switch (planet.area) {
        case 0:
            size = 25;
            break;
        case 1:
            size = 50;
            break;
        case 2:
            size = 75;
    }
    planet.height = size;
    planet.width = size;
    planet.angle = planet.graphicAngle;
    // add random tint if desired
    planet.tint = 0xffffff;
    space.data.exploration[planet.id] = {
        scanned: true,
        explored: 0
    };
};

module.exports = Ship;