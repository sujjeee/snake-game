// Select the canvas element and other elements from the HTML document
const canvas = document.querySelector('canvas');
const instructions = document.getElementById('instructions');

// Get the canvas context and set its properties
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// canvas.requestFullscreen();
// ctx.fillStyle = 'green';
// ctx.strokeStyle = 'white';
// ctx.lineWidth = 2;

// Define the initial state of the game
const cellSize = 20;
const width = Math.floor(canvas.width / cellSize);
const height = Math.floor(canvas.height / cellSize);
let gameStarted = false;
let snake = [{ x: Math.floor(Math.random() * width), y: Math.floor(Math.random() * height) }];
let direction = 'right';
let food = { x: Math.floor(Math.random() * width), y: Math.floor(Math.random() * height) };
let interval;
let speedTime = 100;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;

// Set up the game loop function
function gameLoop() {

    // Update the snake's position based on the direction
    let head = { x: snake[0].x, y: snake[0].y };
    if (direction === 'right') {
        head.x++;
    } else if (direction === 'left') {
        head.x--;
    } else if (direction === 'up') {
        head.y--;
    } else if (direction === 'down') {
        head.y++;
    }
    snake.unshift(head);

    // Check for collisions with the walls or the snake's body
    if (head.x < 0 || head.x >= width || head.y < 0 || head.y >= height || snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
        // localStorage.setItem("high-score", highScore)
        // Game over
        clearInterval(interval);
        location.reload();
        alert('Game over! Do you want to play again?');
    }


    // Check for collisions with the food
    if (head.x === food.x && head.y === food.y) {
        // Eat the food and grow
        snake.push({});
        food = { x: Math.floor(Math.random() * width), y: Math.floor(Math.random() * height) };
        score++;
        speedTime -= 10;
        clearInterval(interval);
        interval = setInterval(gameLoop, speedTime);
        document.getElementById('your-score').innerHTML = `your Score: ${score}`
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
            document.getElementById('high-score').innerHTML = `High Score: ${highScore}`;
        }
    } else {
        // Remove the tail segment to keep the same length
        snake.pop();
    }

    // Redraw the board
    ctx.clearRect(0, 0, width * cellSize, height * cellSize);

    // design snake
    ctx.fillStyle = 'green';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * cellSize, segment.y * cellSize, cellSize, cellSize);
        // ctx.strokeRect(segment.x * 10, segment.y * 10, 10, 10);
    });

    // design food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * cellSize, food.y * cellSize, cellSize, cellSize);
}

// Set up the keyboard event listener to handle arrow keys
document.addEventListener('keydown', event => {
    if (event.code === 'ArrowRight' && direction !== 'left') {
        direction = 'right';
    } else if (event.code === 'ArrowLeft' && direction !== 'right') {
        direction = 'left';
    } else if (event.code === 'ArrowUp' && direction !== 'down') {
        direction = 'up';
    } else if (event.code === 'ArrowDown' && direction !== 'up') {
        direction = 'down';
    }
});

// Start the game loop
document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !gameStarted) {
        gameStarted = true;
        document.getElementById('high-score').innerHTML = `High Score: ${highScore}`
        instructions.style.display = 'none'; // Hide the instructions
        interval = setInterval(gameLoop, speedTime);
    }
})

