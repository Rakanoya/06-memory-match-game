// List of emojis to use in the game (8 pairs for 4x4 grid)
const emojis = ['🍎', '🍌', '🍇', '🍉', '🍒', '🍋', '🍓', '🍍'];

// Get references to DOM elements
const board = document.querySelector('#game-board');
const message = document.querySelector('#message');
const restartBtn = document.querySelector('#restart-btn');
const movesSpan = document.querySelector('#moves');
const timerSpan = document.querySelector('#timer');

let cards = []; // Array to store card objects
let flippedCards = []; // Cards currently flipped
let matchedCount = 0; // Number of matched pairs
let moves = 0; // Number of moves
let timer = 0; // Timer in seconds
let timerInterval = null; // Interval for timer
let canFlip = true; // Prevent flipping during animations

// Function to shuffle an array
function shuffle(array) {
  // Fisher-Yates shuffle algorithm
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // Swap elements
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

// Function to start or restart the game
function startGame() {
  // Reset variables
  cards = [];
  flippedCards = [];
  matchedCount = 0;
  moves = 0;
  timer = 0;
  canFlip = true;
  movesSpan.textContent = `Moves: 0`;
  timerSpan.textContent = `Time: 0s`;
  message.textContent = '';
  clearInterval(timerInterval);

  // Create a list of 2 of each emoji
  const emojiPairs = emojis.concat(emojis);
  shuffle(emojiPairs);

  // Clear the board
  board.innerHTML = '';

  // Create card elements
  for (let i = 0; i < emojiPairs.length; i++) {
    // Create card object
    const card = {
      emoji: emojiPairs[i],
      element: null,
      matched: false
    };

    // Create card DOM element
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card');

    // Create inner div for flip animation
    const cardInner = document.createElement('div');
    cardInner.classList.add('card-inner');

    // Create front face (shows emoji)
    const cardFront = document.createElement('div');
    cardFront.classList.add('card-face', 'card-front');
    cardFront.textContent = card.emoji;

    // Create back face (hidden)
    const cardBack = document.createElement('div');
    cardBack.classList.add('card-face', 'card-back');
    cardBack.textContent = '❓';

    // Add faces to inner div
    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);

    // Add inner div to card
    cardDiv.appendChild(cardInner);

    // Add click event to card
    cardDiv.addEventListener('click', function () {
      flipCard(card, cardDiv);
    });

    // Store reference to element
    card.element = cardDiv;

    // Add card to board and array
    board.appendChild(cardDiv);
    cards.push(card);
  }
}

// Function to handle card flipping
function flipCard(card, cardDiv) {
  // If already matched or already flipped, do nothing
  if (!canFlip || card.matched || flippedCards.includes(card)) {
    return;
  }

  // Flip the card (add 'flipped' class)
  cardDiv.classList.add('flipped');
  flippedCards.push(card);

  // Start timer on first move
  if (moves === 0 && flippedCards.length === 1) {
    startTimer();
  }

  // If two cards are flipped, check for match
  if (flippedCards.length === 2) {
    canFlip = false; // Prevent more flips
    moves += 1;
    movesSpan.textContent = `Moves: ${moves}`;

    // Check if emojis match
    if (flippedCards[0].emoji === flippedCards[1].emoji) {
      // Mark as matched
      flippedCards[0].matched = true;
      flippedCards[1].matched = true;
      matchedCount += 1;
      flippedCards = [];
      canFlip = true;

      // Check for win
      if (matchedCount === emojis.length) {
        endGame();
      }
    } else {
      // Not a match: flip back after short delay
      setTimeout(function () {
        flippedCards[0].element.classList.remove('flipped');
        flippedCards[1].element.classList.remove('flipped');
        flippedCards = [];
        canFlip = true;
      }, 1000); // 1 second delay
    }
  }
}

// Function to start the timer
function startTimer() {
  timerInterval = setInterval(function () {
    timer += 1;
    timerSpan.textContent = `Time: ${timer}s`;
  }, 1000);
}

// Function to stop the timer and show win message
function endGame() {
  clearInterval(timerInterval);
  message.textContent = '🎉 You Win!';
}

// Event listener for restart button
restartBtn.addEventListener('click', function () {
  startGame();
});

// Start the game when the page loads
startGame();
