const { readFileSync, promises: fsPromises } = require('fs');
const library = syncReadFile('./words.txt');
const validLets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const posPhrases = syncReadFile('./positivePhrases.txt');
const negPhrases = syncReadFile('./negativePhrases.txt');

var curGuess = [];
var ans;
var answer = [];
var guessedLets = [];
var numGuesses = 0;

var MISSING_CHAR = "*"; //Default: "*"
var RND_MIN_LENGTH = 5; //Default: 5

run(); // I don't know what the actual function is called
function run() {
  console.clear();
  while (true) {
    console.log("Welcome to Hangman!\nPlease enter a word to get started, or..\nType -1 for info!\nType -2 for a randomly generated word!\n");

    ans = prompt("INPUT ");
    ans = ans.toUpperCase();
    
    if (ans != -1) { //If answer is the answer, not info page
      if (ans == -2) { //If answer is asking for random word
        var passes = false;
        while (!passes) {
          var randNo = Math.floor(Math.random() * (library.length));
          ans = library[randNo].toUpperCase();

          if (ans.length >= RND_MIN_LENGTH && ans.indexOf(".") == -1) {
            passes = true;
          }
        }
      }
      buildWord(ans);
      for (var i = 0; i < ans.length; i++) {
        answer[i] = ans.substring(i, i + 1);
      }

      break;
    } else {
      console.clear();
      console.log("Hangman is a guessing game for two or more players.\nOne player thinks of a word, phrase or sentence and the other tries to guess it by suggesting letters within a certain number of guesses.\n");
      prompt("<ENTER");
      console.clear();
    }
  }
  console.clear();
  gameLoop();
}

function gameLoop(){
  numGuesses = 0;
  guessedLets = [];
  
  while (numGuesses < 6) {
    console.log(6 - numGuesses + " guess(es) left!\nGuessed Letters: " + arrToString(guessedLets) + "\n");
    printCurHangman();
    console.log(arrToString(curGuess) + "\n");

    var curLet = prompt("GUESS ");
    curLet = curLet.toUpperCase();

    if (isValid(curLet) && curLet.length == 1 && guessedLets.indexOf(curLet) == -1) {
      if (answer.indexOf(curLet) == -1) {
        //Incorrect guess
        numGuesses++;

        console.clear();
        console.log("Incorrect!\n");
      } else {
        //Correct guess
        while (answer.indexOf(curLet) != -1) { //Catches every letter
          var index = answer.indexOf(curLet);
          answer[index] = " ";
          curGuess[index] = curLet;
        }

        console.clear();
        console.log("Correct!\n");
      }
      guessedLets.push(curLet);
    } else {
      console.clear();
      console.log("This letter is not valid! Please try again.\n");
    }
    if (checkForWin()) {
      break;
    }
  }
  if (!checkForWin()) {
    console.log("You've run out of guesses!\n");
    printCurHangman(2);
    console.log("The word was: " + ans);
  } else {
    console.clear();
    console.log("You got it!\n");
    printCurHangman(1);
    console.log("The word was: " + ans + "\n");
    console.log("You still had " + (6 - numGuesses) + " guess(es) left! Nice work!");
  }
  console.log("\nPlay Again?");
  prompt("<ENTER");
  run();
}

function checkForWin() {
  if (curGuess.indexOf(MISSING_CHAR) == -1) {
    return true;
  }
  return false;
}

function arrToString(arr) {
  var retStr = "";
  for (var i = 0; i < arr.length; i++) {
    retStr += arr[i] + " ";
  }
  return retStr;
}

function isValid(word) {
  for (var i = 0; i < word.length; i++) {
    if (validLets.indexOf(word.substring(i, i + 1)) == -1) {
      return false;
    }
  }
  return true;
}

function buildWord(word) {
  curGuess = [];
  for (var i = 0; i < word.length; i++) {
    if (validLets.indexOf(word.substring(i, i + 1)) == -1) {
      curGuess.push(word.substring(i, i + 1));
    } else {
      curGuess.push(MISSING_CHAR);
    }
  }
}

//Imported, for word library
function syncReadFile(filename) {
  const contents = readFileSync(filename, 'utf-8');
  arr = contents.split(/\r?\n/);
  return arr;
}

function printCurHangman(special){
  if(special != undefined){
    if(special == 1){
      var randNum = Math.floor(Math.random() * (posPhrases.length));
      var randPhrase = posPhrases[randNum];
    }else if(special == 2){
      var randNum = Math.floor(Math.random() * (negPhrases.length));
      var randPhrase = negPhrases[randNum];
    }
  }
  
  console.log("  +---+");
  
  if(special == 1){
    console.log("  |   |");
    console.log("      |");
    console.log("      |       \"" + randPhrase + "\"");
    console.log("      |       \\O/");
    console.log("      |        |");
    console.log("=========     / \\ \n");
    return;
  }else if(special == 2){
    console.log("  |   |  \"" + randPhrase + "\"");
  }else{
    
    console.log("  |   |");
  }

  if(numGuesses > 0){
    console.log("  O   |");
  }else{
    console.log("      |");
  }
  
  if(numGuesses > 1){
    if(numGuesses < 3){
      console.log("  |   |");
    }else if(numGuesses < 4){
      console.log(" /|   |");
    }else if(numGuesses >= 4){
      console.log(" /|\\  |");
    }
  }else{
    console.log("      |");
  }
  
  if(numGuesses > 4){
    if(numGuesses == 5){
      console.log(" /    |");
    }else{
      console.log(" / \\  |");
    }
  }else{
    console.log("      |");
  }

  console.log("      |");
  console.log("=========\n");
}