document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const overlay = document.getElementById('overlay');
    const playerNameInput = document.getElementById('player-name');
    const submitScoreButton = document.getElementById('submit-score-button');
    const restartButton = document.getElementById('restart-button');
    const scoreList = document.getElementById('score-list');
    const size = 4;
    let board = [];
    let score = 0;
    let scores = JSON.parse(localStorage.getItem('scores')) || {};

    function createBoard() {
        gameBoard.innerHTML = '';
        board = [];
        for (let i = 0; i < size * size; i++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            gameBoard.appendChild(tile);
            board.push(0);
        }
        addNewTile();
        addNewTile();
        updateBoard();
    }

    function updateBoard() {
        const tiles = document.querySelectorAll('.tile');
        for (let i = 0; i < tiles.length; i++) {
            tiles[i].innerText = board[i] === 0 ? '' : board[i];
            tiles[i].style.backgroundColor = getBackgroundColor(board[i]);
        }
        if (isGameOver()) {
            overlay.style.display = 'flex';
        }
    }

    function getBackgroundColor(value) {
        const colors = {
            0: '#cdc1b4',
            2: '#eee4da',
            4: '#ede0c8',
            8: '#f2b179',
            16: '#f59563',
            32: '#f67c5f',
            64: '#f65e3b',
            128: '#edcf72',
            256: '#edcc61',
            512: '#edc850',
            1024: '#edc53f',
            2048: '#edc22e',
        };
        return colors[value] || '#3c3a32';
    }

    function addNewTile() {
        let emptyTiles = [];
        for (let i = 0; i < board.length; i++) {
            if (board[i] === 0) {
                emptyTiles.push(i);
            }
        }
        if (emptyTiles.length > 0) {
            const randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
            board[randomTile] = Math.random() > 0.1 ? 2 : 4;
        }
    }

    function move(direction) {
        let moved = false;
        if (direction === 'ArrowUp' || direction === 'ArrowDown') {
            for (let col = 0; col < size; col++) {
                let column = [];
                for (let row = 0; row < size; row++) {
                    column.push(board[row * size + col]);
                }
                let newColumn = slideAndMerge(column, direction === 'ArrowDown');
                for (let row = 0; row < size; row++) {
                    if (board[row * size + col] !== newColumn[row]) {
                        moved = true;
                    }
                    board[row * size + col] = newColumn[row];
                }
            }
        } else if (direction === 'ArrowLeft' || direction === 'ArrowRight') {
            for (let row = 0; row < size; row++) {
                let newRow = slideAndMerge(board.slice(row * size, row * size + size), direction === 'ArrowRight');
                for (let col = 0; col < size; col++) {
                    if (board[row * size + col] !== newRow[col]) {
                        moved = true;
                    }
                    board[row * size + col] = newRow[col];
                }
            }
        }
        if (moved) {
            addNewTile();
            updateBoard();
        }
    }

    function slideAndMerge(line, reverse) {
        if (reverse) {
            line.reverse();
        }
        line = line.filter(num => num !== 0);
        for (let i = 0; i < line.length - 1; i++) {
            if (line[i] === line[i + 1]) {
                line[i] *= 2;
                score += line[i];
                line[i + 1] = 0;
            }
        }
        line = line.filter(num => num !== 0);
        while (line.length < size) {
            line.push(0);
        }
        if (reverse) {
            line.reverse();
        }
        return line;
    }

    function isGameOver() {
        for (let i = 0; i < size * size; i++) {
            if (board[i] === 0) {
                return false;
            }
            if (i % size !== size - 1 && board[i] === board[i + 1]) {
                return false;
            }
            if (i < size * (size - 1) && board[i] === board[i + size]) {
                return false;
            }
        }
        return true;
    }

    function saveScore(player, playerScore) {
        if (!scores[player] || scores[player] < playerScore) {
            scores[player] = playerScore;
            localStorage.setItem('scores', JSON.stringify(scores));
        }
    }

    function displayScores() {
        scoreList.innerHTML = '';
        for (const player in scores) {
            const row = document.createElement('tr');
            const playerNameCell = document.createElement('td');
            playerNameCell.innerText = player;
            const scoreCell = document.createElement('td');
            scoreCell.innerText = scores[player];
            row.appendChild(playerNameCell);
            row.appendChild(scoreCell);
            scoreList.appendChild(row);
        }
    }

    function restartGame() {
        score = 0;
        overlay.style.display = 'none';
        createBoard();
    }

    submitScoreButton.addEventListener('click', () => {
        const playerName = playerNameInput.value.trim();
        if (playerName) {
            saveScore(playerName, score);
            displayScores();
            restartGame();
        } else {
            alert('Please enter your name.');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            move(e.key);
        }
    });

    restartButton.addEventListener('click', restartGame);

    createBoard();
    displayScores();
});
