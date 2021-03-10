const gameBoard = document.querySelector('.snake');
const start = document.querySelector('.start-overlay');
let SNAKE_SPEED = 5;
let lastRenderTime = 0;
let count = 0;

function startGame() {
    start.addEventListener('click', () => {
        start.classList.add('hide');
        requestAnimationFrame(move);
    })
}

// contains click event which starts the animation
startGame();

function gameOver() {
    cancelAnimationFrame(RequestID);
    let gameOverOverlay = document.createElement('div');
    gameOverOverlay.innerHTML = `<h1>Game Over</h1>
    <div class="button" onClick=location=URL>Retry</div>`;
    gameOverOverlay.classList.add('start-overlay');
    gameBoard.appendChild(gameOverOverlay);
}

function countIncrement() {
    count++
    return count;
}

function randomApplePosition() {
    return {
        x: Math.floor(Math.random() * 21) + 1,
        y: Math.floor(Math.random() * 21) + 1
    }
}

// snake array with nested object for default position
let snake = [
    {
        x: 11,
        y: 11
    }
]

// object for keyboard input
let inputDirection = {
    x: 0,
    y: 0
}

// heart of the app controles the animation 
function move(timestamp) {
    RequestID = requestAnimationFrame(move);
    const secondSinceLastRender = (timestamp - lastRenderTime) / 1000;
    if (secondSinceLastRender < 1 / SNAKE_SPEED) return
    lastRenderTime = timestamp

    updatesnake();
    drawsnake(gameBoard);
    drawApple(gameBoard);
    showCount(gameBoard);
    nextLevel();
    appleCollect();
    wallCollision();
    snakeCollision();
}

// makes sure previous position of snake gets cleared
function updatesnake() {
    for (let i = snake.length - 2; i >= 0; i--) {
        snake[i + 1] = { ...snake[i] };
    }
    snake[0].x += inputDirection.x;
    snake[0].y += inputDirection.y;
}

// draws the snake to the grid
function drawsnake(gameBoard) {
    gameBoard.innerHTML = '';
    snake.forEach(segment => {
        const snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = segment.y;
        snakeElement.style.gridColumnStart = segment.x;
        snakeElement.classList.add('snakebox');
        gameBoard.appendChild(snakeElement);
    })
}

let apple = getRandomApple();
// draws the apple to the grid
function drawApple(gameBoard) {
    const appleElement = document.createElement('div');
    appleElement.style.gridRowStart = apple.y;
    appleElement.style.gridColumnStart = apple.x;
    appleElement.classList.add('foodbox');
    gameBoard.appendChild(appleElement);
}

// increases the speed of animation at certain milestones
function nextLevel() {
    if (snake.length === 10) {
        SNAKE_SPEED = 8;
    }
    if (snake.length === 20) {
        SNAKE_SPEED = 10;
    }
    if (snake.length === 30) {
        SNAKE_SPEED = 12;
    }
}

function onSnake(position) {
    return snake.some(elem => equalPosition(elem, position))
}

function equalPosition(pos1, pos2) {
    return pos1.x === pos2.x && pos1.y === pos2.y
}

// pushes object to snake array increasing the length and reloads apple and increases count
function appleCollect() {
    if (onSnake(apple)) {
        snake.push(1);
        countIncrement();
        apple = getRandomApple();
    }
}

function getRandomApple() {
    let newApplePosition;
    while (newApplePosition == null || onSnake(newApplePosition)) {
        newApplePosition = randomApplePosition();
    }
    return newApplePosition
}

function showCount(elem) {
    let displayCount = document.createElement('h2');
    displayCount.innerHTML = `Score: ${count}`;
    displayCount.classList.add('count');
    elem.appendChild(displayCount);
    return displayCount;
}

function snakeCollision() {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            gameOver();
        } else if (snake[0].x && snake[0].y) {
            console.log('still working');
        }
    }
}

function wallCollision() {
    snake.map((elem) => {
        if (elem.x > 22 || elem.x < 0 || elem.y > 22 || elem.y < 0) {
            gameOver();
        }
    })
}

// keyborad control
window.addEventListener("keydown", e => {
    switch (e.key) {
        case "ArrowUp":
            if (inputDirection.y !== 1) {
                inputDirection = { x: 0, y: -1 }
                break
            }
        case "ArrowDown":
            if (inputDirection.y !== -1) {
                inputDirection = { x: 0, y: 1 }
                break
            }
        case "ArrowRight":
            if (inputDirection.x !== -1) {
                inputDirection = { x: 1, y: 0 }
                break
            }
        case "ArrowLeft":
            if (inputDirection.x !== 1) {
                inputDirection = { x: -1, y: 0 }
                break
            }
    }
})