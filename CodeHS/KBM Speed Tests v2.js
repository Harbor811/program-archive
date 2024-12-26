// This code is indended to be run in the CodeHS JS Graphics Environment

var letterArr = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
var gameFont = "Monospace";
var rate = getHeight()/16;
var centerX = getWidth()/2;
var centerY = getHeight()/2;
var keyIsDown = false;
var canClickKey = false;
var keyIsClicked = false;
var rIsLited = false;
var rIsClicked = false;
var cIsLited = false;
var cIsClicked = false;
var randLetter;
var PAT = false;
var againText = new Text("Next Stage >","35pt Comic Sans MS");
var menuText = new Text("< Main Menu","35pt Comic Sans MS");
var circleBG = new Circle(0);
var score = 0;
var rText = new Text("R.K.P.S.T. v2","22pt "+gameFont);
var cText = new Text("C.A.S.T. v1","26pt "+gameFont);
var rBox1 = new Rectangle(getWidth()-150,getHeight()/2-150);
var rBox2 = new Rectangle(getWidth()-130,getHeight()/2-130);
var cBox1 = new Rectangle(getWidth()-150,getHeight()/2-150);
var cBox2 = new Rectangle(getWidth()-130,getHeight()/2-130);
var keyTile = new Text("ERROR");
var keyBox1 = new Rectangle(100,100);
var keyBox2 = new Rectangle(120,120);
var clickBox = new Circle(50);
var clickRad;
var exBox1;
var exBox2;
var numKeys = 0;
var round;
var scoreboard = new Text("Score: "+score);
var gameScreen = "CD";
var cdText = new Text("error code 1","50pt Comic Sans MS");
var setX = 0;
var setY = 0;
var timer;
var timerTXT;
var bg = new WebImage("https://codehs.com/"+"uploads/"+"872ae0ca82c9b8a491aeb1a655edd00f");
var blackBG = new Rectangle(getWidth(),getHeight());
var clickablePA = false;
var clickableMM = false;
var timeSet;
var countD = 4;
var noteStreak = [];
var sMusic = new Audio("https://codehs.com/uploads/06480eec406fdc07cdc268d969ea70ed");
var sAPlus = new Audio("https://codehs.com/uploads/4263eb332d35444f2e8329dd325937c1");
var sA = new Audio("https://codehs.com/uploads/2a390dec2abe2933fb8f9e81c837398d");
var sB = new Audio("https://codehs.com/uploads/b73e3e85c26acdb879f7d2770dc3cf88");
var sC = new Audio("https://codehs.com/uploads/b5beb51553032f082803799a3be36798");
var sD = new Audio("https://codehs.com/uploads/be35fdee44c9a58847edc2849a297e0f");
var sF = new Audio("https://codehs.com/uploads/752a6c27cf1b5a473098d955fab47ecd");
var gameMode = "error code 1";
println("R.K.P.S.T. = Random Key Press Speed Test");
println("C.A.S.T. v1= Click Accuracy Speed Test");

function start(){
    rIsLited = false;
    cIsLited = false;
    round=0;
    timer=10;
    timeSet=10;
    gameScreen = "start";
    bg.setSize(400,480);
    bg.setRotation(180);
    add(bg);
    rBox2.setSize(getWidth()-130,getHeight()/2-130);
    cBox2.setSize(getWidth()-130,getHeight()/2-130);
    rBox1.setPosition(getWidth()/2-15-rBox1.getWidth()/2+5,centerY-5-rBox1.getHeight()/2);
    rBox2.setPosition(centerX-rBox2.getWidth()/2-5,centerY-rBox2.getHeight()/2);
    cBox1.setPosition(getWidth()/2-15-cBox1.getWidth()/2+5,getHeight()-getHeight()/4-5-cBox1.getHeight()/2);
    cBox2.setPosition(centerX-rBox2.getWidth()/2-5,getHeight()-getHeight()/4-cBox2.getHeight()/2);
    rBox1.setColor("#C7C7C7");
    rBox2.setColor("#757575");
    cBox1.setColor("#C7C7C7");
    cBox2.setColor("#757575");
    cText.setColor(Color.black);
    rText.setColor(Color.black);
    add(rBox2);
    add(rBox1);
    add(cBox2);
    add(cBox1);
    rText.setPosition(centerX-15-rText.getWidth()/2,centerY-5+rText.getHeight()/2);
    cText.setPosition(centerX-15-cText.getWidth()/2,getHeight()-getHeight()/4-5+cText.getHeight()/2);
    add(rText);
    add(cText);
    createGraphic(getWidth()/1.25,getHeight()/2-180,centerX-15,centerY/3.5);
    makeText("KB/M SPEED TESTS","23pt "+gameFont,centerX-10,getHeight()/2.05,Color.black);
    mouseMoveMethod(onMouseMove);
    mouseDownMethod(mouseDown);
    mouseUpMethod(mouseUp);
}
function CD(){
    if(gameMode!=1&&gameMode!=2){println("gamdeMode: "+gameMode);}
    add(blackBG);
    var readyText = new Text("Ready?","45pt "+gameFont);
    readyText.setPosition(centerX-readyText.getWidth()/2,centerY-rate*4);
    readyText.setColor(Color.white);
    gameScreen = "CD";
    clickablePA=false;
    bg.setSize(400,480);
    bg.setPosition(0,0);
    add(readyText);
    countD=3;
    makeCircle(35,centerX-rate*3,centerY,"#394247");
    makeCircle(35,centerX,centerY,"#394247");
    makeCircle(35,centerX+rate*3,centerY,"#394247");
    makeCircle(50,centerX,centerY+rate*4,"#394247");
    setTimer(tick,1000);
}

function tick(){
    var cdText = new Text("error code 2","35pt "+gameFont);
    var circleBG = new Circle(0);
    circleBG.setPosition(centerX,centerY);
    circleBG.setColor(Color.yellow);
    if(countD>0){
        circleBG.setRadius(35);
        cdText.setText(countD);
    }else if(countD==0){
        circleBG.setColor(Color.green);
        circleBG.setRadius(50);
        cdText.setText("GO!");
    }else{
        stopTimer(tick);
        remove(cdText);
        begin();
    }
    if(countD==3){
        cdText.setPosition(centerX-cdText.getWidth()/2-rate*3,centerY+cdText.getHeight()/3);
        circleBG.setPosition(centerX-rate*3,centerY);
    }else if(countD==2){
        cdText.setPosition(centerX-cdText.getWidth()/2,centerY+cdText.getHeight()/3);
        circleBG.setPosition(centerX,centerY);
    }else if(countD==1){
        cdText.setPosition(centerX-cdText.getWidth()/2+rate*3,centerY+cdText.getHeight()/3);
        circleBG.setPosition(centerX+rate*3,centerY);
    }else{
        cdText.setPosition(centerX-cdText.getWidth()/2,centerY+cdText.getHeight()/3+rate*4);
        circleBG.setPosition(centerX,centerY+rate*4);
    }
    if(countD!=-1){
        add(circleBG);
        add(cdText);
        countD--;
    }
}

function begin(){
    gameScreen="game";
    if(gameMode==2){
        gameScreen="gameCAST";
    }
    if(round!=0){
        timer=5*round;
        timeSet=timer;
    }
    round++;
    sAPlus.pause();
    sMusic = new Audio("https://codehs.com/uploads/06480eec406fdc07cdc268d969ea70ed");
    noteStreak = [];
    score = 0;
    scoreboard = new Text("Score:"+score,"20pt "+gameFont);
    numKeys = 0;
    removeAll();
    clear();
    bg.setRotation(0);
    add(bg);
    createGraphic(getWidth()-10,30,getWidth()/2-5,getHeight()-25);
    scoreboard.setPosition(getWidth()/2-scoreboard.getWidth()/2,getHeight()-scoreboard.getHeight()/2);
    sMusic.play();
    add(scoreboard);
    var roundText = new Text("Round:"+round,"20pt "+gameFont);
    roundText.setPosition(rate/4,getHeight()-roundText.getHeight()/2);
    setTimer(minusOne,1000);
    timerTXT = new Text("Time:"+timer,"20pt "+gameFont);
    timerTXT.setPosition(getWidth()-timerTXT.getWidth()-rate/4,getHeight()-timerTXT.getHeight()/2);
    add(timerTXT);
    add(roundText);
    newKey();
    if(gameMode==1){
        keyDownMethod(keyDown);
    }else if(gameMode==2){
        mouseMoveMethod(onMouseMove);
        mouseDownMethod(mouseDown);
        mouseUpMethod(mouseUp);
    }
}

function minusOne(){
    if(timer>0){
        remove(timerTXT);
        timer--;
        timerTXT.setText("Time:"+timer);
        timerTXT.setPosition(getWidth()-timerTXT.getWidth()-rate/4,getHeight()-timerTXT.getHeight()/2);
        add(timerTXT);
    }else{
        gameScreen="end";
        stopTimer(minusOne);
        remove(timerTXT);
        numKeys--;
        newKey();
    }
}
function keyDown(e){
    if(gameScreen=="game"){
        if(e.keyCode == Keyboard.letter(randLetter) && keyIsDown!=true){
            keyIsDown=true;
            keyUpMethod(keyUp);
            remove(keyBox1);
            remove(keyBox2);
            remove(keyTile);
            keyBox2.setSize(110,110);
            keyBox1.move(15,15);
            keyBox2.move(15,15);
            keyTile.move(15,15);
            add(keyBox2);
            add(keyBox1);
            add(keyTile);
        }
    }else if(gameScreen=="end"){
        PAT = true;
    }else if(gameScreen=="start"){
        if(rIsLited==true){
            gameMode=1;
        }else if(cIsLited==true){
            gameMode=2;
        }
        CD();
    }
}

function keyUp(e){
    if(keyIsDown==true&&gameScreen=="game"){
        score++;
        var sNoteHit = new Audio("https://codehs.com/uploads/497c253dabe515919eb4c2815f1c0888");
        sNoteHit.play();
        noteStreak.push("hit");
        println("HIT");
        remove(scoreboard);
        scoreboard.setText("Score:"+score);
        add(scoreboard);
        keyIsDown=false;
        newKey();
    }else if(gameScreen=="game"&&keyIsDown!=true){
        remove(scoreboard);
        numKeys++;
        var sNoteMiss = new Audio("https://codehs.com/uploads/de14f0112f7e3ea41418386f2e3ed52d");
        sNoteMiss.play();
        noteStreak.push("miss");
        println("MISS");
        scoreboard.setText("Score:"+score);
        add(scoreboard);
    }
}

function newKey(){
    if(gameMode==1){
        remove(keyTile);
        remove(keyBox1);
        remove(keyBox2);
    }else if(gameMode==2){
        remove(clickBox);
    }
    if(gameScreen=="game"||gameScreen=="gameCAST"){
        numKeys++;
        if(gameScreen=="game"){
            setX = Randomizer.nextInt(60,getWidth() - 120);
            setY = Randomizer.nextInt(60,getHeight() - 200);
            var randNum = Randomizer.nextInt(0,25);
            randLetter = letterArr[randNum];
            keyTile = new Text(randLetter, "50pt "+gameFont);
            keyTile.setPosition(setX-keyTile.getWidth()/2,setY+keyTile.getHeight()/4);
            keyBox2.setSize(120,120);
            keyBox2.setPosition(setX-keyBox2.getWidth()/2 + 5,setY-keyBox2.getHeight()/2 + 5);
            keyBox2.setColor("#757575");
            keyBox1.setPosition(setX-keyBox1.getWidth()/2,setY-keyBox1.getHeight()/2);
            keyBox1.setColor("#C7C7C7");
            add(keyBox2);
            add(keyBox1);
            add(keyTile);
        }else if(gameScreen=="gameCAST"){
            clickRad = Randomizer.nextInt(20,50);
            setX = Randomizer.nextInt(clickRad,getWidth()-clickRad);
            setY = Randomizer.nextInt(clickRad,getHeight() - 100);
            clickBox.setRadius(clickRad);
            clickBox.setPosition(setX,setY);
            clickBox.setColor("#799987");
            add(clickBox);
        }
    }else{
        //Game Over Screen
        sMusic.pause();
        removeAll();
        // Temp white background (because its gross)
        var tempBg = new Rectangle(getWidth(), getHeight());
        tempBg.setColor(Color.white);
        add(tempBg);
        
        
        var food = rate*2;
        for(var i=0;i<15;i++){
            graphLineX(food);
            food+=rate;
        }
        graphLineY(rate);
        if(numKeys!=0){
            var accuracy = Math.floor((score/numKeys)*100);
        }else{accuracy=0}
        var highestNS = calculateNS();
        var gO = new Text("Game Over!","25pt Comic Sans MS");
        var accText = new Text("Accuracy: "+accuracy+"%","15pt Comic Sans MS");
        var timeText = new Text("Time set: "+timeSet+" second(s)","15pt Comic Sans MS");
        var scoreboard = new Text("Score: "+score+"/"+numKeys,"15pt Comic Sans MS");
        if(gameMode==1){
            var noteStreakText = new Text("Highest Key Streak: "+highestNS+"!","15pt Comic Sans MS");
        }else if(gameMode==2){
            var noteStreakText = new Text("Highest Click Streak: "+highestNS+"!","15pt Comic Sans MS");
        }
        var letGrade = "";
        if(accuracy==100&&score>=timeSet*1.25&&score>=20){
            var grade = new WebImage("https://codehs.com/"+"uploads/"+"aca9fe9ddfdaa6adb4db296a0d223182");
            sAPlus.play();
            letGrade = "A+";
        }else if(accuracy>89&&score>=(timeSet/1.5)){
            var grade = new WebImage("https://codehs.com/"+"uploads/"+"cca4429a703d3046627ab44fea2d0be8");
            sA.play();
            letGrade = "A";
        }else if(accuracy>79&&score>=(timeSet/1.75)){
            var grade = new WebImage("https://codehs.com/"+"uploads/"+"9295236ec99c4b4a212057c66df3cac0");
            sB.play();
            letGrade = "B";
        }else if(accuracy>69&&score>=(timeSet/2)){
            var grade = new WebImage("https://codehs.com/"+"uploads/"+"8697ea3d44f3632665cf165358b298fd");
            sC.play();
            letGrade = "C";
        }else if(accuracy>59&&score>=(timeSet/3)){
            var grade = new WebImage("https://codehs.com/"+"uploads/"+"5eb5ea11c9bdc505923723e0957da67c");
            sD.play();
            letGrade = "D";
        }else{
            var grade = new WebImage("https://codehs.com/"+"uploads/"+"7de2fc69968602c7eddeeacf71fa34e2");
            var seeMe = new WebImage("https://codehs.com/"+"uploads/"+"3074543c09147bd6754e8c7bf08d7679");
            seeMe.setSize(132,49);
            seeMe.setPosition(getWidth()-getWidth()/3,(seeMe.getHeight()+rate*2.7));
            seeMe.rotate(-10);
            add(seeMe);
            sF.play();
            letGrade = "F";
        }
        grade.rotate(-10);
        grade.setSize(100,100);
        grade.setPosition(getWidth()-120,20);
        gO.setPosition(rate+10,(gO.getHeight()/1.2)+rate);
        scoreboard.setPosition(rate+10,scoreboard.getHeight()*1.4+rate*2);
        timeText.setPosition(rate+10,timeText.getHeight()*1.4+rate*3);
        noteStreakText.setPosition(rate+10,noteStreakText.getHeight()*1.4+rate*4);
        accText.setPosition(rate+10,accText.getHeight()*1.4+rate*5);
        againText.setPosition(rate+10,againText.getHeight()*8.2);
        menuText.setPosition(rate+10,menuText.getHeight()*9.57);
        againText.setColor(Color.black);
        menuText.setColor(Color.black);
        againText.setRotation(0);
        menuText.setRotation(0);
        add(grade);
        add(accText);
        add(scoreboard);
        add(gO);
        add(timeText);
        if(letGrade != "F" && letGrade != "D"){
            add(againText);
        }
        add(menuText);
        add(noteStreakText);
        mouseMoveMethod(onMouseMove);
        mouseDownMethod(mouseDown);
        mouseUpMethod(mouseUp);
    }
}
function onMouseMove(e){
    if(gameScreen=="gameCAST"){
        if(e.getX()>setX-clickRad&&e.getX()<setX+clickRad&&e.getY()>setY-clickRad&&e.getY()<setY+clickRad){
            canClickKey=true;
            remove(clickBox);
            clickBox.setColor(Color.green);
            add(clickBox);
        }else{
            canClickKey=false;
            remove(clickBox);
            clickBox.setColor("#799987");
            add(clickBox);
        }
    }else if(gameScreen=="end"){
        if(e.getY()>rate*10 && e.getY()<rate*12.7 && e.getX()>rate && e.getX()<rate*11){
            clickablePA=true;
            remove(againText);
            againText.setColor(Color.red);
            againText.setPosition(rate+10,againText.getHeight()*8.1);
            againText.setRotation(3);
            add(againText);
        }else{
            if(clickablePA==true){
                remove(againText);
                againText.setColor(Color.black);
                againText.setPosition(rate+10,againText.getHeight()*8.2);
                againText.rotate(-3);
                add(againText);
            }
            clickablePA = false;
        }
        if(e.getY()>rate*12.7 && e.getY()<rate*14.2 && e.getX()>rate && e.getX()<rate*11){
            clickableMM=true;
            remove(menuText);
            menuText.setColor(Color.red);
            menuText.setPosition(rate+10,menuText.getHeight()*9.47);
            menuText.setRotation(3);
            add(menuText);
        }else{
            if(clickableMM==true){
                remove(menuText);
                menuText.setColor(Color.black);
                menuText.setPosition(rate+10,menuText.getHeight()*9.57);
                menuText.setRotation(0);
                add(menuText);
            }
            clickableMM=false;
        }
    }else if(gameScreen=="start"){
        if(e.getY()>rate*6.2&&e.getY()<rate*10&&e.getX()>rate*2&&e.getX()<rate*11.1){
            rIsLited=true;
            cIsLited=false;
            remove(rBox1);
            remove(rBox2);
            remove(rText);
            rBox1.setColor("#DDDD77");
            rBox2.setColor("#ACAC46");
            rText.setColor("#666600");
            add(rBox2);
            add(rBox1);
            add(rText);
        }else{
            rIsLited=false;
            cIsLited=false;
            remove(rBox1);
            remove(rBox2);
            remove(rText);
            rBox1.setColor("#C7C7C7");
            rBox2.setColor("#757575");
            rText.setColor(Color.black);
            add(rBox2);
            add(rBox1);
            add(rText);
        }
        if(e.getY()>rate*10.2&&e.getY()<rate*13.9&&e.getX()>rate*2&&e.getX()<rate*11.1){
            rIsLited=false;
            cIsLited=true;
            remove(cBox1);
            remove(cBox2);
            remove(cText);
            cBox1.setColor("#DDDD77");
            cBox2.setColor("#ACAC46");
            cText.setColor("#666600");
            add(cBox2);
            add(cBox1);
            add(cText);
        }else{
            remove(cBox1);
            remove(cBox2);
            remove(cText);
            cBox1.setColor("#C7C7C7");
            cBox2.setColor("#757575");
            cText.setColor(Color.black);
            add(cBox2);
            add(cBox1);
            add(cText);
        }
    }
}
function mouseDown(e){
    if(gameScreen=="gameCAST"){
        if(canClickKey==true){
            keyIsClicked=true;
        }else{
            keyIsClicked=false;
        }
    }else
    if(gameScreen=="start"){
        if(rIsLited==true){
            rIsClicked=true;
            cIsClicked=false;
            remove(rBox1);
            remove(rBox2);
            remove(rText);
            rBox1.setPosition(getWidth()/2-15-rBox1.getWidth()/2+15,centerY-5-rBox1.getHeight()/2+10);
            rBox2.setPosition(centerX-rBox2.getWidth()/2+5,centerY-rBox2.getHeight()/2+10);
            rBox2.setSize(getWidth()-140,getHeight()/2-140);
            rText.setPosition(centerX-5-rText.getWidth()/2,centerY+5+rText.getHeight()/2);
            add(rBox2);
            add(rBox1);
            add(rText);
        }else if(cIsLited==true){
            cIsClicked=true;
            rIsClicked=false;
            remove(cBox1);
            remove(cBox2);
            remove(cText);
            cBox1.setPosition(getWidth()/2-cBox1.getWidth()/2,getHeight()-getHeight()/4-5-cBox1.getHeight()/2+10);
            cBox2.setPosition(centerX-cBox2.getWidth()/2+5,getHeight()-getHeight()/4-cBox2.getHeight()/2+10);
            cBox2.setSize(getWidth()-140,getHeight()/2-140);
            cText.setPosition(centerX-5-cText.getWidth()/2,getHeight()-getHeight()/4+5+cText.getHeight()/2);
            add(cBox2);
            add(cBox1);
            add(cText);
        }else{
            rIsClicked=false;
            cIsClicked=false;
        }
    }
}
function mouseUp(e){
    if(gameScreen=="gameCAST"){
        if(canClickKey==true&&keyIsClicked==true){
            score++;
            noteStreak.push("hit");
            remove(scoreboard);
            scoreboard.setText("Score:"+score);
            add(scoreboard);
            canClickKey=false;
            keyIsClicked=false;
            newKey();
        }else{
            numKeys++;
            noteStreak.push("miss");
        }
    }else if(gameScreen=="end"){
        if(clickablePA==true){
            CD();
        }else if(clickableMM==true){
            start();
        }
    }else if(gameScreen=="start"){
        if(rIsLited==true&&rIsClicked==true){
            gameMode=1;
            CD();
        }else if(cIsLited==true&&cIsClicked==true){
            gameMode=2;
            CD();
        }else{
            remove(rBox1);
            remove(rBox2);
            remove(rText);
            remove(cBox1);
            remove(cBox2);
            remove(cText);
            rBox2.setSize(getWidth()-130,getHeight()/2-130);
            cBox2.setSize(getWidth()-130,getHeight()/2-130);
            rBox1.setPosition(getWidth()/2-15-rBox1.getWidth()/2+5,centerY-5-rBox1.getHeight()/2);
            rBox2.setPosition(centerX-rBox2.getWidth()/2-5,centerY-rBox2.getHeight()/2);
            rText.setPosition(centerX-15-rText.getWidth()/2,centerY-5+rText.getHeight()/2);
            cBox1.setPosition(getWidth()/2-15-cBox1.getWidth()/2+5,getHeight()-getHeight()/4-5-cBox1.getHeight()/2);
            cBox2.setPosition(centerX-rBox2.getWidth()/2-5,getHeight()-getHeight()/4-cBox2.getHeight()/2);
            cText.setPosition(centerX-15-cText.getWidth()/2,getHeight()-getHeight()/4-5+cText.getHeight()/2);
            add(rBox2);
            add(rBox1);
            add(rText);
            add(cBox2);
            add(cBox1);
            add(cText);
        }
    }
}
function createGraphic(width,height,setX,setY){
    exBox1 = new Rectangle(width,height);
    exBox1.setPosition(setX - width/2 + 5,setY - height/2 + 5);
    exBox1.setColor("#C7C7C7");
    exBox2 = new Rectangle(width + 20,height + 20);
    exBox2.setPosition(setX - width/2,setY - height/2);
    exBox2.setColor("#757575");
    add(exBox2);
    add(exBox1);
}
function removeGraphic(){
    remove(exBox1);
    remove(exBox2);
}
function graphLineX(y){
    var exLine = new Line(0,y,getWidth(),y);
    exLine.setColor("#95E6D8");
    add(exLine);
}
function graphLineY(x){
    var exLine = new Line(x,0,x,getHeight());
    exLine.setColor("#DB4054");
    add(exLine);
}
function calculateNS(){
    var counter = 0;
    var highestNum = 0;
    for(var i=0;i<noteStreak.length;i++){
        var curr = noteStreak[i];
        if(curr=="hit"){
            counter++;
        }
        if(curr=="miss"){
            if(highestNum<counter){
                highestNum=counter;
            }
            counter = 0;
        }
    }
    if(counter>highestNum){highestNum = counter;}
    return(highestNum);
}
function makeCircle(rad,x,y,col){
    var exCirc = new Circle(rad);
    exCirc.setPosition(x,y);
    exCirc.setColor(col);
    add(exCirc);
}
function makeText(text,ptAndFont,x,y,col){
    var exText = new Text(text,ptAndFont);
    exText.setPosition(x-exText.getWidth()/2,y-exText.getWidth()/2);
    exText.setColor(col);
    add(exText);
}