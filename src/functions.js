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
    var resultsList = [];
    var planet = space.ship.orbiting;
    var currentExploration = space.data.exploration[planet.id].explored;
    if (currentExploration == planet.PLANET_AREAS[planet.area]) {
        resultsList.push(new Result("Expedition Cancelled", "test_icon", "You've already discovered everything there is to discover on this planet. There is no need to conduct another expedition."));
        generateResultsChain(resultsList);
        return;
    }
    // TODO check that you have time left for an expedition
    var exploreTime = 1;
    // TODO Reduce explore result by terrain if applicable
    var exploreResult = space.data.explorationSkill * 100;
    resultsList.push(new Result("Expedition Result", "test_icon", "You explored " +
        exploreResult + " sq. miles of the planet's surface. The expedition took " +
        exploreTime + " day(s).",
        function() {
            space.data.daysLeft -= exploreTime;
            space.data.exploration[planet.id].explored += exploreResult;
            if (space.data.exploration[planet.id].explored > planet.PLANET_AREAS[planet.area])
                space.data.exploration[planet.id].explored = planet.PLANET_AREAS[planet.area];
        }));
    Array.prototype.push.apply(resultsList,
        createDiscoveryUnlockResults(currentExploration, currentExploration + exploreResult));
    // TODO decide if random event(s) occurred during exploration (explore only)
    generateResultsChain(resultsList);
};

Functions.scan = function() {
    var resultsList = [];
    var planet = space.ship.orbiting;
    var currentExploration = space.data.exploration[planet.id].explored;
    if (currentExploration == planet.PLANET_AREAS[planet.area]) {
        resultsList.push(new Result("Scan Cancelled", "test_icon", "You've already discovered everything there is to discover on this planet. There is no need to conduct another scan."));
        generateResultsChain(resultsList);
        return;
    }
    // TODO Check that you can afford a scan
    var scanResult = 50;
    var scanCost = 1000;
    resultsList.push(new Result("Scan Result", "test_icon", "You purchased a sensor scan of the planet for " +
        scanCost + " credits. The scan covers " + scanResult + " sq. miles of terrain.",
        function() {
            space.data.credits -= scanCost;
            space.data.exploration[planet.id].explored += scanResult;
            if (space.data.exploration[planet.id].explored > planet.PLANET_AREAS[planet.area])
                space.data.exploration[planet.id].explored = planet.PLANET_AREAS[planet.area];
        }));
    Array.prototype.push.apply(resultsList,
        createDiscoveryUnlockResults(currentExploration, currentExploration + scanResult));
    generateResultsChain(resultsList);
};

var Result = function(title, icon, text, result) {
    this.title = title;
    this.icon = icon;
    this.text = text;
    this.result = result;
};

var createDiscoveryUnlockResults = function(currentExploration, newExploration) {
    var planet = space.ship.orbiting;
    var resultsList = [];
    planet.discoveries.forEach(function(discovery) {
        if (discovery.unlockAt > currentExploration && discovery.unlockAt <= newExploration)
            resultsList.push(new Result("Discovery!", "test_icon", "You discovered " + planet.PLANET_DISCOVERIES[discovery.id] + "! You record this discovery in your log to share with the Federation after the journey ends."));
    });
    return resultsList;
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