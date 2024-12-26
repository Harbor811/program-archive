// This code is indended to be run in the CodeHS JS Graphics Environment

//DEFAULT SIZE: (398,478)
//ADD [REDACTED] SFX
//ADD MORE SFX FOR VARIOUS THINGS (BALL BOUNCES, CLICKING OPTIONS)

//ALL SFX SHOULD BE SOMEWHAT 8-BIT

setSize(1000,500);
var SCREEN;
var GAMEMODE = "MOUSE";
var DIFFICULTY = "MED";
var colors = [Color.red,Color.orange,Color.green,Color.yellow];
var gamemodeText;
var playText;
var lives = 3;
var lifeText = new Text("Balls Left: "+lives,"10pt Monospace");
var scoreText = new Text("Score: 0","10pt Monospace");
var diffText = new Text("MED","48pt Monospace");
var startButton = new Rectangle(getWidth()/4,getHeight()/4);
var optionsButton = new Rectangle(startButton.getWidth(),startButton.getHeight()/1.5);
var BG = new Rectangle(getWidth(),getHeight());
var player = new Rectangle(getWidth()/6.5,getHeight()/25);
var blocks = new Rectangle(getWidth()/13.5,getHeight()/24);
var diffButton = new Rectangle(getWidth()/4,getHeight()/4);
var ball = new Circle(10);
var ballDX = 5;
var ballDY = 5;
var playerDIR = "none";
var across = 13;
var down = 8;
var tempCounter = 0;
var tempCounter2 = 0;
var blocksBroken = 0;
var blockColor;
var blockY = 2.5;
var elem;
var score = 0;
var maxScore = 416;
var canSmallPad = true;

function start(){
    SCREEN = "menu";
    removeAll();
    playText = new Text("PLAY!","48pt Monospace");
    gamemodeText = new Text(GAMEMODE,"20pt Monospace");
    var menuText = new Text("BREAKOUT!","80pt Monospace");
    startButton.setPosition(getWidth()/2-startButton.getWidth()/2,getHeight()/2.5-startButton.getHeight()/2);
    optionsButton.setPosition(getWidth()/2-optionsButton.getWidth()/2,getHeight()/1.4-optionsButton.getHeight()/2);
    diffButton.setPosition(startButton.getX()-diffButton.getWidth()*1.2,startButton.getY()+diffButton.getHeight()/2);
    menuText.setPosition(getWidth()/2-menuText.getWidth()/2,menuText.getHeight()*1.25);
    gamemodeText.setPosition(getWidth()/2-gamemodeText.getWidth()/2,optionsButton.getY()+gamemodeText.getHeight()*2.3);
    playText.setPosition(getWidth()/2-playText.getWidth()/2,startButton.getY()+playText.getHeight()*1.6);
    diffText.setPosition(diffButton.getX()+diffButton.getWidth()/6,diffButton.getY()+diffButton.getHeight()/1.7);
    startButton.setColor(Color.gray);
    optionsButton.setColor(Color.gray);
    diffText.setColor(Color.yellow);
    menuText.setColor(Color.gray);
    add(BG);
    add(menuText);
    add(startButton);
    add(optionsButton);
    add(diffButton);
    add(gamemodeText);
    add(playText);
    add(diffText);
    mouseClickMethod(clickHandler);
}
function startGame(){
    SCREEN="game";
    removeAll();
    player.setPosition(getWidth()/2-player.getWidth()/2,getHeight()-player.getHeight()*2);
    player.setColor(Color.gray);
    add(BG);
    add(player);
    mouseMoveMethod(mouseMoved);
    keyDownMethod(keyDown);
    setupGame();
}
function diffSel(){
    if(DIFFICULTY=="EASY"){
        DIFFICULTY="MED";
        diffText.setColor(Color.yellow);
    }else if(DIFFICULTY=="MED"){
        DIFFICULTY="HARD";
        diffText.setColor(Color.red);
    }else if(DIFFICULTY=="HARD"){
        DIFFICULTY="IMP";
        diffText.setColor("#910000");
    }else if(DIFFICULTY=="IMP"){
        DIFFICULTY="EASY";
        diffText.setColor(Color.green);
    }
    diffText.setText(DIFFICULTY);
}
function keyDown(e){
    if(GAMEMODE=="KEYBOARD"&&(SCREEN=="game"||SCREEN=="temp")){
        keyUpMethod(resetDIR);
        if(e.keyCode==Keyboard.letter('A')||e.keyCode==Keyboard.LEFT){
            player.move(-25,0);
            playerDIR = "left";
        }else if(e.keyCode==Keyboard.letter('D')||e.keyCode==Keyboard.RIGHT){
            player.move(25,0);
            playerDIR = "right";
        }else if(e.keyCode==Keyboard.SPACE){
            score=415;
        }
        checkPlayerX();
    }
}
function resetDIR(){
    playerDIR = "none";
}
function mouseMoved(e){
    if(GAMEMODE=="MOUSE"&&(SCREEN=="game"||SCREEN=="temp")){
        var beforeX = e.getX();
        var playerX = Math.floor(player.getX()+player.getWidth()/2);
        player.setPosition(e.getX()-player.getWidth()/2,player.getY());
        if(playerX>(beforeX+5)){
            playerDIR = "left";
            beforeX = player.getX();
        }else if(playerX<(beforeX-5)){
            playerDIR = "right";
            beforeX = player.getX();
        }else{
            playerDIR = "none";
        }
        checkPlayerX();
    }
}
function checkPlayerX(){
    if(player.getX()<0){player.setPosition(0,player.getY())}
    if(player.getX()>(getWidth()-player.getWidth())){player.setPosition(getWidth()-player.getWidth(),player.getY())}
}
function clickHandler(e){
    var elem = getElementAt(e.getX(),e.getY());
    if(SCREEN=="menu"||SCREEN=="end"){
        if(elem==optionsButton||elem==gamemodeText){
            if(GAMEMODE=="MOUSE"){
                GAMEMODE="KEYBOARD";
            }else if(GAMEMODE="KEYBOARD"){
                GAMEMODE="MOUSE";
            }
            gamemodeText.setText(GAMEMODE);
            gamemodeText.setPosition(getWidth()/2-gamemodeText.getWidth()/2,gamemodeText.getY());
        }
        if(elem==startButton||elem==playText){
            startGame();
        }
        if(elem==diffButton||elem==diffText){
            diffSel();   
        }
    }else if(SCREEN=="temp"){
        setTimer(moveBall,15);
        SCREEN="game";
    }
}
function setupGame(){
    player.setSize(getWidth()/6.5,getHeight()/25);
    if(DIFFICULTY=="EASY"){
        lives = 4;
        across = 13;
        down = 4;
        blockColor = colors[2];
        maxScore = 104;
        canSmallPad = false;
    }else if(DIFFICULTY=="MED"){
        lives = 2;
        down = 8;
        blockColor = colors[0];
        maxScore = 416;
        canSmallPad = true;
    }else if(DIFFICULTY=="HARD"){
        lives = 1;
        down = 9;
        blockColor = colors[0];
        maxScore = 637;
        canSmallPad = true;
    }else if(DIFFICULTY=="IMP"){
        lives = 0;
        down = 12;
        blockColor = colors[0];
        maxScore = 1092;
        canSmallPad = true;
        player.setSize(getWidth()/10,getHeight()/25);
    }
    lifeText.setText("Balls Left: "+(lives+1));
    lifeText.setPosition(7,getHeight()-7);
    lifeText.setColor(Color.white);
    scoreText.setText("Score: 0");
    scoreText.setFont("10pt Monospace");
    scoreText.setPosition(21+lifeText.getWidth(),getHeight()-7);
    scoreText.setColor(Color.white);
    add(lifeText);
    add(scoreText);
    tempCounter=0;
    tempCounter2=0;
    score=0;
    blockY=2.5;
    setTimer(makeBlocks,20);
}
function makeBlocks(){
    blocks = new Rectangle(getWidth()/13.5,getHeight()/24);
    blocks.setColor(blockColor);
    blocks.setPosition((tempCounter*blocks.getWidth())+(tempCounter*2.5)+2.5,blocks.getHeight()+blockY);
    add(blocks);
    tempCounter++;
    if(tempCounter==across){
        tempCounter=0;
        tempCounter2++;
        if(DIFFICULTY=="IMP"){
            blockColor=colors[0];
        }else if(DIFFICULTY=="EASY"){
            blockColor=colors[Math.floor(2+tempCounter2/2)];
        }else if(DIFFICULTY=="HARD"){
            blockColor=colors[Math.floor(tempCounter2/4)];
        }else{
            blockColor=colors[Math.floor(tempCounter2/2)];
        }
        blockY+=blocks.getHeight()+2.5;
        if(tempCounter2==down){
            stopTimer(makeBlocks);
            addBall();
        }
    }
}
function addBall(){
    ballDX = 5;
    ballDY = 5;
    ball.color = Color.white;
    ball.setPosition(getWidth()/2-ball.getRadius()/2,(down+1)*(blocks.getHeight()+7)-ball.getRadius()/2);
    add(ball);
    SCREEN="temp";
}
function moveBall(){
    ball.move(ballDX,ballDY);
    var topElem = getElementAt(ball.getX(),ball.getY()-ball.getRadius());
    var botElem = getElementAt(ball.getX(),ball.getY()+ball.getRadius());
    var leftElem = getElementAt(ball.getX()-ball.getRadius(),ball.getY());
    var rightElem = getElementAt(ball.getX()+ball.getRadius(),ball.getY());
    if(leftElem==null||rightElem==null){
        ballDX = -ballDX;
    }
    if(topElem<=0){
        ballDY = -ballDY;
        if(canSmallPad==true){
            player.setSize(getWidth()/10,getHeight()/25);
        }
    }
    if(botElem==player&&ballDY>0&&topElem.getY()<player.getY()){
        if(playerDIR=="left"&& ballDX > -7){
            ballDX-=1;
        }else if(playerDIR=="right"&&ballDX<7){
            ballDX+=1;
        }
        if(ballDX==0){
            ballDX++;
        }
        ballDY = -ballDY;
    }
    if((leftElem==player||rightElem==player)&&ball.getY()<player.getY()-player.getHeight()/2){
        ballDX = -ballDX;
        ballDY = -ballDY;
    }else if(topElem!=null&&topElem!=BG&&topElem!=ball&&topElem!=player&&topElem!=scoreText&&topElem!=lifeText){
        remove(topElem);
        ballDY = -ballDY;
        getPoints(topElem);
    }else if(leftElem!=null&&leftElem!=BG&&leftElem!=ball&&leftElem!=player&&leftElem!=scoreText&&leftElem!=lifeText){
        remove(leftElem);
        ballDX = -ballDX;
        getPoints(leftElem);
    }else if(rightElem!=null&&rightElem!=BG&&rightElem!=ball&&rightElem!=player&&rightElem!=scoreText&&rightElem!=lifeText){
        remove(rightElem);
        ballDX = -ballDX;
        getPoints(rightElem);
    }else if(botElem!=null&&botElem!=BG&&botElem!=ball&&botElem!=player&&botElem!=scoreText&&botElem!=lifeText){
        remove(botElem);
        ballDY = -ballDY;
        getPoints(botElem);
    }else if(botElem==null){
        remove(ball);
        stopTimer(moveBall);
        if(lives==0){
            endGame("lose");
        }else{
            lives--;
            lifeText.setText("Balls Left: "+(lives+1));
            addBall();
        }
        mouseClickMethod(clickHandler);
    }else if((botElem==player&&leftElem==player)||(botElem==player&&rightElem==player)){
        var oldX = ball.getX();
        var oldY = ball.getY();
        ball.setPosition(oldX,oldY+player.getHeight());
    }
}
function upSpeed(num){
    if(ballDX>0&&ballDX<7){
        ballDX+=num;
    }else if(ballDX<0&&ballDX>-7){
        ballDX-=num;
    }
    if(ballDY>0&&ballDX<7){
        ballDY+=num;
    }else if(ballDY<0&&ballDY>-7){
        ballDY-=num;
    }
}
function getPoints(elm){
    var isaac = new Audio("");
    isaac.play();
    if(elm.getColor()==Color.yellow){
        score++;
    }else if(elm.getColor()==Color.green){
        score+=3;
    }else if(elm.getColor()==Color.orange){
        score+=5;
        upSpeed(0.03);
    }else if(elm.getColor()==Color.red){
        score+=7;
        upSpeed(0.06);
    }
    scoreText.setText("Score: "+score);
    if(score==maxScore){
        endGame("win");
    }
}
function endGame(e){
    SCREEN = "end";
    stopTimer(moveBall);
    removeAll();
    add(BG);
    if(e=="lose"){
        var youLose = new Text("L Bozo.","50pt Monospace");
    }else if(e=="win"){
        var youLose = new Text("WWWWWWWWWWWWWWWWWWWW","50pt Monospace");
    }
    youLose.setPosition(getWidth()/2-youLose.getWidth()/2,getHeight()/4-youLose.getHeight()/2);
    youLose.setColor(Color.white);
    add(youLose);
    scoreText.setText("Final Score: "+score);
    scoreText.setFont("25pt Monospace");
    scoreText.setPosition(getWidth()/2-scoreText.getWidth()/2,getHeight()/1.25+scoreText.getHeight()/1.5);
    playText.setText("Retry");
    playText.setPosition(238,276);
    startButton.setPosition(getWidth()/2-startButton.getWidth()/2-startButton.getWidth()/1.5,getHeight()/2-startButton.getHeight()/2);
    diffButton.setPosition(startButton.getX()+getWidth()/3.5,startButton.getY());
    diffText.setPosition(diffButton.getX()+diffButton.getWidth()/6,playText.getY());
    add(scoreText);
    add(startButton);
    add(playText);
    add(diffButton);
    add(diffText);
    mouseClickMethod(clickHandler);
}