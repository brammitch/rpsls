/**
 * @typedef {('Scissors' | 'Paper' | 'Rock' | 'Lizard' | 'Spock')} Guess
 * @typedef {('Win' | 'Lose' | 'Tie')} Result
 */

const RPSLS_LOOKUP = {
  Scissors: 1,
  Paper: 2,
  Rock: 3,
  Lizard: 4,
  Spock: 5,
};

/**
 *
 * @returns {[number, Guess]}
 */
function computerPlay() {
  const num = Math.floor(Math.random() * 5 + 1);

  switch (num) {
    case 1:
      return [1, "Scissors"];
    case 2:
      return [2, "Paper"];
    case 3:
      return [3, "Rock"];
    case 4:
      return [4, "Lizard"];
    case 5:
      return [5, "Spock"];
  }
}

/**
 *
 * @param {Guess} guessA
 * @param {Guess} guessB
 */
function getVerb(guessA, guessB) {
  let verb = "";

  switch (guessA) {
    case "Scissors":
      switch (guessB) {
        case "Lizard":
          verb = "decapitates";
          break;
        case "Paper":
          verb = "cuts";
          break;
        case "Rock":
          verb = "crushes";
          break;
        case "Spock":
          verb = "smashes";
          break;
      }
      break;
    case "Paper":
      switch (guessB) {
        case "Lizard":
          verb = "eats";
          break;
        case "Rock":
          verb = "covers";
          break;
        case "Spock":
          verb = "disproves";
          break;
      }
      break;
    case "Rock":
      switch (guessB) {
        case "Lizard":
          verb = "crushes";
          break;
        case "Spock":
          verb = "vaporizes";
          break;
      }
      break;
    case "Lizard":
      switch (guessB) {
        case "Spock":
          verb = "poisons";
          break;
      }
      break;
  }

  return verb;
}

/**
 *
 * @param {Guess} guess
 */
function getGuessElement(guess) {
  const guessImageContainer = document.createElement("span");
  guessImageContainer.classList.add("guess-image-container");
  const guessImage = document.createElement("img");
  guessImage.src = `img/${guess.toLocaleLowerCase()}_sm.png`;
  guessImage.height = "40";
  guessImage.width = "40";
  guessImageContainer.appendChild(guessImage);

  return guessImageContainer;
}

/**
 *
 * @param {Guess} playerGuess
 */
function playRound(playerGuess) {
  const playerNumber = RPSLS_LOOKUP[playerGuess];
  const [computerNumber, computerGuess] = computerPlay();

  playerGuessElement.appendChild(getGuessElement(playerGuess));
  computerGuessElement.appendChild(getGuessElement(computerGuess));

  /*
    Calculate playerNumber - computerNumber
    Tie: 0
    Player wins with positive even numbers and negative odd: -3, -1, 2, 4
    Computer wins with positive odd numbers and negative even: -4, -2, 1, 3
  */

  const result = playerNumber - computerNumber;
  if (result === 0) {
    return "Tie Game! You both guessed " + playerGuess + ".";
  }

  let verb = getVerb(playerGuess, computerGuess);
  if (!verb) {
    verb = getVerb(computerGuess, playerGuess);
  }

  if ((result > 0 && result % 2 === 0) || (result < 0 && result % 2 !== 0)) {
    return (
      "You won this round! " +
      playerGuess +
      " " +
      verb +
      " " +
      computerGuess +
      "."
    );
  } else {
    return (
      "You lost this round! " +
      computerGuess +
      " " +
      verb +
      " " +
      playerGuess +
      "."
    );
  }
}

/**
 *
 * @param {Guess} guess
 */
function game(guess) {
  if (isGameRunning) {
    let result = playRound(guess);

    if (result.includes("lost")) {
      computerScore++;
    } else if (result.includes("won")) {
      playerScore++;
    }

    if (playerScore === 5) {
      result += " You win the game!";
      endGame();
    } else if (computerScore === 5) {
      result += " Computer wins the game!";
      endGame();
    }

    // Update scores
    playerScoreElement.innerHTML = playerScore;
    computerScoreElement.innerHTML = computerScore;
    resultElement.innerHTML = result;
  }
}

function endGame() {
  isGameRunning = false;

  const guessElements = document.querySelectorAll(".guess");
  guessElements.forEach((g) => {
    g.classList.remove("guess");
    g.classList.add("disabled-guess");
  });

  const resultsElement = document.querySelector(".results");
  const button = document.createElement("button");
  button.innerHTML = "Play Again";
  button.classList.add("play");
  button.onclick = () => {
    location.reload();
  };
  resultsElement.appendChild(button);
}

function setupImagemap() {
  // Adapted from https://stackoverflow.com/a/64711402/4245038
  const image = document.querySelector("img[usemap]");
  const mapid = image.getAttribute("usemap").substring(1);
  const imagemap = document.querySelector('map[name="' + mapid + '"]');
  const areas = imagemap.querySelectorAll("area");

  image.removeAttribute("usemap");
  imagemap.remove();

  // create wrapper container
  const wrapper = document.createElement("div");
  wrapper.classList.add("imagemap");
  image.parentNode.insertBefore(wrapper, image);
  wrapper.appendChild(image);

  areas.forEach((area) => {
    const coords = area.getAttribute("coords").split(",");
    const numberCoords = coords.map(Number);
    const [x, y, radius] = numberCoords;
    const left = x - radius;
    const top = y - radius;
    const diameter = radius * 2;

    wrapper.innerHTML +=
      "<a href='#' title='" +
      area.getAttribute("title") +
      "' class='guess' style='left: " +
      left +
      "px; top: " +
      top +
      "px; width: " +
      diameter +
      "px; height: " +
      diameter +
      "px;'></a>";
  });
}

// Game starts here
setupImagemap();
let isGameRunning = true;

let playerScore = 0;
const playerScoreElement = document.querySelector("#player-score");
playerScoreElement.innerHTML = playerScore;

let computerScore = 0;
const computerScoreElement = document.querySelector("#computer-score");
computerScoreElement.innerHTML = computerScore;

let result = "";
const resultElement = document.querySelector("#result");
resultElement.innerHTML = " ";

const playerGuessElement = document.querySelector("#player-guess");
const computerGuessElement = document.querySelector("#computer-guess");

const guesses = document.querySelectorAll(".guess");
guesses.forEach((guess) =>
  guess.addEventListener("click", () => game(guess.title))
);
