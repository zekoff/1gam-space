/* global space, game */
var DEBUG_TEXT_STYLE = {
    font: 'bold 22pt sans',
    fill: 'white',
    // backgroundColor: 'black',
    wordWrap: true,
    wordWrapWidth: 750,
    align: 'center'
};

var state = {};

state.create = function() {
    var score = 0;
    var i;
    // 1 point for every scanned planet
    var scanned = 0;
    for (i = 0; i < space.planets.length; i++) {
        if (space.data.exploration[i].scanned) scanned += 1;
    }
    score += scanned;
    game.add.text(400, 50, "Planets scanned (1 point each): " + scanned, DEBUG_TEXT_STYLE).anchor.set(0.5);
    // 3 points for every fully-explored planet
    var explored = 0;
    for (i = 0; i < space.planets.length; i++) {
        if (space.data.exploration[i].explored >= space.planets[i].PLANET_AREAS[space.planets[i].area]) explored += 3;
    }
    score += explored * 3;
    game.add.text(400, 100, "Planets fully explored (3 points each): " + explored, DEBUG_TEXT_STYLE).anchor.set(0.5);
    // 3 points per discovery
    var discovered = 0;
    for (i = 0; i < space.planets.length; i++) {
        discovered += space.planets[i].getDiscoveries().length * 3;
    }
    score += discovered * 3;
    game.add.text(400, 150, "Discoveries made (3 points each): " + discovered, DEBUG_TEXT_STYLE).anchor.set(0.5);
    if (space.data.extraLoans > 0) {
        game.add.text(400, 200, "Penalty for extra Federation loan:", DEBUG_TEXT_STYLE).anchor.set(0.5);
        game.add.text(400, 230, "Score divided by " + (space.data.extraLoans + 1), DEBUG_TEXT_STYLE).anchor.set(0.5);
        score /= space.data.extraLoans + 1;
    }
    game.add.text(400, 350, "Final Score: " + Math.floor(score), DEBUG_TEXT_STYLE).anchor.set(0.5);

    var timer = game.time.create();
    timer.add(3000, function() {
        game.add.text(400, 550, "Click to end game...", DEBUG_TEXT_STYLE).anchor.set(0.5);
        game.input.onUp.addOnce(function() {
            game.state.start('title');
        });
    });
    timer.start();
};

module.exports = state;