class endScreen extends Phaser.Scene {
    constructor() {
        super("endScreen");
        this.my = {sprite: {}};
        this.bam = null;
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("playerShip", "ship_0004.png");
        this.load.image("explode0", "tile_0004.png"); 
        this.load.image("explode1", "tile_0005.png");
        this.load.image("explode2", "tile_0006.png");
        this.load.image("explode3", "tile_0007.png");
        this.load.image("explode4", "tile_0008.png");
        
    }

    create() {
        let my = this.my;
        
        my.sprite.playerShip = this.add.sprite(375, 230, "playerShip");
        my.sprite.playerShip.setScale(3.5);
        my.sprite.playerShip.setAngle(90);

        this.anims.create({
            key: "bam",
            frames: [
                { key: "explode0" },
                { key: "explode1" },
                { key: "explode2" },
                { key: "explode3" },
                { key: "explode4" },
            ],
            framerate: 20,
            repeat: 10,
            hideOnComplete: false
        });

        const endText = this.add.text(300, 275, "YOU DIED", {
            fontFamily: "Arial",
            fontSize: 32,
            color: "#FF0000"
        });
        const newScene = this.add.text(230, 305, "CLICK TO RESTART", {
            fontFamily: "Arial",
            fontSize: 32,
            color: "#FF0000"
        });
        const highScoreText = this.add.text(270, 335, `HighScore: ${this.scene.get("shooter").highScore}`, {
            fontFamily: "Arial",
            fontSize: 32,
            color: "#00FF00"
        });

        this.bam = this.add.sprite(my.sprite.playerShip.x, my.sprite.playerShip.y, "explode4").setScale(3.5).play("bam");

        this.input.once("pointerdown", function () {
            const shooterScene = this.scene.get("shooter");
            if (shooterScene) {
                shooterScene.resetVaris();
            }
            this.scene.start("shooter");
        }, this);
    }

    update() {
        let my = this.my
    }
}