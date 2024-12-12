export default class View {
  constructor() {
      this.gameContainer = document.getElementById('game-container');
  }

  renderBoard() {
      // Create the board element
      const board = document.createElement('div');
      board.id = 'board';

      // Apply styles
      board.style.width = '600px';
      board.style.height = '600px';
      board.style.backgroundImage = "url('../assets/images/plateau.jpg')";
      board.style.backgroundSize = 'cover';
      board.style.backgroundPosition = 'center';
      board.style.border = '2px solid #000';

      // Append the board to the game container
      this.gameContainer.appendChild(board);

      this.renderZones(board);

      console.log('Board rendered successfully by the View class.');
  }

  renderZones(board) {
      const rows = 5;
      const cols = 5;
      const zoneWidth = board.offsetWidth / cols;
      const zoneHeight = board.offsetHeight / rows;

      this.zones = []; // Keep track of all zones for positioning pieces

      for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
              const zone = document.createElement('div');
              zone.classList.add('clCliquable');
              zone.style.width = `${zoneWidth}px`;
              zone.style.height = `${zoneHeight}px`;
              zone.style.left = `${col * zoneWidth}px`;
              zone.style.top = `${row * zoneHeight}px`;
              zone.style.position = 'absolute';

              this.addZoneEvents(zone);
              this.zones.push({ row, col, zone });
              board.appendChild(zone);
          }
      }
  }

  placePieces(pieces) {
      pieces.forEach(piece => {
          const zone = this.zones.find(z => z.row === piece.row && z.col === piece.col);
          if (zone) {
              this.renderPiece(zone.zone, piece.type, piece.index ?? 0);
          }
      });
  }

  renderPiece(zone, type, index) {
      const pieceElement = document.createElement('div');
      pieceElement.classList.add('piece', `${type}-${index + 1}`); // Dynamically assign sprite class
      zone.appendChild(pieceElement);
  }

  addZoneEvents(zone) {
      // Highlight zone on hover
      zone.addEventListener('mouseover', () => {
          zone.classList.remove('clCliquable');
          zone.classList.add('clSurvol');
      });

      // Remove highlight on mouse out
      zone.addEventListener('mouseout', () => {
          zone.classList.remove('clSurvol');
          zone.classList.add('clCliquable');
      });

      // Select zone on click
      zone.addEventListener('click', () => {
          zone.classList.toggle('clSelection');
      });
  }
}
