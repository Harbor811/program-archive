"use strict";
var userQuit = false;
var userHand = "";
var alDustyHand = "";
var numWins = 0;
var numLoses = 0;

// Program's Start
while (true) { // Loop until user quits program
  getUserInput();

  if (userQuit) {
    break;
  }

  getResults();

  var tempAns = prompt("How about another round? > ");
  if (tempAns.toLowerCase().substring(0, 1) == "n") {
    break;
  }
}
// Code to run at the end
console.log("\nYou had a score of " + numWins);
console.log("Al Dusty had a score of " + numLoses);
console.log("");
if (numWins > numLoses) {
  console.log("You Win!");
} else if (numWins < numLoses) {
  console.log("Al Dusty Wins!");
} else {
  console.log("It's a tie!\n\nHow about one final round?");
  getUserInput();
  getResults();
}

// This function will ask the user for rock, paper, scissors, or -1. Will set userHand to the hand, and userQuits to true if the user inputs -1.
function getUserInput() {
  while (true) { // Loop until we get a valid input
    console.log("\nPlease input rock, paper, or scissors! (QUIT: -1)");

    // Checking for real input
    userHand = prompt("Input > ");
    if (userHand.toLowerCase().substring(0, 1) == "r") {
      userHand = "rock";
      break;
    } else if (userHand.toLowerCase().substring(0, 1) == "p") {
      userHand = "paper";
      break;
    } else if (userHand.toLowerCase().substring(0, 1) == "s") {
      userHand = "scissors";
      break;
    } else if (userHand == -1) {
      userQuit = true;
      break;
    } else {
      console.log("\n" + userHand + " is not a valid input.");
    }
  }
}

// Gets the winner with userHand and adds one to numWins or numLoses, printing the results.
// This function can loop itself if there is a tie
function getResults() {
  console.log("\nYou chose " + userHand + "!");
  alDustyHand = getAlsHand();

  var userWon = decideWinner(userHand, alDustyHand);

  if (userWon != undefined) {
    if (userWon) {
      numWins++;
      console.log("You Win!\n");
    } else {
      numLoses++;
      console.log("Al Dusty wins this one!\n");
    }
  } else {
    console.log("It's a tie!\n\nWe need a tiebreaker!");
    getUserInput();
    getResults();
  }
}

// This function will log && return what random result Al Dusty gets (rock, paper, or scissors)
function getAlsHand() {
  var alDuIndex = Math.floor(Math.random() * 3) + 1;
  var retLet = "";

  if (alDuIndex == 1) {
    retLet = "rock";
    console.log("Al Dusty chose rock!");
  } else if (alDuIndex == 2) {
    retLet = "paper";
    console.log("Al Dusty chose paper!");
  } else {
    retLet = "scissors";
    console.log("Al Dusty chose scissors!");
  }
  return retLet;
}

// This function will calculate the winner of 2 hands
// Returns 'true' if hand1 wins.
function decideWinner(hand1, hand2) {
  var userWins = false;
  if (hand1 == hand2) {
    return;
  }

  if (hand1 == "rock") {
    if (hand2 == "scissors") {
      userWins = true;
    }
    return userWins;
  }

  if (hand1 == "paper") {
    if (hand2 == "rock") {
      userWins = true;
    }
    return userWins;
  }

  if (hand1 == "scissors") {
    if (hand2 == "paper") {
      userWins = true;
    }
    return userWins;
  }

  console.log("How did we get here? Line 132.");
}