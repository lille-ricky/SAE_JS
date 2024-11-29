/**
 * Controller object, containing logic concerning user's actions.
 */
class Controller {
    constructor(game, view) {
        this.game = game;
        this.view = view;

        this.selectedPiece = null;

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.view.boardElement.addEventListener('click', this.handleBoardClick.bind(this));

        const resetButton = document.getElementById('reset-game');
        if (resetButton) {
            resetButton.addEventListener('click', this.resetGame.bind(this));
        }
        
    }

    handleBoardClick(event) {
        const clickedCell = event.target.closest('.board-cell');
        if (!clickedCell) return;

        const x = parseInt(clickedCell.dataset.x);
        const y = parseInt(clickedCell.dataset.y);

        if (!this.selectedPiece) {
            this.selectedPiece(x, y);
        } else {
            this.movePiece(x, y);
        }
    }

    selectPiece(x, y) {
        const piece = this.game.board[y][x];

        if (piece && piece.owner === this.game.currentPlayer) {
            this.selectedPiece = { x,y };
        }
    }

    
}