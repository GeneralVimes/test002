#pragma strict

var wayPoints = 
[
	[0,0,0,0],
	[0,0,0,0],
	[0,0,0,0],
	[0,0,0,0],
	[0,0,0,0]

];

var currentCourseDeg:float;
var currentCourseRad:float;
var deltaCourse:float;
var turnSide:float;
var destPointId:int;
var nextPointId:int;

var v:float;
var turnRad:float;


var moveMode:int;//1 - прямолинейный полёт до ЛУр, 2 - разворот на точку
var moveTime:float;
var maxMoveTime:float;
function Start(){
	for (var i=1; i<=5; i++){		
		var pos = GameObject.Find("Cube"+i).transform.position;
		wayPoints[i-1][0] = pos.x;
		wayPoints[i-1][1] = pos.y;
		wayPoints[i-1][2] = pos.z;
		wayPoints[i-1][3] = 20*i;	
	}	
	
	turnRad = 10;
	v = 10;
	currentCourseRad = 0;//4.08*Mathf.Deg2Rad;
	currentCourseDeg = 0;
	
	startMoving2Point(0, true);
}

function Update(){
	//Debug.Log(moveMode+' '+moveTime+' '+maxMoveTime+' '+currentCourseRad);
	if (moveMode==2){
		var omega = turnRad/v;
		var dPhi = turnSide*omega*Time.deltaTime;
		currentCourseRad+= dPhi;
		
		moveTime+=Time.deltaTime;
		if (moveTime>=maxMoveTime){
			moveMode=1;
		}		
	}
	
	var vz:float = -Mathf.Cos(currentCourseRad)*v;
	var vx:float = -Mathf.Sin(currentCourseRad)*v;
	
	this.transform.position.z+=vz*Time.deltaTime;
	this.transform.position.x+=vx*Time.deltaTime;
	

}

function startMoving2Point(pid:int, fromThisPos:boolean){
	Debug.Log('startMoving2Point '+pid);
	var x0:int = this.transform.position.x;
	var y0:int = this.transform.position.y;
	var z0:int = this.transform.position.z;
	var v0:int = v;
	
	destPointId = pid;
	nextPointId = (destPointId+1)%wayPoints.length;
	
	var x1:int = wayPoints[destPointId][0];
	var y1:int = wayPoints[destPointId][1];
	var z1:int = wayPoints[destPointId][2];
	var v1:int = wayPoints[destPointId][3];
	
	//var x2:int = wayPoints[nextPointId][0];
	//var y2:int = wayPoints[nextPointId][1];
	//var z2:int = wayPoints[nextPointId][2];
	//var v2:int = wayPoints[nextPointId][3];
	
	var dest1:Vector3 = new Vector3(x1-x0, y1-y0, z1-z0);
	//var dest2:Vector3 = new Vector3(x2-x1, y2-y1, z2-z1);
	
	var phi1 = Mathf.Atan2(-dest1.x,-dest1.z);
	//var phi2 = Mathf.Atan2(-dest2.x,-dest2.z);
	
	//var dPhi:Number = phi1 - currentCourseRad;
	    //
	//if (dPhi > Math.PI) {				
		//dPhi-=2*Math.PI;
	//}
	//if (dPhi < -Math.PI) {				
		//dPhi+=2*Math.PI;
	//}
	//
	//if (dPhi > 0) {
		//sideTurn = 1;
	//}
	//else {
		//sideTurn = -1;
	//}
	
	Debug.Log('My Course:'+currentCourseRad*Mathf.Rad2Deg);
	Debug.Log('Need Course:'+phi1*Mathf.Rad2Deg);
	
	deltaCourse = phi1 - currentCourseRad;
	Debug.Log('deltaCourse:'+deltaCourse*Mathf.Rad2Deg);
	
	
	if (deltaCourse!=0){
		var dz:float = z1-z0;
		var dx:float = x1-x0;
		
		Debug.Log('dz:'+dz+ ' dx: '+dx);

		if (deltaCourse<0){turnSide = -1;} else {turnSide = 1;}
		Debug.Log('turnSide:'+turnSide);
		var sideAng:float;
		sideAng = (turnSide == 1)?(Mathf.PI / 2): (-Mathf.PI / 2);
		
		
		var zc:float = -turnRad * Mathf.Sin(currentCourseRad + sideAng);
		var xc:float = -turnRad * Mathf.Cos(currentCourseRad + sideAng);
		Debug.Log('circle center z:'+zc+ ' x: '+xc);
		
		var d1:float = Mathf.Sqrt((dz - zc) * (dz - zc) + (dx - xc) * (dx - xc));
		var R1:float = d1 / 2;
		var zc1:float = (zc + dz) / 2;
		var xc1:float = (xc + dx) / 2;
		
		var dst:float = Mathf.Sqrt((zc-zc1)*(zc-zc1)+(xc-xc1)*(xc-xc1));
		if (d1 >= Mathf.Abs(turnRad-R1)) {
			var a:float = (turnRad * turnRad - R1 * R1 + dst * dst) / (2 * dst);
			var h:float = Mathf.Sqrt(turnRad * turnRad - a * a);
			var z2:float = zc + a * (zc1 - zc) / dst;
			var x2:float = xc + a * (xc1 - xc) / dst;
			if (turnSide == 1) {
				var z3:float = z2 - h * (xc1 - xc) / dst;
				var x3:float = x2 + h * (zc1 - zc) / dst;						
			}
			else {
				z3 = z2 + h * (xc1 - xc) / dst;
				x3 = x2 - h * (zc1 - zc) / dst;	
			}
			
			var newCourse:float = Mathf.Atan2(-(dz-z3), -(dx-x3));
			Debug.Log('new Course: '+newCourse*Mathf.Rad2Deg);
			if (turnSide==1){
				if (newCourse>currentCourseRad){
					newCourse-=Mathf.PI*2;
				}
			}
			
			if (turnSide==-1){
				if (newCourse<currentCourseRad){
					newCourse+=Mathf.PI*2;
				}
			}
			
			var dc1 = newCourse-currentCourseRad;
		
		
			moveMode = 2;
			maxMoveTime = Mathf.Abs(dc1)*v/turnRad;			
		}
		else{//go to another point
			
		}
	}
	else{
		moveMode = 1;
	}
	//currentCourseRad = phi1;
	//moveMode = 1;
	
	moveTime = 0;
	//if ()
	
	//Debug.Log(newPhi);
}