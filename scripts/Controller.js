import Game from "./Game.js";
import View from "./View.js";
/**
 * The `Controller` class is responsible for handling user interactions with the game, such as clicking on game zones and reserve pieces. It manages the game state and updates the view accordingly.
 *
 * The `Controller` class has the following responsibilities:
 * - Initializing the game and setting up the initial game state
 * - Handling user interactions, such as clicking on game zones and reserve pieces
 * - Updating the game state based on user actions
 * - Updating the view to reflect the current game state
 * - Checking the game state and determining the winner
 */
export default class Controller {
  /**
   * Initializes the game and view, sets up event handlers, and prepares the initial game state.
   */
  constructor() {
    this.game = new Game();
    this.view = new View({
      onZoneClick: (row, col) => this.handleZoneClick(row, col),
      onReservePieceClick: (type, index) =>
        this.handleReservePieceClick(type, index),
    });
    this.pendingMove = null;
    this.bindEvents();
  }

  /**
   * Initializes the game by setting up the game state, rendering the board, updating the game information, and highlighting the available pieces.
   */
  initGame() {
    this.game.setupGame();
    this.view.renderBoard();
    this.view.updateBoard(this.game);
    this.view.updateGameInfo({
      currentPlayer: this.game.currentPlayer,
      rhinoPieces: this.game.rhinoPieces,
      elephantPieces: this.game.elephantPieces,
    });
    this.highlightAvailablePieces();
  }

  /**
   * Binds the event listener for the reset button, which calls the `initGame()` method when clicked.
   */
  bindEvents() {
    document.getElementById("reset-button").addEventListener("click", () => {
      this.initGame();
    });
  }

  /**
   * Highlights the available pieces on the game board.
   * This method retrieves the available pieces from the game state and
   * passes them to the view to highlight the valid moves for those pieces.
   */
  highlightAvailablePieces() {
    const availablePieces = this.game.getAvailablePieces();
    this.view.highlightValidMoves(availablePieces);
  }

  /**
   * Handles the user's click on a reserve piece.If the clicked reserve piece belongs to the current player,
   * it sets the selected piece to the reserve piece and highlights the valid moves for that piece.
   *
   */
  handleReservePieceClick(type, index) {
    if (type === this.game.currentPlayer) {
      this.game.selectedPiece = { type, index, inReserve: true };
      const validMoves = this.game.getValidMoves(null, null);
      this.view.highlightValidMoves(validMoves);
    }
  }

  /**
   * Supposed to handle the user's click on a game zone.
   * If the clicked piece belongs to the current player, it sets the selected piece and highlights the valid moves for that piece.
   */
  handlePieceSelection(row, col) {
    const piece = this.game.board[row][col];
    if (piece && piece.type === this.game.currentPlayer) {
      this.game.selectedPiece = { row, col };
      this.view.clearHighlights();
      const validMoves = this.game.getValidMoves(row, col);
      this.view.highlightValidMoves(validMoves);
      return true;
    }
    return false;
  }

  /**
   * Handles the logic for moving a piece on the game board.
   * First it checks if a piece is currently selected, and if so, it's supposed to move the piece to the clicked destination.
   * If the clicked destination is a valid move, it sets the pending move and it's supposed to show the orientation selector.
   *
   */
  handleMove(toRow, toCol) {
    if (this.game.selectedPiece) {
      const fromRow = this.game.selectedPiece.row;
      const fromCol = this.game.selectedPiece.col;

      const validMoves = this.game.getValidMoves(fromRow, fromCol);
      const isValidMove = validMoves.some(
        (move) => move.row === toRow && move.col === toCol
      );

      if (isValidMove) {
        this.pendingMove = { row: toRow, col: toCol };
        this.view.showOrientationSelector(toRow, toCol);
      }
    }
  }

  /**
   * Handles the user's selection of a piece orientation for the pending move.
   */
  handleOrientationSelect(orientation) {
    const move = {
      fromRow: this.game.selectedPiece.row,
      fromCol: this.game.selectedPiece.col,
      toRow: this.pendingMove.row,
      toCol: this.pendingMove.col,
      orientation: orientation,
    };

    if (this.game.movePiece(move)) {
      this.view.animateMove(move.fromRow, move.fromCol, move.toRow, move.toCol);
      this.view.updateBoard(this.game);
      this.view.highlightLastMove(move.toRow, move.toCol);
      this.checkGameState();
    }
  }

  /**
   * Handles the logic for clicking on a zone (cell) on the game board.
   * If a piece is not currently selected, it attempts to select a piece at the clicked location.
   * If a piece is currently selected, it attempts to move the selected piece to the clicked location.
   *
   */
  handleZoneClick(row, col) {
    console.log("Zone clicked:", row, col);
    if (!this.game.selectedPiece) {
      console.log("Attempting piece selection");
      this.handlePieceSelection(row, col);
    } else {
      console.log("Attempting move");
      this.handleMove(row, col);
    }
  }
}
