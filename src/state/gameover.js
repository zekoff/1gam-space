/* global space, game */
var DEBUG_TEXT_STYLE = {
    font: 'bold 20pt sans',
    fill: 'white',
    backgroundColor: 'black',
    wordWrap: true,
    wordWrapWidth: 550,
    align: 'center'
};

var state = {};

state.create = function() {
    var score = 0;
    var i;
    // 1 point for every scanned planet
    for (i = 0; i < space.planets.length; i++) {
        if (space.data.exploration[i].scanned) score += 1;
    }
    // 3 points for every fully-explored planet
    for (i = 0; i < space.planets.length; i++) {
        if (space.data.exploration[i].explored >= space.planets[i].PLANET_AREAS[space.planets[i].area]) score += 3;
    }
    // 3 points per discovery
    for (i = 0; i < space.planets.length; i++) {
        score += space.planets[i].getDiscoveries().length * 3;
    }
    game.add.text(400, 300, "Final Score: " + score, DEBUG_TEXT_STYLE).anchor.set(0.5);
};

module.exports = state;