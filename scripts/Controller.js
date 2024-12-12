import Game from './Game.js';
import View from './View.js';

export default class Controller {
    constructor() {
        this.game = new Game();
        this.view = new View();
    }

    initGame() {
        // Initialize the game state (can add any game setup logic here if needed)
        this.game.setupGame();

        // Render the game board using the View class
        this.view.renderBoard();

        // Place the initial pieces on the board
        this.view.placePieces(this.game.getInitialPieces());
    }
}
