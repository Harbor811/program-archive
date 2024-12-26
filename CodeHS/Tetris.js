// This code is intended to run in the CodeHS JS Graphics Environment

var CURTICK = 0;
var TICKSPEED = 25; // gotta be pretty slow
var SQR_SIZE = getHeight()/24; //two for top & bottom space
var LINE_CT = 0;
var LINES = "";
var SCORE = 0; // 40, 100, 300, 1200
var SCORE_TXT = "";
var GAME_GRID = []; // [REDACTED]'S IDEA BLAME HIM!!!
var P_IND = []; // complicated af but basically [y1, x1, y2, x2, y3, x3, y4, x4, col]
var NEXT_GRID = []; // MY IDEA BLAME ME!!!
var NEXT_P = [];
var HOLD_GRID = [];
var HOLD_P = [];
var DROP_IND = [];

function start(){
    updateRandPiece();
    drawStart();
    reset();
    
    mouseDownMethod(mouseDown);
    keyDownMethod(keyDown);
    setTimer(tick, 1);
}

function tick(forced){ // Game loop!
    if(CURTICK < TICKSPEED && !forced){
        CURTICK++;
        return;
    }else{
        CURTICK = 0;
    }
    
    var toMove = [];
    
    for(var i = 0; i < 8; i+=2){
        toMove.push(P_IND[i] + 1);
        toMove.push(P_IND[i+1]);
    }

    if(isSafeMove(toMove)){
        for(var i = 6; i >= 0; i -= 2){
            GAME_GRID[P_IND[i]][P_IND[i + 1]].id = 0;
            P_IND[i] += 1;
        }
        updateGrid(GAME_GRID);
    }else{
        updateRandPiece();
        checkForLines();
        updateGrid(GAME_GRID);
    }
}

function reset(){
    SCORE = 0;
    LINE_CT = 0;
    updateLineCT(0);
    updateScore(0);
    for(var i = 0; i < 20; i++){
        for(var j = 0; j < 10; j++){
            GAME_GRID[i][j].id = 0;
        }
    }
}

function keyDown(e){
    if(e.key == "a"){ // Left
        // Method: add ALL pieces (x-1) to checkSpots excluding dupes
        var toMove = [];
        
        for(var i = 0; i < 8; i+=2){
            toMove.push(P_IND[i]);
            toMove.push(P_IND[i+1]-1);
        }
        
        if(!isSafeMove(toMove)) return;
        
        for(var i = 6; i >= 0; i-=2){
            GAME_GRID[P_IND[i]][P_IND[i + 1]].id = 0;
            P_IND[i + 1] -= 1;
        }
        
        updateGrid(GAME_GRID);
        
    } else if(e.key == "d"){ // Right
        var toMove = [];
        
        for(var i = 0; i < 8; i+=2){
            toMove.push(P_IND[i]);
            toMove.push(P_IND[i+1]+1);
        }
        
        if(!isSafeMove(toMove)) return;
        
        for(var i = 0; i < 8; i+=2){
            GAME_GRID[P_IND[i]][P_IND[i+1]].id = 0;
            P_IND[i+1] += 1;
        }
        
        updateGrid(GAME_GRID);
        
    } else if(e.key == "s"){
        tick(true);
    } else if(e.key == "ArrowLeft"){ // x = y, y = -x
        if(P_IND[8] == 1){
            return; // Squares don't rotate
        }
        var distX = P_IND[5];
        var distY = P_IND[4];
        
        var newP = [];
        // Add desired move to newP, then check with isSafeMove
        for(var i = 0; i < 8; i+=2){
            newP.push((P_IND[i+1] - distX) * -1 + distY);
            newP.push(P_IND[i] - distY + distX);
        }
        
        if(isSafeMove(newP)){ // If we're replacing this piece with the new one...
            for(var i = 0; i < 8; i+=2){
                GAME_GRID[P_IND[i]][P_IND[i+1]].id = 0;
                P_IND[i] = newP[i];
                P_IND[i+1] = newP[i+1];
            }
            updateGrid(GAME_GRID);
        }
    } else if(e.key == "ArrowRight"){ // x = -y, y = x
    // fix this
        if(P_IND[8] == 1){
            return;
        }
        var distX = P_IND[5];
        var distY = P_IND[4];
        
        var newP = [];
        for(var i = 0; i < 8; i+=2){
            newP.push(P_IND[i+1] - distX + distY);
            newP.push((P_IND[i] - distY) * -1 + distX);
        }

        if(isSafeMove(newP)){
            for(var i = 0; i < 8; i+=2){
                GAME_GRID[P_IND[i]][P_IND[i+1]].id = 0;
                P_IND[i] = newP[i];
                P_IND[i+1] = newP[i+1];
            }
            updateGrid(GAME_GRID);
        }
    }else if (e.key == "ArrowUp" || e.key == "w"){
        // HOLD!
        var tempP = [];
        if(HOLD_P[0] == null){
            tempP = updateRandPiece(1);
        }else{
            tempP = HOLD_P;
        }
        
        // Put tempP at right coords
        var distY = P_IND[4];
        var distX = P_IND[5];
        var checkP = [];
        for(var i = 0; i < 8; i+=2){
            checkP.push(distY + tempP[i]);
            checkP.push(distX + tempP[i+1]);
        }
        
        if(isSafeMove(checkP)){
            newP = [];
            for(var i = 0; i < 8; i+=2){
                newP.push(P_IND[i] - distY);
                newP.push(P_IND[i+1] - distX);
                GAME_GRID[P_IND[i]][P_IND[i+1]].id = 0;
            }
            newP.push(P_IND[8]);
            HOLD_P = newP
            P_IND = checkP;
            
            updateGrid(GAME_GRID);
        }
    }else if (e.key == " "){
        updateDropHighlight();
    }else{
        println(e.key);
    }
}

function isSafeMove(toMove){
    var isSafe = true;
    for(var i = 0; i < 8; i+=2){
        var check = true;
        for(var j = 0; j < 8; j+=2) if(toMove[i] == P_IND[j] && toMove[i+1] == P_IND[j+1])check = false;
        
        if(check && (toMove[i] < 0 || toMove[i+1] < 0 || toMove[i] > 19 || toMove[i+1] > 9 || GAME_GRID[toMove[i]][toMove[i+1]].id != 0)){
            isSafe = false;
        }
    }
    return isSafe;
}

function mouseDown(e){
    if(getElementAt(e.getX(), e.getY()).isReset){
        reset();
    }
}

// Update Methods {

function updateDropHighlight(){ // highlights where piece will drop
    for(var i = 0; i < 8; i+=2){
        if(DROP_IND[8] != null){
            GAME_GRID[DROP_IND[i]][DROP_IND[i+1]].ind = 0;
        }
        DROP_IND.push(P_IND[i]+1);
        DROP_IND.push(P_IND[i+1]);
    }
    
    while(isSafeMove(DROP_IND)){
        for(var i = 0; i < 8; i+=2){
            DROP_IND[i]++;
        }
    }
    
    for(var i = 0; i < 8; i+=2){
        GAME_GRID[DROP_IND[i]][DROP_IND[i+1]].ind = 1;
    }
}

function checkForLines(){ // should be able to find line combos
    var lines = [];
    for(var y = 19; y >=0; y--){
        var trueLine = true;
        for(var x = 0; x < 10; x++){
            if(GAME_GRID[y][x].id == 0){
                trueLine = false;
            }
        }
        if(trueLine) lines.push(y);
    }
    if(lines.length > 0){
        // SCORING::
        updateScore(lines.length);
        updateLineCT(lines.length);
        
        for(var i = lines.length - 1; i >= 0; i--){
            wipeLine(lines[i]);
        }
    }
}

function wipeLine(line){
    for(var x = 0; x < 10; x++){
        GAME_GRID[line][x].id = 8;
    }
    updateGrid(GAME_GRID);
    CURTICK = 0;
    
    for(var y = line; y > 0; y--){
        for(var x = 0; x < 10; x++){
            var replace = true;
            for(var i = 0; i < 8; i += 2){
                if((y == P_IND[i] || y == P_IND[i]+1) && x == P_IND[i + 1]){
                    GAME_GRID[y][x].id = 0;
                    replace = false;
                }
                CURTICK = 0;
            }
            if(replace) GAME_GRID[y][x].id = GAME_GRID[y - 1][x].id;
        }
    }
    updateGrid(GAME_GRID);
}

function updateRandPiece(e){
    var ind = Randomizer.nextInt(1, 7);
    if(e == null && P_IND[0] != undefined){
        for(var i = 0; i < 8; i++){
            if(i % 2 == 1){
                P_IND[i] = NEXT_P[i] + 4;
            }else{
                P_IND[i] = NEXT_P[i];
            }
        }
        P_IND[8] = NEXT_P[8];
    }
    // ALL 3'd COORDS SHOULD BE THE CENTER!!!!
    if(ind == 1){
        // Square
        NEXT_P = [0, 0, 0, 1, 1, 0, 1, 1, ind];
    }else if(ind == 2){
        // Long straight
        NEXT_P = [0, 1, 1, 1, 2, 1, 3, 1, ind];
    }else if(ind == 3){
        // Weird red piece
        NEXT_P = [0, 1, 0, 2, 1, 1, 1, 0, ind];
    }else if(ind == 4){
        // Weird orange piece
        NEXT_P = [0, 0, 0, 1, 1, 1, 1, 2, ind];
    }else if(ind == 5){
        // L piece
        NEXT_P = [0, 0, 2, 0, 1, 0, 2, 1, ind];
    }else if(ind == 6){
        // J piece
        NEXT_P = [0, 1, 2, 0, 1, 1, 2, 1, ind];
    }else{
        // T piece
        NEXT_P = [0, 1, 1, 0, 1, 1, 1, 2, ind];
    }
    
    if(NEXT_GRID[0] == undefined){
        for(var y = 0; y < 4; y ++){
            NEXT_GRID[y] = [];
            for(var x = 0; x < 4; x++){
                NEXT_GRID[y][x] = drawRect(SQR_SIZE, SQR_SIZE, getWidth() - (SQR_SIZE*6.25) + (SQR_SIZE * x), SQR_SIZE * 3.25 + (SQR_SIZE*y), "#333333", true, "#000000");
                NEXT_GRID[y][x]._layer = 2;
            }
        }
    }
    
    for(var y = 0; y < 4; y++){
        for(var x = 0; x < 4; x++){
            NEXT_GRID[y][x].id = 9;
        }
    }
    
    for(var i = 0; i < 8; i+=2){
        NEXT_GRID[NEXT_P[i]][NEXT_P[i+1]].id = NEXT_P[8];
    }
    
    updateGrid(NEXT_GRID);
    
    if(e == null && P_IND[0] == undefined){
        P_IND[0] = -1;
        updateRandPiece();
    }
    
    return NEXT_P;
}

function updateLineCT(numLines){
    LINE_CT += numLines
    var cur = "";
    if(LINE_CT > 999){
        cur = "NERD";
    }else{
        cur = "" + Math.floor(LINE_CT / 100)
                     + Math.floor(LINE_CT/10 % 10)
                     + Math.floor(LINE_CT % 10);
    }
    
    LINES.setText("LINES - " + cur);
}

function updateScore(numLines){
    if(numLines == 1){
        SCORE += 40;
    }else if(numLines == 2){
        SCORE += 100;
    }else if(numLines == 3){
        SCORE += 300;
    }else if(numLines == 4){
        SCORE += 1200;
    }
    
    var nu = "";
    if(SCORE > 99999999){
        nu = "GET A LIFE";
    }else{
        var temp = SCORE;
        var cur = "";
        for(var i = 0; i < 8; i++){
            cur += Math.floor(temp % 10);
            temp /= 10;
        }
        for(var i = 7; i >= 0; i--){
            nu += cur.substring(i, i+1);
        }
    }
    SCORE_TXT.setText(nu);
}

// PRE: all P_INDs are NOT on the grid!!
function updateGrid(e){
    if(e.length > 10){
        for(var i = 0; i < 8; i+=2){
            GAME_GRID[P_IND[i]][P_IND[i + 1]].id = P_IND[8];
        }
    }
    for(var y = 0; y < e.length; y++){
        for(var x = 0; x < e[0].length; x++){
            var curInd = e[y][x].id;
            if(curInd == 0){
                e[y][x].color = "#333333";
            }else if(curInd == 1){
                e[y][x].color = "#23b04c";
            }else if(curInd == 2){
                e[y][x].color = "#01a2e9";
            }else if(curInd == 3){
                e[y][x].color = "#ed1c24";
            }else if(curInd == 4){
                e[y][x].color = "#ff7f27";
            }else if(curInd == 5){
                e[y][x].color = "#fff301";
            }else if(curInd == 6){
                e[y][x].color = "#a249a5";
            }else if(curInd == 7){
                e[y][x].color = "#3f49cd";
            }else if(curInd == 8){
                e[y][x].color = "#FFFFFF";
            }else if(curInd == 9){
                e[y][x].color = "#000000";
            }
        }
    }
}

//}

// Drawing Methods{
// Disgusting, leave closed at all costs
function drawStart(){
    drawRect(getWidth() - SQR_SIZE/2, getHeight() - SQR_SIZE/2, SQR_SIZE/4, SQR_SIZE/4, "#000000", false);
    drawRect(SQR_SIZE * 10.5, SQR_SIZE * 20.5, SQR_SIZE - SQR_SIZE/4, SQR_SIZE*3 - SQR_SIZE/4, "#FFFFFF", false);
    
    drawRect(SQR_SIZE * 10.5, SQR_SIZE * 2, SQR_SIZE - SQR_SIZE/4, SQR_SIZE /2, "#FFFFFF", false);
    drawRect(SQR_SIZE * 10, SQR_SIZE * 1.5, SQR_SIZE, SQR_SIZE - SQR_SIZE/4, "#000000", true);
    LINES = drawText("", 15, (10 * SQR_SIZE /2) + SQR_SIZE, SQR_SIZE*1.5);
    updateLineCT(0);
    
    drawRect(SQR_SIZE * 7.5, SQR_SIZE * 7.75, getWidth() - SQR_SIZE * 8.5, SQR_SIZE/2, "#FFFFFF", false);
    drawRect(SQR_SIZE * 7, SQR_SIZE * 1.5, getWidth() - SQR_SIZE * 8.25, SQR_SIZE - SQR_SIZE/4, "#000000", true);
    drawRect(SQR_SIZE * 7, SQR_SIZE * 5.5, getWidth() - SQR_SIZE * 8.25, (SQR_SIZE * 3/4) + SQR_SIZE * 1.75, "#000000", true);
    drawText("NEXT:", 15, getWidth() - (SQR_SIZE * 7.25)/2 - SQR_SIZE, SQR_SIZE*1.5);

    drawRect(SQR_SIZE * 7.5, SQR_SIZE * 7.75, getWidth() - SQR_SIZE * 8.5, SQR_SIZE * 8.5, "#FFFFFF", false);
    drawRect(SQR_SIZE * 7, SQR_SIZE * 1.5, getWidth() - SQR_SIZE * 8.25, SQR_SIZE * 8.75, "#000000", true);
    drawRect(SQR_SIZE * 7, SQR_SIZE * 5.5, getWidth() - SQR_SIZE * 8.25, SQR_SIZE * 10.5, "#000000", true);
    drawText("HOLD:", 15, getWidth() - (SQR_SIZE * 7.25)/2 - SQR_SIZE, SQR_SIZE * 9.5);

    drawRect(SQR_SIZE * 7.5, SQR_SIZE * 3.75, getWidth() - SQR_SIZE * 8.5, SQR_SIZE * 16.5, "#FFFFFF", false);
    drawRect(SQR_SIZE * 7, SQR_SIZE * 1.5, getWidth() - SQR_SIZE * 8.25, SQR_SIZE * 16.75, "#000000", true);
    drawRect(SQR_SIZE * 7, SQR_SIZE * 1.5, getWidth() - SQR_SIZE * 8.25, SQR_SIZE * 18.5, "#000000", true);
    drawText("SCORE:", 15, getWidth() - (SQR_SIZE * 7.25)/2 - SQR_SIZE, SQR_SIZE * 17.5);
    SCORE_TXT = drawText("", 15, getWidth() - (SQR_SIZE * 7.5)/2 - SQR_SIZE, SQR_SIZE * 19.25);
    updateScore();
    
    var temp = drawRect(SQR_SIZE * 7.5, SQR_SIZE * 2, getWidth() - SQR_SIZE * 8.5, getHeight() - SQR_SIZE * 2.75, "#666666", false);
    temp.isReset = true;
    temp = drawRect(SQR_SIZE * 7, SQR_SIZE * 1.5, getWidth() - SQR_SIZE * 8.25, getHeight() - SQR_SIZE * 2.5, "#333333", true);
    temp.isReset = true;
    temp = drawText("RESET", 15, getWidth() - (SQR_SIZE * 7.25)/2 - SQR_SIZE, getHeight() - SQR_SIZE * 1.75);
    temp.isReset = true;

    //10 x 20
    for(var y = 0; y < 20; y++){
        GAME_GRID[y] = [];
        for(var x = 0; x < 10; x++){
            GAME_GRID[y][x] = drawRect(SQR_SIZE, SQR_SIZE, x * SQR_SIZE + SQR_SIZE, y * SQR_SIZE + SQR_SIZE*3, "#666666", true);
            GAME_GRID[y][x].id = 0;
        }
    }
    //4 x 4
    if(NEXT_GRID[0] == undefined){
        for(var y = 0; y < 4; y++){
            NEXT_GRID[y] = [];
            for(var x = 0; x < 4; x++){
                NEXT_GRID[y][x] = drawRect(SQR_SIZE, SQR_SIZE, getWidth() - (SQR_SIZE * 6.75) + (SQR_SIZE * x), SQR_SIZE * 3.25 + (SQR_SIZE * y), "#333333", true);
                NEXT_GRID[y][x].id = 0;
            }
        }
    }
    
    if(HOLD_GRID[0] == undefined){
        for(var y = 0; y < 4; y++){
            HOLD_GRID[y] = [];
            for(var x = 0; x < 4; x++){
                HOLD_GRID[y][x] = drawRect(SQR_SIZE, SQR_SIZE, getWidth() - (SQR_SIZE * 6.75) + (SQR_SIZE * x), SQR_SIZE * 11.25 + (SQR_SIZE * y), "#333333", true);
                HOLD_GRID[y][x].id = 0;
            }
        }
    }
    
    updateGrid(GAME_GRID);
}

function drawRect(width, height, x, y, col, hasBorder, borderCol){
    var rect = new Rectangle(width, height);
    rect.setPosition(x, y);
    rect.setColor(col);
    rect.hasBorder = hasBorder;
    if(borderCol==null) rect.stroke = "#111111"; else rect.stroke = borderCol;
    add(rect);
    return rect;
}

function drawText(text, pt, x, y){
    var txt = new Text(text, pt + "pt Monospace");
    txt.setAnchor({vertical: 0.5, horizontal: 0.5});
    txt.setColor("#FFFFFF");
    txt.setPosition(x, y);
    add(txt);
    return txt;
}
//}