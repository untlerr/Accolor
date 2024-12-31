let circles = [];
let score = 0;
let lives = 4;
let targetColor;
let gameOver = false;
let spawnInterval = 60;
let gameStarted = false;
let playAgainButton;

let correctSound;
let incorrectSound;

function preload() {
    correctSound = loadSound('SoundEffects/burp.wav');
    incorrectSound = loadSound('SoundEffects/pop.wav');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    targetColor = color(random(255), random(255), random(255));
    createStartMenu();
}

function draw() {
    if (!gameStarted) {
        drawStartMenu();
    } else if (gameOver) {
        drawGameOverScreen();
    } else {
        drawGameScreen();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function drawStartMenu() {
    background(0);
    textAlign(CENTER);
    textSize(50);
    fill(255);
    text("Accolor", width / 2, height / 2 - 100);
    textSize(30);
    text("Click 'Start Game' to play.", width / 2, height / 2);
}

function createStartMenu() {
    let startButton = createButton('Start Game');
    startButton.position(width / 2 - 75, height / 2 + 40);
    startButton.size(150, 50);
    startButton.style('background-color', '#007BFF');
    startButton.style('color', '#FFFFFF');
    startButton.style('font-size', '20px');
    startButton.style('border', 'none');
    startButton.style('border-radius', '10px');
    startButton.style('cursor', 'pointer');
    startButton.style('box-shadow', '0 5px 10px rgba(0, 0, 0, 0.2)');

    startButton.mouseOver(() => {
        startButton.style('background-color', '#0056b3');
    });

    startButton.mouseOut(() => {
        startButton.style('background-color', '#007BFF');
    });

    startButton.mousePressed(() => {
        startGame();
        startButton.remove();
    });
}

function startGame() {
    score = 0;
    lives = 4;
    console.log("Starting game with lives:", lives);
    circles = [];
    targetColor = color(random(255), random(255), random(255));
    gameOver = false;
    spawnInterval = 60;
    gameStarted = true;
    loop();
}

function drawGameScreen() {
    background(0);
    fill(targetColor);
    noStroke();
    rect(width / 2 - 50, 10, 100, 20);
    fill(255);
    textAlign(CENTER);
    textSize(20);
    text("Target Color", width / 2, 50);

    for (let i = circles.length - 1; i >= 0; i--) {
        let circle = circles[i];
        if (circle.activeView()) {
            circle.display();
        } else {
            circles.splice(i, 1);
        }
    }

    fill(255);
    textAlign(LEFT);
    textSize(20);
    text(`Score: ${score}`, 10, 30);
    text(`Lives: ${lives}`, 10, 60);

    if (score > 0 && score % 100 === 0) {
        changeTargetColor();
    }

    if (lives <= 0) {
        gameOver = true;
    }

    if (frameCount % spawnInterval === 0) {
        spawnCircle();
    }

    spawnInterval = max(10, 60 - Math.floor(score / 10));
}

function mousePressed() {
    if (gameOver) return;

    let clicked = false;

    for (let i = circles.length - 1; i >= 0; i--) {
        let circle = circles[i];
        let d = dist(mouseX, mouseY, circle.x, circle.y);

        if (d < circle.size / 2) {
            if (circle.color.levels.toString() === targetColor.levels.toString()) {
                score += 10;
                correctSound.play();
            } else {
                lives -= 1;
                console.log("Incorrect click! Lives remaining:", lives);
                incorrectSound.play();
            }
            circles.splice(i, 1);
            clicked = true;
            break;
        }
    }

    if (!clicked) {
        lives -= 1;
        console.log("Nothing clicked! Lives remaining:", lives);
        incorrectSound.play();
    }
}

function flashScreen(r, g, b) {
    fill(r, g, b);
    rect(0, 0, width, height);
    setTimeout(() => {
        fill(0);
        rect(0, 0, width, height);
    }, 100);
}

function spawnCircle() {
    let newCircle = new scoreCircle();
    circles.push(newCircle);
}

class scoreCircle {
    constructor() {
        this.size = random(30, 100);
        this.color = color(random(255), random(255, random(255)));
        let topMargin = 80;
        this.x = random(this.size / 2, width - this.size / 2);
        this.y = random(topMargin + this.size / 2, height - this.size / 2);
        this.appTime = random(2000, 4000);
        this.startTime = millis();
        if (random(0, 100) < 30) {
            this.color = targetColor;
        }
    }

    display() {
        fill(this.color);
        noStroke();
        ellipse(this.x, this.y, this.size, this.size);
    }

    activeView() {
        return millis() - this.startTime < this.appTime;
    }
}

function drawGameOverScreen() {
    console.log("Game Over! Final lives count:", lives);
    background(0);
    textAlign(CENTER);
    textSize(50);
    fill(255, 0, 0);
    text("Game Over", width / 2, height / 2 - 100);
    createPlayAgainButton();
}

function createPlayAgainButton() {
    if (!playAgainButton) {
        playAgainButton = createButton('Play Again');
        playAgainButton.position(width / 2 - 75, height / 2);
        playAgainButton.size(150, 50);
        playAgainButton.style('background-color', '#007BFF');
        playAgainButton.style('color', '#FFFFFF');
        playAgainButton.style('font-size', '20px');
        playAgainButton.style('border', 'none');
        playAgainButton.style('border-radius', '10px');
        playAgainButton.style('cursor', 'pointer');
        playAgainButton.style('box-shadow', '0 5px 10px rgba(0, 0, 0, 0.2)');
        playAgainButton.mouseOver(() => {
            playAgainButton.style('background-color', '#0056b3');
        });
        playAgainButton.mouseOut(() => {
            playAgainButton.style('background-color', '#007BFF');
        });
        playAgainButton.mousePressed(() => {
            startGame();
            playAgainButton.remove();
            playAgainButton = null;
        });
    }
}

function changeTargetColor() {
    targetColor = color(random(255), random(255, random(255)));
}
