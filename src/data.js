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
            maxCargo: 200,
            cargo: null,
            credits: 10000,
            daysLeft: 5,
            negotiationSkill: 2,
            explorationSkill: 1,
            pilotingSkill: 1
        };
    }
};