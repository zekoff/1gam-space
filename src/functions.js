/* global space */
var Trade = require('./trade');

var Functions = {};

Functions.buy = function() {
    var result = Trade.buyGood(space.ship.orbiting);
    space.hud.resultsPanel.showPanel(result.title, result.icon, result.text);
    space.hud.resultsPanel.onDismissed.addOnce(function() {
        if (result.result) result.result();
        space.hud.dockedPanel.updatePanel();
    });
};

Functions.sell = function() {
    var result = Trade.sellGood(space.ship.orbiting);
    space.hud.resultsPanel.showPanel(result.title, result.icon, result.text);
    space.hud.resultsPanel.onDismissed.addOnce(function() {
        if (result.result) result.result();
        space.hud.dockedPanel.updatePanel();
    });
};

Functions.explore = function() {
    // TODO cancel exploration if fully-explored
    var planet = space.ship.orbiting;
    var resultsList = [];
    // figure out range of exploration results based on player skill
    var exploreResult = 200;
    resultsList.push(new Result("Expedition Result", "test_icon", "You explored " +
        exploreResult + " sq. miles of the planet's surface.",
        function() {
            // TODO advance time based on exploration stat
            space.data.exploration[planet.id].explored += exploreResult;
            if (space.data.exploration[planet.id].explored > planet.PLANET_AREAS[planet.area])
                space.data.exploration[planet.id].explored = planet.PLANET_AREAS[planet.area];
        }));
    var currentExploration = space.data.exploration[planet.id].explored;
    var newExploration = currentExploration + exploreResult;
    planet.discoveries.forEach(function(discovery) {
        if (discovery.unlockAt > currentExploration && discovery.unlockAt <= newExploration)
            resultsList.push(new Result("Discovery!", "test_icon", "You discovered " + planet.PLANET_DISCOVERIES[discovery.id] + "! You record this discovery in your log to share with the Federation after the journey ends."));
    });
    // TODO decide if random event(s) occurred during exploration (explore only)
    generateResultsChain(resultsList);
};

Functions.hireExplorers = function() {
    print('hired explorers');
};

var Result = function(title, icon, text, result) {
    this.title = title;
    this.icon = icon;
    this.text = text;
    this.result = result;
};

var generateResultsChain = function(resultsList) {
    if (resultsList.length == 0) {
        space.hud.dockedPanel.updatePanel();
        return;
    }
    var result = resultsList.shift();
    space.hud.resultsPanel.showPanel(result.title, result.icon, result.text);
    space.hud.resultsPanel.onDismissed.addOnce(function() {
        if (result.result)
            result.result();
        generateResultsChain(resultsList);
    });
};

/* ideas for planet random encounters:
Cached Goods
Shipwreck
Well-charted
*/

module.exports = Functions;