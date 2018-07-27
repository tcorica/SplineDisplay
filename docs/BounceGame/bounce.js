/*
Worry about hit detection at higher velocity (if trying slower frameRate)
 
 Breadcrumbs

Count strokes; Display strokes, display message for hole in one (on Canvas or in document?).

Check in IE; doesn't seem to work in a local load

Little flag for hole?
Sounds: ball dropping into hole; club hitting the ball

  Make the ball slow down as it reaches the end of its travel.  
  --> Switch behavior from moveCount to check for small velocity

draw arrow on rubberband to indicate direction.

 checkerboard coloring?

  Test:
     Walls at angles
     Behavior near endpoints of wall - is collision detection correct?
 
 A hole is a Ball with a different display.  Use inheritance???
 
Look for speed optimization - building too many objects?

 */

// Global variables
var mX, mY, bX, bY;  // rubberband endpoints (mouse, and ball)
var bandOn = false;
var wallList = [];
var theBall;    // the moving ball
var hole;   // the stationary hole

//======================================================

function setup() 
{
  var canvas = createCanvas(521, 401);// Extra pixed needed to make grid finish (not sure why)
  
  // This code tells the HTML where to locate the canvas.
  canvas.parent("sketch-holder");


  theBall = new Ball(100, 100);
  hole = new Ball(floor(random(8))*20+20, 300);

  // Build four walls of playing area
  wallList.push(new Wall(createVector(0, 0), createVector(0, height)));
  wallList.push(new Wall(createVector(width, 0), createVector(width, height)));
  wallList.push(new Wall(createVector(0, 0), createVector(width,0)));
  wallList.push(new Wall(createVector(0,height), createVector(width, height)));

  wallList.push(new Wall(createVector(260, 100), createVector(260, 300)));

  //  frameRate(30);  //
}

function freshStart()
{
theBall = new Ball(100, 100);
  hole = new Ball(floor(random(8))*20+20, 300);
loop();
}

function retry()
{
theBall = new Ball(100, 100);
 // hole = new Ball(floor(random(8))*20+20, 300);
loop();
}



function draw() 
{
  background(255);
  var boxWidth = 20;
  stroke(100);  // grey grid
  strokeWeight(1);
  for (i = 0; i<=width; i+=boxWidth)
    line(i, 0, i, height);
  for (i = 0; i<=height; i+=boxWidth)
    line(0, i, width, i);
  for (i = 0; i < wallList.length; i++)
    wallList[i].showWall();

//  hole.showBall();
  fill(0);
  stroke(0);
  strokeWeight(1);
  ellipseMode(CENTER);
  ellipse(hole.pos.x, hole.pos.y, hole.radius*3, hole.radius*3);

  theBall.showBall();
  theBall.moveBall();
  if (bandOn)
    line(bX, bY, mX, mY);
}

function mouseReleased()
{
  if (abs(mouseX - width/2)<=width/2 && abs(mouseY - height/2)<=height)
{
  var newVel = createVector(mouseX-theBall.pos.x, mouseY-theBall.pos.y);
  newVel.setMag(5);
  theBall.start(newVel.x, newVel.y);
  bandOn = false;
}
}

function mouseDragged()
{
if (theBall.moveCount == 0)  // if ball not already moving
  if (abs(mouseX - width/2)<=width/2 && abs(mouseY - height/2)<=height)
{
  bandOn = true;
  mX = mouseX;
  mY = mouseY;
  bX = theBall.pos.x;
  bY = theBall.pos.y;
}
}

//======================================================
// DEFINITION OF Ball CLASS

function Ball(startX, startY) {
  this.pos = createVector(startX, startY);
  this.vel = createVector(0, 0);
  this.moveCount = 0;
  this.radius = 5;
  this.color1 = color(255, 0, 0);
  this.color2 = color(255);
  this.currColor = this.color1; 

  this.showBall = showBall;
  this.moveBall = moveBall;
  this.changeColor = changeColor;
  this.start = start;
}

function start(vx, vy)
{
  this.vel.set(vx, vy);
  this.moveCount = 200;  // 200 steps, each with mag 5 = 1000
}

function showBall()
{
  fill(this.currColor);
  stroke(0);
  strokeWeight(1);
  ellipseMode(CENTER);
  ellipse(this.pos.x, this.pos.y, this.radius*2, this.radius*2);
}

function changeColor()
{
  if (this.currColor == this.color1)
    this.currColor = this.color2; 
//  else
//    this.currColor = this.color1;
}

function moveBall()
{
  if (this.moveCount > 0)
  {
    this.moveCount--;  

    // check if at goal (Ugly use of global hole)
    if (this.pos.dist(hole.pos)<5  && this.currColor == this.color2)
    {
      this.moveCount = 0;
      //this.currColor = color(255, 0, 0);
      redraw();
      noLoop();
    }

    for (i = 0; i < wallList.length; i++)
    {
      if (nearWall(wallList[i], this.pos))  // Assumes vertical!!!!
      {
        //this.vel.set(this.vel.x * -1, this.vel.y);
        var newVel = bounce(wallList[i], this.vel);
        this.vel.set(newVel.x, newVel.y);
        this.changeColor();
      }
    } // for loop

    //this.vel.mult(0.995); // this works, but not in a nice way and other code needs to be changed.  
    
    this.pos.add(this.vel); // must move after bounce so that ball moves away from wall.

  } // end if moveCount
} // end moveBall function

//===========================================
// DEFINITION OF Wall CLASS
function Wall(p1, p2)
{
  this.p1 = p1.copy();
  this.p2 = p2.copy();
  this.dir = p1.sub(p2).copy();
  this.showWall = showWall;
}

function showWall()
{
  stroke(0);
  strokeWeight(2);
  line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
}




//==================================================
// Wall tools below.  Could go inside of the Wall class or Ball class

// Vectors, baby!
// Find points near line, but that form acute/obtuse angles 
//    with direction and endpoints.
function nearWall(w, p)
{
  var v1 = p5.Vector.sub(w.p1, p);
  var crossV = p5.Vector.cross(w.dir, v1);
  var dist = crossV.mult(1/w.dir.mag());
  var v2 = p5.Vector.sub(w.p2, p);

  return dist.mag() < 3 && v1.dot(w.dir) > 0 && v2.dot(w.dir) < 0;
}

// Vectors, baby!  
// Reverse direction of component of velocity normal to wall 
function bounce(w, v)
{
  projDir = p5.Vector.mult(w.dir,v.dot(w.dir)/w.dir.magSq());
  projNorm = p5.Vector.sub(v,projDir);
  return p5.Vector.add(projNorm.mult(-1), projDir);
}