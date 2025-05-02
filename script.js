// filepath: c:\Users\rohan\Documents\GitHub\PRODIGY_WD_03\script.js

const cells = document.querySelectorAll('.cell');
const statusText = document.querySelector('.status');
const restartButton = document.getElementById('restart');
const toggleModeButton = document.getElementById('toggle-mode');
const darkModeToggle = document.getElementById('dark-mode-toggle');

let currentPlayer = 'X';
let gameState = Array(9).fill(null);
let isGameActive = true;
let isSinglePlayer = true; // Default to Single Player mode

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellClick(event) {
    const cell = event.target;
    const cellIndex = cell.getAttribute('data-index');

    if (gameState[cellIndex] || !isGameActive || (isSinglePlayer && currentPlayer === 'O')) {
        return;
    }

    makeMove(cellIndex, currentPlayer);

    if (checkWin()) {
        statusText.textContent = `Player ${currentPlayer} wins!`;
        isGameActive = false;
    } else if (gameState.every(cell => cell)) {
        statusText.textContent = "It's a draw!";
        isGameActive = false;
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusText.textContent = `Player ${currentPlayer}'s turn`;

        if (isSinglePlayer && currentPlayer === 'O') {
            setTimeout(aiMove, 500); // Delay AI move for better UX
        }
    }
}

function makeMove(index, player) {
    gameState[index] = player;
    const cell = document.querySelector(`.cell[data-index="${index}"]`);
    cell.textContent = player;
    cell.classList.add('taken');
}

function aiMove() {
    if (!isGameActive) return;

    // AI tries to win or block
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
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

    // AI blocks opponent
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

function checkWin() {
    return winningConditions.some(condition => {
        return condition.every(index => gameState[index] === currentPlayer);
    });
}

function restartGame() {
    gameState.fill(null);
    isGameActive = true;
    currentPlayer = 'X';
    statusText.textContent = `Player ${currentPlayer}'s turn`;

    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('taken');
    });
}

function toggleMode() {
    isSinglePlayer = !isSinglePlayer;
    const modeText = isSinglePlayer ? "Single Player Mode" : "2 Player Mode";
    toggleModeButton.textContent = `Switch to ${isSinglePlayer ? "2 Player Mode" : "Single Player Mode"}`;
    restartGame();
    statusText.textContent = `Game mode switched to ${modeText}`;
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

// Event listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', restartGame);
toggleModeButton.addEventListener('click', toggleMode);
darkModeToggle.addEventListener('click', toggleDarkMode);

// Initialize status text
statusText.textContent = `Player ${currentPlayer}'s turn`;