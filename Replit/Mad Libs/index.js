"use strict";
const { readFileSync, promises: fsPromises } = require('fs');
const fs = require('fs'); //for "saving"
const madLibTemplates = [];
//for auto-generating
const genNouns = syncReadFile('./nouns.txt');
const genAdjs = syncReadFile('./adjectives.txt');
const genPNouns = syncReadFile('./pNouns.txt');
const genVerbs = syncReadFile('./verbs.txt');

var final = "";
compileLibs(); // to stay somewhat organized I guess
start();

function compileLibs() { // I would minimize this
  //[a]: adjective
  //[n]: noun
  //[v]: verb
  //[m]: noun's
  //[s]: specials
  var madlib = {
    story: "",
    summary: "",
    code: 0,
    numAdj: 0,
    numNouns: 0,
    numVerbs: 0,
    numPNouns: 0,
    numSpecial: 0,
    special: null,
  }
  var madlib = {
    story: "Pizza was invented by a [a] [s] chef named [s]. To make a pizza, you need to take a lump of [n], and make a thin, round [a] [n]. Then you cover it with [a] sauce, [a] cheese, and fresh chopped [m]. Next you have to bake it in a very hot [n]. When it is done, cut it into [s] [s]s. Some kids like [s] pizza the best, but my favorite is the [s] pizza. If I could, I would eat pizza [s] times a day!",
    summary: "A short passage about the history and making of pizza!",
    code: 0,
    numAdj: 4,
    numNouns: 3,
    numVerbs: 0,
    numPNouns: 1,
    numSpecial: 7,
    special: "a nationality:a person's name:a number:a shape:a food:a different food:a number"
  }
  madLibTemplates.push(madlib);
  var madlib = {
    story: "Star Wars is a [a] [n] of [a] versus evil in a [s] far far away. There are [a] battles between [a] [s]s in [a] space and [a] duels with [m] called [a]sabers. [m] called 'droids' are helpers and [m] to the heros. A [a] power called 'The [n]' [v]'s people to do [a] things, like [v] [m]. The Jedi [s] use The Force for the [a] side and the Sith [v]s it for the [a] side.",
    summary: "A very wordy explanation of the movie series Star Wars!",
    code: 1,
    numAdj: 11,
    numNouns: 2,
    numVerbs: 3,
    numPNouns: 4,
    numSpecial: 3,
    special: "a place:a vehicle:a job, plural",
  }
  madLibTemplates.push(madlib);

  var madlib = {
    story: "Today, every student has a computer small enough to fit into his [n]. He can solve any math problem by simply pushing the computer's little [m]. Computers can add, multiply, divide, and [v]. They can also [v] better than a human. Some computers are [s]. Others have a(n) [a] screen that shows all kinds of [m] and [a] figures.",
    summary: "A short story about computers, very simple- good first madlib!",
    code: 2,
    numAdj: 2,
    numNouns: 1,
    numVerbs: 2,
    numPNouns: 2,
    numSpecial: 1,
    special: "a part of the body, plural",
  }
  madLibTemplates.push(madlib);
  var madlib = {
    story: "I am a payroll professional. I have worked in payroll for [s] years. People think payroll is [a] and you just push a [n] and everyone gets paid. Isn't that [a]?\nI start every day with a hot cup of [a] [n]. It makes me feel [a]. Then, I give my pet [n] a big [n] and [v] to the office [s] miles away.\nThis morning, I helped one [a] [n] solve a pay issue. My company is completing an acquisition and soon I'll be paying employees in [s].\nWhen I heard that, I shouted, \"[s]\"! I am also working with my [n] on a very [a] payroll implementation.\nI am proud I pay employees [s] with [s]% accuracy. I love payroll with all my [s]!",
    summary: "A long story about a payroll professional.",
    code: 3,
    numAdj: 6,
    numNouns: 6,
    numVerbs: 1,
    numPNouns: 0,
    numSpecial: 7,
    special: "a number:another number:a location:an exclamation:an adverb:yet another number:a part of the body",
  }
  madLibTemplates.push(madlib);

  var madlib = {
    story: "Winter sports are so much [a]! There's skiing, where you put two [m] on your feet and [v] down a steep [n] really [s]. You can also do cross-country [s] or snow [s] if you don't live near [a] [m]. Snowboarding is similar, but you stand on one [n] and [v] downhill. Another fun downhill sport is sledding or tubing, where you ride a [a] [n] or an air-filled [n] downhill!",
    summary: "A decent-lengthed explanation of winter sports.",
    code: 4,
    numAdj: 3,
    numNouns: 4,
    numVerbs: 2,
    numPNouns: 2,
    numSpecial: 3,
    special: "an adverb:a verb, ending in \"ing\":an article of clothing",
  }
  madLibTemplates.push(madlib);

  var madlib = {
    story: "Our school cafeteria has really [a] food. Just thinking about it makes my stomach [v]. The spaghetti is [a] and tastes like [n]. One day, I swear one of my meatballs started to [v]! The turkey tacos are totally [a] and look kind of like old [n]. My friend Dana actually likes the meatloaf, even though it's [a] and [a]. I call it \"[a] meatloaf\" and think it's really made out of [m]. My dad said he'd make my lunches, but the first day, he made me a sandwich out of [n] and peanut butter! I think I'd rather take my chances with the cafeteria!",
    summary: "A a somewhat lengthy cafeteria anecdote, perfect for auto generated madlibs!",
    code: 5,
    numAdj: 6,
    numNouns: 3,
    numVerbs: 2,
    numPNouns: 1,
    numSpecial: 0,
    special: null,
  }
  madLibTemplates.push(madlib);

  var madlib = {
    story: "No Christmas season can be really [a] unless you have a(n) [a] tree in your [s]. If you live in a city, you will see many vacant [m] filled with hundreds of [m] for sale. If you live in the country, you can get your own [n] right out of the forest. Go out with a(n) [n] and [n], and when you see a(n) [a] tree you like, you can dig it up and plant it in a(n) [n]. Then you can use it for [s] years. To make sure your tree is [a], shake the branches and see if the [m] fall off onto the [n]. And make sure the tree is very [a]. Nothing looks worse than a(n) [a] tree. Just follow these directions and you can have a perfectly beautiful [n] in your front room for weeks. Remember, poems and Mad Libs are made by fools like [s], but only [s] can make a tree.",
    summary: "A very long Christmas themed mad lib about trees.",
    code: 6,
    numAdj: 6,
    numNouns: 6,
    numVerbs: 0,
    numPNouns: 3,
    numSpecial: 4,
    special: "a room:a number:a person in the room:another person in the room",
  }
  madLibTemplates.push(madlib);
  
}

function start() {
  console.log("Welcome to Madlibs, Javascript edition!\nIf you're new, type 'help' for a list of commands!\n");
  while (true) { //Game looooop!
    var ans = prompt("");
    ans = ans.toLowerCase().trim() + " ";
    console.log();

    if (ans == "exit " || ans == "quit " || ans == "stop ") {
      break;
    } else if (ans == "help ") {
      console.log(">help\n  -Will print a list of functions that you can use");
      console.log(">play \"code\"\n  *Do not include quotes when calling this function\n  -Will choose a madlib template with appropriate \"code\" and begin to fill it out!\n    *use >list for specific madlib template codes\n  -If it can't recognize code or code is blank, it will load a random template.");
      console.log(">list\n  -Will list madlibs templates with their codes and a summary of their story.");
      console.log(">save\n  -Will save most recent complete madlibs to the \"final.txt\" file!\n  -This function will be prompted after finishing a madlib, but it can still be called if you accidentally put no.\n  -You can save the file, or just copy the text inside to share with your friends!");
      console.log(">exit (quit) (stop)\n  -Will exit the game.");
      console.log(">generate \"code\"\n  *Do not include quotes when calling this function\n  -Will try to auto-generate a madlib with random words!\n    *Note: unique questions will still be asked, only filling in things like verbs, nouns, adjectives, ect.");
      console.log(">clear (cls)\n  -Will completely clear the console.");
    } else if (ans.substring(0, 5) === ("play ")) {
      var code = parseInt(ans.substring(5));
      if (code != null && code >= 0 && code < madLibTemplates.length) {
        play(code);
      } else {
        play();
      }
    } else if (ans == "list ") {
      list();
    } else if (ans == "save ") {
      if (final != "") {
        save();
      } else {
        console.log("There is nothing to save!");
      }
    } else if (ans.trim().substring(0,9) === "generate ") {
      var code = parseInt(ans.substring(9));
      if(code != null && code >= 0 && code < madLibTemplates.length){
        generate(code);
      }else{
        generate();
      }
    }else if(ans == "clear " || ans == "cls "){
      console.clear();
    }else {
      console.log("Sorry, the command \"" + ans.trimEnd() + "\" does not exist!");
      console.log("If you're not sure what to type, put in \"help\" for a list of commands!");
    }

    console.log();
  }
  console.clear();
  console.log("See you next time!");
}

function list() {
  for (var i = 0; i < madLibTemplates.length; i++) {
    var cur = madLibTemplates[i];
    console.log("Code " + cur.code + ": " + cur.summary);
  }
}

function play(code) {
  final = "";
  console.clear();
  if (code == null) {
    code = Math.floor(Math.random() * madLibTemplates.length);
  }
  var cur = madLibTemplates[code];
  console.log("!IMPORTANT!:: Seperate your different answers with a comma and a space!!\nExample: >ran, house, Hawaii\n");

  var userAdjs = [];
  if (cur.numAdj > 0) {
    console.log("Please input " + cur.numAdj + " adjective(s)");
    var ans = prompt("> ");
    userAdjs = ans.split(", ");
  }

  var userNouns = [];
  if (cur.numNouns > 0) {
    console.log("Please input " + cur.numNouns + " noun(s)");
    var ans = prompt("> ");
    userNouns = ans.split(", ");
  }

  var userVerbs = [];
  if (cur.numVerbs > 0) {
    console.log("Please input " + cur.numVerbs + " verb(s)");
    var ans = prompt("> ");
    userVerbs = ans.split(", ");
  }

  var userPNouns = [];
  if (cur.numPNouns > 0) {
    console.log("Please input " + cur.numPNouns + " plural noun(s)");
    var ans = prompt("> ");
    userPNouns = ans.split(", ");
  }

  var userSpecials = [];
  if (cur.numSpecial > 0) {
    var spec = cur.special;
    for (var i = 0; i < cur.numSpecial; i++) {
      var endInd = spec.indexOf(":");
      if (endInd === -1) {
        var curSpec = spec;
      } else {
        var curSpec = spec.substring(0, endInd);
      }

      console.log("Please input " + curSpec);
      spec = spec.substring(endInd + 1);
      var ans = prompt("> ");
      userSpecials.push(ans);
    }
  }

  if(cur.numAdj != userAdjs.length){
    reset("adjective");
  }else if(cur.numNouns > userNouns.length){
    reset("noun");
  }else if(cur.numVerbs > userVerbs.length){
    reset("verb");
  }else if(cur.numPNouns > userPNouns.length){
    reset("plural noun");
  }else if(cur.numSpecial > userSpecials.length){
    console.log("How did we get here?");
    prompt();
    play(code);
  }else{
    //Madlib compiler code
    for (var i = 0; i < cur.story.length; i++) {
      if (cur.story.substring(i, i+1) == "[") {
        var letter = cur.story[i + 1];
        
        if (letter == "a") {
          final += userAdjs.shift();
        }
        if (letter == "n") {
          final += userNouns.shift();
        }
        if (letter == "v") {
          final += userVerbs.shift();
        }
        if (letter == "m") {
          final += userPNouns.shift();
        }
        if (letter == "s") {
          final += userSpecials.shift();
        }
        
        i += 2;
      } else {
        final += cur.story[i];
      }
    }
  }
  
  console.clear();
  console.log("Here is your completed MadLib!\n\n" + final);
  console.log("\n\nWould you like to save this to final.txt?");
  var ans = prompt("y/n>");
  if(ans.substring(0, 1).toLowerCase() == "y"){
    save();
  }

  function reset(name){
    console.log("Incorrect amount of " + name + "s! Resetting...");
    prompt("Press enter to continue ");
    play(code);
  }
}

function save() {
  fs.writeFileSync("final.txt", final);
  console.log("Madlib successfully saved to \"final.txt\"!");
}






function generate(code){
  console.clear();
  final = "";
  if (code == null) {
    code = Math.floor(Math.random() * madLibTemplates.length);
  }
  var cur = madLibTemplates[code];
  console.log("!IMPORTANT!:: Seperate your different answers with a comma and a space!!\nExample: >ran, house, Hawaii\n");

  var userAdjs = [];
  for (var i = 0; i<cur.numAdj; i++) {
    userAdjs.push(genAdjs[Math.floor(Math.random() * genAdjs.length)]);
  }

  var userNouns = [];
  for(var i = 0; i < cur.numNouns; i++){
    userNouns.push(genNouns[Math.floor(Math.random() * genNouns.length)]);
  }

  var userVerbs = [];
  for (var i=0; i<cur.numVerbs; i++) {
    userVerbs.push(genVerbs[Math.floor(Math.random() * genVerbs.length)]);
  }

  var userPNouns = [];
  for (var i=0; i<cur.numPNouns; i++) {
    userPNouns.push(genPNouns[Math.floor(Math.random() * genPNouns.length)]);
  }

  var userSpecials = [];
  if (cur.numSpecial > 0) {
    var spec = cur.special;
    for (var i = 0; i < cur.numSpecial; i++) {
      var endInd = spec.indexOf(":");
      if (endInd === -1) {
        var curSpec = spec;
      } else {
        var curSpec = spec.substring(0, endInd);
      }

      console.log("Please input " + curSpec);
      spec = spec.substring(endInd + 1);
      var ans = prompt("> ");
      userSpecials.push(ans);
    }
  }

  //Madlib compiler code
  for (var i = 0; i < cur.story.length; i++) {
    if (cur.story.substring(i, i+1) == "[") {
      var letter = cur.story[i + 1];
      
      if (letter == "a") {
        final += userAdjs.shift();
      }
      if (letter == "n") {
        final += userNouns.shift();
      }
      if (letter == "v") {
        final += userVerbs.shift();
      }
      if (letter == "m") {
        final += userPNouns.shift();
      }
      if (letter == "s") {
        final += userSpecials.shift();
      }
      
      i += 2;
    } else {
      final += cur.story[i];
    }
  }
  console.clear();
  console.log("Here is your completed MadLib!\n\n" + final);
  console.log("\n\nWould you like to save this to final.txt?");
  var ans = prompt("y/n>");
  if(ans.substring(0, 1).toLowerCase() == "y"){
    save();
  }
}

function syncReadFile(filename) {
  const contents = readFileSync(filename, 'utf-8');
  var arr = contents.split(/\r?\n/);
  return arr;
}

//Funny madlibs I made

//Star Wars is a troubled trousers of giddy versus evil in a bean far far away. There are kind battles between funny golf carts in petite space and unsightly duels with pianos called nutritioussabers. loaves called 'droids' are helpers and rodeos to the heros. A zealous power called 'The handle' want's people to do creepy things, like work boats. The Jedi construction workers use The Force for the perfect side and the Sith feels it for the arrogant side.

//I am a payroll professional. I have worked in payroll for 10 years. People think payroll is wobbly and you just push a side and everyone gets paid. Isn't that floppy? I start every day with a hot cup of fluttering owl. It makes me feel immense. Then, I give my pet mascara a big bathroom and limp to the office 500 miles away. This morning, I helped one mysterious freckle solve a pay issue. My company is completing an acquisition and soon I'll be paying employees in the bermuda triangle. When I heard that, I shouted, "MAAAN GET DAT PEPPUH OFF DER DAS JUS TOO MUCH DAWGGOWN PEPPUH"! I am also working with my spot on a very bright payroll implementation. I am proud I pay employees quietly with 10% accuracy. I love payroll with all my balls!