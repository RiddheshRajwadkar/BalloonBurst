const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });

const config = {
type: Phaser.AUTO,
width: 1734,
height: 824,
scene: {
preload,
create,
update
}
};

const game = new Phaser.Game(config);

let balloon, pumpButton, isInFlating = false;

function preload() {
this.load.audio('pop', 'assets/Pop sound.mp3');
this.load.image('balloon', 'assets/Symbol 100001.png', 'assets/Symbol 100002.png');
this.load.image('pump', 'assets/Symbol 320003.png');
this.load.image('background', 'assets/Symbol 3 copy.png');
this.load.image('pumpButton', 'assets/Symbol 320001.png');
this.load.image('pipe', 'assets/Symbol 320002.png')
}

function create() {
this.add.image(500,300, 'background');

// Adds balloon
balloon = this.add.image(1245, 455, 'balloon').setScale(0.1);

//Adds the pumpButton
pumpButton = this.add.image(1500, 450, 'pumpButton').setScale(0.4)
.setInteractive()
.on('pointerdown', () => {isInFlating = true;
pumpButton.setScale(0.35);
})
.on('pointerup', () => {isInFlating = false;
pumpButton.setScale(0.4);
});

//Adds pump
pump = this.add.image(1500, 600, 'pump').setScale(0.6);
pipe = this.add.image(1320, 570, 'pipe').setScale(0.6);

balloon.setInteractive();
balloon.on('pointerdown', burstBalloon,this);
}
let isFloating = false;
let dx = (Math.random() - 0.5) * 2;
let dy = -3;

function update() {
if (isInFlating && balloon.scale < 0.5) {
balloon.setScale(balloon.scale + 0.01);
balloon.setPosition(balloon.x, balloon.y - 1.5);
} else if (balloon.scale >= 0.5 && !isFloating) {
isFloating = true;
}

if (isFloating) {

balloon.x += dx;
balloon.y += dy;
//Bounces off the walls
if (balloon.x <= 50 || balloon.x >= config.width - 50) {
dx *= -1;
}
//Stops the balloon from going off the top or bottom of the screen
if (balloon.y <= 50) {
dy = 1;
} else if (balloon.y >= config.height - 50) {
dy = -1;
}
}
}

function burstBalloon() {
this.sound.play('pop');
balloon.destroy(update());
}
