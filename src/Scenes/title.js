class title extends Phaser.Scene {
    constructor() {
        super("title");
        this.my = {sprite: {}};

        this.my.sprite.bullet = [];
        this.maxBullets = 3;
        this.path = null;
    }

    preload() {
        this.load.setPath("./assets/");     // Set load path
        this.load.image("bullet", "tile_0001.png");  
        this.load.image("playerShip", "ship_0004.png");
        this.load.audio("shoot", ["laserRetro_002.ogg"]);
    }

    create() {
        let my = this.my;   // create an alias to this.my for readability

        const points = [
            100, 100,
            50, 450,
            300, 200,
            500, 300,
            500, 50,
            50, -20
        ];
        this.path = new Phaser.Curves.Spline(points);

        my.sprite.playerShip = this.add.follower(this.path, 200, 200, "playerShip");
        my.sprite.playerShip.setScale(3.5);
        my.sprite.playerShip.startFollow({
            duration: 4500,
            repeat: -1,
            yoyo: true,
            ease: 'Sine.easeInOut',
            rotationOffset: 180,
        });

        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.cKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

        const titleText = this.add.text(245, 260, "GUNNER", {
            fontFamily: "Arial Black",
            fontSize: 64
        });
        titleText.setStroke('#BCD1FB', 4);

        //  Apply the gradient fill.
        const gradient = titleText.context.createLinearGradient(0, 0, 0, titleText.height);
        gradient.addColorStop(0, '#FFAA00');
        gradient.addColorStop(0.5, '#FBE6BC');
        gradient.addColorStop(0.5, '#0055FF');
        gradient.addColorStop(1, '#BCD1FB');

        titleText.setFill(gradient);
        const newScene = this.add.text(225, 325, "CLICK TO START GAME", {
            fontFamily: "Arial",
            fontSize: 32,
            color: "#55FF55"
        });
        const controlsScene = this.add.text(200, 355, "PRESS 'c' FOR CONTROLS", {
            fontFamily: "Arial",
            fontSize: 32,
            color: "#FF33AA"
        });
        const creditsScene = this.add.text(220, 385, "PRESS 'a' FOR CREDITS", {
            fontFamily: "Arial",
            fontSize: 32,
            color: "#FF33AA"
        });

        this.input.once("pointerdown", function () {
            this.scene.start("shooter");
        }, this);

    }

    update() {
        let my = this.my;
        
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            if (my.sprite.bullet.length < this.maxBullets) {
                my.sprite.bullet.push(this.add.sprite(
                    my.sprite.playerShip.x, my.sprite.playerShip.y - (my.sprite.playerShip.displayHeight/2), "bullet")
                );
                const music = this.sound.add("shoot");
                music.play();
            }
        }

        for (let bullet of my.sprite.bullet) {
            bullet.y -= 10;
        }

        my.sprite.bullet = my.sprite.bullet.filter((bullet) => bullet.y > -(bullet.displayHeight/2));

        if (Phaser.Input.Keyboard.JustDown(this.cKey)) {
            this.scene.start("controls");
        }
        if (Phaser.Input.Keyboard.JustDown(this.aKey)) {
            this.scene.start("credits");
        }
    }
}