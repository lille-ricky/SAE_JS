export default class Game {
  constructor() {
      this.rows = 5; // Number of rows on the board
      this.cols = 5; // Number of columns on the board
  }

  setupGame() {
      console.log("Game is being initialized...");
  }

  getInitialPieces() {
      const pieces = [];

      // Add rhinos (first row)
      for (let col = 0; col < 5; col++) {
          pieces.push({ type: 'rhino', row: 0, col });
      }

      // Add elephants (second row)
      for (let col = 0; col < 5; col++) {
          pieces.push({ type: 'elephant', row: 1, col });
      }

      // Add a rock in the center
      pieces.push({ type: 'rock', row: 2, col: 2 });

      return pieces;
  }
}
