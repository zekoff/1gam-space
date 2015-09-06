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
        resultsList.push(new Result("Expedition Cancelled", "i_cancel", "You've already discovered everything there is to discover on this planet. There is no need to conduct another expedition."));
        generateResultsChain(resultsList);
        return;
    }
    var exploreTime = 3;
    var exploreResult = game.rnd.between(100, 350);
    var roughTerrain = planet.terrain == 1;
    if (roughTerrain && space.data.explorationSkill < 3) exploreResult /= 2;
    exploreResult = Math.floor(exploreResult);
    var exploreMessage = "You explored " +
        exploreResult + " sq. miles of the planet's surface. The expedition took " +
        exploreTime + " days. ";
    if (roughTerrain && space.data.explorationSkill < 3)
        exploreMessage += " The rough terrain made for slow going. ";
    else if (roughTerrain && space.data.explorationSkill == 3)
        exploreMessage += "Despite the rough terrain, you are skilled enough to push ahead full-speed.";
    resultsList.push(new Result("Expedition Result", "i_compass", exploreMessage,
        function() {
            space.data.daysLeft -= exploreTime;
            space.data.exploration[planet.id].explored += exploreResult;
            if (space.data.exploration[planet.id].explored >= planet.PLANET_AREAS[planet.area]) {
                space.data.exploration[planet.id].explored = planet.PLANET_AREAS[planet.area];
                resultsList.push(new Result("Planet Fully Explored!", "i_star", "You've completely explored this planet! The Federation will be pleased."));
            }
        }));
    if (space.data.explorationSkill > 1) {
        var scavengedAmount = game.rnd.between(200, 1000);
        resultsList.push(new Result("Scavenged Resources", "i_axe", "As a skilled explorer, " +
            "you were able to scavenge " + scavengedAmount + " credits worth of resources during your expedition.",
            function() {
                space.data.credits += scavengedAmount;
            }));
    }
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
        resultsList.push(new Result("Scan Cancelled", "i_cancel", "You've already discovered everything there is to discover on this planet. There is no need to conduct another scan."));
        generateResultsChain(resultsList);
        return;
    }
    var scanCost = 5000;
    if (scanCost > space.data.credits) {
        resultsList.push(new Result("Scan Cancelled", "i_money", "You can't afford to purchase a scan."));
        generateResultsChain(resultsList);
        return;
    }
    var scanResult = 200;
    resultsList.push(new Result("Scan Result", "i_scan", "You purchased a sensor scan of the planet for " +
        scanCost + " credits. The scan covers " + scanResult + " sq. miles of terrain.",
        function() {
            space.data.credits -= scanCost;
            space.data.exploration[planet.id].explored += scanResult;
            if (space.data.exploration[planet.id].explored >= planet.PLANET_AREAS[planet.area]) {
                space.data.exploration[planet.id].explored = planet.PLANET_AREAS[planet.area];
                resultsList.push(new Result("Planet Fully Explored!", "i_star", "You've completely explored this planet! The Federation will be pleased."));
            }
        }));
    Array.prototype.push.apply(resultsList,
        createDiscoveryUnlockResults(currentExploration, currentExploration + scanResult));
    generateResultsChain(resultsList);
};

Functions.travelResults = function(distance) {
    var deltaCredits = 0;
    var resultsList = [];
    // Manage global event if one isn't active, or decrement if active
    // Chance for 0..n random good events (more if better piloting skill)
    if (space.data.upgradeLevel < 9) {
        while (game.rnd.frac() < .2) {
            var badEvent = createRandomBadTravelEvent();
            deltaCredits -= badEvent[0];
            resultsList.push(badEvent[1]);
        }
    }
    if (space.data.upgradeLevel >= 5 && !space.data.cargo) {
        var grapplingBeamAmount = game.rnd.between(1000, 4000);
        deltaCredits += grapplingBeamAmount;
        resultsList.push(new Result('Salvaged Scrap', 'test_icon', 'Because your cargo hold is empty, ' +
            'you were able to salvage ' + grapplingBeamAmount + ' credits worth of scrap with your grappling beam.',
            function() {
                space.data.credits += grapplingBeamAmount;
            }));
    }
    var resupplyCost = Math.ceil(distance * 2 * (space.data.upgradeLevel + 1) / 2);
    if (space.data.pilotingSkill > 1) resupplyCost /= 2;
    resupplyCost = Math.ceil(resupplyCost);
    deltaCredits -= resupplyCost;
    resultsList.push(new Result('Resupply Costs', 'i_resupply', 'Based on the length ' +
        'of your journey, your piloting skill, and the cost of various components of your ship, your ' +
        'resupply costs total ' + resupplyCost + '.',
        function() {
            space.data.credits -= resupplyCost;
        }));
    if (space.data.credits + deltaCredits <= 0) resultsList.push(new Result("Out of Credits", "i_money", "You have run " +
        "out of money. The Federation grants you a loan to continue exploration, but they are very unhappy.",
        function() {
            space.data.extraLoans++;
            space.data.credits += 5000;
        }));
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
            resultsList.push(new Result("Discovery!", "i_discovery", "You discovered " + planet.PLANET_DISCOVERIES[discovery.id] + "! You record this discovery in your log to share with the Federation after the journey ends."));
    });
    return resultsList;
};

var createRandomExplorationEvent = function() {
    /*
    I know what an ugly interface this creates (returning an array where all
    similar functions return just the Result), but I'm accepting it so I can
    get this feature done.
    */
    return game.rnd.pick([
        new Result("Found Shipwreck", "i_search", "While exploring, you find a spaceship that crash landed here. The ruins have been picked pretty clean, but on an old data drive you find 1000 credits.", function() {
            space.data.credits += 1000;
        }),
        new Result("Found Secret Cache", "i_search", "Your party stumbled across a cave while exploring where someone left a cache of goods. You sell them upon your return for 2000 credits.", function() {
            space.data.credits += 2000;
        }),
        new Result("Precursor Technology", "i_search", "You find a magnificent cache of Precursor technology while exploring. After carting it back, you sell it to a collector for 10,000 credits.", function() {
            space.data.credits += 10000;
        }),
        new Result("Brush with Death", "i_search", "Your party is ambushed by local fauna. One of your party members is gravely injured, but everyone makes it back alive."),
        new Result("Beautiful View", "i_search", "During this expedition you find an incredible vista overlooking the landscape. Even after all these years exploring, you can still appreciate a sunset."),
        new Result("Encounter with the Numinous", "i_search", "Near an ancient stone circle, a deathly chill overcomes your party even though the sun is shining brightly. No one speaks a word of it, even long after.")
    ]);
};

var createRandomGoodTravelEvent = function() {
    return game.rnd.pick([
        new Result("", "test_icon", "", function() {})
    ]);
};

var createRandomBadTravelEvent = function() {
    var amountLost = game.rnd.between(200, 800);
    var negativeFunction = function() {
        space.data.credits -= amountLost;
    };
    return [amountLost, game.rnd.pick([
        new Result("Solar Storm", "i_bang", "The radiation from a solar storm " +
            "damaged your ship during travel. It will cost " + amountLost + " to repair the damage.", negativeFunction),
        new Result("Meteorite Strike", "i_bang", "A small meteorite strikes your ship " +
            "during travel. It will cost " + amountLost + " to repair the hull damage.", negativeFunction),
        new Result("Cargo Door Malfunction", "i_bang", "The door to the ship's cargo " +
            "hold malfunctioned and your cargo was lost. Your insurance will cover the repurchase " +
            "when you arrive, but the deductible will be " + amountLost + ".", negativeFunction)
    ])];
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