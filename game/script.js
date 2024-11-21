const canvas = document.getElementById('maze');
        const ctx = canvas.getContext('2d');

        const tileSize = 10; // Size of each maze tile
        const rows = 40;
        const cols = 40;

        let maze = []; // Dynamic maze array

        // Player and goal positions
        const player = { x: 1, y: 1 }; // Start position
        const goal = { x: 37, y: 37 }; // Goal position

        // Generate the maze using Prim's algorithm
        function generateMaze() {
            // Initialize maze with walls
            maze = Array.from({ length: rows }, () => Array(cols).fill(1));

            // Random starting cell
            let startX = 1;
            let startY = 1;
            maze[startY][startX] = 0;

            let walls = [[startY, startX]];

            const directions = [
                [0, 2], [0, -2], [2, 0], [-2, 0]
            ];

            while (walls.length > 0) {
                // Choose a random wall
                const randomIndex = Math.floor(Math.random() * walls.length);
                const [currentY, currentX] = walls.splice(randomIndex, 1)[0];

                for (const [dy, dx] of directions) {
                    const ny = currentY + dy;
                    const nx = currentX + dx;

                    if (ny > 0 && ny < rows - 1 && nx > 0 && nx < cols - 1 && maze[ny][nx] === 1) {
                        // Check the neighboring cell in the opposite direction
                        const wallBetweenY = currentY + dy / 2;
                        const wallBetweenX = currentX + dx / 2;

                        // Ensure the cell is surrounded by walls
                        const neighbors = directions.map(([dy, dx]) => maze[ny + dy]?.[nx + dx]).filter(Boolean);
                        if (neighbors.every(cell => cell === 1)) {
                            maze[ny][nx] = 0;
                            maze[wallBetweenY][wallBetweenX] = 0;
                            walls.push([ny, nx]);
                        }
                    }
                }
            }

            // Ensure start and goal are open
            maze[startY][startX] = 0;
            maze[goal.y][goal.x] = 0;
        }

        // Draw the maze
        function drawMaze() {
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    if (maze[row][col] === 1) {
                        ctx.fillStyle = 'black'; // Wall color
                    } else {
                        ctx.fillStyle = 'white'; // Path color
                    }
                    ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
                }
            }

            // Draw goal
            ctx.fillStyle = 'green';
            ctx.fillRect(goal.x * tileSize, goal.y * tileSize, tileSize, tileSize);
        }

        // Draw the player
        function drawPlayer() {
            ctx.fillStyle = 'blue';
            ctx.fillRect(player.x * tileSize, player.y * tileSize, tileSize, tileSize);
        }

        // Move the player
        function movePlayer(dx, dy) {
            const newX = player.x + dx;
            const newY = player.y + dy;

            // Check for wall collisions
            if (maze[newY][newX] === 0) {
                player.x = newX;
                player.y = newY;
            }

            // Check for goal
            if (player.x === goal.x && player.y === goal.y) {
                alert('You reached the goal!');
                resetGame();
            }

            drawGame();
        }

        // Reset game
        function resetGame() {
            player.x = 1;
            player.y = 1;
            generateMaze();
            drawGame();
        }

        // Draw the game
        function drawGame() {
            drawMaze();
            drawPlayer();
        }

        // Initialize game
        generateMaze();
        drawGame();
