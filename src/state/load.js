/* global game,Phaser */
module.exports = {
    preload: function() {
        game.input.maxPointers = 1;
        game.world.resize(3000,3000);
        Phaser.Easing.Default = Phaser.Easing.Quadratic.InOut;
        game.load.baseURL = './assets/';
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
    },
    create: function() {
        game.load.image('pix');
        game.load.image('ship');
        game.load.image('starfield');
        game.load.start();
    },
    update: function() {
        if (game.load.hasLoaded) game.state.start('title');
    }
};