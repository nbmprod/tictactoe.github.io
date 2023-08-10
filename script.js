// General variables
const cell = Array.from(document.querySelectorAll('.cell'));
const centralCell = cell.find(cell => cell.id === '5');
const xBg = 'url(./source/pinguin.png)';
const oBg = 'url(./source/ladybug.png)';

let playerXSlot = [];
let playerOSlot = [];
let isPlayerTurn = true;

const winSequences = [
  [1, 2, 3], // Top row
  [4, 5, 6], // Middle row
  [7, 8, 9], // Bottom row
  [1, 4, 7], // Left column
  [2, 5, 8], // Middle column
  [3, 6, 9], // Right column
  [1, 5, 9], // Top-left to bottom-right diagonal
  [3, 5, 7]  // Top-right to bottom-left diagonal
];

// Player move
function putX(element) {
  if (!isPlayerTurn || element.style.backgroundImage !== '') {
    return;
  }

  element.style.backgroundImage = xBg;

  const idAsNumber = parseInt(element.id, 10);
  playerXSlot.push(idAsNumber);

  checkWinCondition();
  if (!isGameOver()) {
    isPlayerTurn = false;
    setTimeout(aiMove, 200); 
  }
}

// AI move
function aiMove() {
  const availableCells = cell.filter(cell => {
    return cell.style.backgroundImage === '' || cell.style.backgroundImage === 'none';
  });

  if (availableCells.length > 0) {
    let selectedCell = availableCells.includes(centralCell) ? centralCell : null;

    if (!selectedCell) {
      // Block player's chain or make a random move
      for (const winSubsequence of winSequences) {
        const playerMovesInSubsequence = winSubsequence.filter(cellId => playerXSlot.includes(cellId));

        if (playerMovesInSubsequence.length === 2) {
          const emptyCellId = winSubsequence.find(cellId => !playerXSlot.includes(cellId) && !playerOSlot.includes(cellId));
          if (emptyCellId) {
            selectedCell = availableCells.find(cell => parseInt(cell.id) === emptyCellId);
            break;
          }
        } else {
          const randomIndex = Math.floor(Math.random() * availableCells.length);
          selectedCell = availableCells[randomIndex];
        }
      }
    }

    setTimeout(() => {
      selectedCell.style.backgroundImage = oBg;
      const idAsNumber = parseInt(selectedCell.id, 10);
      playerOSlot.push(idAsNumber);

      checkWinCondition();
      if (!isGameOver()) {
        isPlayerTurn = true;
      }
    }, 200); // Adjust the delay duration as needed
  }
}

// Win mechanic
function checkWinCondition() {
  function containsSubArray(arr, subArr) {
    const arrSet = new Set(arr);
    return subArr.every(num => arrSet.has(num));
  }

  const resultsX = winSequences.some(subArr => containsSubArray(playerXSlot, subArr));
  const resultsO = winSequences.some(subArr => containsSubArray(playerOSlot, subArr));

  if (resultsX) {
    setTimeout(() => {
      alert('You win!');
      resetGame();
    }, 300); // Delay the alert message
  } else if (resultsO) {
    setTimeout(() => {
      alert('Computer wins!');
      resetGame();
    }, 300); // Delay the alert message
  } else if (isGameOver()) {
    setTimeout(() => {
      alert("It's a tie!");
      resetGame();
    }, 300); // Delay the alert message
  }
}

function isGameOver() {
  return playerXSlot.length + playerOSlot.length === 9;
}

// Reset
function resetGame() {
  playerXSlot.length = 0;
  playerOSlot.length = 0;
  isPlayerTurn = true;


  cell.forEach(element => {
    element.style.backgroundImage = '';
  });
}
