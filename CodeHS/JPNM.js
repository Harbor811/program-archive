// This code is indended to be run in the CodeHS JS Graphics Environment

setSize(560,315);
//variables
var staticCol = {
    blue: "#00ffff",
    pink: "#ff007f",
    bg: "ERROR"
};
var BACKGROUND_COLS = ["#1e1b1b","#000000","#141d26","#240112","#292828"];
var TIME = 1; //for looks, slo-mo effect
var P_REP_RATE = 5;
var P_REP_STEP = P_REP_RATE;
var CAN_DEL_P = false;
var NUM_OBSTACLES = 2;
var TERRAIN_WIDTH = 25;
var TMAX_HEIGHT = 50;
var TMIN_HEIGHT = 10;
var DELAY = 10;
var MAX_DY = 5;

var GAMEMODE = 0;
var rotateOb = false;
var obstacle;
var cpArr = [];
var obstacles = [];
var particleArr = [];
var particleYArr = [];
var exPArr = [];
var exPXArr = [];
var exPYArr = [];
var whiteScreen = new Rectangle(getWidth(),getHeight());
var tempTFS = false; //true/false switch, used for animation
var collSide = "ERROR";
var score = new Text(0,"25pt Monospace");
var scoreRot = 0;
var scoreRotDig = 0;
var scoreRotDir="up";
var points = 0;
var obstacleEnabled = true;

var terrainBorder = 0;
var terrainArrUp = [];
var terrainArrDn = [];
var copter; //global var 
var copterDir = "down"; //global var for heli direction
var dY = 0;
var terrainSpikes = false;
var spikesBuffer = 0;


//MENU VARS
var startButton = new Rectangle(getWidth()/2.5,getHeight()/2.5);
var modeButton = new Rectangle(getWidth()/2.5,getHeight()/2.5);
var startText = new Text("PLAY","25pt Monospace");
var modeText = new Text("NORMAL","25pt Monospace");
var mousePos;
var canStart = false;
var canMode = false;
var willStart = false;
var willMode = false;

//MENU FUNCTIONS
function start(){
    setBackgroundColor(Color.black);
    staticCol["bg"] = "Color.black";
    var gameText = new Text("Just Polygons No Music","25pt Monospace");
    var gameSubtext = new Text("(JPNM)","20pt Monospace");
    gameText.setPosition(getWidth()/2-gameText.getWidth()/2,getHeight()/3.5);
    gameSubtext.setPosition(getWidth()/2-gameSubtext.getWidth()/2,gameText.getY()+gameSubtext.getHeight()*2);
    gameText.setColor(staticCol["blue"]);
    gameSubtext.setColor(staticCol["pink"]);
    add(gameText);
    add(gameSubtext);
    startButton.setPosition(getWidth()/12,getHeight()/2);
    add(startButton);
    modeButton.setPosition(getWidth()-getWidth()/12-modeButton.getWidth(),getHeight()/2);
    add(modeButton);
    startText.setColor(staticCol["blue"]);
    startText.setPosition(startButton.getX()+startButton.getWidth()/2-startText.getWidth()/2,
                            startButton.getY()+startButton.getHeight()/2+startText.getHeight()/3);
    add(startText);
    modeText.setColor(staticCol["blue"]);
    modeText.setPosition(modeButton.getX()+modeButton.getWidth()/2-modeText.getWidth()/2,
                            modeButton.getY()+modeButton.getHeight()/2+modeText.getHeight()/3);
    add(modeText);
    mouseMoveMethod(mouseMove);
    mouseDownMethod(menuMouseDown);
    mouseUpMethod(menuMouseUp);
}
function mouseMove(e){
    mousePos = getElementAt(e.getX(),e.getY());
    if(mousePos==startButton||mousePos==startText){
        startButton.setColor(staticCol["blue"]);
        startText.setColor(Color.black);
        canStart = true;
        if(willStart == true){
            startButton.setColor(Color.white);
            startText.setColor(Color.black);
        }
    }else{
        startButton.setColor(Color.black);
        startText.setColor(staticCol["blue"]);
        canStart = false;
        willStart = false;
    }
    if(mousePos==modeButton||mousePos==modeText){
        if(GAMEMODE==0){
            modeButton.setColor(staticCol["blue"]);
        }else if(GAMEMODE==1){
            modeButton.setColor(Color.white);
        }else if(GAMEMODE==2){
            modeButton.setColor(staticCol["pink"]);
        }
        canMode = true;
        modeText.setColor(Color.black);
    }else{
        modeButton.setColor(Color.black);
        if(GAMEMODE==0){
            modeText.setText("NORMAL");
            modeText.setColor(staticCol["blue"]);
        }else if(GAMEMODE==1){
            modeText.setText("ENDLESS");
            modeText.setColor(Color.white);
        }else if(GAMEMODE==2){
            modeText.setText("IMPOSSIBLE");
            modeText.setColor(staticCol["pink"]);
        }
        canMode = false;
        willMode = false;
    }
    modeText.setPosition(modeButton.getX()+modeButton.getWidth()/2-modeText.getWidth()/2,
                            modeButton.getY()+modeButton.getHeight()/2+modeText.getHeight()/3);
}
function menuMouseDown(e){
    if((mousePos==startButton||mousePos==startText)&&canStart==true){
        willStart = true;
        startButton.setColor(Color.white);
    }
    if((mousePos==modeButton||mousePos==modeText)&&canMode==true){
        willMode = true;
    }
}
function menuMouseUp(e){
    if(willStart==true){
        removeAll();
        setup();
    }
    if(willMode==true){
        willMode=false;
        if(GAMEMODE==2){
            GAMEMODE=0;
        }else{
            GAMEMODE++;
        }
        if(GAMEMODE==0){
            modeText.setText("NORMAL");
            modeButton.setColor(staticCol["blue"]);
        }else if(GAMEMODE==1){
            modeText.setText("ENDLESS");
            modeButton.setColor(Color.white);
        }else if(GAMEMODE==2){
            modeText.setText("IMPOSSIBLE");
            modeButton.setColor(staticCol["pink"]);
        }
        modeText.setColor(Color.black);
    }
    modeText.setPosition(modeButton.getX()+modeButton.getWidth()/2-modeText.getWidth()/2,
                            modeButton.getY()+modeButton.getHeight()/2+modeText.getHeight()/3);
}
//GAME FUNCTIONS
function setup(){
    setTimer(move, DELAY*TIME);
    score.setColor("#ff007fAA");
    score.setPosition(getWidth()/2-score.getWidth()/2,getHeight()/2+score.getHeight()/2);
    add(score);
    
    var bgCol = Randomizer.nextInt(0,4);
    setBackgroundColor(BACKGROUND_COLS[bgCol]);
    staticCol["bg"] = BACKGROUND_COLS[bgCol];
    
    copter = new Rectangle(30,15);
    copter.setColor(staticCol["blue"]);
    /*copter = new WebImage(ImageLibrary.Objects.helicopter);
    copter.setSize(50,25);*/
    copter.setSize(30,15);
    copter.setPosition(getWidth()/4,getHeight()/2);
    add(copter);
    mouseDownMethod(upPassed);
    mouseUpMethod(notUpPass);
    keyDownMethod(upPassed);
    keyUpMethod(notUpPass);
    
    makeObstacle(NUM_OBSTACLES);
    
    if(GAMEMODE==1){
        TERRAIN_WIDTH = 25;
        TMAX_HEIGHT = 50;
        TMIN_HEIGHT = 20;
    }else if(GAMEMODE==2){
        obstacleEnabled = false;
        TERRAIN_WIDTH = 50;
        TMAX_HEIGHT = 200; //120
        TMIN_HEIGHT = 200;  //50
        removeObstacle();
    }
}
function move(){
    moveCP();
    if(CAN_DEL_P == true){    
        remove(particleArr[0]);
        particleArr.remove(0);
        particleYArr.remove(0);
        CAN_DEL_P = false;
    }
    points++;
    if(copterDir=="down" && dY<MAX_DY){
        dY+=0.5;
    }else if(copterDir=="up" && dY>-MAX_DY){
        dY-=0.5;
    }
    copter.move(0,dY);
    copter.setRotation(dY*3);
    if(obstacleEnabled==true){
        obstacleMove();
    }
    checkColl();
    moveParticles();
    moveTerrain();
    animateScore();
    if(GAMEMODE==0){
        pointTrigger();
    }
}
function pointTrigger(){
    if(points%500==0){
        whiteScreen.setColor(Color.white);
        tempTFS = false;
        setTimer(tempFlash,DELAY*7);
        removeCP();
    }
    if(points%500==422){
        makeCP();
    }
    if((points%2000)==1000){
        terrainSpikes = true;
        spikesBuffer = 0;
    }else if((points%2000)==0){
        terrainSpikes = false;
        TMAX_HEIGHT = 50;
        TMIN_HEIGHT = 20;
    }
    if((points%2500)==500){
        obstacleEnabled = true;
        makeObstacle(NUM_OBSTACLES);
        TMIN_HEIGHT = 50;
        TMAX_HEIGHT = 50;
    }
    if((points%2500)==1000){
        TMIN_HEIGHT = 60;
        TMAX_HEIGHT = 90;
        terrainSpikes = true;
        obstacleEnabled = false;
        removeObstacle();
    }
    if((points%3000)==1500){
        obstacleEnabled = true;
        makeObstacle(NUM_OBSTACLES);
        TMIN_HEIGHT = 50;
        TMAX_HEIGHT = 50;
    }
        //LONG HALLWAY
        //obstacleEnabled = true;
        //makeObstacle(NUM_OBSTACLES);
        //terrainSpikes = true;
        //TMIN_HEIGHT = 50;
        //TMAX_HEIGHT = 50;
        
        //HARD HALLWAY
        //TMIN_HEIGHT = 75;
        //TMAX_HEIGHT = 100;
        //terrainSpikes = true;
        //obstacleEnabled = false;
        //removeObstacle();
        
        //BREAK ROOM
        //TMIN_HEIGHT = 20;
        //TMAX_HEIGHT = 60;
        //obstacleEnabled = true;
        //makeObstacle(NUM_OBSTACLES);
        //terrainSpikes = false;
}
function animateScore(){
    var simplePts = (Math.floor(points/10))*10;
    score.setText(simplePts);
    score.setPosition(getWidth()/2-score.getWidth()/2,getHeight()/2+score.getHeight()/2);
    if(scoreRotDig<-18){
        scoreRotDir="up";
    }
    if(scoreRotDig>18){
        scoreRotDir="down";
    }
    if(scoreRotDir=="up"&&scoreRot<=0.25){
        scoreRot+=0.05;
        score.move(-1,0);
    }
    if(scoreRotDir=="down"&&scoreRot>=-0.25){
        scoreRot-=0.05;
        score.move(1,0);
    }
    score.rotate(scoreRot);
    scoreRotDig+=scoreRot;
}
function checkColl(){
    if(hitWall()==true||(getCollider(copter)!=null&&getCollider(copter)!=score&&getCollider(copter)!=whiteScreen)){
        TIME=1;
        P_REP_RATE = 0;
        P_REP_STEP = P_REP_RATE;
        stopTimer(move);
        setTimer(slowTime, 1);
        copter.setColor(Color.white);
        if(getCollider(copter)!=null){
            rotateOb = true;
            obstacle = getCollider(copter);
        }
        for(var i=0;i<particleArr.length;i++){
            var cur = particleArr[i];
            remove(cur);
        }
    }
}
function moveParticles(e){
    if(P_REP_RATE==P_REP_STEP){
        var p = new Rectangle(4,4);
        p.setColor("#8ceeff55");
        p.setPosition(copter.getX(),copter.getY()+copter.getHeight()/2);
        p.setRotation(Randomizer.nextInt(0,89));
        add(p);
        if(e!=null){
            exPArr.push(p);
            exPXArr.push(Randomizer.nextInt(-10,0));
            exPYArr.push(Randomizer.nextInt(-5,5));
        }else{
            particleArr.push(p);
            particleYArr.push(Randomizer.nextInt(-2,2)*(dY/2));
        }
        P_REP_STEP = 0;
    }else{
        P_REP_STEP++;
    }
    if(e==null){
        for(var i=0;i<particleArr.length;i++){
            var cur = particleArr[i];
            cur.move(-6*TIME,particleYArr[i]*TIME);
        }
    }else{
        for(var j=0;j<exPArr.length;j++){
            var cur = exPArr[j];
            cur.move(exPXArr[j]*TIME,exPYArr[j]*TIME);
        }
    }
    if(particleArr.length>0){
        if(particleArr[0].getX()<0){
            CAN_DEL_P = true;
        }
    }
}
function slowTime(){
    moveCP();
    remove(score);
    for(var t = 0;t<terrainArrUp.length;t++){
        var curobj = terrainArrUp[t];
        curobj.move(-5*TIME,0);
        var curobj = terrainArrDn[t];
        curobj.move(-5*TIME,0);
    }
    moveParticles("up");
    obstacleMove();
    copter.move(-5*TIME,0);
    if(rotateOb==true){
        if(collSide=="TL"||collSide=="BR"){
            obstacle.rotate(2*TIME);
            obstacle.move(3*TIME,0);
            if(collSide=="TL"){
                obstacle.move(0,-1*TIME);
            }
        }else if(collSide=="TR"||collSide=="BL"){
            obstacle.move(3*TIME,0);
            obstacle.rotate(-2*TIME);
            if(collSide=="BL"){
                obstacle.move(0,1*TIME);
            }
        }else{
            obstacle.move(-2*TIME,0);        
        }
    }
    TIME-=0.025;
    if(tempTFS==false){
        tempTFS = true;
        copter.move(-3,0);
    }else{
        tempTFS = false;
        copter.move(3,0);
    }
    if(TIME<=0){
        stopTimer(slowTime);
        copterExplode();
    }
}
function copterExplode(){
    whiteScreen.setColor(Color.white);
    tempTFS = false;
    setTimer(tempFlash,DELAY);
    endGame();
}
function tempFlash(){
    if(tempTFS == false){
        add(whiteScreen);
        tempTFS = true;
        var bgCol = Randomizer.nextInt(0,4);
        setBackgroundColor(BACKGROUND_COLS[bgCol]);
        staticCol["bg"] = BACKGROUND_COLS[bgCol];
    }else{
        tempTFS = false;
        remove(whiteScreen);
        stopTimer(tempFlash);
    }
}
function endGame(){
    removeAll();
    var endText = new Text("You Lose","35pt Monospace");
    var scoreFinal = new Text("Score: "+points,"15pt Monospace");
    var endModeText = new Text("Difficulty: " + modeText.getText(), "20pt Monospace");
    endText.setColor(staticCol["pink"]);
    scoreFinal.setColor(Color.white);
    endModeText.setColor(Color.white);
    endText.setPosition(getWidth()/2 - endText.getWidth()/2,getHeight()/2 - endText.getHeight()/2);
    scoreFinal.setPosition(getWidth()/2 - scoreFinal.getWidth()/2,getHeight()/2 + scoreFinal.getHeight()/2 + endText.getHeight()*1.5);
    endModeText.setPosition(getWidth()/2 - endModeText.getWidth()/2,getHeight()/2 + endModeText.getHeight()/2 + endText.getHeight()*2.5);
    add(endText);
    add(scoreFinal);
    add(endModeText);
}
function upPassed(e){
    copterDir = "up";
}
function notUpPass(e){
    copterDir = "down";
}
function makeObstacle(num){
    for(var i=0;i<num;i++){
        if(obstacles.length<NUM_OBSTACLES){
            var o = new Rectangle(TERRAIN_WIDTH,80);
            o.setColor(staticCol["pink"]);
            o.setPosition(getWidth()+getWidth()*(i/num),Randomizer.nextInt(80,getHeight()-80));
            obstacles.push(o);
            add(o);
        }
    }
}
function removeObstacle(){
    for(var i=0;i<obstacles.length;i++){
        remove(obstacles[i]);
    }
    obstacles = [];
}
function obstacleMove(){
    for(var i=0;i<obstacles.length;i++){
        var o = obstacles[i];
        o.move(-5*TIME,0);
    }
    checkOb();
}
function checkOb(){
    for(var i=0;i<obstacles.length;i++){
        var o = obstacles[i];
        if(o.getX()<=-50){
            obstacles.remove(0);
            remove(o);
            makeObstacle(1);
            o.move(-5*TIME,0);
        }
    }
}
function hitWall(){
    return(copter.getY()<=0||copter.getY()+15>=getHeight());
}
function getCollider(e){
    var topLeft = getElementAt(e.getX()-1,e.getY()-1);
    if(topLeft!=null){
        collSide = "TL";
        return(topLeft);
    }
    var topRight = getElementAt(e.getX()+e.getWidth()+1,e.getY()-1);
    if(topRight!=null){
        collSide = "TR";
        return(topRight);
    }
    var botLeft = getElementAt(e.getX()-1,e.getY()+e.getHeight()+1);
    if(botLeft!=null){
        collSide = "BL";
        return(botLeft);
    }    
    var botRight = getElementAt(e.getX()+e.getWidth()+1,e.getY()+e.getHeight()+1);
    if(botRight!=null){
        collSide = "BR";
        return(botRight);
    }
}
function makeTerrain(){
    var height1 = Randomizer.nextInt(TMIN_HEIGHT,TMAX_HEIGHT);
    var terrain1 = new Rectangle(TERRAIN_WIDTH,height1);
    terrain1.setPosition(getWidth()+5,0);
    terrain1.setColor(staticCol["pink"]);
    terrainArrUp.push(terrain1);
    add(terrain1);
    var height2 = Randomizer.nextInt(TMIN_HEIGHT,TMAX_HEIGHT);
    var terrain2 = new Rectangle(TERRAIN_WIDTH,height2);
    terrain2.setPosition(getWidth()+5,getHeight()-height2);
    terrain2.setColor(staticCol["pink"]);
    terrainArrDn.push(terrain2);
    add(terrain2);
    if(terrainSpikes==true){
        var spike1 = new Rectangle(TERRAIN_WIDTH-8,TERRAIN_WIDTH-8);
        spike1.setColor(staticCol["pink"]);
        spike1.setPosition(getWidth()+8.5,getHeight()-height2-8);
        spike1.setRotation(45);
        terrainArrDn.push(spike1);
        add(spike1);
        var spike2 = new Rectangle(TERRAIN_WIDTH-8,TERRAIN_WIDTH-8);
        spike2.setColor(staticCol["pink"]);
        spike2.setPosition(getWidth()+8.5,height1-8);
        spike2.setRotation(45);
        terrainArrUp.push(spike2);
        add(spike2);
    }
}
function moveTerrain(){
    if(terrainArrUp[0]!=null&&terrainArrDn[0].getX()<-TERRAIN_WIDTH&&terrainArrUp[0].getX()<-TERRAIN_WIDTH/*getElementAt(-TERRAIN_WIDTH,1)!=null && getElementAt(-TERRAIN_WIDTH,getHeight()-1!=null)*/){
        remove(terrainArrUp[0]);
        remove(terrainArrDn[0]);
        terrainArrDn.remove(0);
        terrainArrUp.remove(0);
        if(terrainSpikes==true){
            if(spikesBuffer!=150){ //121 bare minimum
                spikesBuffer++;
            }else{
                remove(terrainArrDn[0]);
                remove(terrainArrUp[0]);
                terrainArrDn.remove(0);
                terrainArrUp.remove(0);
            }
        }
    }
    for(var j=0;j<terrainArrUp.length;j++){
        var curobj = terrainArrUp[j];
        curobj.move(-5,0);
        var curobj = terrainArrDn[j];
        curobj.move(-5,0);
    }
    terrainBorder++;
    if(terrainBorder==10){
        makeTerrain();
        terrainBorder = 0;
    }
}
function makeCP(){
    for (var i=0;i<10;i++){
        var l = new Line(getWidth(),getHeight()*i/10,getWidth(),getHeight()*i/10+(getHeight()/10)/2);
        l.setColor(staticCol["blue"]);
        l.setLineWidth(1);
        add(l);
        cpArr.push(l);
    }
}
function moveCP(){
    for(var i=0;i<cpArr.length;i++){
        var cur = cpArr[i];
        cur.move(-5*TIME,0);
    }
}
function removeCP(){
    for (var i =0;i<cpArr.length;i++){
        var cur = cpArr[i];
        remove(cur);
    }
    cpArr = [];
}