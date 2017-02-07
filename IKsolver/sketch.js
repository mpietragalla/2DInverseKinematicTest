var arm;
function setup() {
createCanvas(800,800);
arm  = new Arm(createVector(width/2,height/2), 60,60);
}

function draw() {
background(200);
if(mouseIsPressed){

	if(dist(mouseX, mouseY, arm.fist.x, arm.fist.y)<arm.jointRadius/2 && !arm.draggingPivot) arm.draggingFist = true;

	if(dist(mouseX, mouseY, arm.pivot.x, arm.pivot.y)<arm.jointRadius/4 && !arm.draggingFist) arm.draggingPivot = true;

}else if(!mouseIsPressed){
	arm.draggingFist = false;
	arm.draggingPivot = false;
	
}

arm.render();
  
  
 if(arm.draggingFist || arm.draggingPivot){
	arm.IKSolver(mouseX, mouseY);
 }
}


function Arm(pivot, len1, len2){

this.pivot = pivot;
this.foreArmLen = len1;
this.armLen = len2;
this.foreArmAngle = radians(10);
this.armAngle = radians(10);
this.elbow = createVector(this.pivot.x+this.armLen*cos(this.armAngle), this.pivot.y +this.armLen*sin(this.armAngle));
this.fist = createVector(this.elbow.x+this.foreArmLen*cos(this.armAngle+this.foreArmAngle), this.elbow.y+this.foreArmLen*sin(this.armAngle+this.foreArmAngle));
this.jointRadius = 30;
this.midPoint = createVector(0,0);

this.draggingPivot = false;
this.draggingFist = false;

this.IKSolver = function(mX, mY){
	if(this.draggingFist){
		var dif =  p5.Vector.sub(createVector(mX,mY), this.pivot);
		console.log(dif);
		
		var dis = constrain(dif.mag(),-2*this.armLen, 2*this.armLen);
		
		if(mX<this.pivot.x) 
			dis*=-1;
		var midDis = dis/2;
		
		
		
		this.midPoint = p5.Vector.add(this.pivot, dif.setMag(midDis));
		
		var mult = 1;
		if(mX<this.pivot.x) 
			mult*=-1;
		this.armAngle = atan(dif.y/(dif.x+0.0001)) -acos(midDis/this.armLen)*mult;
		console.log(this.armAngle+" = "+atan(dif.y/(dif.x+0.0001))+" - "+acos(midDis/this.armLen) );
		
		
		
		
		this.elbow = createVector(this.pivot.x+(this.armLen*cos(this.armAngle)), this.pivot.y +(this.armLen*sin(this.armAngle)));
		
		
		if(dif.mag()> 2*this.armLen) 
			dif.setMag( 2*this.armLen);
			
		dif.mult(2);
		
		if(mX<this.pivot.x) 
			dif.mult(-1);
		
		this.fist = p5.Vector.add(this.pivot, dif);
	}else if(this.draggingPivot){
		var dif =  p5.Vector.sub(createVector(mX,mY), this.fist);
		console.log(dif);
		
		var dis = constrain(dif.mag(),-2*this.armLen, 2*this.armLen);
		
		if(mX<this.fist.x) 
			dis*=-1;
		var midDis = dis/2;
		
		
		
		this.midPoint = p5.Vector.add(this.fist, dif.setMag(midDis));
		
		var mult = 1;
		if(mX>this.fist.x) 
			mult*=-1;
		this.armAngle = atan(dif.y/(dif.x+0.0001)) -acos(midDis/this.armLen)*mult;
		console.log(this.armAngle+" = "+atan(dif.y/(dif.x+0.0001))+" - "+acos(midDis/this.armLen) );
		
		
		
		
		this.elbow = createVector(this.fist.x+(this.armLen*cos(this.armAngle)), this.fist.y +(this.armLen*sin(this.armAngle)));
		
		
		if(dif.mag()> 2*this.armLen) 
			dif.setMag( 2*this.armLen);
			
		dif.mult(2);
		
		if(mX<this.fist.x) 
			dif.mult(-1);
		
		this.pivot = p5.Vector.add(this.fist, dif);
	
	}
	
	
	

}
this.render = function(){
	push();

		stroke(0);
		strokeWeight(5);
		
		line(this.pivot.x,this.pivot.y, this.elbow.x, this.elbow.y);
		line(this.elbow.x,this.elbow.y,this.fist.x ,this.fist.y);
		
		fill(255);
		strokeWeight(2);
		
		ellipse(this.elbow.x,this.elbow.y,this.jointRadius/2,this.jointRadius/2);
		if(this.draggingFist) fill(255,0,0); else fill(200);
		ellipse(this.fist.x,this.fist.y,this.jointRadius,this.jointRadius);
		if(this.draggingPivot) fill(255,0,0); else fill(200);
		ellipse(this.pivot.x,this.pivot.y,this.jointRadius/2,this.jointRadius/2);
		
	pop();

}


}
