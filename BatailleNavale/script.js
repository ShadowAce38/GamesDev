document.addEventListener("DOMContentLoaded", () => {
  const userGrid = document.querySelector("#player-grid");
  const computerGrid = document.querySelector("#computer-grid");
  const startButton = document.querySelector("#start-button");
  const infoDisplay = document.querySelector("#info-text");

  const userSquares = [];
  const computerSquares = [];
  const width = 10;
  const shipArray = [
    {
      name: "destroyer",
      directions: [
        [0, 1],
        [0, width],
      ],
      size: 2,
    },
    {
      name: "submarine",
      directions: [
        [0, 1, 2],
        [0, width, width * 2],
      ],
      size: 3,
    },
    {
      name: "cruiser",
      directions: [
        [0, 1, 2],
        [0, width, width * 2],
      ],
      size: 3,
    },
    {
      name: "battleship",
      directions: [
        [0, 1, 2, 3],
        [0, width, width * 2, width * 3],
      ],
      size: 4,
    },
    {
      name: "carrier",
      directions: [
        [0, 1, 2, 3, 4],
        [0, width, width * 2, width * 3, width * 4],
      ],
      size: 5,
    },
  ];

  let isGameOver = false;
  let currentPlayer = "user";
  let selectedShipIndex = 0; // Indice du navire sélectionné pour le placement

  // Créer les grilles de jeu
  function createBoard(grid, squares) {
    for (let i = 0; i < width * width; i++) {
      const square = document.createElement("div");
      square.dataset.id = i;
      grid.appendChild(square);
      squares.push(square);
    }
  }

  createBoard(userGrid, userSquares);
  createBoard(computerGrid, computerSquares);

  // Placer les navires de l'ordinateur
  function generate(ship) {
    let randomDirection = Math.floor(Math.random() * ship.directions.length);
    let current = ship.directions[randomDirection];
    let direction = randomDirection === 0 ? 1 : width;
    let randomStart = Math.abs(
      Math.floor(
        Math.random() * computerSquares.length -
          ship.directions[0].length * direction
      )
    );

    const isTaken = current.some(
      (index) =>
        computerSquares[randomStart + index].classList.contains("taken")
    );
    const isAtRightEdge = current.some(
      (index) => (randomStart + index) % width === width - 1
    );
    const isAtLeftEdge = current.some(
      (index) => (randomStart + index) % width === 0
    );

    if (!isTaken && !isAtRightEdge && !isAtLeftEdge) {
      current.forEach((index) =>
        computerSquares[randomStart + index].classList.add("taken", ship.name)
      );
    } else generate(ship);
  }

  shipArray.forEach((ship) => generate(ship));

  // Placer les navires du joueur
  function placeShip(index, ship) {
    const direction = Math.floor(Math.random() * ship.directions.length);
    const current = ship.directions[direction];
    const horizontal = direction === 0;
    let isValid = true;

    // Vérification que le navire peut être placé
    if (horizontal) {
      if (index % width + ship.size > width) isValid = false; // Dépassement à droite
    } else {
      if (index + ship.size * width >= width * width) isValid = false; // Dépassement en bas
    }

    if (isValid) {
      const isTaken = current.some((i) =>
        userSquares[index + i * (horizontal ? 1 : width)].classList.contains(
          "taken"
        )
      );

      if (!isTaken) {
        current.forEach((i) =>
          userSquares[
            index + i * (horizontal ? 1 : width)
          ].classList.add("taken", "ship", ship.name)
        );
        return true;
      }
    }

    return false;
  }

  userSquares.forEach((square) => {
    square.addEventListener("click", (e) => {
      if (selectedShipIndex < shipArray.length) {
        const ship = shipArray[selectedShipIndex];
        const index = parseInt(square.dataset.id);

        if (placeShip(index, ship)) {
          selectedShipIndex++;
          if (selectedShipIndex === shipArray.length) {
            infoDisplay.textContent = "Tous les navires sont placés!";
            startButton.disabled = false; // Permet de démarrer le jeu une fois les navires placés
          } else {
            infoDisplay.textContent = `Placez votre ${shipArray[selectedShipIndex].name}!`;
          }
        } else {
          infoDisplay.textContent = "Impossible de placer ici!";
        }
      }
    });
  });

  // Commencer le jeu
  startButton.addEventListener("click", () => {
    if (document.querySelectorAll(".ship").length !== 17) {
      infoDisplay.textContent = "Placez tous vos navires!";
      return;
    }
    startButton.disabled = true;
    infoDisplay.textContent = "Le jeu a commencé!";
    computerGrid.addEventListener("click", function handleClick(e) {
      if (!isGameOver && currentPlayer === "user") {
        const targetSquare = e.target;
        if (
          !targetSquare.classList.contains("miss") &&
          !targetSquare.classList.contains("hit")
        ) {
          checkHit(targetSquare, "computer");
          currentPlayer = "computer";
          setTimeout(computerTurn, 1000);
        }
      }
    });
  });

  // Vérifier un tir
  function checkHit(square, target) {
    if (square.classList.contains("taken")) {
      square.classList.add("hit");
      infoDisplay.textContent = `Coup réussi sur le ${
        target === "user" ? "votre" : "l'ordinateur"
      }!`;
      checkForWins();
    } else {
      square.classList.add("miss");
      const cross = document.createElement("span");
      cross.classList.add("cross");
      cross.textContent = "\u2716"; // Utilisation du caractère Unicode pour la croix
      square.appendChild(cross); // Ajoute une croix pour un coup manqué
      infoDisplay.textContent = `Coup manqué sur le ${
        target === "user" ? "votre" : "l'ordinateur"
      }!`;
    }
  }

  // Tour de l'ordinateur
  function computerTurn() {
    if (!isGameOver && currentPlayer === "computer") {
      const randomSquare =
        userSquares[Math.floor(Math.random() * userSquares.length)];
      if (
        !randomSquare.classList.contains("miss") &&
        !randomSquare.classList.contains("hit")
      ) {
        checkHit(randomSquare, "user");
        currentPlayer = "user";
      } else {
        computerTurn();
      }
    }
  }

  // Vérifier les victoires
  function checkForWins() {
    const userShips = shipArray.map((ship) => ship.name);
    const computerShips = shipArray.map((ship) => ship.name);

    let userHits = 0;
    let computerHits = 0;

    computerSquares.forEach((square) => {
      if (square.classList.contains("hit")) {
        computerShips.forEach((ship) => {
          if (square.classList.contains(ship)) {
            userHits++;
            if (userHits === shipArray.find((s) => s.name === ship).size) {
              infoDisplay.textContent = `Vous avez coulé le ${ship} de l'ordinateur!`;
              userHits = 0;
            }
          }
        });
      }
    });

    userSquares.forEach((square) => {
      if (square.classList.contains("hit")) {
        userShips.forEach((ship) => {
          if (square.classList.contains(ship)) {
            computerHits++;
            if (computerHits === shipArray.find((s) => s.name === ship).size) {
              infoDisplay.textContent = `L'ordinateur a coulé votre ${ship}!`;
              computerHits = 0;
            }
          }
        });
      }
    });

    const allUserHits = computerSquares.filter((square) =>
      square.classList.contains("hit")
    ).length;
    const allComputerHits = userSquares.filter((square) =>
      square.classList.contains("hit")
    ).length;

    if (allUserHits === shipArray.reduce((acc, ship) => acc + ship.size, 0)) {
      infoDisplay.textContent = "Vous avez gagné!";
      isGameOver = true;
    }

    if (allComputerHits === shipArray.reduce((acc, ship) => acc + ship.size, 0)) {
      infoDisplay.textContent = "L'ordinateur a gagné!";
      isGameOver = true;
    }
  }
});
