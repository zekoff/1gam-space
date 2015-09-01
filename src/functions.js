/* global space, game */
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
    var exploreTime = 2;
    // TODO random event to boost exploration result?
    var exploreResult = space.data.explorationSkill * 100;
    var roughTerrain = planet.terrain == 1;
    if (roughTerrain) exploreResult /= 2;
    var exploreMessage = "You explored " +
        exploreResult + " sq. miles of the planet's surface. The expedition took " +
        exploreTime + " days.";
    if (roughTerrain) exploreMessage += "The rough terrain made for slow going.";
    resultsList.push(new Result("Expedition Result", "test_icon", exploreMessage,
        function() {
            space.data.daysLeft -= exploreTime;
            space.data.exploration[planet.id].explored += exploreResult;
            if (space.data.exploration[planet.id].explored >= planet.PLANET_AREAS[planet.area]) {
                space.data.exploration[planet.id].explored = planet.PLANET_AREAS[planet.area];
                resultsList.push(new Result("Planet Fully Explored!", "test_icon", "You've completely explored this planet! The Federation will be pleased."));
            }
        }));
    Array.prototype.push.apply(resultsList,
        createDiscoveryUnlockResults(currentExploration, currentExploration + exploreResult));
    while (game.rnd.frac() < .15) resultsList.push(createRandomExplorationEvent());
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
    var scanCost = 1000;
    if (scanCost > space.data.credits) {
        resultsList.push(new Result("Scan Cancelled", "test_icon", "You can't afford to purchase a scan."));
        generateResultsChain(resultsList);
        return;
    }
    var scanResult = 50;
    resultsList.push(new Result("Scan Result", "test_icon", "You purchased a sensor scan of the planet for " +
        scanCost + " credits. The scan covers " + scanResult + " sq. miles of terrain.",
        function() {
            space.data.credits -= scanCost;
            space.data.exploration[planet.id].explored += scanResult;
            if (space.data.exploration[planet.id].explored >= planet.PLANET_AREAS[planet.area]) {
                space.data.exploration[planet.id].explored = planet.PLANET_AREAS[planet.area];
                resultsList.push(new Result("Planet Fully Explored!", "test_icon", "You've completely explored this planet! The Federation will be pleased."));
            }
        }));
    Array.prototype.push.apply(resultsList,
        createDiscoveryUnlockResults(currentExploration, currentExploration + scanResult));
    generateResultsChain(resultsList);
};

Functions.travelEncounter = function() {
    
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

var createRandomExplorationEvent = function() {
    return game.rnd.pick([
        new Result("Found Shipwreck", "test_icon", "While exploring, you find a spaceship that crash landed here. The ruins have been picked pretty clean, but on an old data drive you find 1000 credits.", function() {
            space.data.credits += 1000;
        }),
        new Result("Found Secret Cache", "test_icon", "Your party stumbled across a cave while exploring where someone left a cache of goods. You sell them upon your return for 2000 credits.", function() {
            space.data.credits += 2000;
        }),
        new Result("Precursor Technology", "test_icon", "You find a magnificent cache of Precursor technology while exploring. After carting it back, you sell it to a collector for 10,000 credits.", function() {
            space.data.credits += 10000;
        }),
        new Result("Brush with Death", "test_icon", "Your party is ambushed by local fauna. One of your party members is gravely injured, but everyone makes it back alive."),
        new Result("Beautiful View", "test_icon", "During this expedition you find an incredible vista overlooking the landscape. Even after all these years exploring, you can still appreciate a sunset."),
        new Result("Encounter with the Numinous", "test_icon", "Near an ancient stone circle, a deathly chill overcomes your party even though the sun is shining brightly. No one speaks a word of it, even long after.")
    ]);
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

module.exports = Functions;