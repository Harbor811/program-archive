// This code is indended to be run in the CodeHS JS Graphics Environment

var s;
const RAD = 0.0174533; // one degree in radians
const PI = 3.14159;
const P2 = PI / 2;
const P3 = 3 * PI / 2;
var TEMP_LINES = [];
setSize(500, 900);
setBackgroundColor(Color.black)

var FOV;
var PLAYER;
const _TICKSPEED = 20;
var MAP = [[1, 1, 1, 1, 1, 1, 1, 1],
           [1, 0, 0, 0, 0, 0, 0, 1],
           [1, 0, 0, 0, 0, 0, 0, 1],
           [1, 0, 0, 0, 1, 0, 0, 1],
           [1, 0, 0, 0, 0, 0, 0, 1],
           [1, 0, 0, 0, 0, 0, 0, 1],
           [1, 0, 0, 0, 0, 0, 0, 1],
           [1, 1, 1, 1, 1, 1, 1, 1]];
var SQR_SIZE;
var SCR_LINES = [];

// ----------------------- I can't believe how much more efficient this is ----------------------- //


function debugLines()
{
    for(var i = 0; i < FOV; i++)
    {
        let temp = new Line(0, 0, getWidth(), getHeight());
        TEMP_LINES.push(temp);
        add(TEMP_LINES[i]);
    }
}

function drawScreen()
{
    let screen = new Rectangle(getWidth(), 200);
    screen.setColor("#999999");
    screen.setPosition(0, 700);
    add(screen);
    
    let ceiling = new Rectangle(getWidth(), 200);
    ceiling.setColor("#333333");
    ceiling.setPosition(0, 500);
    add(ceiling);
    
    for(let i = 0; i < FOV; i++)
    {
        SCR_LINES[i] = new Rectangle((getWidth() / FOV) + 1, 0);
        SCR_LINES[i].anchor = {"horizontal": 0, "vertical": 0.5};
        SCR_LINES[i].setPosition(getWidth()/FOV * i, getHeight()-200);
        add(SCR_LINES[i]);
    }
}

function drawMap()
{
    for(var row = 0; row < MAP.length; row++)
    {
        let curDist = row*getWidth()/MAP.length;
        
        for(var col = 0; col < MAP[0].length; col++)
        {
            if(MAP[col][row] == 1)
            {
                var foo = new Rectangle(getWidth()/MAP[0].length,
                                        getWidth()/MAP.length);
                foo.setColor(Color.WHITE);
                foo.setPosition(row * getWidth()/MAP[0].length,
                                col * getWidth()/MAP.length);
                
                add(foo);
            }
        }
    }
}

function drawPlayer()
{
    PLAYER = new Polygon();
    PLAYER.addPoint(0,0);
    PLAYER.addPoint(20,10);
    PLAYER.addPoint(0,20);
    PLAYER.setColor(Color.GREEN);
    PLAYER.anchor = {"horizontal": 0.5, "vertical": 0.5};
    add(PLAYER);
    PLAYER.setPosition(getWidth()/2, getHeight()/2);
    PLAYER.veloX = 0;
    PLAYER.veloY = 0;
    PLAYER.fov = 90;
    PLAYER.rotate(-90);
    PLAYER.deltaX = Math.cos(PLAYER._rotation) * 5;
    PLAYER.deltaY = Math.sin(PLAYER._rotation) * 5;
}

function start()
{
    FOV = parseInt(readLine("FOV (60 is recommended): "));
    if(isNaN(FOV))
    {
        FOV = 60;
    }
    SQR_SIZE = (getWidth()/MAP.length);
    debugLines();
    
    keyDownMethod(keyDown);
    
    drawMap();
    drawPlayer();
    drawScreen();
    
    setTimer(tick, _TICKSPEED);
}

function getDistance(ax, ay, bx, by, ang)
{
    return Math.sqrt((bx - ax) * (bx - ax) + (by - ay) * (by - ay)); // pythagorean this theorum
}

function drawRays()
{
    var mapX, mapY, dof, rayX, rayY, rayAngle, xOffset, yOffset, distFinal = 0.0, colFinal = Color.BLACK;
    
    var maxDof = 8;
    
    if(PLAYER._rotation < 0)
    {
        PLAYER.rotate(360);
    }
    if(PLAYER._rotation > 2 * PI)
    {
        PLAYER.rotate(-360);
    }
    
    rayAngle = PLAYER._rotation - RAD * FOV / 2;
    
    for(let ray = 0; ray < FOV; ray++)
    {
        if(rayAngle < 0)      rayAngle += 2 * PI;
        if(rayAngle > 2 * PI) rayAngle -= 2 * PI;
        
        // Horizontal Line{
        dof = 0;
        var disH = Infinity, horzX = PLAYER._x, horzY = PLAYER._y;
        var aTan = -1/Math.tan(rayAngle);
        
        if(rayAngle > PI)                                // Looking UP
        {
            rayY = (Math.floor(PLAYER._y / SQR_SIZE) * SQR_SIZE) - 0.0001;
            rayX = (PLAYER._y - rayY) * aTan + PLAYER._x;
            yOffset = -SQR_SIZE;
            xOffset = -yOffset * aTan;
        } 
        else if (rayAngle < PI)                          // Looking DOWN
        {
            rayY = (Math.floor(PLAYER._y / SQR_SIZE) * SQR_SIZE) + SQR_SIZE;
            rayX = (PLAYER._y - rayY) * aTan + PLAYER._x;
            yOffset =  SQR_SIZE;
            xOffset = -yOffset * aTan;
        }   
        else if (rayAngle == 0 || rayAngle == PI)        // Impossible for ray to ever hit a horizontal line
        {
            rayX = PLAYER._x;
            rayY = PLAYER._y;
            dof = 8; // finish check
        }
        while (dof < maxDof)
        {
            mapX = Math.floor(rayX / SQR_SIZE);
            mapY = Math.floor(rayY / SQR_SIZE);
            //println("mapX: " + Math.floor(mapX) + ", mapY: " + Math.floor(mapY));
            
            if(mapX >= 0 && mapY >= 0 && mapX < MAP.length && mapY < MAP[0].length && MAP[mapY][mapX]==1) // We hit the damn wall
            {
                horzX = rayX;
                horzY = rayY;
                disH = getDistance(PLAYER._x, PLAYER._y, horzX, horzY, rayAngle);
                dof = 8;
            } 
            else
            {
                rayX += xOffset;
                rayY += yOffset;
                dof++;
            }
        }
        //}
        
        // Vertical Line{
        dof = 0;
        var disV = Infinity, vertX = PLAYER._x, vertY = PLAYER._y;
        var nTan = -Math.tan(rayAngle);
        
        if(rayAngle > P2 && rayAngle < P3)        //Looking LEFT
        {
            rayX = (Math.floor(PLAYER._x / SQR_SIZE) * SQR_SIZE) - 0.0001;
            rayY = (PLAYER._x - rayX) * nTan + PLAYER._y;
            xOffset = -SQR_SIZE;
            yOffset = -xOffset * nTan;
        } 
        else if (rayAngle < P2 || rayAngle > P3)  // Looking RIGHT
        {
            rayX = (Math.floor(PLAYER._x / SQR_SIZE) * SQR_SIZE) + SQR_SIZE;
            rayY = (PLAYER._x - rayX) * nTan + PLAYER._y;
            xOffset =  SQR_SIZE;
            yOffset = -xOffset * nTan;
        } 
        else if (rayAngle == 0 || rayAngle == PI)     // Impossible for ray to ever hit a vertical line
        {
            rayX = PLAYER._x;
            rayY = PLAYER._y;
            dof = 8; // finish check
        }
        while (dof < maxDof)
        {
            mapX = Math.floor(rayX / SQR_SIZE);
            mapY = Math.floor(rayY / SQR_SIZE);
            //println("mapX: " + Math.floor(mapX) + ", mapY: " + Math.floor(mapY));
            
            if(mapX >= 0 && mapY >= 0 && mapX < MAP.length && mapY < MAP[0].length && MAP[mapY][mapX]==1) // We hit the damn wall
            {
                vertX = rayX;
                vertY = rayY;
                disV = getDistance(PLAYER._x, PLAYER._y, vertX, vertY, rayAngle);
                dof = 8;
            } 
            else
            {
                rayX += xOffset;
                rayY += yOffset;
                dof++;
            }
        }
        //}
        
        if(disV < disH)
        {
            rayX = vertX;
            rayY = vertY;
            distFinal = disV;
            colFinal = new Color(255, 0, 0);
        }
        if(disH < disV)
        {
            rayX = horzX;
            rayY = horzY;
            distFinal = disH;
            colFinal = new Color(200, 0, 0);
        }
        
        // Draw debug line
        TEMP_LINES[ray].setPosition(PLAYER._x, PLAYER._y)
        TEMP_LINES[ray].setEndpoint(rayX, rayY);
        TEMP_LINES[ray].setColor(Color.RED);
        TEMP_LINES[ray].setLineWidth(1);
        
        // Draw 3D Walls
        var ca = PLAYER._rotation - rayAngle;
        if(ca)          ca += 2*PI;
        if(ca > 2 * PI) ca -= 2*PI;
        
        distFinal = distFinal * Math.cos(ca);
        var lineH = (SQR_SIZE * 400) / distFinal;
        if(lineH > 400)  lineH = 400;
        if(isNaN(lineH)) lineH = 0;
        if(lineH < 0)    lineH = 0;
        
        var curWidth = SCR_LINES[ray]._width;
        SCR_LINES[ray].setSize(curWidth, lineH);
        SCR_LINES[ray].setColor(colFinal);
        
        rayAngle += RAD
    }
}

function tick()
{
    // Key Handler
    if (isKeyPressed(Keyboard.letter("W")))
    {
        PLAYER.veloX = PLAYER.deltaX;
        PLAYER.veloY = PLAYER.deltaY;
    }
    if (isKeyPressed(Keyboard.letter("A"))) 
    {
        PLAYER.rotate(-5);
        PLAYER.deltaX = Math.cos(PLAYER._rotation) * 5;
        PLAYER.deltaY = Math.sin(PLAYER._rotation) * 5;
    }
    if (isKeyPressed(Keyboard.letter("S")))
    {
        PLAYER.veloX = -PLAYER.deltaX;
        PLAYER.veloY = -PLAYER.deltaY;
    }
    if (isKeyPressed(Keyboard.letter("D")))
    {
        PLAYER.rotate(5);
        PLAYER.deltaX = Math.cos(PLAYER._rotation) * 5;
        PLAYER.deltaY = Math.sin(PLAYER._rotation) * 5;
    }
    
    // Player
    PLAYER.move(PLAYER.veloX, PLAYER.veloY);
    PLAYER.veloX *= 0.8;
    PLAYER.veloY *= 0.8;
    
    drawRays();
}

function keyDown(e)
{
    if (e.keyCode == Keyboard.letter("R"))
    {
        println(PLAYER);
    }
    if (e.keyCode == Keyboard.SPACE)
    {
        println("pew");
    }
}