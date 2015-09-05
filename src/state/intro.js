/* global game, space */
var Data = require('../data');
var INTRO_TEXT_STYLE = {
    font: '18pt sans',
    fill: 'white',
    // backgroundColor: '#ffffff',
    wordWrap: true,
    wordWrapWidth: 750,
    align: 'center'
};
var BUTTON_TEXT_STYLE = {
    font: 'bold 22pt sans',
    fill: 'black',
    backgroundColor: '#00ff00',
    wordWrap: true,
    wordWrapWidth: 750,
    align: 'center'
};
var NUM_PLANETS = 150;
var NEGOTIATION_SKILLS = ['Trading', 'Haggling', 'Free Refining'];
var EXPLORATION_SKILLS = ['Exploring', 'Scavenging', 'Pathfinding'];
var PILOTING_SKILLS = ['Piloting', 'Fuel Conservation', 'Deft Manuevering'];

var state = {};

var skillPointsText;
var skillPointsRemaining;
var negotiation;
var exploration;
var piloting;
var negotiationText;
var explorationText;
var pilotingText;

var updateSkills = function() {
    skillPointsText.setText("Skill points remaining: " + skillPointsRemaining);
    negotiationText.setText("Negotiation: " + negotiation + " (" + NEGOTIATION_SKILLS.slice(0, negotiation).join(", ") + ")");
    explorationText.setText("Exploration: " + exploration + " (" + EXPLORATION_SKILLS.slice(0, exploration).join(", ") + ")");
    pilotingText.setText("Piloting: " + piloting + " (" + PILOTING_SKILLS.slice(0, piloting).join(", ") + ")");
};

state.create = function() {
    space.data = Data.newData(NUM_PLANETS);
    game.add.text(400, 20, "YOUR MISSION, CAPTAIN: To explore an unknown sector of the galaxy, " +
        "bringing back information about planets and any unique discoveries you find to the Federation. " +
        "The Federation has given you a ship, a loan, and one year. You will be graded based on the " +
        "number of planets scanned, the number of discoveries found, and the number of planets fully " +
        "explored after 1 year. You may need to trade to make a few bucks along the way.", INTRO_TEXT_STYLE).anchor.set(0.5, 0);
    skillPointsText = game.add.text(10, 310, "Skill points left: 3", INTRO_TEXT_STYLE);
    skillPointsText.anchor.set(0, 0.5);
    skillPointsRemaining = 3;
    negotiation = 1;
    exploration = 1;
    piloting = 1;
    var reset = game.add.text(400, 310, "RESET", BUTTON_TEXT_STYLE);
    reset.inputEnabled = true;
    reset.events.onInputUp.add(function() {
        skillPointsRemaining = 3;
        negotiation = 1;
        exploration = 1;
        piloting = 1;
        updateSkills();
    });
    reset.anchor.set(0, 0.5);
    negotiationText = game.add.text(50, 360, "sa", INTRO_TEXT_STYLE);
    negotiationText.anchor.set(0, 0.5);
    explorationText = game.add.text(50, 410, "das", INTRO_TEXT_STYLE);
    explorationText.anchor.set(0, 0.5);
    pilotingText = game.add.text(50, 460, "ad", INTRO_TEXT_STYLE);
    pilotingText.anchor.set(0, 0.5);
    updateSkills();

    var negotiationButton = game.add.text(25, 360, " +", BUTTON_TEXT_STYLE);
    negotiationButton.anchor.set(0.5);
    negotiationButton.inputEnabled = true;
    negotiationButton.events.onInputUp.add(function() {
        if (skillPointsRemaining && negotiation < 3) {
            skillPointsRemaining--;
            negotiation++;
        }
        updateSkills();
    });
    var explorationButton = game.add.text(25, 410, " +", BUTTON_TEXT_STYLE);
    explorationButton.anchor.set(0.5);
    explorationButton.inputEnabled = true;
    explorationButton.events.onInputUp.add(function() {
        if (skillPointsRemaining && exploration < 3) {
            skillPointsRemaining--;
            exploration++;
        }
        updateSkills();
    });
    var pilotingButton = game.add.text(25, 460, " +", BUTTON_TEXT_STYLE);
    pilotingButton.anchor.set(0.5);
    pilotingButton.inputEnabled = true;
    pilotingButton.events.onInputUp.add(function() {
        if (skillPointsRemaining && piloting < 3) {
            skillPointsRemaining--;
            piloting++;
        }
        updateSkills();
    });

    var button = game.add.text(400, 550, 'ONWARD!', BUTTON_TEXT_STYLE);
    button.inputEnabled = true;
    button.events.onInputUp.add(function() {
        space.data.negotiationSkill = negotiation;
        space.data.explorationSkill = exploration;
        space.data.pilotingSkill = piloting;
        game.state.start('main');
    });
    button.anchor.set(0.5);
};

module.exports = state;