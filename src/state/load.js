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
        game.load.image('ship');
    },
    create: function() {
        var preloadSprite = game.add.sprite(400, 250, 'ship');
        preloadSprite.anchor.set(0.5, 0);
        game.add.text(400, 500, "LOADING...", {
            fill: 'white',
            font: '36pt Arial'
        }).anchor.set(0.5);
        game.load.setPreloadSprite(preloadSprite, 1);
        for (var i = 1; i < 19; i++) game.load.image('planet' + i, 'planets/' + i + '.png');
        [
            'begin',
            'cancel',
            'compass',
            'star',
            'axe',
            'money',
            'scan',
            'resupply',
            'discovery',
            'search',
            'bang',
            'organics',
            'minerals',
            'medicine',
            'food',
            'electronics',
            'weapons',
            'scale'
        ].forEach(function(icon) {
            game.load.image('i_' + icon, 'icons/' + icon + '.png');
        });
        game.load.image('pix');
        // game.load.image('ship');
        game.load.image('starfield4');
        game.load.image('range_marker');
        game.load.image('test_icon');
        game.load.image('unscanned');
        game.load.image('docked_bg');
        game.load.image('multi_button_close');
        game.load.image('multi_button_ship');
        game.load.image('title');
        game.load.image('undock_button');
        game.load.audio('blip', 'sounds/blip.ogg');
        game.load.audio('coin', 'sounds/coin.ogg');
        game.load.audio('travel', 'sounds/travel.ogg');
        game.load.audio('music', 'sounds/music.ogg');
        game.load.start();
    },
    update: function() {
        if (game.load.hasLoaded) {
            space.sounds = {};
            space.sounds.blip = game.sound.add('blip', .2);
            space.sounds.coin = game.sound.add('coin', .5);
            space.sounds.travel = game.sound.add('travel', .3);
            space.sounds.music = game.sound.play('music', .05, true);
            game.state.start('title');
        }
    }
};