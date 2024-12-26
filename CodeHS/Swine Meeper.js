// This code is indended to be run in the CodeHS JS Graphics Environment

// Minesweeper. Permanently zoomed in

// Global Variables
var SCREEN = "ERROR 1";
var GAMEMODE = "";
var SQUARES = [];
var MINES = [];
var NUMS = [];
var GAME_GRID = [];
var COL = {
    bg: "#C0C0C0",
    border: "#808080",
    one: "#0001FD",
    two: "#017E00",
    three: "#FE0000",
    four: "#010180",
    five: "#820102",
    six: "#008080",
    seven: "#000000",
    eight: "#808080"
};

var IMG = {
    mBg: "",
    titleTxt: "",
    easyB: "",
    medB: "",
    hardB: "",
    impB: "",
    playB: "",

    square: "",
    num1: "",
    num2: "",
    num3: "",
    num4: "",
    num5: "",
    num6: "",
    num7: "",
    num8: "",
    flag: "https://codehs.com/uploads/2a4bd30bda7f4750fbecdd101b3e5cf1", // get better
    mine: "https://codehs.com/uploads/4cdae2719ca803aa26ce1008c2fcc683" // get better
};

var OPEN_SQS = [];
var FLAGS = [];
var GAME_OVER;

// Global others
var numSquaresPer = 9;  // 9
var numMines = 10;      // 10
var blocksBroken = 0;
var flagKey;
var winKey = 0; // For animating win screen
var time = 0; // For total time taken

// Mouse globals
var mXPos;
var mYPos;
var mInd;


// Resets all global variables, like block count, arrays, mouse Pos'
function resetGlobalVars(){
    OPEN_SQS = [];
    FLAGS = [];
    GAME_OVER = false;
    
    blocksBroken = 0;
    flagKey = 0;
    winKey = 0;
    
    mXPos = 0;
    mYPos = 0;
    mInd = 0;
}

function start(){
    loadMenu();
}

function stepTimer(){
    time += 0.1;
}

function loadMenu(){
    SCREEN = "MENU";
    setBackgroundColor(Color.gray);
    
    // Declare variables
    var menuTxt = new WebImage(IMG["titleTxt"]);
    
    var playButton = new WebImage(IMG["playB"]);
    
    
    gameStart(); // To be called to start game
}

function gameStart(){
    
    SCREEN = "GAME";
    resetGlobalVars();
    
    
    numSquaresPer = parseInt(readLine("numSquaresPer (9): "));
    numMines = parseInt(readLine("numMines (10): "));
    
    // TEMPORARY - GET THE KEY
    flagKey = readLine("flagKey (\"f\"): ").toLowerCase();
    if(flagKey.toLowerCase() == "space" || (flagKey.length >= 2 && flagKey.substring(0,2).toLowerCase() == "sp")){
        flagKey = "arrowleft";
    }else if(flagKey == ""){
        flagKey = "f";
    }
    
    
    setSize(numSquaresPer * 40, numSquaresPer * 40 + 40);
    
    // Generates start-of-game items, all in arrays
    generateGridSquares();
    generateMines();
    generateNumbers();
    assembleGameGrid();

    // Drawing game
    drawBgGrid();
    dbDrawNumbers();
    drawMines(IMG["mine"]);
    drawSquares();
    
    breakFirst();

    mouseMoveMethod(mouseMovedG);
    mouseClickMethod(mouseClickedG);
    keyDownMethod(keyDown);
    
    setTimer(stepTimer, 87.127);
}

// In-game methods
function mouseMovedG(e){
    if(e.getX() > getWidth() || e.getX() < 0 ||
       e.getY() > getHeight() || e.getY() < 0){
        return;
    }
    mXPos = Math.floor(e.getX() / (getWidth() / numSquaresPer));
    mYPos = Math.floor(e.getY() / ((getHeight() - 40) / numSquaresPer));
    mInd = (mYPos * numSquaresPer) + (mXPos);
}

function mouseClickedG(){
    var cur = SQUARES[mInd];
    //var eSquare = getElementAt(e.getX(), e.getY());

    if(!GAME_OVER && isSQUARE(cur) && !flagIsAt(mInd)){
        if(GAME_GRID[mInd] > -1){
            GAME_OVER = true;
            drawMines(IMG["mine"]);
            println("You Lose!");
        }else{
            if(GAME_GRID[mInd].getText() == ""){
                // empty square
                clearAt(mInd);
            }else{
                // GAME_GRID[mInd].getText();
                if(cur.alive){
                    remove(cur);
                    blocksBroken++;
                    checkForWin();
                }
            }
        }
    }
}

// Maybe temp function, breaks first empty tile in a game
function breakFirst(){
    for(var i=0; i<SQUARES.length; i++){
        if(GAME_GRID[i].label == ""){
            mInd = i;
            mouseClickedG();
            return;
        }
    }
    println("No empty squares!");
    checkForWin();
}

function isSQUARE(obj){
    var num = SQUARES.indexOf(obj);
    if(num >= 0){
        return true;
    }
    return false;
}

function keyDown(e){
    if(e.key.toLowerCase() == flagKey && !GAME_OVER && mInd < SQUARES.length){
        for(var i=0; i<FLAGS.length; i++){
            if(FLAGS[i].index === mInd){
                remove(FLAGS[i].image);
                FLAGS.splice(i, 1);
                return;
            }
        }
        if(SQUARES[mInd].alive){
            var img = new WebImage(IMG["flag"]);
            
            img.setSize(30,30);
            img.setPosition(mXPos * 40 + 5, mYPos * 40 + 5);
            
            add(img);
            
            var flag = {
                index: mInd,
                xPos: mXPos,
                yPos: mYPos,
                image: img
            }
            
            FLAGS.push(flag);
        }
    }
    if(e.key == "e" && !GAME_OVER && !SQUARES[mInd].alive){
        flagsAround(mInd);
    }
}

function flagIsAt(ind){
    for(var i=0; i<FLAGS.length; i++){
        if(FLAGS[i].index == ind){
            return true;
        }
    }
    return false;
}

function clearAt(index){
    // If it's against an edge, gonna be problems
    // Fix 'em
    var limit = "";
    
    if(index % numSquaresPer == numSquaresPer -1){
        limit = "right";
    }else if(index % numSquaresPer == 0){
        limit = "left";
    }
    
    // Looping and removing relevant tiles
    for(var i=0; i<9; i++){
        var rowToDel;
        if(i < 3){
            rowToDel = numSquaresPer;
        }else if(i > 5){
            rowToDel = -numSquaresPer;
        }else{
            rowToDel = 0;
        }
        
        var sideMods = (i % 3) - 1;
        
        if((limit == "right" && sideMods == 1) || 
           (limit == "left" && sideMods == -1)){
            sideMods = 0;
        }
        
        var newInd = index + sideMods + rowToDel;
        
        if(OPEN_SQS.indexOf(newInd) == -1 && !flagIsAt(newInd)){
            OPEN_SQS.push(newInd);
            if(GAME_GRID[newInd] != undefined &&
              newInd != index &&
              GAME_GRID[newInd]["label"] == "" &&
              !flagIsAt(newInd)){
                clearAt(newInd);
            }
            if(newInd >= 0 && newInd < SQUARES.length && SQUARES[newInd].alive){
                
                // add mine check here !!!
                
                if(GAME_GRID[newInd] > -1){
                    GAME_OVER = true;
                    drawMines(IMG["mine"]);
                    println("You Lose!");
                }else{
                    remove(SQUARES[newInd]);
                    blocksBroken++;
                    checkForWin();
                }
            }
        }
    }
    //println("clearAt finished for index " + index); // for db
}

function flagsAround(ind){
    var flags = 0;
    var limit = "";
    var whiteListed = [];
    
    
    if(ind % numSquaresPer == numSquaresPer - 1){
        limit = "right";
    }else if(ind % numSquaresPer == 0){
        limit = "left";
    }
    
    for(var i = 0; i < 9; i++){
        var row;
        if(i < 3){
            row = numSquaresPer;
        }else if(i > 5){
            row = -numSquaresPer;
        }else{
            row = 0;
        }
        
        var sides = (i % 3) - 1;
        
        if((limit == "right" && sides == 1) ||
           (limit == "left" && sides == -1)){
            sides = 0;
        }
        
        var newInd = ind + sides + row;
        
        //println("flag check newInd: " + newInd); // for db
        
        if((newInd >=0 && newInd < numSquaresPer * numSquaresPer) && flagIsAt(newInd) && whiteListed.indexOf(newInd) == -1){
            flags++;
            whiteListed.push(newInd);
        }
    }
    if(flags == GAME_GRID[ind].label){
        clearAt(ind);
    }
    
}

function checkForWin(){
    if(blocksBroken >= SQUARES.length - MINES.length){
        stopTimer(stepTimer);
        time = (Math.floor(time * 100))/100;
        if(time >= 60){
            var minute = Math.floor(time / 60);
            time = minute + ":" + (time - (minute * 60));
        }
        if(numMines >= 10){
            GAME_OVER = true;
            drawMines(IMG["flag"]);
            setTimer(startWin, 550);
        }else{
            winKey = Infinity;
            setTimer(startWin, 0);
        }
    }else{
        return;
    }
    
    function startWin(){
        winKey++;
        if(winKey < 7){
            var randPhrases = ["WOW!", "OMG!", "NO WAY", "MLG", "YOOOO", "WINNER?", "AYO", "PSYCHO", "HE DID IT", "THE THING", "GAMING", "WARLORD", "HE CLICKED", "NO SHOT", "GAMER", "WHAT A GUY", "360 NO MINES", "SWEPT MINES", "BEAT THE GAME", "ALBERT", "EINSTEIN", "VACATION", "SEE THOSE GREEN SQUARES?", "YOU CHEATED"];
            var randFont = Randomizer.nextInt(10, 30) + "pt Comic Sans MS";
            var randTxt = new Text(randPhrases[Randomizer.nextInt(0,randPhrases.length - 1)], randFont);
            
            randTxt.setPosition(Randomizer.nextInt(0, getWidth() - randTxt.getWidth()), Randomizer.nextInt(randTxt.getHeight(), getHeight()));
            randTxt.setRotation(Randomizer.nextInt(-30, 30));
            add(randTxt);
        } else{
            stopTimer(startWin);
            setSize(400,400);
            removeAll();
            
            var vacation = new Audio("https://codehs.com/uploads/48d12e540d0631e4d051020fb2d2a90d");
            var winner = new Text("You Win!!!", "25pt Comic Sans MS");
            
            var score = numSquaresPer + "x" + numSquaresPer + " Grid, " + numMines + " Mine(s)!";
            var scoreTxt = new Text(score, "15pt Comic Sans MS");
            
            var timerTxt = new Text(time + "s", "20pt Comic Sans MS");
            
            winner.setPosition(getWidth()/2 - winner.getWidth()/2, getHeight()/2 - winner.getHeight());
            winner.setColor(Color.white);
            add(winner);
        
            scoreTxt.setPosition(getWidth()/2 - scoreTxt.getWidth()/2, getHeight()/2);
            scoreTxt.setColor(Color.white);
            add(scoreTxt);
            
            timerTxt.setPosition(getWidth()/2 - timerTxt.getWidth()/2, getHeight()/1.7);
            timerTxt.setColor(Color.white);
            add(timerTxt);
            
            vacation.loop = true;
            vacation.play();
            
            setTimer(tempWinner, 550);
        }
        
        function tempWinner(){
            setBackgroundColor(Randomizer.nextColor());
        }
    }
}

// Pre-game methods
function generateMines(){
    for(var i=0; i<numMines; i++){
        while(true){
            var mineNo = Randomizer.nextInt(0,SQUARES.length - 1);
            if(notRepeat(mineNo)){
                MINES.push(mineNo);
                break;
            }
        }
    }
    
    // This function loops over every object of MINES[] and returns false if it equals 'num'
    function notRepeat(num){
        for(var i=0; i<MINES.length; i++){
            if(MINES[i] == num){
                return false;
            }
        }
        return true;
    }
}

function generateNumbers(){
    for(var i=0; i<SQUARES.length; i++){
        
        var no = new Text("None", "15pt Arial");
        var bmbCt = -1;
        
        
        if(MINES.indexOf(i) == -1){
            bmbCt++;
            
            // Right sides
            if(i % numSquaresPer != numSquaresPer - 1){
                if(MINES.indexOf(i + 1) != -1){ // R
                    bmbCt++;
                }
                if(MINES.indexOf(i - numSquaresPer + 1) != -1){ //TR
                    bmbCt++;
                }
                if(MINES.indexOf(i + numSquaresPer + 1) != -1){ //BR
                    bmbCt++;
                }
            }
            
            // Left Sides
            if(i % numSquaresPer != 0){
                if(MINES.indexOf(i - 1) != -1){ // L
                    bmbCt++;
                }
                if(MINES.indexOf(i - numSquaresPer - 1) != -1){ // TL
                    bmbCt++;
                }
                if(MINES.indexOf(i + numSquaresPer - 1) != -1){ // BL
                    bmbCt++;
                }
            }
            
            // Top
            if(i - numSquaresPer /* -1? */ >= 0 && MINES.indexOf(i - numSquaresPer) != -1){ // T
                bmbCt++;
            }
            
            // Bottom
            if(i + numSquaresPer <= Math.pow(numSquaresPer, 2) && MINES.indexOf(i + numSquaresPer) != -1){ // B
                bmbCt++;
            }
        }
        
        if(bmbCt == 0){
            bmbCt = "";
        }
        if(bmbCt == 1){
            no.setColor(COL["one"]);
        }
        if(bmbCt == 2){
            no.setColor(COL["two"]);
        }
        if(bmbCt == 3){
            no.setColor(COL["three"]);
        }
        if(bmbCt == 4){
            no.setColor(COL["four"]);
        }
        if(bmbCt == 5){
            no.setColor(COL["five"]);
        }
        if(bmbCt == 6){
            no.setColor(COL["six"]);
        }
        if(bmbCt == 7){
			no.setColor(COL["seven"]);
        }
        if(bmbCt == 8){
            no.setColor(COL["eight"]);
        }
        
        no.setText(bmbCt);
        
        no.setPosition(SQUARES[i].getX() + no.getWidth(), SQUARES[i].getY() + 28);
        
        NUMS.push(no);
    }
}

function generateGridSquares(){
    for(var y = 0; y < numSquaresPer; y++){
        for(var x = 0; x < numSquaresPer; x++){
            makeSquare(x,y);
        }
    }
    
    function makeSquare(x,y){
        var tempSquare = new Rectangle(40,40);
        tempSquare.setColor(COL["border"]);
        tempSquare.setPosition(x*40, y*40);
        
        tempSquare.setBorderColor(COL["bg"]);
        tempSquare.setBorderWidth(0);
        
        SQUARES.push(tempSquare);
    }
}

function assembleGameGrid(){
    var mineC = 0;
    
    for(var i=0; i<SQUARES.length; i++){
        if(NUMS[i].getText() != -1){
            GAME_GRID.push(NUMS[i]);
            //println("NUMS[" + i + "] Logged"); //for debugging
        }else{
            GAME_GRID.push(MINES[mineC]);
            //println("MINES[" + mineC + "] (ind " + i + ") Logged"); //for db
            mineC++;
        }
    }
}

function drawSquares(){
    for(var i=0; i<SQUARES.length; i++){
        add(SQUARES[i]);
    }
}

function drawMines(img){
    var flagCt = 2;
    for(var i=0; i<numMines; i++){
        var posX = SQUARES[MINES[i]].getX() + 5;
        var posY = SQUARES[MINES[i]].getY() + 5;
        
        var bombImg = new WebImage(img);
        bombImg.setSize(30, 30);
        bombImg.setPosition(posX, posY);
        
        if(!flagIsAt(MINES[i])){
            add(bombImg);
        }else{
            SQUARES[MINES[i]].setColor(Color.green);
            //println("GreeN FLAGS");
            //println(SQUARES[MINES[i]]);
        }
    }
    
    for(var i=0; i<FLAGS.length; i++){
        // println("MINES.indexOf(FLAGS[i].index: " + MINES.indexOf(FLAGS[i].index)); // for db
        
        if(MINES.indexOf(FLAGS[i].index) == -1){
            SQUARES[FLAGS[i].index].setColor(Color.yellow);
            //println("yeller flag");
            //println(SQUARES[FLAGS[i].index].alive);
        }
    }
}

function dbDrawNumbers(){
    for(var i=0; i<NUMS.length; i++){
        add(NUMS[i]);
    }
}

// This function looks really funky, but the screen is always a square!
function drawBgGrid(){
    setBackgroundColor(COL["bg"]);
    for(var xy=-0.5; xy<getWidth(); xy+=40){
        drawLine(xy);
    }
    
    function drawLine(xyPos){
        for(var i=0; i<2; i++){
            if(i == 0){
                var tempLine = new Line(0, xyPos, getHeight(), xyPos);
            }else{
                var tempLine = new Line(xyPos, 0, xyPos, getWidth());
            }
            tempLine.setColor(COL["border"]);
            tempLine.setLineWidth(3);
            add(tempLine);
        }
    }
}