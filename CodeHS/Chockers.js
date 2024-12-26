// This code is intended to run in the CodeHS JS Graphics Environment

var gameArr = [];
var turn = 1;
var curSelected = null;
var onDoubleJump = false;

var SQR_SIZE = getWidth()/4;
var COLS;
var COLS_IND = 1;
var IMGS = {
    w1: "https://codehs.com/uploads/a4ac17dc81ae415f507b3aff6836dbd4",
    w2: "https://codehs.com/uploads/5e8b65b6ecf86adec348b4adbe53b053",
    b1: "https://codehs.com/uploads/d0f506308f398b862a839b993e127584",
    b2: "https://codehs.com/uploads/aee94827def9be5cdd568f0867cec372"
}

function start(){
    var size = prompt("Choose a size (default: 400)\nRange: (10 - ∞)");
    
    size = parseInt(size);
    
    if(size < 10 || isNaN(size)){
        size = 400;
    }
    
    setSize(size,size);
    SQR_SIZE = getWidth()/8;
    
    UPDATE_COLS();
    
    drawGrid();
    initArray();
    mouseClickMethod(mouseClicked);
    keyDownMethod(keyDown);
    
    println("Press up & down arrow keys to change the color scheme!");
}

// User input method, for keyboard
function keyDown(e){
    if(e.keyCode == 38){ // 38 is the code for up arrow key
        COLS_IND++;
        if(COLS_IND > 3){
            COLS_IND = 0;
        }
        UPDATE_COLS();
        updateGrid();
    }else if(e.keyCode == 40){ // 40 is the code for down arrow key
        COLS_IND--;
        if(COLS_IND < 0){
            COLS_IND = 3;
        }
        UPDATE_COLS();
        updateGrid();
    }
}

function UPDATE_COLS(){
    if(COLS_IND == 0){
        COLS = {
            a: "#894827",
            b: "#dfbf95",
            c: "#bb7b40"
        }
    }else if(COLS_IND == 1){
        COLS = {
            a: "#7d945d",
            b: "#eeeed5",
            c: "#f7f783"
        }
    }else if(COLS_IND == 2){
        COLS = {
            a: "#d4a369",
            b: "#ecc9a1",
            c: "#f2d076"
        }
    }else if(COLS_IND == 3){
        COLS = {
            a: "#4d6d92",
            b: "#ececd7",               
            c: "#75c7e8"
        }
    }
}

// User input method, for mouse
function mouseClicked(e){
    // Get mouse pos to grid
    var x = Math.floor(e.getX() / SQR_SIZE);
    var y = Math.floor(e.getY() / SQR_SIZE);
    if(x < 0 || x > 7 || y < 0 || y > 7){
        return;
    }
    
    // Get piece at pos, if any
    var piece = getPieceAt(x, y);
    if(piece != null){curSelected = piece;}
    var sqr = getElementAt(x * SQR_SIZE, y * SQR_SIZE);

    // Move Making statement
    if(sqr.color == COLS.c && piece == null){
        onDoubleJump = false;
        
        // Eliminating Pieces
        if(Math.abs(curSelected.x - x) == 2){
            piece = getPieceAt(curSelected.x - (curSelected.x - x)/2,
                               curSelected.y - (curSelected.y - y)/2);
            piece.remove();
            onDoubleJump = true;
        }
        
        if((curSelected.col == 1 && y == 0) ||
           (curSelected.col == -1 && y == 7)){
            curSelected.setKing();
        }
        
        curSelected.x = x;
        curSelected.y = y;
        curSelected.updatePos();
        
        // For Double, triple, quadruple jump
        
        unhighlightAll();
        
        if(!(onDoubleJump && highlightAll(curSelected, sqr, true))){
            turn *= -1;
            unhighlightAll();
            onDoubleJump = false;
        }
        
        return;
    }

    unhighlightAll();
    
    if(onDoubleJump){
        turn *= -1;
        onDoubleJump = false;
        return;
    }
    if(piece == null){
        return;
    }
    if(turn == piece.col){
        highlightAll(piece, sqr, false);
    }
}

function highlightAll(piece, sqr, onDouble){
    // Highlight Legal Moves (so you can check for color on another click){
    sqr.setColor(COLS.c);
    var isKing = piece.isKing;
    var y = -piece.col;
    var hasDoubleJump = false;
    while(true){
        for(var x = -1; x <= 1; x+=2){
            if(moveIsSafe(piece.x + x) && moveIsSafe(piece.y + y)){
                var checkPiece = getPieceAt(piece.x + x, piece.y + y);
                
                if(checkPiece == null){ // Square is empty
                    if(!onDouble){
                        highlightSqr(piece.x + x, piece.y + y);
                    }
                }else if(checkPiece.col != piece.col){ // Dif colored piece
                    if(moveIsSafe(piece.x + x*2) && moveIsSafe(piece.y + y*2)
                    && getPieceAt(piece.x + x*2, piece.y + y*2) == null){
                        hasDoubleJump = true;
                        highlightSqr(piece.x + x*2, piece.y + y*2);
                    }
                }
            }
        }
        if(isKing){
            y *= -1;
            isKing = false;
        }else{
            break;
        }
    }
    
    return hasDoubleJump;
    
    // Function that checks if move is on the board or not
    function moveIsSafe(pos){
        return pos >= 0 && pos < 8;
    }
}
    
function unhighlightAll(){
    for(var row = 0; row < 8; row++){
        for(var col = 0; col < 8; col++){
            var curSq = getElementAt(row * SQR_SIZE, col * SQR_SIZE);
            if(curSq.color == COLS.c){
                curSq.setColor(COLS.a);
            }
        }
    }
}

function highlightSqr(x, y){
    getElementAt(x*SQR_SIZE, y*SQR_SIZE).setColor(COLS.c);
}

function getPieceAt(posX, posY){
    for(var i = 0; i < gameArr.length; i++){
        var cur = gameArr[i];
        if(cur.x == posX && cur.y == posY){
            return cur;
        }
    }
    
    return null;
}

function initArray(){
    for(var row = 0; row < 8; row++){
        for(var col = 0; col < 8; col++){
            if((row + col) % 2 != 0){
                if(row < 3){
                    gameArr.push(createGameObj(-1, col, row));
                }else if(row > 4){
                    gameArr.push(createGameObj(1, col, row));
                }
            }
        }
    }
    
    function createGameObj(col, posX, posY){
        if(col == 1){ // black
            var tempImg = IMGS.b1;
        }else{ // white
            var tempImg = IMGS.w1;
        }
        var objImg = new WebImage(tempImg);
        
        objImg.setSize(getWidth()/10, getHeight()/10);
        
        add(objImg);
        
        var obj = {
            col: col,
            img: objImg,
            x: posX,
            y: posY,
            isKing: false,
            updatePos: function(){
                this.img.setPosition(this.x * SQR_SIZE + (SQR_SIZE /2 - (this.img.getWidth()/2)), this.y * SQR_SIZE + (SQR_SIZE /2 - (this.img.getHeight()/2)));
            },
            setKing: function(){
                if(this.isKing){
                    return;
                }
                this.isKing = true;
                if(col == 1){ // black
                    tempImg = IMGS.b2;
                }else{ // white
                    tempImg = IMGS.w2;
                }
                this.img.setImage(tempImg);
                this.img.setSize(getWidth()/10, getHeight()/10);
            },
            remove: function(){
                for(var i = 0; i < gameArr.length; i++){
                    var cur = gameArr[i];
                    if(cur.x == this.x && cur.y == this.y){
                        gameArr.splice(i, 1);
                        remove(this.img);
                        return;
                    }
                }
            }
        };
        
        obj.updatePos();
        
        return obj;
    }
}

function drawGrid(){
    for(var row = 0; row < 8; row++){
        for(var col = 0; col < 8; col++){
            drawSquare(row, col, (row + col) % 2);
        }
    }
    
    function drawSquare(x, y, col){
        var sq = new Rectangle(SQR_SIZE, SQR_SIZE);
        if(col == 1){
            sq.setColor(COLS.a);
        }else{
            sq.setColor(COLS.b);
        }
        sq.setPosition(x * SQR_SIZE, y * SQR_SIZE);
        add(sq);
    }
}

function updateGrid(){
    for(var row = 0; row < 8; row++){
        for(var col = 0; col < 8; col++){
            if((row + col) % 2 != 0){
                getElementAt(row * SQR_SIZE, col * SQR_SIZE).setColor(COLS.a);
            }else{
                getElementAt(row * SQR_SIZE, col * SQR_SIZE).setColor(COLS.b);
            }
        }
    }
}