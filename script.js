// Constants
const CANVAS_BORDER_COLOUR = '#FFFF00';
const CANVAS_BACKGROUND_COLOUR = 'black';
const SNAKE_COLOUR = '#00FF00';
const SNAKE_BORDER_COLOUR = 'darkgreen';
const FOOD_COLOUR ='red';
const FOOD_BORDER_COLOUR = 'darkred'

let snake = [
    {x: 150, y: 150},
    {x: 140, y: 150},
    {x: 130, y: 150},
    {x: 120, y: 150},
    {x: 110, y: 150}
]

// The users score
let score = 0;
// When set to true the snake is changing direction
let changingDirection = false;
// Food x-coordinate
let foodX;
// Food y-coordinate
let foodY;
//Horizontal velocity
let dx = 10;
// Vertical velocity
let dy = 0;

// Adjust speed as needed (increase for slower speed and decrease for faster speed)
const GAME_SPEED = 70;

// Get the canvas element
const gameCanvas = document.getElementById("gameCanvas");

// Return a two dimentional drawing context
const ctx = gameCanvas.getContext("2d");

// Select the color to fill the canvas
ctx.fillStyle = CANVAS_BACKGROUND_COLOUR;
// Select the color for the border of the canvas
ctx.strokeStyle = CANVAS_BORDER_COLOUR;

// Draw a "filled" rectangle to cover the entire canvas
ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
// Draw "border" around entire canvas
ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);


// Wrap everything inside window.onload to ensure the script runs after the page loads
window.onload = function () { 
// Create the first food location
createFood();

// Start game
main();
};

// Call changeDirection whenever a key is pressed
document.addEventListener("keydown", changeDirection);

// Main function of the game
// Called repeatedly to advance the game
function main() {
    if (didGameEnd()) {
        gameRunning = false;
        return;
    }

    if (gamePaused || !gameRunning) return; // Ensure pause stops execution

    setTimeout(function onTick() {
        changingDirection = false
        clearCanvas();
        drawFood();
        advanceSnake();
        drawSnake();

        // Call main again
        main();
    }, GAME_SPEED)
}

 // Change the background colour of the canvas to CANVAS_BACKGROUND_COLOUR and
// draw a border around it
 function clearCanvas() {
    //  Select the colour to fill the drawing
    ctx.fillStyle = CANVAS_BACKGROUND_COLOUR;
    //  Select the colour for the border of the canvas
    ctx.strokeStyle = CANVAS_BORDER_COLOUR;

    // Draw a "filled" rectangle to cover the entire canvas
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    // Draw a "border" around the entire canvas
    ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
  }

   // Draw food on the canvas
   function drawFood() {
    ctx.fillStyle = FOOD_COLOUR;
    ctx.strokeStyle = FOOD_BORDER_COLOUR;
    ctx.fillRect(foodX, foodY, 10, 10);
    ctx.strokeRect(foodX, foodY, 10, 10);
  }

// Advances the snake by changing the x-coordinates of its parts
// according to the horizontal velocity and the y-coordinates of its parts
// according to the vertical veolocity
function advanceSnake() {
    // Create new snakes head
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    // Add new head to beggining of snak body
    snake.unshift(head);

    const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
    if (didEatFood) {
        // Increase score
        score += 10;
        // Display score on screen
        document.getElementById('score').innerHTML = score;

        // Generate new food location
        createFood();
    } else {
        // Remove the last part of the snake body
    snake.pop();
    }
}

  // Returns true if the head of the snake touched another part of the game or any of the walls
  function didGameEnd() {
    for (let i = 4; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }

    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > gameCanvas.width - 10;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > gameCanvas.height - 10;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
  }


// Generates a random number that is a multiple of 10 given a minimum and a maximum number
// @param { number } min - The minimum number the random number can be
// @param { number } max - The maximum number the random can be
function randomTen(min, max) {
    return Math.round((Math.random() * (max-min) + min) / 10) * 10;
}

// Craetes random set of coordinates for the snake food
function createFood() {
    // Generate random number the food x-coordinate
    foodX = randomTen(0, gameCanvas.width - 10);
    // Generate a random number for the food y-coordinate
    foodY = randomTen(0, gameCanvas.height - 10);

// If the new food location is where the snake currently is, generate a new food
snake.forEach(function isFoodOnSnake(part) {
    const foodIsOnSnake = part.x == foodX && part.y == foodY; 
    if (foodIsOnSnake) createFood();
});
}

// Draws the snake on the canvas
function drawSnake() {
    // Loop through the snake parts drawing each part on the canvas
    snake.forEach(drawSnakePart)
}

// Draws part of the snake on the canvas
// @param { object } snakePart - The coordinates where the part should be drawn
function drawSnakePart(snakePart) {
    // Set the colour of the snake part
    ctx.fillStyle = SNAKE_COLOUR;
    ctx.strokeStyle = SNAKE_BORDER_COLOUR;

    // Draw a "filled" rectangle to represent the snake part at the coordinates
    // The part is located
    ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
    
    // Draw a border around the snake part
    ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

// Changes the vertical and horizontal velocity of the snake according to thekey that was pressed.
// The direction cannot be switched to the opposite direction, to prevent the snake from reversing
// For example if the the direction is 'right' it cannot become 'left'
// @param { object } event - The keydown event
function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    // Prevent the snake from reversing
    // Example scenario:
    // Snake is moving to the right. User presses down and immediately left
    // and the snake immediately changes direction without taking a step down first
    if (changingDirection) return;

    changingDirection = true;

    const keyPressed = event.keyCode;

    const goingUp = dy === -10;
    const goingDown = dy === 10
    const goingRight = dx === 10;
    const goingLeft = dx === -10

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -10;
        dy = 0;
    }

    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -10;
    }

    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 10;
        dy = 0;
    }

    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 10;
    }
}

// Listen for pause and reset key presses
document.addEventListener("keydown", function(event) {
    if (event.key.toLowerCase() === "p") {
        togglePause();
    }
    if (event.key.toLowerCase() === "r") {
        resetGame();
    }
});

// Define pause function
let gamePaused = false;
let gameRunning = true;

function togglePause() {
    gamePaused = !gamePaused;
    if (!gamePaused && gameRunning) {
        main(); // Resume game loop if unpaused
    }
}

// Define reset function
function resetGame() {
    gameRunning = true;
    gamePaused = false;

    // Reset snake and game variables
    snake = [
        {x: 150, y: 150},
        {x: 140, y: 150},
        {x: 130, y: 150},
        {x: 120, y: 150},
        {x: 110, y: 150}
    ];

    dx = 10;
    dy = 0;
    score = 0;
    document.getElementById('score').innerHTML = score;

    createFood();

    clearCanvas(); // Clear canvas before restarting
    drawFood();
    drawSnake();

    main(); // Restart the game
}