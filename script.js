// Select all the cells in the game board
const cells = document.querySelectorAll('.cell');
// Select the status text element to display game messages
const statusText = document.querySelector('.status');
// Select the restart button
const restartButton = document.getElementById('restart');
// Select the toggle mode button (Single Player / Two Player)
const toggleModeButton = document.getElementById('toggle-mode');
// Select the dark mode toggle button
const darkModeToggle = document.getElementById('dark-mode-toggle');

// Initialize game variables
let currentPlayer = 'X'; // The current player ('X' or 'O')
let gameState = Array(9).fill(null); // Array to track the state of the board
let isGameActive = true; // Boolean to track if the game is active
let isSinglePlayer = true; // Default to Single Player mode

// Define the winning conditions (rows, columns, diagonals)
const winningConditions = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal (top-left to bottom-right)
    [2, 4, 6]  // Diagonal (top-right to bottom-left)
];

// Handle a cell click event
function handleCellClick(event) {
    const cell = event.target; // Get the clicked cell
    const cellIndex = cell.getAttribute('data-index'); // Get the cell's index

    // Ignore clicks if the cell is already taken, the game is over, or it's the AI's turn
    if (gameState[cellIndex] || !isGameActive || (isSinglePlayer && currentPlayer === 'O')) {
        return;
    }

    // Make the move for the current player
    makeMove(cellIndex, currentPlayer);

    // Check if the current player has won
    if (checkWin()) {
        statusText.textContent = `Player ${currentPlayer} wins!`;
        isGameActive = false;
    } 
    // Check if the game is a draw
    else if (gameState.every(cell => cell)) {
        statusText.textContent = "It's a draw!";
        isGameActive = false;
    } 
    // Switch to the next player
    else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusText.textContent = `Player ${currentPlayer}'s turn`;

        // If in Single Player mode and it's the AI's turn, make the AI move
        if (isSinglePlayer && currentPlayer === 'O') {
            setTimeout(aiMove, 500); // Delay AI move for better UX
        }
    }
}

// Make a move for the given player at the specified index
function makeMove(index, player) {
    gameState[index] = player; // Update the game state
    const cell = document.querySelector(`.cell[data-index="${index}"]`); // Get the cell element
    cell.textContent = player; // Display the player's symbol ('X' or 'O')
    cell.classList.add('taken'); // Add a class to indicate the cell is taken
}

// AI logic to make a move
function aiMove() {
    if (!isGameActive) return;

    // AI tries to win or block the opponent
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        // Check if AI can win
        if (gameState[a] === 'O' && gameState[b] === 'O' && !gameState[c]) {
            makeMove(c, 'O');
            finalizeMove();
            return;
        }
        if (gameState[a] === 'O' && gameState[c] === 'O' && !gameState[b]) {
            makeMove(b, 'O');
            finalizeMove();
            return;
        }
        if (gameState[b] === 'O' && gameState[c] === 'O' && !gameState[a]) {
            makeMove(a, 'O');
            finalizeMove();
            return;
        }
    }

    // Check if AI needs to block the opponent
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (gameState[a] === 'X' && gameState[b] === 'X' && !gameState[c]) {
            makeMove(c, 'O');
            finalizeMove();
            return;
        }
        if (gameState[a] === 'X' && gameState[c] === 'X' && !gameState[b]) {
            makeMove(b, 'O');
            finalizeMove();
            return;
        }
        if (gameState[b] === 'X' && gameState[c] === 'X' && !gameState[a]) {
            makeMove(a, 'O');
            finalizeMove();
            return;
        }
    }

    // Otherwise, pick a random available cell
    const availableCells = gameState.map((val, index) => (val === null ? index : null)).filter(val => val !== null);
    const randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
    makeMove(randomIndex, 'O');
    finalizeMove();
}

// Finalize the move by checking for a win or draw
function finalizeMove() {
    if (checkWin()) {
        statusText.textContent = `Player O wins!`;
        isGameActive = false;
    } else if (gameState.every(cell => cell)) {
        statusText.textContent = "It's a draw!";
        isGameActive = false;
    } else {
        currentPlayer = 'X';
        statusText.textContent = `Player ${currentPlayer}'s turn`;
    }
}

// Check if the current player has won
function checkWin() {
    return winningConditions.some(condition => {
        return condition.every(index => gameState[index] === currentPlayer);
    });
}

// Restart the game
function restartGame() {
    gameState.fill(null); // Reset the game state
    isGameActive = true; // Reactivate the game
    currentPlayer = 'X'; // Reset to Player X
    statusText.textContent = `Player ${currentPlayer}'s turn`; // Update the status text

    // Clear the board
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('taken');
    });
}

// Toggle between Single Player and Two Player modes
function toggleMode() {
    isSinglePlayer = !isSinglePlayer; // Toggle the mode
    const modeText = isSinglePlayer ? "Single Player Mode" : "2 Player Mode";
    toggleModeButton.textContent = `Switch to ${isSinglePlayer ? "2 Player Mode" : "Single Player Mode"}`;
    restartGame(); // Restart the game
    statusText.textContent = `Game mode switched to ${modeText}`;
}

// Toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode'); // Add or remove the 'dark-mode' class
}

// Event listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick)); // Add click event to each cell
restartButton.addEventListener('click', restartGame); // Add click event to the restart button
toggleModeButton.addEventListener('click', toggleMode); // Add click event to the toggle mode button
darkModeToggle.addEventListener('click', toggleDarkMode); // Add click event to the dark mode button

// Initialize the status text
statusText.textContent = `Player ${currentPlayer}'s turn`;