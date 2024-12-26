// This code is indended to be run in the CodeHS JS Graphics Environment

var block = new Rectangle(50,50);
    var block2 = new Rectangle(50,50);
    var coin = new Rectangle(50,50);
    var setX = 50;
    var setY = 50;
    var setX2 = 300;
    var setY2 = 400;
    var coinX = 0;
    var coinY = 0;
    var ans = 0;
    var gameInPlay = true;
    var gameEnded = false;
    var blackCB = 0;
    var CENTERX = getWidth()/2;
    var CENTERY = getHeight()/2;
    var score = 0;
    var scoreboard = new Text("Score:"+score*5);
    var bgMusic = new Audio("https://freesound.org/data/previews/158/158866_2871314-lq.mp3");
function start(){
    bottomBar();
    makeGrid();
    makeCoin();
    block.setPosition(setX,setY);
    block2.setPosition(setX2,setY2);
    scoreboard.setPosition(0,getHeight()-scoreboard.getHeight()/5);
    block2.setColor(Color.blue);
    coin.setColor(Color.yellow);
    scoreboard.setColor(Color.black);
    scoreboard.setFont("20pt Comic Sans MS");
    add(block);
    add(block2);
    add(scoreboard);
    keyDownMethod(keyDown);
    println("Type 1 for Black chase Blue!");
    var ans = readInt("Type 2 for Blue chase Black!");
    bgMusic.play();
    bgMusic.loop = true;
    if(ans == 1){
        blackCB = true;
    }else if(ans == 2){
        blackCB = false;
    }else{
        println("this is not 1 or 2.");
        start();
    }
    println();
}
function keyDown(e){
    if(gameEnded==false){
        if (e.keyCode == Keyboard.letter('S')){
            remove(block);
            if(setY!=400){
                setY=setY+50;
            }else{
                setY=0;
            }
            block.setPosition(setX,setY);
            add(block);
        }
        if (e.keyCode == Keyboard.letter('W')){
            remove(block);
            if(setY!=0){
                setY = setY-50;
            }else{
                setY = 400;
            }
            block.setPosition(setX,setY);
            add(block);
        }
        if (e.keyCode == Keyboard.letter('A')){
            remove(block);
            if(setX!=0){
                setX = setX-50;
            }else{
                setX = 350;
            }
            block.setPosition(setX,setY);
            add(block);
        }
        if (e.keyCode == Keyboard.letter('D')){
            remove(block);
            if(setX!=350){
                setX = setX+50;
            }else{
                setX = 0;
            }
            block.setPosition(setX,setY);
            add(block);
        }
        if (e.keyCode == Keyboard.SPACE){
            printXY();
            printCoinXY();
        }
        if (e.keyCode == Keyboard.letter('K')){
            remove(block2);
            if(setY2!=400){
                setY2=setY2+50;
            }else{
                setY2 = 0;
            }
            block2.setPosition(setX2,setY2);
            add(block2);
        }
        if (e.keyCode == Keyboard.letter('I')){
            remove(block2);
            if(setY2!=0){
                setY2=setY2-50;
            }else{
                setY2 = 400;
            }
            block2.setPosition(setX2,setY2);
            add(block2);
        }
        if (e.keyCode == Keyboard.letter('J')){
            remove(block2);
            if(setX2!=0){
                setX2=setX2-50;
            }else{
                setX2 = 350;
            }
            block2.setPosition(setX2,setY2);
            add(block2);
        }
        if (e.keyCode == Keyboard.letter('L')){
            remove(block2);
            if(setX2!=350){
                setX2=setX2+50;
            }else{
                setX2 = 0;
            }
            block2.setPosition(setX2,setY2);
            add(block2);
        }
        if(setX==coinX){
            if(setY==coinY){
                if(blackCB==false){
                    coinCollected();
                }else{
                    var dontDoThat = new Audio("https://freesound.org/data/previews/235/235652_1904290-lq.mp3");
                    remove(block);
                    setX=0;
                    setY=0;
                    block.setPosition(setX,setY);
                    add(block);
                    dontDoThat.play();
                }
            }
        }
        if(setX2==coinX){
            if(setY2==coinY){
                if(blackCB==true){
                    coinCollected();
                }else{
                    var dontDoThat = new Audio("https://freesound.org/data/previews/235/235652_1904290-lq.mp3");
                    remove(block2);
                    setX2=0;
                    setY2=0;
                    block2.setPosition(setX2,setY2);
                    add(block2);
                    dontDoThat.play();
                }
            }
        }
        if(setX2==setX){
            if(setY2==setY){
                endGame();
            }
        }
    }
}
function printXY(){
    println("BLACK: X = "+setX+" Y = "+setY);
}
function printCoinXY(){
    println("COIN: X = "+coinX+" Y = "+coinY);
}
function endGame(){
    gameEnded = true;
    var gameEndedSound = new Audio("https://freesound.org/data/previews/381/381769_7097158-lq.mp3");
    remove(block2);
    remove(block);
    remove(coin);
    remove(scoreboard);
    bgMusic.pause();
    gameEndedSound.play();
    if(blackCB==true){
        newText("Black wins!",getWidth()/3.5,CENTERY);
    }else if(blackCB==false){
        newText("Blue wins!",getWidth()/3.5,CENTERY);
    }
    newText("Score: "+score*5,getWidth()/3.5,CENTERY+50);
}
function newText(text,x,y){
    var exText = new Text(text);
    exText.setPosition(x,y);
    exText.setColor(Color.black);
    exText.setFont("25pt Comic Sans MS");
    add(exText);
}
function coinCollected(){
    var coinSound = new Audio("https://freesound.org/data/previews/351/351563_2398403-lq.mp3");
    score = score+1;
    coinSound.play();
    makeCoin();
    remove(scoreboard);
    scoreboard.setText("Score: "+score*5);
    add(scoreboard);
}
function makeCoin(){
    if(gameEnded==false){
        coinX = Randomizer.nextInt(0,7);
        coinY = Randomizer.nextInt(0,8);
        coinY = coinY*50;
        coinX = coinX*50;
        if(coinX==setX){
            if(coinY==setY){
                makeCoin();
            }
        }
        if(coinX==setX2){
            if(coinY==setY2){
                makeCoin();
            }
        }
        coin.setPosition(coinX,coinY);
        add(coin);
    }
}
function makeGrid(){
    var gridXPos = 50;
    for(var i=0;i<7;i++){
        makeGridX(gridXPos);
        gridXPos = gridXPos + 50;
    }
    var gridYPos = 50;
    for(var i=0;i<9;i++){
        makeGridY(gridYPos);
        gridYPos = gridYPos + 50;
    }
}
function makeGridX(x){
    var exLn = new Line(x,0,x,450);
    exLn.setColor(Color.grey);
    exLn.setLineWidth(1);
    add(exLn);
}
function makeGridY(y){
    var exLn = new Line(0,y,getWidth(),y);
    exLn.setColor(Color.grey);
    exLn.setLineWidth(1);
    add(exLn);
}
function bottomBar(){
    var bB = new Rectangle(getWidth(),30);
    bB.setPosition(0,getHeight()-bB.getHeight());
    bB.setColor(Color.grey);
    add(bB);
}