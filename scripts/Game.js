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

            let currentX = endX;
            let currentY = endY;

            while (true) {
                currentX += pushDirectionX;
                currentY += pushDirectionY;

                if (currentX < 0 || currentX >= this.BOARD_SIZE || currentY < 0 || currentY >= this.BOARD_SIZE) {
                    return true;
                }

                const nextPiece = this.board[currentY][currentX];

                if (!nextPiece) {
                    break;
                }

                if (nextPiece.type !== this.PIECE_TYPES.BOULDER) {
                    return false;
                }
            }

            return true;
        }

        return false;
   }

   movePiece(startX, startY, endX, endY) {
    if (!this.isValidMove(startX, startY, endX, endY)) {
        return false;
    }

    const piece = this.board[startY][startX];
    const destinationPiece = this.board[endY][endX];

    if (!destinationPiece) {
        this.board[endY][endX] = piece;
        this.board[startY][startX] = null;
        return true;
    }

    if (destinationPiece.type === this.PIECE_TYPES.BOULDER) {
        const pushDirectionX = endX - startX;
        const pushDirectionY = endY - startY;

        let currentX = endX;
        let currentY = endY;

        while (currentX >= 0 && currentX < this.BOARD_SIZE && currentY >= 0 && currentY < this.BOARD_SIZE) {
            const nextPiece = this.board[currentY][currentX];

            if (!nextPiece) {
                break;
            }

            this.board[currentY + pushDirectionY][currentX + pushDirectionX] = nextPiece;
            this.board[currentY][currentX] = null;

            currentX += pushDirectionX;
            currentY += pushDirectionY;
        }

        this.board[endY][endX] = piece;
        this.board[startY][startX] = null;

        return true;
    }

    return false;

   }

   checkWinCon() {
    
   }
}