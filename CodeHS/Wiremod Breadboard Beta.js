// This code is indended to be run in the CodeHS JS Graphics Environment

const LAST_UPDATED = "6.2.23";
const ASSETS = {
    INFO: "Wiremod Breadboard - - - - by Harbor811\nA cool little project made by yours truly in a computer science class lol\nUpdate: due to unforseen circumstances (boredom) I've pretty much dropped this project. \nLast updated: " + LAST_UPDATED,
    PIX: {
        "m-logo":    "https://codehs.com/uploads/05154aff8f40c81c06cd24c2d814860d",
        "m-reset":   "https://codehs.com/uploads/3b9159c33cd8bb3484d581289ed64c80",
        "m-cursor":  "https://codehs.com/uploads/a8765d1fbf43af647ff72667f6c1cabe",
        "m-wire":    "https://codehs.com/uploads/4483e20a5d7cf9e167e8472f030ce1cf",
        "m-debug":   "https://codehs.com/uploads/d8e92b1c324ab511a98af27d420fa15c",
        "m-dvdebug": "https://codehs.com/uploads/45cf4a2ebabbd3faab9a6a0848ab694c",
        "m-edit":    "https://codehs.com/uploads/c51fd86bd56a2fe72ad847a7bbeb7b6b",
        
        "m-info":    "https://codehs.com/uploads/3b63b032a85b9140db34dceec0e16b04",
        
        "m-play":    "https://codehs.com/uploads/923d0c819514fa5e3b3e503dc9d4ba54",
        "m-pause":   "https://codehs.com/uploads/94e5154744bcdf65a5a565c7cf326806",
        "m-stepper": "https://codehs.com/uploads/c1f8a75bfa1da9e6bcb2f1e8e9d0abb9",
        "m-tkspn":   "https://codehs.com/uploads/0fd9772ff7cdadfaa8590ec189cf3cca",
        "m-gates":   "https://codehs.com/uploads/a285c1ec5c91f829070c80dbd053b0fe",
        "m-button":  "https://codehs.com/uploads/e1765a435ca4d75a574eebcd1b111bc2",
        "m-const":   "https://codehs.com/uploads/b273190dc986e108ca7a00c48185659d",
        "m-display": "https://codehs.com/uploads/3da925a3ebc3319a0b18be92f5b30abf",
        
        "display":   "https://codehs.com/uploads/04d3a5720da78eea3b115276da7ddbb3",
        "buttonOn":  "https://codehs.com/uploads/943902b2028b15b34d7961e9824ddadc",
        "buttonOff": "https://codehs.com/uploads/ff9b16aecb49befb26fcc3b7e93fb925"
    },
    CUSTOM: {
        "button": {
            sizeX: 5,
            sizeY: 20,
            init: function(e){
                let L = "custom-button" + boardObjs.length;
                var ret = drawButton(5 * RAT, 20 * RAT, e.getX() - 5 * RAT / 2, e.getY() - 20 * RAT / 2, ASSETS.PIX["buttonOff"], L, false);
                L = "button:" + L;
                boardObjs.push(L);
                ACTIVE[L].inputs = null;
                ACTIVE[L].outputs = {"A": 0}
                ACTIVE[L].values = {"onValue": 1, "offValue": 0};
                ACTIVE[L].onClick = function(){
                    var img = this["img"];
                    var sizeX = img.getWidth();
                    var sizeY = img.getHeight();
                    if(this.outputs["A"] == this.values["offValue"]){
                        this.outputs["A"] = this.values["onValue"];
                        img.setImage(ASSETS.PIX["buttonOn"]);
                    }else if(this.outputs["A"] == this.values["onValue"]){
                        this.outputs["A"] = this.values["offValue"];
                        img.setImage(ASSETS.PIX["buttonOff"]);
                    }else{
                        if(img.filename == ASSETS.PIX["buttonOn"]){
                            this.outputs["A"] = this.values["onValue"];
                        }else{
                            this.outputs["A"] = this.values["offValue"];
                        }
                    }
                    img.setSize(sizeX, sizeY);
                }
                ACTIVE[L].onTick = function(){};
                ACTIVE[L].del = function(){
                    remove(this["img"]);
                    delete this;
                };
                return ret;
            }
        },
        "display": {
            sizeX: 25,
            sizeY: 25,
            init: function(e){
                let label = "custom-display" + boardObjs.length;
                boardObjs.push(label);
                ACTIVE[label] = {
                    "img": drawImg(25 * RAT, 25 * RAT, e.getX() - 25 * RAT/2, e.getY() - 25 * RAT/2, ASSETS.PIX["display"], label, false),
                    inputs: {"A": 0},
                    outputs: null,
                    values: {"floorOutputs": false},
                    label: label,
                    disp: drawText("0", getWidth()/32 + "pt Monospace", e.getX(), e.getY() + this.sizeX/8, "#FFFFFF", label),
                    onClick: function(){},
                    onTick: function(){
                        this.disp.setText(this.inputs["A"]);
                    }
                };
            }
        },
        "wire": {
            init: function(){
                let l = "custom-wire" + boardObjs.length;
                ACTIVE[l] = {
                    "img": drawWire(tempWire, l),
                    refs: wireStrings,
                    onClick: function(){},
                    onTick: function(){
                        ACTIVE[this.refs[2]].inputs[this.refs[3]] = ACTIVE[this.refs[0]].outputs[this.refs[1]];
                    }
                }
                boardObjs.push(l);
                tempWire = [];
                wireStrings = [];
            }
        }
    }
};
var TICKSPEED = 500;
var RAT = 3;
var secret = "";

var curTool = "cursor";
var ACTIVE = {}; // For getting parent objects! Finally something that works!
var boardObjs = []; // Just an array of label strings, not really that important
var tempWire = [];
var wireStrings = [];
var curDragging = null;
var drawingWire = false;
var ticklight;
// Baby Blue :: #B5DBEF

function start(){
    RAT = prompt("Screen Size Mul (1-50) (default: 3)\nLeave blank if you're not sure\nIf the screen is too small, increase the number.");
    if(RAT == "" || isNaN(RAT) || RAT < 1 || RAT > 50){
        RAT = 3;
    }
    setSize(192 * RAT, 108 * RAT);
    
    //checkBack(); keyDownMethod(kd); return;
    
    drawMain();
    mouseClickMethod(onClick);
    mouseMoveMethod(onMove);
}

function kd(e){
    if(e.key == "Enter"){
        if(secret == "letmein"){
            drawMain();
            mouseClickMethod(onClick);
            mouseMoveMethod(onMove);
            secret += "z";
        }
    }
    secret += e.key;
}

function tick(){
    if(TICKSPEED > 100){
        ticklight.setColor(Color.green);
        setTimer(untick, TICKSPEED/2);
        function untick(){
            ticklight.setColor(Color.gray);
            stopTimer(untick);
        }
    }else{
        ticklight.setColor(Color.cyan);
    }
    
    for(var key in ACTIVE){
        if(key.indexOf("custom") != -1 && key.indexOf("wire") != -1){
            ACTIVE[key].onTick();
        }
    }
    for(var key in ACTIVE){
        if(key.indexOf("custom") != -1 && key.indexOf("wire") == -1){
            ACTIVE[key].onTick();
        }
    }
}

function onMove(e){
    if(curDragging != null) curDragging.setPosition(e.getX() - curDragging.getWidth()/2,e.getY() - curDragging.getHeight()/2);
}

function drawMain(){
    var bg = new Rectangle(getWidth(), getHeight());
    bg.setColor("#F0F0F0");
    bg.setPosition(0,0);
    bg.label = "board";
    add(bg);
    
    //Grid thing
    for(var i = 0; i < 18; i++) drawLine(getWidth()/17 * i, 0, getWidth()/17 * i, getHeight(), "#D6D6E0");
    for(var i = 0; i < 12; i++) drawLine(0, getHeight()/10 * i, getWidth(), getHeight()/10 * i, "#D6D6E0");
    
    // Side Panels
    drawRect(getWidth()/15, getHeight(), 0,0,"#AAAAAA", "toolbar");
    drawRect(getWidth(), getHeight()/8, 0,0,"#DDDDDD", "menu");
    
    // Defining Lines
    drawLine(getWidth()/15, 0, getWidth()/15, getHeight(), "#000000", "line");
    drawLine(0,getHeight()/8,getWidth(),getHeight()/8,"#000000", "line");
    
    drawLine(0,0,0,getHeight(),"#000000", "line");
    drawLine(getWidth(),0,0,0,"#000000", "line");
    drawLine(getWidth(),0,getWidth(),getHeight(),"#000000", "line");
    drawLine(0,getHeight(),getWidth(),getHeight(),"#000000", "line");
    
    ticklight = drawCircle(getHeight()/100, getWidth()/13, getHeight()/9, Color.gray, "ticklight");
    
    // Drawing Buttons && Defining their functions!
    drawButton(getWidth()/15+1, getWidth()/15 + 1, 0,0, ASSETS.PIX["m-reset"], "reset", true, function(){
        for(var i = 0; i < boardObjs.length; i++){
            var key = boardObjs[i];
            if(key.indexOf("wire") != -1){
                for(var j = 0; j < ACTIVE[key]["img"].length; j++){
                    remove(ACTIVE[key]["img"][j]);
                }
            }
            if(key.indexOf("display") != -1) remove(ACTIVE[key].disp);
            remove(ACTIVE[key]["img"]);
            delete ACTIVE[key];
        }
        boardObjs = [];
        println("Board cleared!");
    });
    
    let toolFunc = function(){curTool = this.label.substring(12);}
    
    drawButton(getWidth()/18, getWidth()/18, getWidth()/15/2 - getWidth()/18/2, getHeight()/6, ASSETS.PIX["m-cursor"], "tool-cursor", true, toolFunc);
    drawButton(getWidth()/18, getWidth()/18, getWidth()/15/2 - getWidth()/18/2, getHeight()/6 + getWidth()/16, ASSETS.PIX["m-wire"], "tool-wire", true, toolFunc)
    drawButton(getWidth()/18, getWidth()/18, getWidth()/15/2 - getWidth()/18/2, getHeight()/6 + getWidth()/16*2, ASSETS.PIX["m-debug"], "tool-debug", true, toolFunc);
    drawButton(getWidth()/18, getWidth()/18, getWidth()/15/2 - getWidth()/18/2, getHeight()/6 + getWidth()/16*3, ASSETS.PIX["m-edit"], "tool-edit", true, toolFunc);
    drawButton(getWidth()/18, getWidth()/18, getWidth()/15/2 - getWidth()/18/2, getHeight()/6 + getWidth()/16*4, ASSETS.PIX["m-dvdebug"], "tool-dvdebug", true, function(){println("Keep in mind this is a developer tool!"); curTool = this.label.substring(12)});
    
    drawButton(getWidth()/23, getWidth()/23, getWidth()/15/2 - getWidth()/23/2, getHeight() - getWidth()/20, ASSETS.PIX["m-info"], "info", false, function(){
        println(ASSETS.INFO);
    });
    
    drawButton(getHeight()/9, getHeight()/9, getWidth()/13, getHeight()/8/2 - getHeight()/9/2, ASSETS.PIX["m-play"], "play", false, function(){
        if(this.playing == undefined) this.playing = false;
        let img = this["img"];
        if(this.playing){
            this.playing = false;
            img.setImage(ASSETS.PIX["m-play"]);
            img.setSize(getHeight()/9, getHeight()/9);
            stopTimer(tick);
            ticklight.setColor(Color.gray);
        }else{
            this.playing = true;
            img.setImage(ASSETS.PIX["m-pause"]);
            img.setSize(getHeight()/9, getHeight()/9);
            tick();
            setTimer(tick, TICKSPEED);
        }
    });
    drawButton(getHeight()/9, getHeight()/9, getWidth()/13 + getHeight()/8, getHeight()/8/2 - getHeight()/9/2, ASSETS.PIX["m-stepper"], "stepper", false, function(){tick()});
    drawButton(getHeight()/9, getHeight()/9, getWidth()/13 + getHeight()/8*2, getHeight()/8/2 - getHeight()/9/2, ASSETS.PIX["m-tkspn"], "tickspeednum", false, function(){
        var tkSp = parseInt(prompt("Current tickspeed: " + TICKSPEED + "\nPlease input desired tickspeed delay in ms [less == faster]\nRange: (n > 0)"));
        if(isNaN(tkSp) || tkSp <= 0){
            alert("Invalid tickspeed. Resetting back to " + TICKSPEED + ".");
        }else{
            TICKSPEED = tkSp;
            alert("Tickspeed successfully set to " + TICKSPEED + ".");
        }
    });
    
    let menuFunc = function(e, label){
        curTool = "cursor";
        var sizeX = ASSETS.CUSTOM[label.substring(12)].sizeX;
        var sizeY = ASSETS.CUSTOM[label.substring(12)].sizeY;
        curDragging = drawRect(sizeX * RAT, sizeY * RAT, e.getX() - sizeX * RAT/2, e.getY() - sizeY * RAT/2, Color.black, this.label.substring(12));
        curDragging.hasBorder = true;
        curDragging.lineWidth = 1;
        curDragging.filled = false;
    }
    
    drawButton(getHeight()/9, getHeight()/9, getWidth() - getHeight()/8, getHeight()/8/2 - getHeight()/9/2, ASSETS.PIX["m-gates"], "menu-gates", false, function(){println("We're working on it, ok?")});
    drawButton(getHeight()/9, getHeight()/9, getWidth() - getHeight()/8*2, getHeight()/8/2 - getHeight()/9/2, ASSETS.PIX["m-button"], "menu-button", false, menuFunc);
    drawButton(getHeight()/9, getHeight()/9, getWidth() - getHeight()/8*3, getHeight()/8/2 - getHeight()/9/2, ASSETS.PIX["m-const"], "menu-const", false, function(){println("Not currently working!\nIf you'd like a constant value, consider changing the value of a button.")});
    drawButton(getHeight()/9, getHeight()/9, getWidth() - getHeight()/8*4, getHeight()/8/2 - getHeight()/9/2, ASSETS.PIX["m-display"], "menu-display", false, menuFunc);

}

function onClick(e){
    var elem = getElementAt(e.getX(),e.getY());

    // Null Click
    if(elem == null){throw new Error("220 - Please report this!\nInfo: mouse pos: " + e.getX() + ", " + e.getY()); return;}
    
    // If you're drawing a wire...
    if(drawingWire){
        if(e.getX() > getWidth()/15 && e.getY() > getHeight()/8){
            if(elem.label.indexOf("custom") != -1 && ACTIVE[elem.label].inputs != null){
                var custom = "";
                for(var key in ACTIVE[elem.label].inputs){
                    custom += "\n" + key;
                }
                var ans = prompt("Please type the input from the list you wish to designate (CASE SENSITIVE!).\n-----------" + custom);
                if(ans == "" || custom.indexOf(ans) == -1){
                    alert("Invalid input!");
                    return;
                }else{
                    for(var each in ACTIVE){
                        if(each.indexOf("custom") != -1 && each.indexOf("wire") != -1){
                            if(ACTIVE[each].refs[2] == elem.label && ACTIVE[each].refs[3] == ans){
                                alert("This input is occupied!");
                                return;
                            }
                        }
                    }
                }
                wireStrings.push(elem.label);
                wireStrings.push(ans);
                tempWire.push(e.getX()); tempWire.push(e.getY());
            }else{
                tempWire.push(e.getX()); tempWire.push(e.getY());
                return;
            }
            drawingWire = false;
            ASSETS.CUSTOM["wire"].init();
            return;
        }else{
            drawingWire = false;
            tempWire = [];
            // Delete EVERYTHING!!!!!!!!
        }
    }
    // Placing Methods
    if(curDragging != null){
        if(e.getX() < getWidth() - curDragging.getWidth()/2 && e.getX() > getWidth()/15 + curDragging.getWidth()/2 && e.getY() < getHeight() - curDragging.getHeight()/2 && e.getY() > getHeight()/8 + curDragging.getHeight()/2){
            ASSETS.CUSTOM[curDragging.label].init(e);
        }
        remove(curDragging);
        curDragging = null;
    }else
    
    // Tool independent Buttons
    if(elem.label.indexOf("button") != -1 && elem.label.indexOf("custom") == -1){
        ACTIVE[elem.label].onClick(e, elem.label);
    }
    
    if(curTool == "debug" && elem.label.indexOf("custom") != -1){
        var obj = ACTIVE[elem.label];
        println("Inputs\n- - - - -");
        if(obj.inputs == null){
            println("None");
        }else{
            for(var key in obj.inputs){
                println(key + ": " + obj.inputs[key]);
            }
        }
        println("\nOutputs\n- - - - -");
        if(obj.outputs == null){
            print("None");
        }else{
            for(var key in obj.outputs){
                print(key + ": " + obj.outputs[key]);
            }
        }
        println();
    }else if(curTool == "dvdebug"){
        // foobar
        println(elem.label);
        println("/\n/\n/\n/\n/\n/\n/\n/");
        println(ACTIVE[elem.label]);
    }
    if(curTool == "edit" && elem.label.indexOf("custom") != -1){
        var obj = ACTIVE[elem.label];
        if(obj.values == null){
            println("No values to edit!");
        }else{
            for(var key in obj.values){
                var temp = prompt(key + "? (Cur: " + obj.values[key] + ")");
                if(typeof(obj.values[key]) == "number"){
                    temp = parseInt(temp);
                    if(!isNaN(temp)){
                        obj.values[key] = temp;
                    }
                }else if(typeof(obj.values[key]) == "string"){
                    if(temp != ""){
                        obj.values[key] = temp;
                    }
                }else if(typeof(obj.values[key]) == "boolean"){
                    temp = temp.toLowerCase();
                    if(temp == "t" || temp == "true" || temp == "1"){
                        obj.values[key] = true;
                    }else if(temp == "f" || temp == "false" || temp == "0"){
                        obj.values[key] = false;
                    }
                }
            }
            obj.onClick();
        }
    }else if(curTool == "cursor" && elem.label.indexOf("custom") != -1){
        ACTIVE[elem.label].onClick();
    }else if(curTool == "wire" && e.getX() > getWidth()/15 && e.getY() > getHeight()/8 && elem.label.indexOf("custom") != -1){
        if(ACTIVE[elem.label].outputs == null){
            println("This module has no outputs!");
        }else{
            var outputs = "";
            for(var key in ACTIVE[elem.label].outputs){
                outputs += "\n" + key;
            }
            var ans = prompt("Please type the output from the list you wish to designate (CASE SENSITIVE!).\n- - - - - - - - - - -" + outputs);
            if(ans != "" && outputs.indexOf(ans) != -1){
                wireStrings.push(elem.label);
                wireStrings.push(ans);
                drawingWire = true;
                onClick(e);
                return;
            }else{
                alert("Invalid output!");
            }
        }
    }
}

// Draw Methods {

function drawText(text, info, x, y, col){
    var temp = new Text(text, info);
    temp.setAnchor({vertical: 0.5, horizontal: 0.5});
    temp.setPosition(x, y);
    temp.setColor(col);
    temp._layer=3;
    add(temp);
    return temp;
}

function drawWire(nodes, L){
    var ret = [];
    for(var i = 0; i < nodes.length-2; i+=2){
        var temp = drawLine(nodes[i], nodes[i+1], nodes[i+2], nodes[i+3], Color.black, L);
        ret.push(temp);
        add(temp);
    }
    return ret;
}

function drawButton(width, height, x, y, img, L, hasOutline, clickFunc){
    var ret = {};
    if(hasOutline){
        ret["outline"] = drawRect(width, height, x, y, "#000000", "button:" + L);
        ret["main"] = drawRect(width-4, height-4, x+2, y+2, "#F0F0F0", "button:" + L);
    }
    ret["img"] = drawImg(width, height, x, y, img, "button:" + L);
    ret.label = "button:" + L;
    ret.onClick = clickFunc;
    
    for(var label in ACTIVE){
        if(L == label || ("button:" + L == label)){
            throw new Error("512: Overwritten Button Label\nInfo: \"" + label + "\"");
        }
    }
    
    ACTIVE["button:" + L] = ret;
    
    return ret;
}

function drawImg(width, height, x, y, img, L){
    var temp = new WebImage(img);
    temp.setSize(width, height);
    temp.setPosition(x, y);
    temp.label = L;
    temp._layer = 2;
    add(temp);
    
    return temp;
}

function drawLine(x1, y1, x2, y2, col, L){
    var temp = new Line(x1, y1, x2, y2);
    temp.setColor(col);
    temp.label = L;
    add(temp);
    
    return temp;
}

function drawCircle(rad, x, y, col, L){
    var temp = new Circle(rad);
    temp.setPosition(x,y);
    temp.setColor(col);
    temp.label = L;
    add(temp);
    
    return temp;
}

function drawRect(width, height, x, y, col, L){
    var temp = new Rectangle(width, height);
    temp.setPosition(x, y);
    temp.setColor(col);
    temp.label = L;
    add(temp);
    
    return temp;
}
// }

// For while WM2B is under maintenance
function checkBack(){
    var bg = new Rectangle(getWidth(), getHeight());
    bg.setPosition(0,0);
    bg.label = "bg";
    add(bg);
    
    var logo = new WebImage(ASSETS.PIX["m-logo"]);
    logo.setSize(getWidth()/2, getHeight()/2.9);
    logo.setPosition(getWidth()/2 - (logo.getWidth()/2), getHeight()/4 - (logo.getHeight()/2));
    add(logo);
    
    var randMsgs = ["HAMSTERS HARD AT WORK", "ERROR 220: ELEVATE KEYBOARD", "IT'S MAYHEM IN HERE", "LOST CONTROL TO AI OVERLORDS", "[object Object]", "INSTALLING ACF SUPPORT... ERROR", "LACK OF NO-COLLIDE DETECTED", "TOO MANY CONSTRAINTS", "MODDING GARRY...", "0_0", "\"WORKING HARD\"", "LOST THE DOODAD", "SHABABOO! SLEEBEEBOO!", "\"DO YOU MOD WIRES?\"", "                yep", ":<", "LAST ONLINE 7 YEARS AGO", "HI MOM!"];
    
    var cur = new Text(randMsgs[Randomizer.nextInt(0,randMsgs.length-1)], getHeight()/15 + "pt Monospace");
    cur.setPosition(getWidth()/2 - (cur.getWidth()/2), getHeight()/1.5 - (cur.getHeight()/2));
    cur.setColor(Color.white);
    add(cur);
    
    var cbs = new Text("CHECK BACK SOON", getHeight()/10 + "pt Monospace");
    cbs.setPosition(getWidth()/2 - (cbs.getWidth()/2), getHeight()/1.15 - (cbs.getHeight()/2));
    cbs.setColor(Color.white);
    add(cbs);
}