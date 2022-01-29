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

const STATS = {
  played: 0,
  computerWins: {
    game: 0,
    round: 0,
  },
  playerWins: {
    game: 0,
    round: 0,
  },
  tiedRounds: 0,
  Scissors: {
    computer: 0,
    player: 0,
  },
  Paper: {
    computer: 0,
    player: 0,
  },
  Rock: {
    computer: 0,
    player: 0,
  },
  Lizard: {
    computer: 0,
    player: 0,
  },
  Spock: {
    computer: 0,
    player: 0,
  },
};

/**
 *
 * @param {Guess} playerGuess
 * @param {Guess} computerGuess
 */
function updateStats(playerGuess, computerGuess) {
  STATS.played++;
  STATS[playerGuess].player++;
  STATS[computerGuess].computer++;
}

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

  updateStats(playerGuess, computerGuess);

  playerGuessElement.appendChild(getGuessElement(playerGuess));
  if (playerGuessElement.childElementCount > 6) {
    playerGuessElement.removeChild(playerGuessElement.firstChild);
  }
  computerGuessElement.appendChild(getGuessElement(computerGuess));
  if (computerGuessElement.childElementCount > 6) {
    computerGuessElement.removeChild(computerGuessElement.firstChild);
  }

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
      "You won this round__" + playerGuess + "__" + verb + "__" + computerGuess
    );
  } else {
    return (
      "You lost this round__" +
      computerGuess +
      "__" +
      verb +
      "__" +
      playerGuess +
      "__"
    );
  }
}

/**
 *
 * @param {Guess} guess
 */
function game(guess) {
  if (isGameRunning) {
    const result = playRound(guess);

    if (result.includes("Tie")) {
      resultElement.innerHTML = result;
    } else {
      const [statement, winningGuess, verb, losingGuess] = result.split("__");
      const resultSpan = document.createElement("span");
      resultSpan.style["background-color"] = `var(--${winningGuess})`;

      const winningElement = document.createElement("span");
      winningElement.innerText = winningGuess;
      resultSpan.appendChild(winningElement);

      const verbElement = document.createElement("span");
      verbElement.style.color = "rgba(255, 0, 0, 0.9)";
      verbElement.style["font-weight"] = "bolder";
      verbElement.innerText = ` ${verb} `;
      resultSpan.appendChild(verbElement);

      const losingElement = document.createElement("span");
      losingElement.innerText = `${losingGuess.toLocaleLowerCase()}! `;
      resultSpan.appendChild(losingElement);

      if (result.includes("lost")) {
        computerScore++;
      } else if (result.includes("won")) {
        playerScore++;
      }

      const finalElement = document.createElement("span");
      finalElement.style["font-weight"] = "bolder";
      if (playerScore === 5) {
        finalElement.innerText += "You win the game!";
        resultSpan.appendChild(finalElement);
        endGame();
      } else if (computerScore === 5) {
        finalElement.innerText += "Computer wins the game!";
        resultSpan.appendChild(finalElement);
        endGame();
      } else {
        const statementElement = document.createElement("span");
        statementElement.innerText = `${statement}! `;
        resultSpan.appendChild(statementElement);
      }

      resultElement.innerHTML = null;
      resultElement.appendChild(resultSpan);

      // Update scores
      playerScoreElement.innerHTML = playerScore;
      computerScoreElement.innerHTML = computerScore;
    }
  }
}

function endGame() {
  isGameRunning = false;

  const guessElements = document.querySelectorAll(".guess");
  guessElements.forEach((g) => {
    g.classList.remove("guess");
    g.classList.add("disabled-guess");
  });

  const button = document.createElement("button");
  button.innerText = "Play Again";
  button.classList.add("play");
  button.onclick = () => restartGame(button);
  resultsElement.appendChild(button);
}

function restartGame(button) {
  const guessElements = document.querySelectorAll(".disabled-guess");
  guessElements.forEach((g) => {
    g.classList.remove("disabled-guess");
    g.classList.add("guess");
  });

  resultsElement.removeChild(button);

  // Reset scores
  playerScore = 0;
  playerScoreElement.innerHTML = playerScore;
  computerScore = 0;
  computerScoreElement.innerHTML = computerScore;

  // Clear history/results
  resultElement.innerHTML = null;
  playerGuessElement.innerHTML = null;
  computerGuessElement.innerHTML = null;

  // restartGame
  isGameRunning = true;
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
      "<a href='#image-map' title='" +
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

const resultsElement = document.querySelector(".results");

let playerScore = 0;
const playerScoreElement = document.querySelector("#player-score");
playerScoreElement.innerHTML = playerScore;

let computerScore = 0;
const computerScoreElement = document.querySelector("#computer-score");
computerScoreElement.innerHTML = computerScore;

const resultElement = document.querySelector("#result");
resultElement.innerHTML = "Select your first guess to start.";

const playerGuessElement = document.querySelector("#player-guess");
const computerGuessElement = document.querySelector("#computer-guess");

const guesses = document.querySelectorAll(".guess");
guesses.forEach((guess) =>
  guess.addEventListener("click", () => game(guess.title))
);

// TODO: Implement stats
// const statsButton = document.querySelector(".stats button");
// statsButton.addEventListener("click", () => {
//   const stats = document.querySelector(".stats-display");
//   const isHidden = stats.hidden;
//   stats.hidden = !isHidden;
//   statsButton.classList.toggle("inverse");
//   statsButton.innerText = statsButton.innerText = "Show Stats"
//     ? "Hide Stats"
//     : "Show Stats";
// });
