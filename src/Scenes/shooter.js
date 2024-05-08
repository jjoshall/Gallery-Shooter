class shooter extends Phaser.Scene {
    
    constructor(){
        super("shooter");
        
        this.my = {sprite: {}};  // Create an object to hold sprite bindings
        this.shipX = 300;
        this.shipY = 500;
        this.yellowX = 350;
        this.yellowY = 100;
        this.redX = 100;
        this.redY = 200;
        this.my.sprite.bullet = [];
        this.enemyBullet = [];
        this.enemyMaxBullets = 3;
        this.maxBullets = 3;
        this.score = 0;
        this.scoreNum = 0;
        this.highScore = 0;
        this.highScoreNum = 0;
        this.lives = 3;
        this.livesNum = null;
        this.yellowEnemies = [];
        this.path = null;
        this.pathRight = null;
        this.pathLeft = null;
    }

    preload() {
        this.load.setPath("./assets/");     // Set load path
        this.load.image("bullet", "tile_0001.png");  
        this.load.image("playerShip", "ship_0004.png");
        this.load.image("yellowEnemy", "ship_0007.png");  
        this.load.image("enemyBullet", "tile_0012.png");  
        this.load.image("redEnemy", "ship_0001.png"); 
        this.load.image("explode0", "tile_0004.png"); 
        this.load.image("explode1", "tile_0005.png");
        this.load.image("explode2", "tile_0006.png");
        this.load.image("explode3", "tile_0007.png");
        this.load.image("explode4", "tile_0008.png");
        this.load.image("groundWater", "tile_0064.png");
        this.load.image("ground", "tile_0050.png");
        this.load.image("water", "tile_0065.png");
        this.load.audio("kill", ["explosionCrunch_000.ogg"]);
        this.load.audio("shoot", ["laserRetro_002.ogg"]);
        this.load.audio("hit", ["doorOpen_001.ogg"]);
        this.load.audio("enemyShoot", ["impactMetal_000.ogg"]);
    }

    create() {
        let my = this.my;   // create an alias to this.my for readability
        
        my.sprite.ground = this.add.sprite(game.config.width/2, game.config.height/2, "ground");
        my.sprite.ground.setScale(50);

        for (let i = 0; i < 5; i++) {
            const randX = Phaser.Math.Between(0, game.config.width);
            const randY = Phaser.Math.Between(0, game.config.height);
            my.sprite.groundWater = this.add.sprite(randX, randY, "groundWater");
            my.sprite.water = this.add.sprite(randY, randX, "water");
            my.sprite.groundWater.setScale(5);
            my.sprite.water.setScale(5);
        }

        const points = [
            -20, -70,
            50, -50,
            250, 0,
            -100, 50,
            0, 0,
            -50, -50,
            200, 24,
            300, 0
        ];
        this.path = new Phaser.Curves.Spline(points);
        const pointsRight = [
            30, 0,
            170, 100,
            250, 200,
            170, 300,
            100, 450,
            120, 600,
            700, 850
        ];
        this.pathRight = new Phaser.Curves.Spline(pointsRight);
        const pointsLeft = [
            0, 0,
            -50, 100,
            -100, 200,
            -170, 300,
            -150, 350,
            -100, 450,
            -30, 550,
            150, 575,
            -85, 600,
            -150, 850
        ];
        this.pathLeft = new Phaser.Curves.Spline(pointsLeft);
        
        
        my.sprite.redLeft = this.add.follower(this.pathLeft, 200, -100, "redEnemy");
        my.sprite.redLeft.setScale(2);
        my.sprite.redLeft.startFollow({
            duration: 2200,
            repeat: -1,
            ease: 'Sine.easeOutExpo',
            rotateToPath: true,
            rotationOffset: 90,
        });

        my.sprite.redRight = this.add.follower(this.pathRight, 400, -100, "redEnemy");
        my.sprite.redRight.setScale(2);
        my.sprite.redRight.startFollow({
            duration: 2200,
            repeat: -1,
            ease: 'Sine.easeInBack',
            rotateToPath: true,
            rotationOffset: 90,
        });

        const spacing = 95;
        for (let i = 0; i < 5; i++) {
            const yellow = this.add.follower(this.path, 100 + i * spacing, 50, "yellowEnemy");
            yellow.setAngle(180);
            yellow.setScale(2);
            yellow.startFollow({
                duration: 3500,
                repeat: -1,
                yoyo: true,
                ease: 'Sine.easeInOutBounce',
                _delay: i * 200,
                delay: i * 100
        });

            this.yellowEnemies.push(yellow);
        }

        // Create the main body sprite
        my.sprite.playerShip = this.add.sprite(game.config.width/2, game.config.height - 40, "playerShip");
        my.sprite.playerShip.setScale(2.25);

        this.anims.create({
            key: "boom",
            frames: [
                { key: "explode0" },
                { key: "explode1" },
                { key: "explode2" },
                { key: "explode3" },
                { key: "explode4" },
            ],
            framerate: 30,
            repeat: 5,
            hideOnComplete: true
        });

        this.leftKey = this.input.keyboard.addKey("LEFT");
        this.rightKey = this.input.keyboard.addKey("RIGHT");
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
        this.playerSpeed = 5;
        this.bulletSpeed = 10;

        const scoreText = this.add.text(20, 20, "Score: ", {
            fontFamily: "Arial",
            fontSize: 23,
            color: "#111111"
        });
        this.scoreNum = this.add.text(90, 20, this.score.toString(), {
            fontFamily: "Arial",
            fontSize: 23,
            color: "#FFAA00"
        });
        const highScoreText = this.add.text(20, 50, "High Score: ", {
            fontFamily: "Arial",
            fontSize: 23,
            color: "#111111"
        });
        this.highScoreNum = this.add.text(140, 50, this.highScore.toString(), {
            fontFamily: "Arial",
            fontSize: 23,
            color: "#00FF00"
        });
        const livesText = this.add.text(20, 530, "Lives: ", {
            fontFamily: "Arial",
            fontSize: 23,
            color: "#111111 "
        });
        this.livesNum = this.add.text(85, 530, this.lives.toString(), {
            fontFamily: "Arial",
            fontSize: 23,
            color: "#1E90FF"
        });

        document.getElementById('description').innerHTML = '<h2>Gallery Shooter</h2><br>Left Key: left // Right Key: right // Space: fire/emit'

    }

    update() {
        let my = this.my;

        if (this.leftKey.isDown) {
            this.my.sprite.playerShip.x -= this.playerSpeed;
            if(this.my.sprite.playerShip.x < 25)
                {
                    this.my.sprite.playerShip.x = 25;
                }
        }
        if (this.rightKey.isDown) {
            this.my.sprite.playerShip.x += this.playerSpeed;
            if(this.my.sprite.playerShip.x > 775)
                {
                    this.my.sprite.playerShip.x = 775;
                }
        }  
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            if (my.sprite.bullet.length < this.maxBullets) {
                my.sprite.bullet.push(this.add.sprite(
                    my.sprite.playerShip.x, my.sprite.playerShip.y - (my.sprite.playerShip.displayHeight/2), "bullet")
                );
                const shoot = this.sound.add("shoot");
                shoot.play();
            }
        }

        for (let i = 0; i < this.yellowEnemies.length; i++) {
            const yellowEnemy = this.yellowEnemies[i];
            const shouldShoot = Phaser.Math.Between(0, 100) < 5;

            if (shouldShoot && this.enemyBullet.length < this.enemyMaxBullets) {
                const yellowEnemyBullet = this.add.sprite(
                    yellowEnemy.x,
                    yellowEnemy.y + (yellowEnemy.displayHeight/2),
                    "enemyBullet"
                );
                yellowEnemyBullet.setScale(1.5);
                this.enemyBullet.push(yellowEnemyBullet);
                const music = this.sound.add("enemyShoot");
                music.play();
            }
        }

        for (let i = 0; i < this.enemyBullet.length; i++) {
            const yellowEnemyBullet = this.enemyBullet[i];
            yellowEnemyBullet.y += this.bulletSpeed;

            if (yellowEnemyBullet.y > game.config.height) {
                yellowEnemyBullet.destroy();
                this.enemyBullet.splice(i, 1);
                i--;
            }
        }

        for (let bullet of my.sprite.bullet) {
            bullet.y -= this.bulletSpeed;
        }

        my.sprite.bullet = my.sprite.bullet.filter((bullet) => bullet.y > -(bullet.displayHeight/2));

        for (let bullet of my.sprite.bullet) {
            for (let yellow of this.yellowEnemies) {
                if (this.collides(yellow, bullet)) {
                    this.boom = this.add.sprite(yellow.x, yellow.y, "explode4").setScale(3.5).play("boom");
                    bullet.y = -100;

                    const music = this.sound.add("kill");
                    music.play();

                    this.score += 100;
                    this.scoreNum.setText(this.score.toString());
                    
                    const index = this.yellowEnemies.indexOf(yellow);
                    if (index !== -1) {
                        this.yellowEnemies.splice(index, 1);
                        yellow.pathTween.stop();
                        yellow.pathTween = null;
                        yellow.setPosition(-100, -100);
                    }
                }
            }
            
            if (this.collides(my.sprite.redLeft, bullet)) {
                this.boom = this.add.sprite(my.sprite.redLeft.x, my.sprite.redLeft.y, "explode4").setScale(3.5).play("boom");
                bullet.y = -100;
                
                const music = this.sound.add("kill");
                music.play();

                this.score += 100;
                this.scoreNum.setText(this.score.toString());

                my.sprite.redLeft.pathTween.stop();
                my.sprite.redLeft.pathTween = null;
                my.sprite.redLeft.setPosition(-100, -100);
            }

            if (this.collides(my.sprite.redRight, bullet)) {
                this.boom = this.add.sprite(my.sprite.redRight.x, my.sprite.redRight.y, "explode4").setScale(3.5).play("boom");
                bullet.y = -100;
                
                const music = this.sound.add("kill");
                music.play();

                this.score += 100;
                this.scoreNum.setText(this.score.toString());

                my.sprite.redRight.pathTween.stop();
                my.sprite.redRight.pathTween = null;
                my.sprite.redRight.setPosition(-100, -100);
            }
        }

        if (this.collides(my.sprite.playerShip, my.sprite.redRight)) {
            this.boom = this.add.sprite(my.sprite.redRight.x, my.sprite.redRight.y, "explode4").setScale(3.5).play("boom");
            const music = this.sound.add("hit");
            music.play();
            
            this.score -= 100;
            this.scoreNum.setText(this.score.toString());

            my.sprite.redRight.pathTween.stop();
            my.sprite.redRight.pathTween = null;
            my.sprite.redRight.setPosition(-100, -100);
            
            this.lives -= 1;
            this.livesNum.setText(this.lives.toString());
        }

        if (this.collides(my.sprite.playerShip, my.sprite.redLeft)) {
            this.boom = this.add.sprite(my.sprite.redLeft.x, my.sprite.redLeft.y, "explode4").setScale(3.5).play("boom");
            const music = this.sound.add("hit");
            music.play();
            
            this.score -= 100;
            this.scoreNum.setText(this.score.toString());

            my.sprite.redLeft.pathTween.stop();
            my.sprite.redLeft.pathTween = null;
            my.sprite.redLeft.setPosition(-100, -100);
            
            this.lives -= 1;
            this.livesNum.setText(this.lives.toString());
        }

        for (let i = 0; i < this.enemyBullet.length; i++) {
            const yellowEnemyBullet = this.enemyBullet[i];
            if (this.collides(my.sprite.playerShip, yellowEnemyBullet)) {
                this.boom = this.add.sprite(my.sprite.playerShip.x, my.sprite.playerShip.y, "explode4").setScale(3.5).play("boom");
                const music = this.sound.add("hit");
                music.play();
            
                this.score -= 100;
                this.scoreNum.setText(this.score.toString());
            
                this.lives -= 1;
                this.livesNum.setText(this.lives.toString());

                yellowEnemyBullet.destroy();
                this.enemyBullet.splice(i, 1);
                i--;
            }
        }
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.highScoreNum.setText(this.highScore.toString());
        }

        if (this.lives == 0) {
            this.scene.start("endScreen");
        }

        const yellowDestroyed = this.yellowEnemies.length === 0;
        if (yellowDestroyed && (my.sprite.redRight.pathTween == null) && (my.sprite.redLeft.pathTween == null)) {
            this.levelCleared();
        }
    }

    levelCleared() {
        // Clear all existing bullets
        for (let bullet of this.my.sprite.bullet) {
            bullet.destroy();
        }
        this.my.sprite.bullet = [];

        for (let yellowEnemyBullet of this.enemyBullet) {
            yellowEnemyBullet.destroy();
        }
        this.enemyBullet = [];

        // Reset the yellow enemies
        for (let i = 0; i < this.yellowEnemies.length; i++) {
            this.yellowEnemies[i].destroy();
        }
        this.yellowEnemies = [];

        // Spawn new yellow enemies
        const numEnemies = 5;
        const spacing = 95;
        for (let i = 0; i < numEnemies; i++) {
            const yellow = this.add.follower(this.path, 100 + i * spacing, 50, "yellowEnemy");
            yellow.setAngle(180);
            yellow.setScale(2);
            yellow.startFollow({
                duration: 3500,
                repeat: -1,
                yoyo: true,
                ease: 'Sine.easeOutExpo',
                delay: i * 100
            });
            this.yellowEnemies.push(yellow);
        }

        // Reset the red enemies
        this.my.sprite.redLeft = this.add.follower(this.pathLeft, 200, -100, "redEnemy");
        this.my.sprite.redLeft.setScale(2);
        this.my.sprite.redLeft.startFollow({
            duration: 2200,
            repeat: -1,
            ease: 'Sine.easeInBack',
            rotateToPath: true,
            rotationOffset: 90,
        });

        this.my.sprite.redRight = this.add.follower(this.pathRight, 400, -100, "redEnemy");
        this.my.sprite.redRight.setScale(2);
        this.my.sprite.redRight.startFollow({
            duration: 2200,
            repeat: -1,
            ease: 'Sine.easeOutInBounce',
            rotateToPath: true,
            rotationOffset: 90,
        });
    }
    // A center-radius AABB collision check
    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }

    resetVaris() {
        // Clear all existing bullets
        for (let bullet of this.my.sprite.bullet) {
            bullet.destroy();
        }
        this.my.sprite.bullet = [];
    
        for (let yellowEnemyBullet of this.enemyBullet) {
            yellowEnemyBullet.destroy();
        }
        this.enemyBullet = [];

        // Reset the yellow enemies
        for (let yellow of this.yellowEnemies) {
            yellow.destroy();
        }
        this.yellowEnemies = [];
        
        this.my.sprite.redLeft.destroy();
        this.my.sprite.redRight.destroy();
        this.my.sprite.playerShip.destroy();

        // Reset any other state variables
        this.score = 0;
        this.lives = 3;
    }
}

