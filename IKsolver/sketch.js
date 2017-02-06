var arm;
function setup() {
createCanvas(800,800);
arm  = new Arm(createVector(width/2,height/2), 60,60);
}

function draw() {
background(200);
if(mouseIsPressed && dist(mouseX, mouseY, arm.fist.x, arm.fist.y)<arm.jointRadius/2){
arm.isDragging = true;
}else if(!mouseIsPressed){
	arm.isDragging = false;
	
}

arm.render();
  
  
 if(arm.isDragging){
	arm.IKSolver(mouseX, mouseY);
 }
}


function Arm(pivot, len1, len2){

this.pivot = pivot;
this.foreArmLen = len1;
this.armLen = len2;
this.foreArmAngle = radians(0);
this.armAngle = radians(0);
this.elbow = createVector(this.pivot.x+this.armLen*cos(this.armAngle), this.pivot.y +this.armLen*sin(this.armAngle));
this.fist = createVector(this.elbow.x+this.foreArmLen*cos(this.armAngle+this.foreArmAngle), this.elbow.y+this.foreArmLen*sin(this.armAngle+this.foreArmAngle));
this.jointRadius = 30;
this.midPoint = createVector(0,0);

this.isDragging = false;

this.IKSolver = function(mX, mY){
	var dif =  p5.Vector.sub(createVector(mX,mY), this.pivot);
	
	var dis = constrain(dif.mag(),-2*this.armLen, 2*this.armLen);
	
	if(mX<width/2) 
		dis*=-1;
	var midDis = dis/2;
	
	this.midPoint = p5.Vector.add(this.pivot, dif.setMag(midDis));
	
	this.armAngle = atan(dif.y/dif.x) -acos(midDis/this.armLen);
	
	
	
	this.elbow = createVector(this.pivot.x+this.armLen*cos(this.armAngle), this.pivot.y +this.armLen*sin(this.armAngle));
	
	
	if(dif.mag()> 2*this.armLen) 
		dif.setMag( 2*this.armLen);
		
	dif.mult(2);
	
	if(mX<width/2) 
		dif.mult(-1);
	
	this.fist = p5.Vector.add(this.pivot, dif);
	
	
	

}

this.render = function(){
	push();

		stroke(0);
		strokeWeight(5);
		
		line(this.pivot.x,this.pivot.y, this.elbow.x, this.elbow.y);
		line(this.elbow.x,this.elbow.y,this.fist.x ,this.fist.y);
		
		fill(255);
		strokeWeight(2);
		ellipse(this.pivot.x,this.pivot.y,this.jointRadius/2,this.jointRadius/2);
		ellipse(this.elbow.x,this.elbow.y,this.jointRadius/2,this.jointRadius/2);
		if(this.isDragging) fill(255,0,0);
		ellipse(this.fist.x,this.fist.y,this.jointRadius,this.jointRadius);
		
	pop();

}


}