// Magic numbers for playing board
const IMAGE_WIDTH = 101;
const IMAGE_HEIGHT = 171;

const CELL_WIDTH = 101;
const CELL_HEIGHT = 83;
const CELL_Y_OFFSET = -20;
const CELL_OVERLAP = 15;

const ROW_COUNT = 6;
const COL_COUNT = 5;

/** Gets invisible collision box around character */
function getCollisionBox(character) {
	const cellLeft = character.x;
	const cellTop = character.y - (3 * CELL_Y_OFFSET);

	const boxLeft = cellLeft + CELL_OVERLAP;
	const boxTop = cellTop + CELL_OVERLAP;
	const boxWidth = CELL_WIDTH - (2 * CELL_OVERLAP);
	const boxHeight = CELL_HEIGHT - (2 * CELL_OVERLAP);
	const boxRight = boxLeft + boxWidth;
	const boxBottom = boxTop + boxHeight;

	return {
		left: boxLeft,
		top: boxTop,
		width: boxWidth,
		height: boxHeight,
		right: boxRight,
		bottom: boxBottom
	};
}

// Enemies our player must avoid
class Enemy {

	constructor() {
		// Variables applied to each of our instances go here,
		// we've provided one for you to get started

		// The image/sprite for our enemies, this uses
		// a helper we've provided to easily load images
		this.sprite = 'images/enemy-bug.png';

		this.reset();
	}

	/**
	 * Resets enemy
	 */
	reset() {
		this.x = -IMAGE_WIDTH;

		const row = Math.round(Math.random() * 2) + 1;
		this.y = (row * CELL_HEIGHT) + CELL_Y_OFFSET;

		this.xSpeed = Math.random() * 5 + 1;
	}

	// Update the enemy's position, required method for game
	// Parameter: dt, a time delta between ticks
	update(dt) {
		// You should multiply any movement by the dt parameter
		// which will ensure the game runs at the same speed for
		// all computers.
		this.x += this.xSpeed;
		// If enemy goes off screen, reset them
		if (this.x > ctx.canvas.width) {
			this.reset();
		}
	}

	// Draw the enemy on the screen, required method for game
	render() {
		ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	}
}
// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

/** Player */
class Player {

	constructor() {

		this.sprite = 'images/char-pink-girl.png';
		this.reset();
	}

	/**
	 * Reset player
	 */
	reset() {
		this.x = 2 * CELL_WIDTH;
		this.y = 5 * CELL_HEIGHT + CELL_Y_OFFSET;
		this.isLoser = false;
		this.isWinner = false;
	}


	update(dt) {
		// See if we collided on the last frame
		if (this.isLoser) {
			alert('Oh Buggah! 🐞');
			this.reset();
		}

		if (this.isWinner) {
			alert('Cannonball!!! 🌊');
			this.reset();
		}

		// Check if collided
		for (const enemy of allEnemies) {
			if (this.collidesWith(enemy)) {
				this.isLoser = true;
			}
		}
		// Check if in water
		if (this.y < CELL_HEIGHT + CELL_Y_OFFSET) {
			this.isWinner = true;
		}
	}

	/** Draw the player on the screen */
	render() {
		ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	}

	handleInput(key) {

		let newX = this.x;
		let newY = this.y;

		switch (key) {
			case 'up':
				newY -= CELL_HEIGHT;
				break;
			case 'left':
				newX -= CELL_WIDTH;
				break;
			case 'right':
				newX += CELL_WIDTH;
				break;
			case 'down':
				newY += CELL_HEIGHT;
				break;
		}

		// Checks player location to prevent moving off screen
		const maxX = (COL_COUNT - 1) * CELL_WIDTH;
		if (newX >= 0 && newX <= maxX) {
			this.x = newX;
		}
		const maxY = (ROW_COUNT - 1) * CELL_HEIGHT;
		if (newY >= 0 + CELL_Y_OFFSET && newY < maxY) {
			this.y = newY;
		}
	}

	/** Checks to see if character box collides with enemy box */
	collidesWith(character) {
		const box = getCollisionBox(this);
		const characterBox = getCollisionBox(character);

		// Collision detection based on:
		// https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
		if (box.left <= characterBox.right
			&& box.right >= characterBox.left
			&& box.top <= characterBox.bottom
			&& box.bottom >= characterBox.top
		) {
			return true;
		}
		else {
			return false;
		}
	}
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

const allEnemies = [
	new Enemy(),
	new Enemy(),
	new Enemy(),
	new Enemy(),
	new Enemy()
];

const player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
	const allowedKeys = {
		37: 'left',
		38: 'up',
		39: 'right',
		40: 'down'
	};
	player.handleInput(allowedKeys[e.keyCode]);
});
