/**
 * The main view class that manages the game layout and user interactions.
 */
export default class View {
  /**
   * Constructs a new instance of the `View` class, which manages the game layout and user interactions.
   */
  constructor(handlers) {
    this.gameContainer = document.getElementById("game-container");
    this.handlers = {
      onZoneClick: handlers.onZoneClick,
      onReservePieceClick: handlers.onReservePieceClick,
      onOrientationSelect: handlers.onOrientationSelect,
    };
    this.setupGameLayout();
  }

  /**
   * Adds event listeners to a game zone element, handling mouseover, mouseout, and click events.
   */
  addZoneEvents(zone) {
    zone.addEventListener("mouseover", () => {
      zone.classList.remove("clCliquable");
      zone.classList.add("clSurvol");
    });

    zone.addEventListener("mouseout", () => {
      zone.classList.remove("clSurvol");
      zone.classList.add("clCliquable");
    });

    zone.addEventListener("click", () => {
      const row = parseInt(zone.dataset.row);
      const col = parseInt(zone.dataset.col);
      if (this.handlers.onZoneClick) {
        this.handlers.onZoneClick(row, col);
      }
    });
  }

  /**
   * Sets up the game layout, including the player turn indicator, rhino and elephant piece reserves, and a reset button.
   */
  setupGameLayout() {
    const gameInfo = document.createElement("div");
    gameInfo.className = "game-info";

    const playerTurn = document.createElement("div");
    playerTurn.className = "player-turn";
    playerTurn.textContent = "Current Turn: Rhinos";

    // Rhinos

    const rhinoReserve = document.createElement("div");
    rhinoReserve.className = "piecereserve-piece rhino-reserve";
    const rhinoTitle = document.createElement("div");
    rhinoTitle.textContent = "Rhinos :";
    rhinoReserve.appendChild(rhinoTitle);

    const rhinoPieces = document.createElement("div");
    rhinoPieces.className = "reserve-pieces";
    for (let i = 0; i < 5; i++) {
      const pieceSlot = document.createElement("div");
      pieceSlot.className = "reserve-piece rhino-piece";
      pieceSlot.dataset.index = i;
      pieceSlot.addEventListener("click", () => {
        this.handlers.onReservePieceClick("rhino", i);
      });
      rhinoPieces.appendChild(pieceSlot);
    }
    rhinoReserve.appendChild(rhinoPieces);

    // Elephants
    const elephantReserve = document.createElement("div");
    elephantReserve.className = "piece-reserve elephant-reserve";
    const elephantTitle = document.createElement("div");
    elephantTitle.textContent = "Elephants :";
    elephantReserve.appendChild(elephantTitle);

    const elephantPieces = document.createElement("div");
    elephantPieces.className = "reserve-pieces";
    for (let i = 0; i < 5; i++) {
      const pieceSlot = document.createElement("div");
      pieceSlot.className = "reserve-piece elephant-piece";
      pieceSlot.dataset.index = i;
      pieceSlot.addEventListener("click", () => {
        this.handlers.onReservePieceClick("elephant", i);
      });
      elephantPieces.appendChild(pieceSlot);
    }
    elephantReserve.appendChild(elephantPieces);

    const resetButton = document.createElement("button");
    resetButton.id = "reset-button";
    resetButton.textContent = "Reset Game";

    gameInfo.appendChild(playerTurn);
    gameInfo.appendChild(rhinoReserve);
    gameInfo.appendChild(elephantReserve);
    gameInfo.appendChild(resetButton);

    this.gameContainer.appendChild(gameInfo);
  }

  /**
   * Renders the game board by creating a new div element with the ID "board" and appending it to the `gameContainer` element.
   * It then calls the `renderZones` method to create the individual zones on the board.
   */
  renderBoard() {
    this.clearBoard();
    const board = document.createElement("div");
    board.id = "board";
    this.gameContainer.appendChild(board);
    this.renderZones(board);
  }

  /**
   * Renders the game board by creating a grid of zones on the board element.
   * The grid is 5x5, and each zone is sized based on the board's dimensions.
   * The zones are positioned absolutely within the board element.
   * Each zone is assigned a row and column dataset attribute, and the `addZoneEvents` method is called on each zone.
   * The zones are stored in the `this.zones` array for later reference.
   */
  renderZones(board) {
    const rows = 5;
    const cols = 5;
    const zoneWidth = board.offsetWidth / cols;
    const zoneHeight = board.offsetHeight / rows;

    this.zones = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const zone = document.createElement("div");
        zone.classList.add("clCliquable");
        zone.style.width = `${zoneWidth}px`;
        zone.style.height = `${zoneHeight}px`;
        zone.style.left = `${col * zoneWidth}px`;
        zone.style.top = `${row * zoneHeight}px`;
        zone.style.position = "absolute";
        zone.dataset.row = row;
        zone.dataset.col = col;

        this.addZoneEvents(zone); // Add this line
        this.zones.push({ row, col, zone });
        board.appendChild(zone);
      }
    }
  }

  /**
   * Renders a game piece in the specified zone.
   */
  renderPiece(zone, piece) {
    const pieceElement = document.createElement("div");
    pieceElement.classList.add("piece", `${piece.type}-${piece.index + 1}`);

    const existingPiece = zone.querySelector(".piece");
    if (existingPiece) {
      existingPiece.remove();
    }

    zone.appendChild(pieceElement);
  }

  /**
   * Updates the game board by rendering the pieces based on the current game state.
   * For each zone on the board, it checks if there is a piece in the corresponding position in the game state.
   * If there is a piece, it renders the piece in the zone. If there is no piece, it removes any existing piece from the zone.
   */
  updateBoard(gameState) {
    this.zones.forEach(({ zone, row, col }) => {
      const piece = gameState.board[row][col];
      if (piece) {
        this.renderPiece(zone, piece);
      } else {
        const existingPiece = zone.querySelector(".piece");
        if (existingPiece) {
          existingPiece.remove();
        }
      }
    });
  }

  /**
   * Highlights the valid moves on the game board.
   *
   *     */
  highlightValidMoves(validMoves) {
    this.clearHighlights();
    validMoves.forEach((move) => {
      const zone = this.findZone(move.row, move.col);
      if (zone) {
        zone.classList.add("clSurvol");
      }
    });
  }

  /**
   * Highlights the last moved piece on the game board.

   */
  highlightLastMove(row, col) {
    const zone = this.findZone(row, col);
    if (zone) {
      const piece = zone.querySelector(".piece");
      if (piece) {
        piece.classList.add("last-moved");
      }
    }
  }

  /**
   * Purely experimental, as of now it is not effective
   * It is supposed to animate the movement of a piece on the game board,
   * by creating a clone of the piece, and positioning it at the starting location,
   * and then moves it to the ending location.
   * Finally, it removes the clone and renders the piece in the new location.

   */
  animateMove(fromRow, fromCol, toRow, toCol) {
    const fromZone = this.findZone(fromRow, fromCol);
    const toZone = this.findZone(toRow, toCol);
    const piece = fromZone.querySelector(".piece");

    if (piece && toZone) {
      const clone = piece.cloneNode(true);
      clone.style.position = "absolute";
      clone.style.transition = "all 0.3s ease";

      const fromRect = fromZone.getBoundingClientRect();
      const toRect = toZone.getBoundingClientRect();

      clone.style.left = `${fromRect.left}px`;
      clone.style.top = `${fromRect.top}px`;

      document.body.appendChild(clone);

      setTimeout(() => {
        clone.style.left = `${toRect.left}px`;
        clone.style.top = `${toRect.top}px`;

        setTimeout(() => {
          clone.remove();
          this.renderPiece(toZone, piece);
        }, 300);
      }, 0);
    }
  }

  /**
   * Finds the game zone element for the given row and column coordinates.
   * If no zone is found, it returns null.
   */
  findZone(row, col) {
    return this.zones.find((z) => z.row === row && z.col === col)?.zone;
  }

  /**
   * This clears any visual highlights or selections on the game board by removing clSurvol and clSelection classes from all zones.
   */
  clearHighlights() {
    this.zones.forEach(({ zone }) => {
      zone.classList.remove("clSurvol", "clSelection");
    });
  }

  /**
   * Updates the game information display on the page, including the current player's turn and the number of pieces remaining for each player.
   */
  updateGameInfo(gameState) {
    const playerTurn = document.querySelector(".player-turn");
    const rhinoReserve = document.querySelector(".rhino-reserve");
    const elephantReserve = document.querySelector(".elephant-reserve");

    playerTurn.textContent = `Current Turn: ${
      gameState.currentPlayer === "rhino" ? "Rhinos" : "Elephants"
    }`;

    const rhinoPieces = rhinoReserve.querySelectorAll(".reserve-piece");
    const elephantPieces = elephantReserve.querySelectorAll(".reserve-piece");

    rhinoPieces.forEach((piece, index) => {
      piece.style.display = index < gameState.rhinoPieces ? "block" : "none";
    });

    elephantPieces.forEach((piece, index) => {
      piece.style.display = index < gameState.elephantPieces ? "block" : "none";
    });
  }

  /**
   * EXPERIMENTAL
   * This is to be used later on in the orientation selector implementation of game pieces.
   * The orientation selector allows the user to select the orientation of a game piece.
   */
  showOrientationSelector(row, col) {
    const zone = this.findZone(row, col);
    if (!zone) return;

    const orientationSelector = document.createElement("div");
    orientationSelector.className = "orientation-selector";

    const directions = ["north", "south", "east", "west"];
    directions.forEach((direction) => {
      const button = document.createElement("button");
      button.className = `orientation-button ${direction}`;
      button.addEventListener("click", () => {
        this.handlers.onOrientationSelect(direction);
        orientationSelector.remove();
      });
      orientationSelector.appendChild(button);
    });

    zone.appendChild(orientationSelector);
  }

  /**
   * Clears the game board by removing the existing board element from the DOM.
   */
  clearBoard() {
    const existingBoard = document.getElementById("board");
    if (existingBoard) {
      existingBoard.remove();
    }
  }
}
