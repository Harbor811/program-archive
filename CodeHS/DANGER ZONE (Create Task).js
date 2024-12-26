// This code is indended to be run in the CodeHS JS Graphics Environment
// This was made for my Create Task project in CSP and got me a 5 on the AP Exam :>

"use strict";
setSize(400,400);
var TICK = parseInt(prompt("Tickspeed (default-10): "));//ms
if(TICK < 0 || isNaN(TICK)){
    TICK = 10;
}
var MAX_OBST = parseInt(prompt("Max Obstacles (default-6): "));
if(MAX_OBST < 0 || isNaN(MAX_OBST)){
    MAX_OBST = 6;
}
var COLS1 = [Color.red, Color.green, Color.cyan]
var COLS2 = [Color.yellow, Color.orange, Color.purple];
var BG = new Rectangle(getWidth(), getHeight());
var P1 = new Rectangle(10, 10);
var P2 = new Rectangle(10, 10);
// Player info! Format: Color, dx, dy, cooldown, #ofWins
var P1_INF = [COLS1[Randomizer.nextInt(0, COLS1.length - 1)], 1, 0, 0, 0];
var P2_INF = [COLS2[Randomizer.nextInt(0, COLS2.length - 1)], -1, 0, 0, 0];
var P1_OBJS = [];
var P2_OBJS = [];
var OBSTS = [];

function start(){
    P1_INF[1] = 1, P1_INF[2] = 0, P1_INF[3] = 0;
    P2_INF[1] = -1, P2_INF[2] = 0, P2_INF[3] = 0;
    BG.setColor(Color.black);
    BG.setPosition(0,0);
    add(BG);
    
    drawMap();
    setup();
    keyDownMethod(keyDown);
    setTimer(gameLoop, TICK);
    
    println(P1_INF[4] + " | " + P2_INF[4]);
}
    
function setup(){
    P1.setColor(P1_INF[0]);
    P1.setPosition(40, 40);
    P1.setAnchor({vertical: 0.5, horizontal: 0.5});
    add(P1);
    P1_OBJS.push(P1);
    
    P2.setColor(P2_INF[0]);
    P2.setPosition(getWidth() - 40, getHeight() - 40);
    P2.setAnchor({vertical: 0.5, horizontal: 0.5});
    add(P2);
    P2_OBJS.push(P2);
}

function keyDown(e){
    if(P1_INF[3] <= 0){
        if(e.key == "w" && P1_INF[2] == 0){
            P1.setRotation(270);
            P1_INF[1] = 0;
            P1_INF[2] = -1;
            P1_INF[3] = 4;
        }else if(e.key == "a" && P1_INF[1] == 0){
            P1.setRotation(180);
            P1_INF[1] = -1;
            P1_INF[2] = 0;
            P1_INF[3] = 4;
        }else if(e.key == "s" && P1_INF[2] == 0){
            P1.setRotation(90);
            P1_INF[1] = 0;
            P1_INF[2] = 1;
            P1_INF[3] = 4;
        }else if(e.key == "d" && P1_INF[1] == 0){
            P1.setRotation(0);
            P1_INF[1] = 1;
            P1_INF[2] = 0;
            P1_INF[3] = 4;
        }
    }
    
    if(P2_INF[3] <= 0){
        if(e.key == "i" && P2_INF[2] == 0){
            P2.setRotation(270);
            P2_INF[1] = 0;
            P2_INF[2] = -1;
            P2_INF[3] = 4;
        }else if(e.key == "j" && P2_INF[1] == 0){
            P2.setRotation(180);
            P2_INF[1] = -1;
            P2_INF[2] = 0;
            P2_INF[3] = 4;
        }else if(e.key == "k" && P2_INF[2] == 0){
            P2.setRotation(90);
            P2_INF[1] = 0;
            P2_INF[2] = 1;
            P2_INF[3] = 4;
        }else if(e.key == "l" && P2_INF[1] == 0){
            P2.setRotation(0);
            P2_INF[1] = 1;
            P2_INF[2] = 0;
            P2_INF[3] = 4;
        }
    }
    
    if(P1_OBJS.length == 1 || P2_OBJS.length == 1){
        if(e.key == "Enter"){
            P1_OBJS = [];
            P2_OBJS = [];
            OBSTS = [];
            removeAll();
            start();
        }
    }
}

function gameLoop(){ // This will run every tick!
    P1_OBJS.push(drawPt(P1.getX(), P1.getY(), P1_INF[0]));
    P2_OBJS.push(drawPt(P2.getX(), P2.getY(), P2_INF[0]));
    P1.setPosition(P1.getX() + P1_INF[1]*2, P1.getY() + P1_INF[2]*2);
    P2.setPosition(P2.getX() + P2_INF[1]*2, P2.getY() + P2_INF[2]*2);
    
    if(P1_INF[3] > 0){
        P1_INF[3]--;
    }
    if(P2_INF[3] > 0){
        P2_INF[3]--;
    }
    
    if(isHit(P1) && isHit(P2)){
        stopTimer(gameLoop);
        println("It's a tie!");
        plink(0);
        P1_INF[3] = 100;
        P2_INF[3] = 100;
        P1_INF[4] += 0.5;
        P2_INF[4] += 0.5;
    }else if(isHit(P1)){
        stopTimer(gameLoop);
        println("P2 Wins!");
        plink(1);
        P1_INF[3] = 100;
        P2_INF[3] = 100;
        P2_INF[4] += 1;
    }else if(isHit(P2)){
        stopTimer(gameLoop);
        println("P1 Wins!");
        plink(2);
        P1_INF[3] = 100;
        P2_INF[3] = 100;
        P1_INF[4] += 1;
    }
    
    function plink(p){
        if(p != 2){
            setTimer(eraseLast, TICK);
        }
        if(p != 1){
            setTimer(eraseLast, TICK);
        }
        
        function eraseLast(){
            var len = 5;
            for(var i = len; i < len * 3; i++){
                if(p != 2) if(i + 1 < P1_OBJS.length){
                    P1_OBJS[i + 1].color = "#FFFFFF";
                }else{
                    P1_OBJS[0].color = "#FFFFFF";
                }
                if(p != 1) if(i + 1 < P2_OBJS.length){
                    P2_OBJS[i + 1].color = "#FFFFFF";
                }else{
                    P2_OBJS[0].color = "#FFFFFF";
                }
            }
            for(var i = 0; i < len; i++){
                if(p != 2){
                    P1_OBJS[1].alive = false;
                    P1_OBJS.splice(1,1);
                }
                if (p != 1){
                    P2_OBJS[1].alive = false;
                    P2_OBJS.splice(1,1);
                }
                if(P1_OBJS.length == 1 || P2_OBJS.length == 1){
                    stopTimer(eraseLast);
                    break;
                }
            }
        }
    }
}

// Precondition: anchor pos is {0.5, 0.5}
function isHit(e){
    if(e.getX() - e.getWidth()/2 - 1 <= 20 || e.getY() - e.getHeight()/2-1 <= 20 ||
       e.getX() + e.getWidth()/2 + 1 >= getWidth() - 20 || e.getY() + e.getHeight()/2+1 >= getHeight() - 20){
        return true;
    }
    for(var xMod = -1.0; xMod <= 1.0; xMod++){
        for(var yMod = -1.0; yMod <= 1.0; yMod++){
            var player = 0;
            if(e === P1_OBJS[0]){
                player = 1;
            }else if(e === P2_OBJS[0]){
                player = 2;
            }
            for(var curObj = 1; curObj < P1_OBJS.length; curObj++){
                if(!(player == 1 && curObj >= P1_OBJS.length - 6) && (e.getX() + ((e.getWidth()/2 + 1) * xMod) == P1_OBJS[curObj].getX() &&
                   e.getY() + ((e.getHeight()/2 + 1) * yMod) == P1_OBJS[curObj].getY())){
                    return true;
                }
                if(!(player == 2 && curObj >= P2_OBJS.length - 6) && (e.getX() + ((e.getWidth()/2 + 1) * xMod) == P2_OBJS[curObj].getX() && 
                   e.getY() + ((e.getHeight()/2 + 1) * yMod) == P2_OBJS[curObj].getY())){
                    return true;
                }
            }
            for(var cur = 0; cur < OBSTS.length; cur++){
                if(e.getX() + ((e.getWidth()/2 + 1) * xMod) >= OBSTS[cur].getX() - OBSTS[cur].getWidth() / 2 &&
                   e.getX() + ((e.getWidth()/2 + 1) * xMod) <= OBSTS[cur].getX() + OBSTS[cur].getWidth() / 2 &&
                   e.getY() + ((e.getHeight()/2 + 1)* yMod) >= OBSTS[cur].getY() - OBSTS[cur].getHeight() / 2 &&
                   e.getY() + ((e.getHeight()/2 + 1)* yMod) <= OBSTS[cur].getY() + OBSTS[cur].getHeight() / 2){
                    return true;
                }
            }
        }
    }
    return false;
}

function drawMap(){
    for(var i = 0; i < getWidth(); i += getWidth()/10){
        drawLine("x", i, "#212121");
        drawLine("y", i, "#212121");
    }
    drawLine("x", 20);
    drawLine("x", getHeight() - 20);
    drawLine("y", 20);
    drawLine("y", getWidth() - 20);
    for(var i = 0; i < Randomizer.nextInt(0, MAX_OBST); i++){
        drawObst();
    }
}

function drawLine(axis, pos, col){
    if(axis == "x"){
        var ln = new Line(0, pos, getWidth(), pos);
    }else{
        var ln = new Line(pos, 0, pos, getHeight());
    }
    
    if(col != null){
        ln.setColor(col);
    } else {
        ln.setColor(Color.white);
    }
    add(ln);
}

function drawObst(){
    var obst = new Rectangle(Randomizer.nextInt(50, 100), Randomizer.nextInt(50, 100));
    obst.setAnchor({vertical: 0.5, horizontal: 0.5});
    obst.setPosition(0, 0);
    var attempts = 0;
    while(isHit(obst)){ 
        obst.setPosition(Randomizer.nextInt(20 + obst.getWidth()/2, getWidth() - 20 - obst.getWidth()/2), Randomizer.nextInt(60 + obst.getHeight()/2, getHeight() - 60 - obst.getHeight()/2));
        attempts++;
        if(attempts > 15000){
            println("Safe Obstacle Generation failed! Watch out!");
            break;
        }
        obst.setBorderColor(Color.white);
    }
    obst.lineWidth = 2;
    obst.filled = false;
    obst.hasBorder = true;

    add(obst);
    
    OBSTS.push(obst);
}

function drawPt(x, y, col){
    var pt = new Rectangle(4, 4);
    pt.setAnchor({vertical: 0.5, horizontal: 0.5});
    pt.setPosition(x, y);
    if(pt != null){
        pt.setColor(col);
    }else{
        pt.setColor(Color.white);
    }
    add(pt);
    return pt;
}