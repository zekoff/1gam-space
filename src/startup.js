/* global Phaser */
var game = new Phaser.Game();
var print = console.log.bind(console);
global.game = game;
global.print = print;
game.state.add('main', require('./state/main'));
game.state.add('title', require('./state/title'));
game.state.add('load', require('./state/load'));
game.state.start('load');