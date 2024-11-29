/**
 * Game object, in charge of all game logic, the game state and it's rules
 */
class Game {
   /**
    * Game construcor
    */
   constructor(){
    this.BOARD_SIZE = 5;
    this.PLAYER_ONE = 1;
    this.PLAYER_TWO = 2;

    this.PIECE_TYPES = {
        ELEPHANT : 'elephant',
        RHINO : 'rhino',
        BOULDER : 'boulder'
    }

    this.reset();
   } 

   reset() {
    this.board = Array(this.BOARD_SIZE).fill().map(()=> 
        Array(this.BOARD_SIZE).fill(null)
    );

    this.board[2][2] = { type: this.PIECE_TYPES.BOULDER, orientation: 0};

    this.playerReserve = {
        [this.PLAYER_ONE]: 5,
        [this.PLAYER_TWO]: 5
    };

    this.currentPlayer = this.PLAYER_ONE;

    this.lastMove = null;
   }

   isValidMove(startX, startY, endX, endY) {
        const piece = this.board[startX][startY];

        if (!piece || piece.owner !== this.currentPlayer) {
            return false;
        }

        const isHorizontalMove = startY === endY && Math.abs(startX - endX);
        const isVerticalMove = startX === endX && Math.abs(startY - endY);

        if (!isHorizontalMove && !isVerticalMove) {
            return false;
        }

        const destinationPiece = this.board[endY][endX];

        if (!destinationPiece) {
            return true;
        }

        if (destinationPiece.type === this.PIECE_TYPES.BOULDER) {
            const pushDirectionX = endX - startX;
            const pushDirectionY = endY - startY;
        }
   }

   movePiece(startX, startY, endX, endY) {

   }

   checkWinCon() {
    
   }
}