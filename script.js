let fields = [
  null, 
  null, 
  null,
  null, 
  null, 
  null,
  null, 
  null, 
  null,    
];

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertikal
  [0, 4, 8], [2, 4, 6] // Diagonal
];

let currentPlayer = 'circle';
let gameInProgress = true;

function init() {  
  render();
  const restartButton = document.getElementById('restartButton');
  restartButton.addEventListener('click', restartGame);
}

function render() {
  const contentDiv = document.getElementById('content');

  let tableHTML = '<table>';
  for (let i = 0; i < 3; i++) {
    tableHTML += '<tr>';
    for (let j = 0; j < 3; j++) {
      const index = i * 3 + j;
      let symbol = '';
      if (fields[index] === 'circle') {
        symbol = generateAnimatedCircleSVG();  // Verwende den animierten Kreis
      } else if (fields[index] === 'cross') {
        symbol = generateAnimatedCrossSVG();   // Verwende das animierte Kreuz
      }
      tableHTML += `<td onclick="handleClick(this, ${index})">${symbol}</td>`;
    }
    tableHTML += '</tr>';
  }
  tableHTML += '</table>';

  contentDiv.innerHTML = tableHTML;
}

function restartGame() {
  gameInProgress = true; // Setze das Spiel wieder auf "läuft"
  fields = [
    null, 
    null, 
    null,
    null, 
    null, 
    null,
    null, 
    null, 
    null,    
  ];
  render();
}

function handleClick(cell, index) {
  if (gameInProgress && fields[index] === null) {    // Überprüfen, ob das Feld leer ist
    fields[index] = currentPlayer;    // Setzen Sie das Feld auf den aktuellen Spieler
    cell.innerHTML = currentPlayer === 'circle' ? generateAnimatedCircleSVG() : generateAnimatedCrossSVG();   // Aktualisieren Sie das Anzeigesymbol im Feld
    cell.onclick = null;               // Deaktivieren Sie den Klick auf das Feld, damit es nicht erneut geklickt werden kann
    currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';           // Wechseln Sie zum anderen Spieler

    if (isGameFinished()) {             // Überprüfen Sie, ob das Spiel beendet ist
      const winCombination = getWinningCombination();                 // Holen Sie sich die gewinnende Kombination, falls vorhanden
      drawWinningLine(winCombination);            // Zeichnen Sie die Gewinnerlinie
    }
  }
}

function isGameFinished() {      
  return fields.every((field) => field !== null) || getWinningCombination() !== null;    // Überprüfen, ob alle Felder belegt sind ODER eine Gewinnkombination vorhanden ist
}

function getWinningCombination() {     // Durchlaufe alle möglichen Gewinnkombinationen
  for (let i = 0; i < WINNING_COMBINATIONS.length; i++) {
    const [a, b, c] = WINNING_COMBINATIONS[i];
    if (fields[a] === fields[b] && fields[b] === fields[c] && fields[a] !== null) {  // Überprüfe, ob die Felder in der aktuellen Kombination alle den gleichen Spieler haben Und ob sie nicht leer sind
      return WINNING_COMBINATIONS[i];    // Wenn ja, gib die Gewinnkombination zurück
    }    
  }
  return null;    // Wenn keine Gewinnkombination gefunden wurde, gib null zurück
}


function generateAnimatedCircleSVG() {
  const color = '#00B0EF';
  const width = 70;
  const height = 70;

  return `<svg width="${width}" height="${height}">
            <circle cx="35" cy="35" r="0" stroke="${color}" stroke-width="5" fill="none">
              <animate attributeName="r" from="0" to="30" dur="0.5s" fill="freeze" />
            </circle>
          </svg>`;
}


function generateAnimatedCrossSVG() {
  const color = '#FFC000';
  const width = 70;
  const height = 70;

  const svgHtml = `
    <svg width="${width}" height="${height}">
      <line x1="0" y1="0" x2="70" y2="70"
        stroke="${color}" stroke-width="5">
        <animate attributeName="x2" from="0" to="70" dur="0.5s" fill="freeze" />
        <animate attributeName="y2" from="0" to="70" dur="0.5s" fill="freeze" />
      </line>
      <line x1="70" y1="0" x2="0" y2="70"
        stroke="${color}" stroke-width="5">
        <animate attributeName="x2" from="70" to="0" dur="0.5s" fill="freeze" />
        <animate attributeName="y2" from="0" to="70" dur="0.5s" fill="freeze" />
      </line>  
    </svg>
  `;
  return svgHtml;
}



function drawWinningLine(combination) {
  const lineColor = '#ffffff';    // Definiere die Farbe der Gewinnlinie
  const lineWidth = 5;           // Definiere Breite der Gewinnlinie

  const startCell = document.querySelectorAll(`td`)[combination[0]];     // Finde die Start- und Endzellen der Gewinnkombination
  const endCell = document.querySelectorAll(`td`)[combination[2]];       // Finde die Start- und Endzellen der Gewinnkombination

  const startRect = startCell.getBoundingClientRect();                                // Berechne die Abmessungen der Zellen und des Inhaltsbereichs
  const endRect = endCell.getBoundingClientRect();                                    // Berechne die Abmessungen der Zellen und des Inhaltsbereichs
  const contentRect = document.getElementById('content').getBoundingClientRect();       // Berechne die Abmessungen der Zellen und des Inhaltsbereichs

  const lineLength = Math.sqrt(           // Berechne die Länge und den Winkel der Linie
    Math.pow(endRect.left - startRect.left, 2) + Math.pow(endRect.top - startRect.top, 2)
  );
  const lineAngle = Math.atan2(endRect.top - startRect.top, endRect.left - startRect.left);

  const line = document.createElement('div');      // Erstelle ein Div-Element für die Gewinnlinie
  line.style.position = 'absolute';
  line.style.width = `${lineLength}px`;
  line.style.height = `${lineWidth}px`;
  line.style.backgroundColor = lineColor;
  line.style.top = `${startRect.top + startRect.height / 2 - lineWidth / 2 -contentRect.top}px`;        // Positioniere die Gewinnlinie anhand der Startzelle
  line.style.left = `${startRect.left + startRect.width / 2 - contentRect.left}px`;
  line.style.transform = `rotate(${lineAngle}rad)`;            // Rotiere die Gewinnlinie entsprechend des Winkels
  line.style.transformOrigin = `top left`;
  document.getElementById('content').appendChild(line);       // Füge die Gewinnlinie dem Inhaltsbereich hinzu
  gameInProgress = false;
}




