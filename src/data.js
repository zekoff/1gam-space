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
            exploration: exploration
        };
    }
};