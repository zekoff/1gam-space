/* global game, space */
var Data = require('../data');
var INTRO_TEXT_STYLE = {
    font: 'bold 18pt sans',
    fill: 'white',
    // backgroundColor: '#ffffff',
    wordWrap: true,
    wordWrapWidth: 750,
    align: 'center'
};
var BUTTON_TEXT_STYLE = {
    font: 'bold 20pt sans',
    fill: 'black',
    backgroundColor: '#00ff00',
    wordWrap: true,
    wordWrapWidth: 750,
    align: 'center'
};
var NUM_PLANETS = 150;

var state = {};

var skillPointsText;
var skillPointsRemaining;
var negotation;
var exploration;
var piloting;
var negotationText;
var explorationText;
var pilotingText;

var updateSkills = function() {
    skillPointsText.setText("Skill points remaining: " + skillPointsRemaining);
};

state.create = function() {
    space.data = Data.newData(NUM_PLANETS);
    game.add.text(400, 20, "YOUR MISSION, CAPTAIN: To explore an unknown sector of the galaxy, " +
        "bringing back information about planets and any unique discoveries you find to the Federation. " +
        "The Federation has given you a ship, a loan, and one year. You will be graded based on the " +
        "number of planets scanned, the number of discoveries found, and the number of planets fully " +
        "explored after 1 year. You may need to trade to make a few bucks along the way.", INTRO_TEXT_STYLE).anchor.set(0.5, 0);
    skillPointsText = game.add.text(10, 350, "Skill points left: 3", INTRO_TEXT_STYLE);
    skillPointsRemaining = 3;
    negotation = 1;
    exploration = 1;
    piloting = 1;
    var reset = game.add.text(400, 350, "RESET", BUTTON_TEXT_STYLE);
    reset.inputEnabled = true;
    reset.events.onInputUp.add(function() {
        negotation = 1;
        exploration = 1;
        piloting = 1;
        updateSkills();
    });
    negotationText = game.add.text(40, 400, "", INTRO_TEXT_STYLE);
    explorationText = game.add.text(40, 430, "", INTRO_TEXT_STYLE);
    pilotingText = game.add.text(40, 460, "", INTRO_TEXT_STYLE);
    updateSkills();

    var button = game.add.text(680, 550, 'ONWARD!', BUTTON_TEXT_STYLE);
    button.inputEnabled = true;
    button.events.onInputUp.add(function() {
        space.data.negotiationSkill = negotation;
        space.data.explorationSkill = exploration;
        space.data.pilotingSkill = piloting;
        game.state.start('main');
    });
    button.anchor.set(0.5);
};

module.exports = state;