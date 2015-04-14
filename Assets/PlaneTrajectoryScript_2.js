#pragma strict

//x, y, z, v, pitch
var wayPoints = 
[
	[0,0,0,0,0],
	[0,0,0,0,0],	
	[0,0,0,0,0],
	[0,0,0,0,0],
	[0,0,0,0,0],
	[0,0,0,0,0],	
	[0,0,0,0,0],
	[0,0,0,0,0],
	[0,0,0,0,0],
	[0,0,0,0,0],
	[0,0,0,0,0]
];




var currentCourseDeg:float;
var currentCourseRad:float;
var deltaCourse:float;
var turnSide:float;
var destPointId:int;
var nextPointId:int;

var currentPitch:float;
var v:float;
var turnRad:float;
var omega:float;

var acceleration:float;

var moveMode:int;//1 - прямолинейный полёт до ЛУр, 2 - разворот на точку
var moveTime:float;
var maxMoveTime:float;

var x0:float;
var y0:float;
var z0:float;
var v0:float;
var pitch0:float;

var x1:float;
var y1:float;
var z1:float;
var v1:float;
var pitch1:float;

var LUR:float;

var timePassed:float;
var maxTime:float;
function Start(){
	for (var i=1; i<=11; i++){
		var cube = GameObject.Find("Cube"+i);
		var pos = cube.transform.position;
		var scl = cube.transform.localScale;
		wayPoints[i-1][0] = pos.x;
		wayPoints[i-1][1] = pos.y;
		wayPoints[i-1][2] = pos.z;
		wayPoints[i-1][3] = (scl.x-1)*10000;	
		wayPoints[i-1][4] = (scl.y-1)*100;	
	}	
	
	
	v = 10;
	turnRad = v*v/(9.8*Mathf.Tan(Mathf.PI/12));
	omega = v/turnRad;
	
	currentCourseRad = 0;//4.08*Mathf.Deg2Rad;
	currentCourseDeg = 0;
	
	currentPitch = 0;
	
	startMoving2Point(0);
}

function Update(){
	////Debug.Log('before Update:'+this.transform.position);
	var dz = z1-this.transform.position.z;
	var dx = x1-this.transform.position.x;
	
	var distDelta = Mathf.Sqrt(dz*dz+dx*dx);
	//////Debug.Log('inside Update0:'+this.transform.position);
	var destCourse = Mathf.Atan2(-dx,-dz);
	var angDelta = destCourse-currentCourseRad;
	if (angDelta>Mathf.PI){angDelta-=2*Mathf.PI;}
	if (angDelta<-Mathf.PI){angDelta+=2*Mathf.PI;}
	
	if (angDelta>0){
		var sideTurn:int = 1;
	}
	else{
		sideTurn = -1;
	}
	//////Debug.Log('inside Update1:'+this.transform.position);
	if (v<0.01){
		omega = 2*Mathf.PI/10;
	}
	else{
		omega = 9.8*Mathf.Tan(Mathf.PI/12)/v;
		if (omega>2*Mathf.PI/10){omega = 2*Mathf.PI/10;}
	}
	//Debug.Log('omega:'+omega);
	omega = v/turnRad;
	omega = 1;
	
	var angStep = Time.deltaTime*omega;
	var distStep = Time.deltaTime*v;

	var vz:float = -Mathf.Cos(currentCourseRad)*distStep;
	var vx:float = -Mathf.Sin(currentCourseRad)*distStep;
	//////Debug.Log('vx:'+vx+ ' vz:'+vz);	
	
	this.transform.position.z+=vz;
	this.transform.position.x+=vx;	
	//////Debug.Log('inside Update2:'+this.transform.position);
	//////////Debug.Log('destCourse: '+destCourse*Mathf.Rad2Deg+ ' currentCourseRad:'+currentCourseRad*Mathf.Rad2Deg);
	//////////Debug.Log('angDelta: '+angDelta+ ' angStep:'+angStep);
	//////////Debug.Log('distDelta: '+distDelta+ ' LUR:'+LUR);
	
	if (Mathf.Abs(angDelta)>0){
		if (Mathf.Abs(angDelta)<angStep){
			currentCourseRad = destCourse;
		}
		else{
			currentCourseRad+=angStep*sideTurn;
		}
	}
	
	currentCourseDeg = currentCourseRad*Mathf.Rad2Deg;
	
	
	timePassed+=Time.deltaTime;
	//Debug.Log('Checking next Point:'+distDelta+' LUR: '+LUR+' timePassed:'+timePassed+' maxTime'+maxTime);
	//||(timePassed>=maxTime)
	if ((distDelta<=LUR)||(distDelta<=2*distStep)){
		startMoving2Point(nextPointId);
	}
	else{
		////////Debug.Log('calculating lambda');
		////////Debug.Log('timePassed: '+timePassed+ ' maxTime:'+maxTime);
		
		if (maxTime>0){
			var lambda:float = timePassed/maxTime;
		}
		else{
			lambda = 1;
		}
		
		if (lambda>1){lambda = 1;}
		
		v = v0*(1-lambda)+v1*lambda;
		currentPitch = pitch0*(1-lambda)+pitch1*lambda;
		var yy:float = this.transform.position.y;
		this.transform.position.y = y0*(1-lambda)+y1*lambda;
		////Debug.Log('y changed from:'+yy+' to:'+this.transform.position.y+' lambda: '+lambda+ 'y0: '+y0+' y1:'+y1);
		this.transform.eulerAngles = Vector3(currentPitch, currentCourseDeg, 0);
	}
	
	
	////Debug.Log('after Update:'+this.transform.position);
}

function startMoving2Point(pid:int){
	//Debug.Log('startMoving2Point '+pid);
	////Debug.Log('before startMoving2Point:'+this.transform.position);
	
	x0 = this.transform.position.x;
	y0 = this.transform.position.y;
	////Debug.Log( 'pos:'+this.transform.position.y+' y0: '+y0);
	z0 = this.transform.position.z;
	v0 = v;
	pitch0 = currentPitch;
	
	destPointId = pid;
	nextPointId = (destPointId+1)%wayPoints.length;
	
	x1 = wayPoints[destPointId][0];
	y1 = wayPoints[destPointId][1];
	z1 = wayPoints[destPointId][2];
	v1 = wayPoints[destPointId][3];
	pitch1 = wayPoints[destPointId][4];
	
	////Debug.Log( 'y0: '+y0+' y1:'+y1+'pos:'+this.transform.position.y);
	
	var x2:float = wayPoints[nextPointId][0];
	var y2:float = wayPoints[nextPointId][1];
	var z2:float = wayPoints[nextPointId][2];
	var v2:float = wayPoints[nextPointId][3];
	var pitch2:float = wayPoints[nextPointId][4];
	
	var dest1:Vector3 = new Vector3(x1-x0, y1-y0, z1-z0);
	var dest2:Vector3 = new Vector3(x2-x1, y2-y1, z2-z1);
	
	var phi1 = Mathf.Atan2(-dest1.x,-dest1.z);
	var phi2 = Mathf.Atan2(-dest2.x,-dest2.z);
	
	deltaCourse = phi1 - currentCourseRad;
	//////////Debug.Log('deltaCourse:'+deltaCourse*Mathf.Rad2Deg);
	
	//Debug.Log('calculating LUR');
	//Debug.Log('phi1 '+phi1*Mathf.Rad2Deg);
	//Debug.Log('phi2 '+phi2*Mathf.Rad2Deg);
	
	var deltaPhi:float = phi2 - phi1;
	//Debug.Log('deltaPhi '+deltaPhi*Mathf.Rad2Deg);
	if (deltaPhi>=Mathf.PI){
		deltaPhi-=2*Mathf.PI;
	}	
	//Debug.Log('deltaPhi '+deltaPhi*Mathf.Rad2Deg);
	if (deltaPhi<=-Mathf.PI){
		deltaPhi+=2*Mathf.PI;
	}
	//Debug.Log('deltaPhi '+deltaPhi*Mathf.Rad2Deg);
	

	
	var turnRad1 = v1*v1/(9.8*Mathf.Tan(Mathf.PI/12));
	//Debug.Log('turnRad1 '+turnRad1);
	LUR = turnRad1*Mathf.Tan(deltaPhi/2);

	//Debug.Log('LUR '+LUR);	
	LUR  = Mathf.Abs(LUR);
	
	LUR = 1;
	var dz = z1-this.transform.position.z;
	var dx = x1-this.transform.position.x;
	
	var distDelta = Mathf.Sqrt(dz*dz+dx*dx);	
	
	var vav = (v0+v1)/2;
	var tav = (distDelta-LUR)/vav;
	
	////////Debug.Log('moving2Point:');
	////////Debug.Log("dest1:"+dest1);
	////////Debug.Log("dest1.magnitude:"+dest1.magnitude);
	////////Debug.Log("LUR"+LUR);
	////////Debug.Log("distDelta"+distDelta);
	
	if (tav>0){
		acceleration = (v1-v0)/tav;
		maxTime = tav;
	}
	else{
		acceleration = 0;
		maxTime = 0;
	}	
	timePassed = 0;
	
	//////Debug.Log('after startMoving2Point:'+this.transform.position);
}