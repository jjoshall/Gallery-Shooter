class controls extends Phaser.Scene {
    constructor() {
        super("controls");
        this.my = {sprite: {}};

    }

    preload() {
        this.load.setPath("./assets/");     // Set load path  
        this.load.image("redEnemy", "ship_0001.png"); 
    }

    create() {
        let my = this.my;   // create an alias to this.my for readability
        
        const pointsLeft = [
            30, 0,
            170, 100,
            -50, 200,
            -100, 300,
            170, 450,
            120, 600,
            -500, 850
        ];
        this.pathLeft = new Phaser.Curves.Spline(pointsLeft);
        
        
        my.sprite.redEnemy = this.add.follower(this.pathLeft, 400, -100, "redEnemy");
        my.sprite.redEnemy.setScale(2);
        my.sprite.redEnemy.setAngle(180);
        my.sprite.redEnemy.setScale(3.5);
        my.sprite.redEnemy.startFollow({
                duration: 3000,
                repeat: -1,
                rotateToPath: true,
                rotationOffset: 90,
                ease: 'Sine.easeInOutBounce'
        });

        const leftText = this.add.text(230, 220, "'Left Key' - Move Left", {
            fontFamily: "Arial Black",
            fontSize: 32
        });
        const rightText = this.add.text(200, 255, "'Right Key' - Move Right", {
            fontFamily: "Arial Black",
            fontSize: 32
        });
        const shootText = this.add.text(245, 290, "'Space Key' - Shoot", {
            fontFamily: "Arial Black",
            fontSize: 32
        });
        const titleScene = this.add.text(190, 325, "CLICK TO GO BACK TO TITLE", {
            fontFamily: "Arial",
            fontSize: 32,
            color: "#FF00FF"
        });

        this.input.once("pointerdown", function () {
            this.scene.start("title");
        }, this);

    }

    update() {
        let my = this.my;
        
    }
}