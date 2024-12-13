/**
 * The main game class that manages the state and logic of the game.
 */
export default class Game {
    /**
     * Initializes the game state, including the game board, player pieces, and selected piece.
     */
    constructor() {
        this.rows = 5;
        this.cols = 5;
        this.board = this.createEmptyBoard();
        this.currentPlayer = 'rhino';
        this.rhinoPieces = 5;
        this.elephantPieces = 5;
        this.selectedPiece = null;
        this.lastMovedPiece = null;
        this.selectedOrientation = null;
    }

    /**
     * Creates an empty 5x5 game board represented as a 2D array.
     */
    createEmptyBoard() {
        const board = [];
        for (let row = 0; row < this.rows; row++) {
            board[row] = [];
            for (let col = 0; col < this.cols; col++) {
                board[row][col] = null;
            }
        }
        return board;
    }


    /**
     * Sets up the game board with the initial positions of the pieces.
     */
    setupGame() {
        this.board = this.createEmptyBoard();
        
        this.board[2][1] = { type: 'rock', index: 0 };
        this.board[2][2] = { type: 'rock', index: 1 };
        this.board[2][3] = { type: 'rock', index: 2 };
        this.currentPlayer = 'rhino';
        this.rhinoPieces = 5;
        this.elephantPieces = 5;
        this.selectedPiece = null;
        this.lastMovedPiece = null;
    }

    getValidMoves(row, col) {
        const validMoves = [];
        const piece = this.board[row][col];
        
        if (!piece || (piece.type !== this.currentPlayer && !piece.inReserve)) {
            return validMoves;
        }

        if (piece.inReserve) {
            if (piece.type !== this.currentPlayer) return [];
            
            for (let c = 0; c < this.cols; c++) {
                if (!this.board[0][c]) validMoves.push({row: 0, col: c});
                if (!this.board[4][c]) validMoves.push({row: 4, col: c});
            }
            for (let r = 1; r < this.rows - 1; r++) {
                if (!this.board[r][0]) validMoves.push({row: r, col: 0});
                if (!this.board[r][4]) validMoves.push({row: r, col: 4});
            }
            return validMoves;
        }

        const directions = [{r:-1,c:0}, {r:1,c:0}, {r:0,c:-1}, {r:0,c:1}];
        
        directions.forEach(dir => {
            const newRow = row + dir.r;
            const newCol = col + dir.c;
            
            if (newRow >= 0 && newRow < this.rows && 
                newCol >= 0 && newCol < this.cols) {
                validMoves.push({row: newRow, col: newCol});
            }
        });

        return validMoves;
    }
    getAvailablePieces() {
        const pieces = [];
        if (this.currentPlayer === 'rhino' && this.rhinoPieces > 0) {
            pieces.push({ type: 'rhino', inReserve: true });
        }
        if (this.currentPlayer === 'elephant' && this.elephantPieces > 0) {
            pieces.push({ type: 'elephant', inReserve: true });
        }
        
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const piece = this.board[row][col];
                if (piece && piece.type === this.currentPlayer) {
                    pieces.push({ type: piece.type, row, col, inReserve: false });
                }
            }
        }
        return pieces;
    }

    switchTurn() {
        this.currentPlayer = this.currentPlayer === 'rhino' ? 'elephant' : 'rhino';
    }

    /**
     * Determines if a piece can be pushed form the specified direction.
     * 
     * The function checks the strength of the player's pieces in the specified direction and compares it to the
     * strength of the opposing pieces. If the player's strength is greater, the push action can be performed.
     */
    canPush(row, col, direction) {
        let strength = 0;
        let opposingStrength = 0;
        let currentRow = row;
        let currentCol = col;
        
        while (currentRow >= 0 && currentRow < this.rows && 
               currentCol >= 0 && currentCol < this.cols) {
            
            const piece = this.board[currentRow][currentCol];
            if (!piece) break;

            if (piece.type === this.currentPlayer && 
                piece.orientation === direction) {
                strength++;
            } else if (piece.type !== 'rock') {
                opposingStrength++;
            }

            currentRow += direction.row;
            currentCol += direction.col;
        }

        return strength > opposingStrength;
    }

    /**
     * Moves a piece on the game board from one position to another, if the move is valid.
     */
    movePiece(fromRow, fromCol, toRow, toCol, orientation) {
        const piece = this.board[fromRow][fromCol];
        if (!piece) return false;

        const direction = this.getDirection(fromRow, fromCol, toRow, toCol);
        if (this.canPush(toRow, toCol, direction)) {
            this.executePush(toRow, toCol, direction);
            piece.orientation = orientation;
            this.board[toRow][toCol] = piece;
            this.board[fromRow][fromCol] = null;
            this.lastMovedPiece = { row: toRow, col: toCol };
            this.switchTurn();
            return true;
        }
        return false;
    }

    /**
     * Executes a push action on the game board, moving all pieces in the specified direction.
     */
    executePush(row, col, direction) {
        let currentRow = row;
        let currentCol = col;
        let piecesToMove = [];

        while (currentRow >= 0 && currentRow < this.rows && 
               currentCol >= 0 && currentCol < this.cols) {
            
            if (this.board[currentRow][currentCol]) {
                piecesToMove.push({
                    piece: this.board[currentRow][currentCol],
                    row: currentRow,
                    col: currentCol
                });
            } else {
                break;
            }

            currentRow += direction.row;
            currentCol += direction.col;
        }

        piecesToMove.reverse().forEach(pieceInfo => {
            const newRow = pieceInfo.row + direction.row;
            const newCol = pieceInfo.col + direction.col;
            
            if (newRow >= 0 && newRow < this.rows && 
                newCol >= 0 && newCol < this.cols) {
                this.board[newRow][newCol] = pieceInfo.piece;
            }
        });
    }

    /**
     * Calculates the direction vector between two coordinates on the game board.
     */
    getDirection(fromRow, fromCol, toRow, toCol) {
        return {
            row: Math.sign(toRow - fromRow),
            col: Math.sign(toCol - fromCol)
        };
    }

    /**
     * Checks if the current player has won the game by verifying if there are less than 3 rocks on the board.
     */
    checkVictory() {
        let rockCount = 0;
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (this.board[row][col]?.type === 'rock') {
                    rockCount++;
                }
            }
        }
        if (rockCount < 3) {
            return this.currentPlayer;
        }
        return null;
    }

    /**
     * Selects a piece on the game board if it belongs to the current player.
     */
    selectPiece(row, col) {
        console.log('Selecting piece at:', row, col);
        const piece = this.board[row][col];
        if (piece && piece.type === this.currentPlayer) {
            this.selectedPiece = { row, col };
            return true;
        }
        return false;
    }
    

    /**
     * Initializes the game board and sets up the initial game state.
     * This method creates an empty game board, places the three rock pieces in the middle row,
     * adds some initial pieces for testing, and sets the initial game state variables.
     */
    setupGame() {
        this.board = this.createEmptyBoard();
        // Place the three rocks in the middle row
        this.board[2][1] = { type: 'rock', index: 0 };
        this.board[2][2] = { type: 'rock', index: 1 };
        this.board[2][3] = { type: 'rock', index: 2 };
        
        
        this.board[0][0] = { type: 'rhino', index: 0 };
        this.board[4][4] = { type: 'elephant', index: 0 };
        
        this.currentPlayer = 'rhino';
        this.rhinoPieces = 5;
        this.elephantPieces = 5;
        this.selectedPiece = null;
        this.lastMovedPiece = null;
    }
    

}

