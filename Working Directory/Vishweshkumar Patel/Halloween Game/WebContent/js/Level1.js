/**
 * Level state.
 */
function Level() {
	Phaser.State.call(this);
	// TODO: generated method.
}

/** @type Phaser.State */
var proto = Object.create(Phaser.State.prototype);
Level.prototype = proto;
Level.prototype.constructor = Level;
var tween1 = null;
var player = null;

Level.prototype.init = function() {

	this.scale.pageAlignHorizontally = true;
	this.scale.pageAlignVertically = true;
	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

	//this.world.resize(3000, 1400);
	this.world.setBounds(0, 0, 3000, 1400);

	this.physics.startSystem(Phaser.Physics.ARCADE);
	this.physics.arcade.gravity.y = 800;

	// Disable base collision 
	this.physics.arcade.checkCollision.up = false;
	this.physics.arcade.checkCollision.down = false;
	
};

Level.prototype.preload = function() {
	this.load.pack("level", "assets/pack.json");
};


Level.prototype.create = function() {
	this.scene = new Scene1(this.game);
	
	var fac = new Factory(this);
	this.player = fac.getObject('player');
	this.collisionLayer = fac.getObject('collisionLayer');
	this.collectibles = fac.getObject('collectibles');
	this.enemy = fac.getObject('enemy');
	this.enemy1 = fac.getObject('enemy1');
	this.enemy2 = fac.getObject('enemy2');
	this.enemy3 = fac.getObject('enemy3');
	this.enemy4 = fac.getObject('enemy4');
	this.enemy5 = fac.getObject('enemy5');
	this.enemy6 = fac.getObject('enemy6');
	
	// Enable collisionWorldBound for Player
	this.player.body.collideWorldBounds = true;
	
	// Enale outOfBoundKill for Player
	this.player.checkWorldBounds = true;
	this.player.outOfBoundKill = true;
	
	this.playerdied = false;
	// camera
	this.camera.follow(this.player, Phaser.Camera.FOLLOW_PLATFORMER);

	// background
	// this.scene.fBack.fixedToCamera = true;

	// set the physics properties of the collision sprites
	this.collisionLayer.setAll("body.immovable", true);
	this.collisionLayer.setAll("body.allowGravity", false);
	this.enemy.setAll("body.allowGravity", false);

	// hide all objects of the collision layer
	this.collisionLayer.setAll("renderable", false);
	this.collisionLayer.setAll("body.checkCollision.left", false);
	this.collisionLayer.setAll("body.checkCollision.right", false);
	this.collisionLayer.setAll("body.checkCollision.down", false);

	this.collectibles.setAll("body.allowGravity", false);
	this.collectibles.setAll("anchor.x", 0.5);
	this.collectibles.setAll("anchor.y", 0.5);

	this.count = 0;
	this.collectiblecount = this.add.text(70, 16, '0', { fontSize: '32px', fill: '#FF4500'});
	this.collectiblecount.fixedToCamera = true;

	this.cursors = this.input.keyboard.createCursorKeys();
	this.spaceKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

	this.game.add.tween(this.enemy1).to({x: 2325}, 2400, 'Sine.easeInOut', true, 0 , -1, true);
	this.game.add.tween(this.enemy2).to({x: 800}, 4000, 'Sine.easeInOut', true, 0 , -1, true);
	this.game.add.tween(this.enemy3).to({x: 100}, 4400, 'Sine.easeInOut', true, 0 , -1, true);
	this.game.add.tween(this.enemy6).to({x: 400}, 4400, 'Sine.easeInOut', true, 0 , -1, true);
	this.game.add.tween(this.enemy5).to({x: 600}, 1400, 'Sine.easeInOut', true, 0 , -1, true);

	player = new Player(this.scene.fPlayer);
	// to keep the fruits in the air
//	this.scene.fFruits.setAll("body.allowGravity", false);
//	this.scene.fFruits.setAll("anchor.x", 0.5);
//	this.scene.fFruits.setAll("anchor.y", 0.5);

	// water
//	this.add.tween(this.scene.fWater.tilePosition).to({
//	x : 25
//	}, 2000, "Linear", true, 0, -1, true);
};

Level.prototype.update = function() {
	if(player.getState()=="die"){
		console.log("Died");
		player.play();
		player.moveBody();
//		this.scene.fPlayer.play("die");
//		this.scene.fPlayer.body.velocity.x = 0;
	}
	else{
		// collide the player with the platforms
		this.physics.arcade.collide(this.player, this.collisionLayer);
		
		//this.player.checkCollision.down = false;
		
		this.doTweenUpdates();

		var touching = this.player.body.touching.down;
		console.log("touch:"+touching);
		
		if(touching){
			if (this.cursors.left.isDown) {
				if(player.getState!=="walk"){
					player.change("walk");	
				}
				player.moveBody("left");
				
				// move to the left
	//			this.scene.fPlayer.body.velocity.x = -200;
			} 
			else if (this.cursors.right.isDown) {
				// move to the right
				if(player.getState!=="walk"){
					player.change("walk");	
				}
				player.moveBody("right");
	//			this.scene.fPlayer.body.velocity.x = 200;
			} 
			else {
				// dont move in the horizontal
	//			this.scene.fPlayer.body.velocity.x = 0;
				console.log(player.getState());
				if(player.getState()!="idle"){
					player.change("idle");	
				}
				else{
					console.log("trie");
				}			
				player.moveBody();
			}
		}
		else{
			if(player.getState()!=="die" && player.getState()!=="jump"){
				player.change("idle");
				if (this.cursors.left.isDown) {
					player.moveDirection("left");
				} 
				else if (this.cursors.right.isDown) {
					player.moveDirection("right");
				}
			}
		}

		if (touching && this.cursors.up.isDown) {
			// jump if the player is on top of a platform and the up key is pressed
			if(player.getState()!="jump"){
				player.change("jump");
			}
			player.moveBody();
//			this.scene.fPlayer.body.velocity.y = -700;
			if (this.cursors.left.isDown) {
				player.moveDirection("left");
			} 
			else if (this.cursors.right.isDown) {
				player.moveDirection("right");
			}	
		}

		if (touching) {
			if (player.getState()=="idle") {
				// if it is not moving horizontally play the idle
//				this.scene.fPlayer.play("idle");
				player.play();
			} else {
				// if it is moving play the walk
				player.play();
			}
		} 
		else {
			// it is not touching the platforms so it means it is jumping.
//			this.scene.fPlayer.play("jump");
			player.play();
			if(player.getState()==="jump"){
				if (this.cursors.left.isDown) {
					player.moveDirection("left");
				} 
				else if (this.cursors.right.isDown) {
					player.moveDirection("right");
				}
			}
		}

		if(this.spaceKey.isDown){
			this.player.play("attack");
		}

		this.physics.arcade.overlap(this.player, this.enemy,
				this.playerVsEnemies, null, this);


		this.physics.arcade.overlap(this.player, this.collectibles,
				this.playerVsCollectibles, null, this);
	}
};

/**
 * @param {Phaser.Sprite}
 *            player
 * @param {Phaser.Sprite}
 *            fruit
 */

Level.prototype.playerVsCollectibles = function(player, collectible) {
	collectible.body.enable = false;

	this.add.tween(collectible).to({
		y : collectible.y - 50
	}, 1000, "Expo.easeOut", true);

	this.add.tween(collectible.scale).to({
		x : 2,
		y : 2
	}, 1000, "Linear", true);

	this.add.tween(collectible).to({
		alpha : 0.2
	}, 1000, "Linear", true).onComplete.add(collectible.kill, collectible);

	//this.count++;
	var countObserver = new CountObserver();
    countObserver.subscribe(this.count);
    this.count = countObserver.increaseCount();
    
	this.collectiblecount.text = this.count;
};

Level.prototype.playerVsEnemies = function(_player, enemies) {
	enemies.body.enable = false;
//	this.playerdied = true;
	
	console.log(player.getState());
	
	if(player.getState()!="die"){
		player.change("die");
		player.play();
		player.moveBody();
	}

	this.add.tween(enemies).to({
		y : enemies.y - 50
	}, 1000, "Expo.easeOut", true);

	this.add.tween(enemies.scale).to({
		x : 2,
		y : 2
	}, 1000, "Linear", true);

	this.add.tween(enemies).to({
		alpha : 0.2
	}, 1000, "Linear", true).onComplete.add(enemies.kill, enemies);

};

Level.prototype.doTweenUpdates = function(){


	if(this.enemy1.x === 2621)
	{
		this.enemy1.scale.x = -0.22;

	}
	if(this.enemy1.x === 2325)
	{
		this.enemy1.scale.x = 0.22;

	}

	if(this.enemy6.x === 1174)
	{
		this.enemy6.scale.x = -0.29;

	}
	if(this.enemy6.x === 400)
	{
		this.enemy6.scale.x = 0.29;

	}

	if(this.enemy5.x === 600)
	{
		this.enemy5.scale.x = -0.19;

	}
	if(this.enemy5.x === 872)
	{
		this.enemy5.scale.x = 0.19;

	}


	if(this.enemy2.x === 800)
	{
		this.enemy2.scale.x = -0.2;

	}
	if(this.enemy2.x === 1739)
	{
		this.enemy2.scale.x = 0.2;

	}

	if(this.enemy3.x === 100)
	{
		this.enemy3.scale.x = 0.23;

	}
	if(this.enemy3.x === 1090)
	{
		this.enemy3.scale.x = -0.23;

	}
}