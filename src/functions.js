/* global space */
var Functions = {};

Functions.buy = function() {
    var planet = space.ship.orbiting;
    print(planet.type);
    print(planet.economy);
    print(planet.government);
    print(planet.terrain);
};

Functions.sell = function() {
    print('selling goods');
};

Functions.explore = function() {
    // TODO cancel exploration if fully-explored
    var planet = space.ship.orbiting;
    var resultsList = [];
    // figure out range of exploration results based on player skill
    var exploreResult = 200;
    resultsList.push({
        title: "Expedition Result",
        icon: "test_icon",
        text: "You explored 200 sq. miles of the planet's surface.",
        result: function() {
            // TODO advance time based on exploration stat
            space.data.exploration[planet.id].explored += exploreResult;
            if (space.data.exploration[planet.id].explored > planet.PLANET_AREAS[planet.area])
                space.data.exploration[planet.id].explored = planet.PLANET_AREAS[planet.area];
        }
    });
    var currentExploration = space.data.exploration[planet.id].explored;
    var newExploration = currentExploration + exploreResult;
    planet.discoveries.forEach(function(discovery) {
        if (discovery.unlockAt > currentExploration && discovery.unlockAt <= newExploration)
            resultsList.push({
                title: "Discovery!",
                icon: "test_icon",
                text: "You discovered " + planet.PLANET_DISCOVERIES[discovery.id] + "! You record this discovery in your log to share with the Federation after the journey ends.",
                result: function() {}
            });
    });
    // TODO decide if random event(s) occurred during exploration (explore only)
    generateResultsChain(resultsList);
};

var generateResultsChain = function(resultsList) {
    if (resultsList.length == 0) return;
    var result = resultsList.shift();
    space.hud.resultsPanel.showPanel(result.title, result.icon, result.text);
    space.hud.resultsPanel.onDismissed.addOnce(function() {
        result.result();
        generateResultsChain(resultsList);
    });
};

Functions.hireExplorers = function() {
    print('hired explorers');
};

/* ideas for planet random encounters:
Cached Goods
Shipwreck
Well-charted
*/

module.exports = Functions;