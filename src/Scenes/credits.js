class credits extends Phaser.Scene {
    constructor() {
        super("credits");
        this.my = {sprite: {}};
    }

    preload() {
        this.load.setPath("./assets/");     // Set load path
        this.load.image("yellowEnemy", "ship_0007.png");  
        this.load.image("enemyBullet", "tile_0012.png");
    }

    create() {
        let my = this.my;   // create an alias to this.my for readability
        
        const pointsLeft = [
            200, 10,
            400, 200,
            50, 400,
            500, 40,
            700, 450,
            250, 250
        ];
        this.pathLeft = new Phaser.Curves.Spline(pointsLeft);
        
        
        my.sprite.yellowEnemy = this.add.follower(this.pathLeft, 200, 100, "yellowEnemy");
        my.sprite.yellowEnemy.setScale(2);
        my.sprite.yellowEnemy.setAngle(180);
        my.sprite.yellowEnemy.setScale(3.5);
        my.sprite.yellowEnemy.startFollow({
                duration: 4500,
                repeat: -1,
                yoyo: true,
                ease: 'Sine.easeInOutBounce'
        });
        
        this.enemyBullet = [];
        this.enemyMaxBullets = 3;
        
        
        
        const creditText = this.add.text(220, 280, "MADE BY: JOSH HALL", {
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
        const shouldShoot = Phaser.Math.Between(0, 100) < 5;
        if (shouldShoot && this.enemyBullet.length < this.enemyMaxBullets) {
            const yellowEnemyBullet = this.add.sprite(
                my.sprite.yellowEnemy.x,
                my.sprite.yellowEnemy.y + (my.sprite.yellowEnemy.displayHeight/2),
                "enemyBullet"
            );
            yellowEnemyBullet.setScale(2.5);
            this.enemyBullet.push(yellowEnemyBullet);
        }
        for (let i = 0; i < this.enemyBullet.length; i++) {
            const yellowEnemyBullet = this.enemyBullet[i];
            yellowEnemyBullet.y += 8;

            if (yellowEnemyBullet.y > game.config.height) {
                yellowEnemyBullet.destroy();
                this.enemyBullet.splice(i, 1);
                i--;
            }
        }
    }
}