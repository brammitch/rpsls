/**
 * @typedef {('Scissors' | 'Paper' | 'Rock' | 'Lizard' | 'Spock')} Guess
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
      return [2, "Rock"];
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
 * @param {Guess} playerGuess
 * @returns {string}
 */
function playRound(playerGuess) {
  const playerNumber = RPSLS_LOOKUP[playerGuess];
  const [computerNumber, computerGuess] = computerPlay();

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

  if ((result > 0 && result % 2 === 0) || (result < 0 && result % 2 !== 0)) {
    return "You win! " + playerGuess + " beats " + computerGuess + ".";
  } else {
    return "You lose! " + computerGuess + " beats " + playerGuess + ".";
  }
}

/**
 *
 * @param {Guess} guess
 */
function game(guess) {
  let playerScore = 0;
  let computerScore = 0;

  const result = playRound(guess);

  if (result.includes("lose")) {
    computerScore++;
  } else if (result.includes("win")) {
    playerScore++;
  }

  console.log(
    result + " -- Player: " + playerScore + " Computer: " + computerScore
  );

  // if (playerScore > computerScore) {
  //   return "You win the game! You had " + playerScore + " point(s).";
  // } else if (playerScore < computerScore) {
  //   return "You lose the game! You had " + playerScore + " point(s).";
  // } else {
  //   return "It's a tie! You both had " + playerScore + " point(s).";
  // }
}

// const guesses = document.querySelectorAll("div.guess");
// const image = document.querySelector("img[usemap]");
// const mapid = image.getAttribute("usemap").substring(1);
// const imagemap = document.querySelector('map[name="' + mapid + '"]');
// const areas = imagemap.querySelectorAll("area");
// console.log("areas", areas);

function setupImagemap() {
  // adapted from https://stackoverflow.com/a/64711402/4245038
  const image = document.querySelector("img[usemap]");
  const mapid = image.getAttribute("usemap").substr(1);
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
      "<a href='" +
      area.getAttribute("href") +
      "' title='" +
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
const guesses = document.querySelectorAll(".guess");
guesses.forEach((guess) =>
  guess.addEventListener("click", () => game(guess.title))
);
