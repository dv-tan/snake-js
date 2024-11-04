// game field
const canvas = document.getElementById('canvas');
const context = createContext(canvas);
const cellSize = 10;
const fieldSizePx = canvas.clientWidth;
const fieldSizeCells = canvas.clientWidth / cellSize;


// directions
const E = { x: 1, y: 0 };
const W = { x: -1, y: 0 };
const N = { x: 0, y: -1 };
const S = { x: 0, y: 1 };

// game state
var snake = [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: 2 },
    { x: 0, y: 3, head: true }
]

var userCanPressKeyOnCurrentTick = true;
var currentDirection = E;
var currentFoodCoords = generateFoodCoords(snake);

// functions
function createContext(canvas) {
    const context = canvas.getContext('2d');
    const dpi = window.devicePixelRatio;

    canvas.style.width = canvas.width + 'px';
    canvas.style.height = canvas.height + 'px';
    canvas.width = canvas.width * dpi;
    canvas.height = canvas.height * dpi;

    context.scale(dpi, dpi);

    return context;
}

function drawLine(x, y, x1, y1) {
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x1, y1);
    context.stroke();
    context.closePath()
}

function drawGrid(size, step) {
    for (let x = step; x < size; x += step) {
        drawLine(x, 0, x, size)
    }
    for (let y = step; y < size; y += step) {
        drawLine(0, y, size, y);
    }
}

function drawCell(x, y, color) {
    context.fillStyle = color;
    context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
}

function drawSnake(snakeBody) {
    for (elem of snakeBody) {
        const color = elem.head === true ? 'blue' : 'green';
        drawCell(elem.x, elem.y, color);
    }
}

function drawFood() {
    drawCell(currentFoodCoords.x, currentFoodCoords.y, 'red');
}

function head(snakeBody) {
    return snakeBody[snakeBody.length - 1];
}

function moveSnake(snakeBody) {
    // const size = snakeBody.length;
    const currentHead = head(snakeBody);
    const newHead = { x: currentHead.x + currentDirection.x, y: currentHead.y + currentDirection.y, head: true };
    if (newHead.x >= fieldSizeCells) {
        newHead.x = 0;
    }
    if (newHead.x < 0) {
        newHead.x = fieldSizeCells - 1;
    }
    if (newHead.y >= fieldSizeCells) {
        newHead.y = 0;
    }
    if (newHead.y < 0) {
        newHead.y = fieldSizeCells - 1;
    }
    currentHead.head = false;
    const newBody = snakeBody.slice(1);
    newBody.push(newHead);
    return newBody;
}

function isCollided(snakeBody) {
    const currentHead = head(snakeBody);
    const currentBody = snakeBody.slice(0, snakeBody.length - 1);
    for (const cell of currentBody) {
        if (currentHead.x === cell.x && currentHead.y === cell.y) {
            return true;
        }
    }
    return false;
}

function canEatFood(snakeHead, foodCoords) {
    if (snakeHead.x === foodCoords.x && snakeHead.y === foodCoords.y) {
        return true;
    } else {
        return false;
    }
}

function eatFood(snakeBody) {
    const lastCell = snakeBody[0];
    snakeBody.unshift(lastCell);
    return snakeBody;
}

function clear() {
    context.fillStyle = 'white';
    context.fillRect(0, 0, fieldSizePx, fieldSizePx);
}

function drawAll() {
    clear();
    drawGrid(300, 10);
    drawSnake(snake);
    drawFood();
}

function tick() {
    setTimeout(function handler() {
        userCanPressKeyOnCurrentTick = true;
        drawAll();
        snake = moveSnake(snake);
        if (canEatFood(snake[snake.length - 1], currentFoodCoords)) {
            eatFood(snake); 
            currentFoodCoords = generateFoodCoords(snake);
        }
        if (isCollided(snake)) {
            console.log('Game over');
            return;
        }
        window.requestAnimationFrame(tick);
    }, 1000/3);
}

function handleUserInput(event) {
    if (userCanPressKeyOnCurrentTick) {
        userCanPressKeyOnCurrentTick = false;
        const currentKey = event.key;
        console.log(currentKey);
        if (currentKey === 'ArrowUp' && currentDirection !== S) {
        currentDirection = N;
        } else if (currentKey === 'ArrowDown' && currentDirection !== N) {
            currentDirection = S;
        } else if (currentKey === 'ArrowRight' && currentDirection !== W) {
            currentDirection = E;
        } else if (currentKey === 'ArrowLeft' && currentDirection !== E) {
            currentDirection = W;
        }
    } 
}

function generateFoodCoords(snakeBody) {
    let foodX = Math.floor(Math.random() * fieldSizeCells);
    let foodY = Math.floor(Math.random() * fieldSizeCells);

    return {
        x: foodX,
        y: foodY
    };
}

drawAll();
window.requestAnimationFrame(tick);
document.addEventListener('keydown', handleUserInput);