class View {
    constructor(game) {
        this.game = game;
        this.boardElement = document.getElementById('game-baord');
        this.playerTurnElement = document.getElementById('player-turn');
        this.reserveElements = {
            [game.PLAYER_ONE]: document.getElementById('player-one-reserve'),
            [game.PLAYER_TWO]: document.getElementById('player-two-reserve')
        };
    }

    biewRender(){
        this.boardElement.innerHTML = '';

        for (let y = 0; y < this.game.BOARD_SIZE; y++) {
            for (let x = 0; x < this.game.BOARD_SIZE; x++) {
                const cell = document.createElement('div');
                cell.classList.add('board-cell');
                cell.dataset.x = x;
                cell.dataset.y = y;

                const piece = this.model.board[y][x];
                if (piece) {
                    cell.classList.add(
                        piece.type == this.model.PIECE_TYPES.ELEPHANT
                    )
                }
            }
        }
    }
}