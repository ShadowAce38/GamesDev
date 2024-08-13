document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const message = document.getElementById('message');
    const replayButton = document.getElementById('replayButton');
    const scoreXElement = document.getElementById('scoreX');
    const scoreOElement = document.getElementById('scoreO');
    const scoreDrawElement = document.getElementById('scoreDraw');
    const playerForm = document.getElementById('playerForm');
    const playerXNameInput = document.getElementById('playerXName');
    const startButton = document.getElementById('startButton');
    const scoreboard = document.getElementById('scoreboard');
    const playerXLabel = document.getElementById('playerXLabel');
    const timerElement = document.getElementById('timer');

    let cells = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let gameOver = false;
    let scoreX = 0;
    let scoreO = 0;
    let scoreDraw = 0;
    let playerXName = 'Joueur X';
    let timerInterval;
    let startTime;

    function renderBoard() {
        board.innerHTML = '';
        cells.forEach((cell, index) => {
            const cellDiv = document.createElement('div');
            cellDiv.classList.add('cell');
            cellDiv.textContent = cell;
            if (cell === 'X') {
                cellDiv.classList.add('X');
            } else if (cell === 'O') {
                cellDiv.classList.add('O');
            }
            cellDiv.addEventListener('click', () => makeMove(index));
            board.appendChild(cellDiv);
        });
    }

    function checkWinner() {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]              // Diagonals
        ];

        for (const combination of winningCombinations) {
            const [a, b, c] = combination;
            if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
                return cells[a];
            }
        }

        if (cells.every(cell => cell !== '')) {
            return 'Draw';
        }

        return null;
    }

    function makeMove(index) {
        if (cells[index] !== '' || gameOver) return;

        cells[index] = currentPlayer;
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        renderBoard();

        const winner = checkWinner();
        if (winner) {
            gameOver = true;
            clearInterval(timerInterval); // Arrêter le chronomètre
            message.textContent = winner === 'Draw' ? "Match nul !" : `${winner === 'X' ? playerXName : 'Ordinateur'} a gagné !`;
            updateScore(winner);
            board.classList.add('disabled');
            replayButton.style.display = 'block';
        } else {
            if (currentPlayer === 'O') {
                setTimeout(computerMove, 500); 
            }
        }
    }

    function computerMove() {
        let emptyCells = cells.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
        let randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        makeMove(randomIndex);
    }

    function updateScore(winner) {
        if (winner === 'X') {
            scoreX++;
            scoreXElement.textContent = scoreX;
        } else if (winner === 'O') {
            scoreO++;
            scoreOElement.textContent = scoreO;
        } else if (winner === 'Draw') {
            scoreDraw++;
            scoreDrawElement.textContent = scoreDraw;
        }
    }

    function resetGame() {
        cells = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        gameOver = false;
        message.textContent = '';
        replayButton.style.display = 'none';
        board.classList.remove('disabled');
        renderBoard();
        startTime = Date.now(); // Réinitialiser le temps de début
        timerInterval = setInterval(updateTimer, 1000); // Démarrer le chronomètre
    }

    function updateTimer() {
        if (gameOver) {
            clearInterval(timerInterval); // Arrêter le chronomètre si le jeu est terminé
            return;
        }

        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        const minutes = String(Math.floor(elapsedTime / 60)).padStart(2, '0');
        const seconds = String(elapsedTime % 60).padStart(2, '0');
        timerElement.textContent = `${minutes}:${seconds}`;
    }

    startButton.addEventListener('click', () => {
        playerXName = playerXNameInput.value || 'Joueur X';
        playerXLabel.textContent = playerXName;
        playerForm.style.display = 'none'; 
        scoreboard.style.display = 'block'; 
        board.style.display = 'grid'; 
        renderBoard();
        startTime = Date.now(); // Initialiser le temps de début
        timerInterval = setInterval(updateTimer, 1000); // Démarrer le chronomètre
    });

    replayButton.addEventListener('click', resetGame);
});
