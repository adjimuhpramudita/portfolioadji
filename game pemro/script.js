const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set ukuran canvas
canvas.width = 400;
canvas.height = 400;

// Ukuran grid
const grid = 20;
const snake = {
    x: 160,
    y: 160,
    dx: grid,
    dy: 0,
    cells: [],
    maxCells: 4
};

const food = {
    x: 320,
    y: 320
};

let score = 0;
let gameOver = false;
let count = 0;

// Fungsi untuk menghasilkan angka random
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// Fungsi untuk memainkan suara
function playSound(audioId) {
    const sound = document.getElementById(audioId);
    sound.currentTime = 0;
    sound.play();
}

// Fungsi untuk reset game
function resetGame() {
    snake.x = 160;
    snake.y = 160;
    snake.cells = [];
    snake.maxCells = 4;
    snake.dx = grid;
    snake.dy = 0;
    score = 0;
    gameOver = false;
    document.getElementById('score').textContent = score;
    food.x = getRandomInt(0, 20) * grid;
    food.y = getRandomInt(0, 20) * grid;
}

// Game loop
function loop() {
    requestAnimationFrame(loop);

    // Slow down game loop to 15 FPS
    if (++count < 4) {
        return;
    }
    count = 0;

    if (gameOver) {
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move snake
    snake.x += snake.dx;
    snake.y += snake.dy;

    // Wrap snake position
    if (snake.x < 0) {
        snake.x = canvas.width - grid;
    } else if (snake.x >= canvas.width) {
        snake.x = 0;
    }
    if (snake.y < 0) {
        snake.y = canvas.height - grid;
    } else if (snake.y >= canvas.height) {
        snake.y = 0;
    }

    // Keep track of where snake has been
    snake.cells.unshift({ x: snake.x, y: snake.y });

    // Remove cells as we move away from them
    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }

    // Draw food
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(food.x, food.y, grid-1, grid-1);

    // Draw snake
    ctx.fillStyle = '#2ecc71';
    snake.cells.forEach((cell, index) => {
        ctx.fillRect(cell.x, cell.y, grid-1, grid-1);

        // Snake ate food
        if (cell.x === food.x && cell.y === food.y) {
            snake.maxCells++;
            score += 10;
            playSound('eatSound');
            document.getElementById('score').textContent = score;
            
            // Make sure food doesn't appear on snake
            let newFood;
            do {
                newFood = {
                    x: getRandomInt(0, 20) * grid,
                    y: getRandomInt(0, 20) * grid
                };
            } while (snake.cells.some(segment => 
                segment.x === newFood.x && segment.y === newFood.y));
            
            food.x = newFood.x;
            food.y = newFood.y;
        }

        // Check collision with all cells after this one
        for (let i = index + 1; i < snake.cells.length; i++) {
            if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                playSound('gameOverSound');
                gameOver = true;
                
                // Tampilkan pesan game over
                ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                ctx.fillStyle = '#ffffff';
                ctx.font = '20px "Press Start 2P"';
                ctx.textAlign = 'center';
                ctx.fillText('Game Over!', canvas.width/2, canvas.height/2 - 30);
                ctx.fillText(`Score: ${score}`, canvas.width/2, canvas.height/2 + 10);
                ctx.font = '12px "Press Start 2P"';
                ctx.fillText('Press Space to Restart', canvas.width/2, canvas.height/2 + 50);
                
                return;
            }
        }
    });
}

// Keyboard controls
document.addEventListener('keydown', function(e) {
    // Prevent snake from reversing
    if (e.which === 37 && snake.dx === 0) { // Left
        snake.dx = -grid;
        snake.dy = 0;
    } else if (e.which === 38 && snake.dy === 0) { // Up
        snake.dx = 0;
        snake.dy = -grid;
    } else if (e.which === 39 && snake.dx === 0) { // Right
        snake.dx = grid;
        snake.dy = 0;
    } else if (e.which === 40 && snake.dy === 0) { // Down
        snake.dx = 0;
        snake.dy = grid;
    } else if (e.code === 'Space' && gameOver) { // Restart game
        resetGame();
    }
});

// Start the game
requestAnimationFrame(loop);
