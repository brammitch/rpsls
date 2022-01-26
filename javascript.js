function computerPlay() {
  const num = Math.floor(Math.random() * 3 + 1);

  switch (num) {
    case 1:
      return "Rock";
    case 2:
      return "Paper";
    case 3:
      return "Scissors";
  }
}

const playerSelection = "Rock";

function playRound(playerSelection, computerSelection) {
  const normalizedPS = playerSelection.toLowerCase();
  const normalizedCS = computerSelection.toLowerCase();

  if (normalizedPS === normalizedCS) {
    const capitalizedGuess =
      playerSelection.charAt(0).toUpperCase() + playerSelection.slice(1);
    return "Tie Game! You both guessed " + capitalizedGuess + ".";
  }

  if (normalizedPS === "rock") {
    if (normalizedCS === "paper") {
      return "You lose! Paper beats Rock.";
    } else {
      return "You win! Rock beats Scissors.";
    }
  } else if (normalizedPS === "paper") {
    if (normalizedCS === "scissors") {
      return "You lose! Scissors beats Paper.";
    } else {
      return "You win! Paper beats Rock.";
    }
  } else if (normalizedPS === "scissors") {
    if (normalizedCS === "rock") {
      return "You lose! Rock beats Scissors.";
    } else {
      return "You win! Scissors beats Paper.";
    }
  }
}

function getPlayerGuess() {
  let guess = prompt("[R]ock, [P]aper, or [S]cissors?");
  guess = guess.toLowerCase();

  if (guess === "r") {
    guess = "rock";
  } else if (guess === "p") {
    guess = "paper";
  } else if (guess === "s") {
    guess = "scissors";
  }

  if (["rock", "paper", "scissors"].includes(guess)) {
    return guess;
  } else {
    alert("Please enter a valid guess.");
    return getPlayerGuess();
  }
}

function game() {
  let playerScore = 0;
  let computerScore = 0;

  for (let i = 0; i < 5; i++) {
    const result = playRound(getPlayerGuess(), computerPlay());

    if (result.includes("lose")) {
      computerScore++;
    } else if (result.includes("win")) {
      playerScore++;
    }

    console.log(
      result + " -- Player: " + playerScore + " Computer: " + computerScore
    );
  }

  if (playerScore > computerScore) {
    return "You win the game! You had " + playerScore + " point(s).";
  } else if (playerScore < computerScore) {
    return "You lose the game! You had " + playerScore + " point(s).";
  } else {
    return "It's a tie! You both had " + playerScore + " point(s).";
  }
}

console.log(game());
