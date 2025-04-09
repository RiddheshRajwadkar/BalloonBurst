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

let pumpButton, isInflating = false;

function preload() {
    for (let i = 1; i <= 10; i++) {
        if (i < 10) {
            this.load.image(`balloon${i}`, `assets/Symbol 10000${i}.png`);
        } else {
            this.load.image(`balloon${i}`, `assets/Symbol 1000${i}.png`);
        }
    }

    this.load.audio('pop', 'assets/Pop sound.mp3');
    this.load.image('pump', 'assets/Symbol 320003.png');
    this.load.image('background', 'assets/Symbol 3 copy.png');
    this.load.image('pumpButton', 'assets/Symbol 320001.png');
    this.load.image('pipe', 'assets/Symbol 320002.png');
}

function spawnBalloon(scene) {
    const nextBalloonKey = balloonKeys[balloonCount];
    const newBalloon = scene.add.image(1245, 455, nextBalloonKey).setScale(0.1);
    newBalloon.dx = (Math.random() - 0.5) * 4;
    newBalloon.dy = -3;
    newBalloon.isFloating = false;
    return newBalloon;
}

let balloonKeys = [];
let balloon = null;
let floatingBalloons = [];
let isFloating = false;
let currentBalloon = null;
let dx = 0;
let dy = -3;
let balloonCount = 0;
const maxBalloons = 26;

function create() {
    this.add.image(config.width / 2, config.height / 2, 'background').setDisplaySize(config.width, config.height);

    pumpButton = this.add.image(1500, 450, 'pumpButton').setScale(0.4)
        .setInteractive()
        .on('pointerdown', () => {
            isInflating = true;
            pumpButton.setScale(0.35);
        })
        .on('pointerup', () => {
            isInflating = false;
            pumpButton.setScale(0.4);
        });

    this.add.image(1500, 600, 'pump').setScale(0.6);
    this.add.image(1320, 570, 'pipe').setScale(0.6);

    // Prepare shuffled balloon keys
    for (let i = 1; i <= 10; i++) {
        for (let j = 0; j < 3; j++) {
            balloonKeys.push(`balloon${i}`);
        }
    }
    balloonKeys.push('balloon1'); // 10x3 + 1 = 31 keys
    balloonKeys = Phaser.Utils.Array.Shuffle(balloonKeys).slice(0, maxBalloons);

    currentBalloon = spawnBalloon(this);
}

function update() {
    if (!currentBalloon && balloonCount >= maxBalloons) return;

    // Inflate balloon
    if (currentBalloon && isInflating && currentBalloon.scale < 0.5) {
        currentBalloon.setScale(currentBalloon.scale + 0.01);
        currentBalloon.setY(currentBalloon.y - 1.5);
    }

    // When fully inflated, start floating and allow clicking to burst
    if (currentBalloon && currentBalloon.scale >= 0.5 && !currentBalloon.isFloating) {
        currentBalloon.isFloating = true;
        currentBalloon.setInteractive().on('pointerdown', burstBalloon, currentBalloon);
        floatingBalloons.push(currentBalloon);
        currentBalloon = null;

        balloonCount++;
        if (balloonCount < maxBalloons) {
            currentBalloon = spawnBalloon(this);
        }
    }

    // Move all floating balloons
    floatingBalloons.forEach(b => {
        b.x += b.dx;
        b.y += b.dy;

        // Bounce off walls
        if (b.x <= 50 || b.x >= config.width - 50) b.dx *= -1;
        if (b.y <= 50 || b.y >= config.height - 50) b.dy *= -1;
    });
}

function burstBalloon() {
    const balloon = this; // 'this' is the clicked balloon
    const scene = balloon.scene;

    scene.sound.play('pop');
    floatingBalloons = floatingBalloons.filter(b => b !== balloon);
    balloon.destroy();
}

function gameOver(scene) {
    const text = scene.add.text(config.width / 2, config.height / 2, 'Game Over!', {
        fontSize: '64px',
        fill: '#ffffff'
    });
    text.setOrigin(0.5);
}
