/* global game, Phaser, space */
module.exports = {
    preload: function() {
        game.input.maxPointers = 1;
        if (space.worldSeed)
            game.rnd.sow([space.worldSeed]);
        game.world.resize(3000, 3000);
        Phaser.Easing.Default = Phaser.Easing.Quadratic.InOut;
        game.load.baseURL = './assets/';
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
    },
    create: function() {
        for (var i = 1; i < 19; i++) game.load.image('planet' + i, 'planets/' + i + '.png');
        game.load.image('pix');
        game.load.image('ship');
        game.load.image('starfield');
        game.load.image('range_marker');
        game.load.image('test_icon');
        game.load.image('unscanned');
        game.load.start();
    },
    update: function() {
        if (game.load.hasLoaded) game.state.start('title');
    }
};