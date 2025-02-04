const symbols = [
  "Coco-Pops.png",
  "image-5.png",
  "image-6.png",
  "image-6.jpg",
  "image-7.png",
  "image-8.png",
  "image-13.png",
  "image-14.png",
  "image-15.png",


];

const backgroundMusic = new Audio("assets/energetic-bgm-242515.mp3");
backgroundMusic.loop = true;
backgroundMusic.volume = 0.3;
const cardFlipSound = new Audio("assets/flipcard-91468.mp3");
cardFlipSound.volume = 1;

const gameBoard = document.getElementById("game-board");

cards = [];
firstCard = null;
secondCard = null;
lockBoard = false;

const musicToggleButton = document.createElement("button");
musicToggleButton.textContent = "Sound Off";
musicToggleButton.classList.add("music-toggle-button");
document.body.appendChild(musicToggleButton);

musicToggleButton.addEventListener("click", () => {
  if (backgroundMusic.paused) {
    musicToggleButton.textContent = "Sound On";
    backgroundMusic.play();
  } else {
    backgroundMusic.pause();
    musicToggleButton.textContent = "Sound Off";
  }
});

initializeBoard = function () {
  gameBoard.innerHTML = "";
  cards = [];
  showInstructions();

  backgroundMusic.play();

  const cardSymbols = [...symbols, ...symbols];
  cardSymbols.sort(() => Math.random() - 0.5);

  cardSymbols.forEach((symbol) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const img = document.createElement("img");
    img.src = `./assets/${symbol}`;
    img.alt = symbol.replace(".png", "");
    img.classList.add("card-image");
    img.style.display = "none";
    card.appendChild(img);

    card.dataset.symbol = symbol;
    card.addEventListener("click", handleCardClick);
    gameBoard.appendChild(card);
    cards.push(card);
  });
};


const hyenaImage = document.createElement("img");
hyenaImage.src = "./assets/hyena.png";
hyenaImage.alt = "Hyena";
hyenaImage.classList.add("hyena");
document.body.appendChild(hyenaImage);


function showHyena() {

    const allCards = document.querySelectorAll(".card");

    const randomCard = allCards[Math.floor(Math.random() * allCards.length)];

    if (randomCard) {

        const cardRect = randomCard.getBoundingClientRect();

        hyenaImage.style.left = `${cardRect.left + window.scrollX}px`;
        hyenaImage.style.top = `${cardRect.top + window.scrollY}px`;
        hyenaImage.style.display = "block"; 

        setTimeout(() => {
            hyenaImage.style.display = "none";
            hyenaImage.style.transform = "scale(1)";
        }, 1000); 
    }
}

setInterval(showHyena, 5000);


handleCardClick = function (event) {
  if (lockBoard) return;
  const clickedCard = event.currentTarget;

  cardFlipSound.play();

  if (clickedCard === firstCard || clickedCard.classList.contains("locked"))
    return;

  revealCard(clickedCard);

  if (!firstCard) {
    firstCard = clickedCard;
    firstCard.classList.add("locked");
    return;
  }

  secondCard = clickedCard;

  firstCard.classList.remove("locked");

  checkForMatch();
};

revealCard = function (card) {
  const img = card.querySelector(".card-image");
  img.style.display = "block"; 
  card.classList.add("revealed");
};

checkForMatch = function () {
  const isMatch = firstCard.dataset.symbol === secondCard.dataset.symbol;

  if (isMatch) {
    lockMatchedCards();
    checkForWin();
  } else {
    hideUnmatchedCards();
  }
};

lockMatchedCards = function () {
  firstCard.classList.add("matched");
  secondCard.classList.add("matched");
  resetTurn();
};

hideUnmatchedCards = function () {
  lockBoard = true;
  setTimeout(() => {
    if (firstCard && secondCard) {
      firstCard.querySelector(".card-image").style.display = "none";
      secondCard.querySelector(".card-image").style.display = "none";
      firstCard.classList.remove("revealed");
      secondCard.classList.remove("revealed");
    }
    resetTurn();
  }, 1000);
};

resetTurn = function () {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
};

checkForWin = function () {
  const matchedCards = document.querySelectorAll(".card.matched");
  if (matchedCards.length === cards.length) {
    showVictoryMessage();
  }
};

showVictoryMessage = function () {
  hideInstructionsButton();
  hideRestartButton();
  const message = document.createElement("div");
  message.classList.add("victory-message");
  message.textContent = "Congratulations! You've won!";

  const victoryImage = document.createElement("img");
  victoryImage.src = "./assets/champagne-glasses-solid.svg";
  victoryImage.alt = "firework explosion";
  victoryImage.width = 250;
  victoryImage.height = 250;
  message.appendChild(victoryImage);

  const playAgainButton = document.createElement("button");
  playAgainButton.classList.add("play-again-button");
  playAgainButton.textContent = "Play Again";
  playAgainButton.addEventListener("click", () => {
    message.remove();
    initializeBoard();
    showInstructionsButton();
    showRestartButton();
  });
  message.appendChild(playAgainButton);
  document.body.appendChild(message);
};

restartGame = function () {
  cards.forEach((card) => {
    card.removeEventListener("click", handleCardClick);
  });
  gameBoard.innerHTML = "";
  cards = [];
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  initializeBoard();
};

const instructionsPopup = document.createElement("div");
instructionsPopup.classList.add("instructions-popup");
instructionsPopup.innerHTML = `
  <div class="instructions-content">
    <span class="close-button"> Close &times</span>
    <br>
    <h2 >Game Instructions</h2>
    <p>Find Coco and all her friends by matching all the pairs of cards to win the game. </p>
    <p>But beware of Collin the hyena who wants to eat all the Coco Pops in the jungle.<br> <br> Goodluck! </p>
  </div>
`;
document.body.appendChild(instructionsPopup);

showInstructions = function () {
  instructionsPopup.style.display = "block";
};

const buttonsContainer = document.createElement("div");
buttonsContainer.classList.add("button-container");

const closeButton = instructionsPopup.querySelector(".close-button");
closeButton.addEventListener("click", () => {
  instructionsPopup.style.display = "none";
});

const restartButton = document.createElement("button");
restartButton.textContent = "Restart Game";
restartButton.classList.add("restart-button");
restartButton.addEventListener("click", restartGame);
buttonsContainer.appendChild(restartButton);

document.body.appendChild(buttonsContainer);

initializeBoard();
