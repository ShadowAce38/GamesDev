// Déclaration des variables
const canvas = document.getElementById('gameCanvas'); // Récupère le canvas
const ctx = canvas.getContext('2d'); // Récupère le contexte de dessin 2D du canvas
const grid = 20; // Taille d'une cellule sur le canvas
let snake = [{ x: 10 * grid, y: 10 * grid }]; // Initialise le serpent avec une tête au centre du canvas
let dx = grid, dy = 0; // Initialise la direction du mouvement du serpent
let food, score = 0, gameLoop; // Initialise la nourriture, le score, et l'identifiant de la boucle de jeu

// Fonction d'initialisation du jeu
const initGame = () => {
    score = 0; // Réinitialise le score
    snake.length = 1; // Réinitialise le serpent avec une seule tête
    snake[0] = { x: 10 * grid, y: 10 * grid }; // Positionne la tête du serpent au centre du canvas
    dx = grid; // Initialise la direction horizontale du serpent
    dy = 0; // Initialise la direction verticale du serpent
    placeFood(); // Place la nourriture sur le canvas
    updateScore(0); // Met à jour l'affichage du score
};

// Place aléatoirement la nourriture sur le canvas
const placeFood = () => {
    food = { x: Math.floor(Math.random() * 20) * grid, y: Math.floor(Math.random() * 20) * grid };
};

// Dessine un rectangle sur le canvas
const drawRect = (x, y, color) => {
    ctx.fillStyle = color; // Définit la couleur de remplissage
    ctx.fillRect(x, y, grid, grid); // Dessine un rectangle aux coordonnées spécifiées
};

// Dessine le serpent sur le canvas
const drawSnake = () => {
    snake.forEach((segment, index) => {
        drawRect(segment.x, segment.y, index === 0 ? 'green' : 'lightgreen'); // Dessine la tête en vert et le corps en vert clair
        ctx.strokeStyle = 'black'; // Définit la couleur de la bordure
        ctx.strokeRect(segment.x, segment.y, grid, grid); // Dessine la bordure du rectangle
    });
};

// Dessine la nourriture sur le canvas
const drawFood = () => {
    drawRect(food.x, food.y, '#BB342F'); // Dessine la nourriture en rouge
};

// Déplace le serpent
const moveSnake = () => {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy }; // Calcule la nouvelle position de la tête
    snake.unshift(head); // Ajoute la nouvelle tête au début du tableau
    if (head.x === food.x && head.y === food.y) { // Vérifie si le serpent a mangé la nourriture
        placeFood(); // Place une nouvelle nourriture
        updateScore(score + 10); // Met à jour le score
    } else {
        snake.pop(); // Supprime la dernière partie du serpent (la queue)
    }
};

// Efface le contenu du canvas
const clearCanvas = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Efface tout le contenu du canvas
};

// Vérifie les collisions avec les bords et le corps du serpent
const checkCollision = () => {
    const [head, ...body] = snake; // Récupère la tête et le reste du corps du serpent
    return head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height ||
           body.some(segment => segment.x === head.x && segment.y === head.y); // Vérifie les collisions avec les bords et le corps
};

// Fonction principale pour dessiner le jeu
const draw = () => {
    if (checkCollision()) { // Vérifie les collisions
        clearInterval(gameLoop); // Arrête la boucle de jeu
        handleGameOver(); // Affiche l'écran de fin de jeu
        return;
    }
    clearCanvas(); // Efface le canvas
    drawSnake(); // Dessine le serpent
    drawFood(); // Dessine la nourriture
    moveSnake(); // Déplace le serpent
};

// Bascule entre le mode sombre et clair
const toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode'); // Active ou désactive la classe 'dark-mode' sur le body
    document.getElementById('scoreboard').classList.toggle('dark-mode'); // Active ou désactive la classe 'dark-mode' sur le scoreboard
};

// Démarre le jeu
const startGame = () => {
    initGame(); // Initialise le jeu
    gameLoop = setInterval(draw, 100); // Démarre la boucle de jeu
    toggleButtonVisibility('startButton', false); // Masque le bouton de démarrage
    toggleButtonVisibility('restartButton', false); // Masque le bouton de redémarrage
};

// Redémarre le jeu
const restartGame = () => {
    initGame(); // Réinitialise le jeu
    gameLoop = setInterval(draw, 100); // Démarre la boucle de jeu
    toggleButtonVisibility('restartButton', false); // Masque le bouton de redémarrage
};

// Affiche ou masque un bouton
const toggleButtonVisibility = (buttonId, show) => {
    document.getElementById(buttonId).style.display = show ? 'block' : 'none'; // Affiche ou masque le bouton en fonction de la valeur de show
};

// Gère la fin de jeu
const handleGameOver = () => {
    alert(`Game Over! Your Score: ${score}`); // Affiche un message de fin de jeu avec le score
    toggleButtonVisibility('restartButton', true); // Affiche le bouton de redémarrage
    const playerName = prompt('Enter your name:', 'Player'); // Demande le nom du joueur
    updateScores(playerName); // Met à jour les scores
    updateScoreboard(); // Met à jour le tableau des scores
};

// Met à jour le score
const updateScore = (newScore) => {
    score = newScore; // Met à jour le score
    document.getElementById('score').innerText = `Score: ${score}`; // Affiche le score
};

// Met à jour les scores dans le stockage local
const updateScores = (name) => {
    const scores = JSON.parse(localStorage.getItem('snakeScores')) || []; // Récupère les scores du stockage local ou initialise un nouveau tableau
    const existingScore = scores.find(s => s.name === name); // Vérifie si le joueur a déjà un score enregistré
    if (existingScore && existingScore.score < score) { // Si oui, met à jour le score si le nouveau score est plus élevé
        existingScore.score = score;
    } else if (!existingScore) { // Sinon, ajoute un nouveau score pour le joueur
        scores.push({ name, score });
    }
    scores.sort((a, b) => b.score - a.score); // Trie les scores par ordre décroissant
    localStorage.setItem('snakeScores', JSON.stringify(scores)); // Enregistre les scores dans le stockage local
};

// Met à jour le tableau des scores
const updateScoreboard = () => {
    const scoreList = document.getElementById('scoreList'); // Récupère la liste des scores dans le DOM
    scoreList.innerHTML = ''; // Efface les anciens scores
    const scores = JSON.parse(localStorage.getItem('snakeScores')) || []; // Récupère les scores depuis le stockage local
    scores.slice(0, 5).forEach((score, index) => { // Affiche les 5 meilleurs scores
        const row = document.createElement('tr'); // Crée une nouvelle ligne de tableau
        row.innerHTML = `<td>${index + 1}</td><td>${score.name}</td><td>${score.score}</td>`; // Remplit la ligne avec les informations du score
        scoreList.appendChild(row); // Ajoute la ligne au tableau des scores
    });
};

// Gère les événements clavier pour contrôler le serpent
document.addEventListener('keydown', ({ key }) => {
    if (key === 'ArrowLeft' && dx === 0) { dx = -grid; dy = 0; } // Déplace vers la gauche si le serpent ne va pas vers la droite
    if (key === 'ArrowUp' && dy === 0) { dx = 0; dy = -grid; } // Déplace vers le haut si le serpent ne va pas vers le bas
    if (key === 'ArrowRight' && dx === 0) { dx = grid; dy = 0; } // Déplace vers la droite si le serpent ne va pas vers la gauche
    if (key === 'ArrowDown' && dy === 0) { dx = 0; dy = grid; } // Déplace vers le bas si le serpent ne va pas vers le haut
});

// Associer les fonctions aux événements des boutons
document.getElementById('startButton').onclick = startGame; // Lorsque le bouton "Start" est cliqué, démarre le jeu
document.getElementById('restartButton').onclick = restartGame; // Lorsque le bouton "Restart" est cliqué, redémarre le jeu
document.getElementById('toggleDarkModeButton').onclick = toggleDarkMode; // Lorsque le bouton "Toggle Dark Mode" est cliqué, bascule entre le mode sombre et clair

// Met à jour le tableau des scores lors du chargement de la page
updateScoreboard();
