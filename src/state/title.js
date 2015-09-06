/* global game */
var TITLE_TEXT_STYLE = {
    font: 'bold 20pt sans',
    fill: 'white',
    wordWrap: true,
    wordWrapWidth: 550,
    align: 'center'
};

module.exports = {
    create: function() {
        game.add.image(0,0,'title');
        var timer = game.time.create();
        timer.add(1000, function() {
            game.add.text(400, 500, "Click anywhere to begin", TITLE_TEXT_STYLE).anchor.set(0.5);
            game.input.onUp.addOnce(function() {
                game.state.start('intro');
            });
        });
        timer.start();
    }
};