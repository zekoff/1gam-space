/* global Phaser */
var game = new Phaser.Game();
var print = console.log.bind(console);
var space = {};
space.worldSeed = "the once and future king";
global.game = game;
global.print = print;
global.space = space;
game.state.add('main', require('./state/main'));
game.state.add('title', require('./state/title'));
game.state.add('load', require('./state/load'));
game.state.start('load');