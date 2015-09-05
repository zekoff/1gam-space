// save world seed and number of planets to data
module.exports = {
    newData: function(numPlanets) {
        var exploration = [];
        for (var i = 0; i < numPlanets; i++) {
            exploration[i] = {};
            exploration[i].scanned = false;
            exploration[i].explored = 0;
        }
        return {
            exploration: exploration,
            extraLoans: 0,
            shipSpeed: 30,
            travelRange: 150,
            maxCargo: 100,
            upgradeLevel: 0,
            cargo: null,
            credits: 10000,
            daysLeft: 365,
            negotiationSkill: 3,
            explorationSkill: 3,
            pilotingSkill: 1
        };
    }
};