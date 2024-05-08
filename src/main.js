// debug with extreme prejudice
"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
      pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    fps: { forceSetTimeOut: true, target: 60},
    width: 800,
    height: 600,
    scene: [title, shooter, endScreen, controls, credits]
}

// Global variable to hold sprites
var my = {sprite: {}};

const game = new Phaser.Game(config);
