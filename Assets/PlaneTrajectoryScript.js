#pragma strict
//стоянка - ВПП ближняя взлёт вправо
//[13,1,2,14]
//[12,3,2,14]
//[11,4,2,14]
//[10,5,2,14]
//[9,6,2,14]
//[8,7,2,14]

//стоянка - ВПП дальняя взлёт вправо
//[13,1,2,14,23,18]
//[12,3,2,14,23,18]
//[11,4,2,14,23,18]
//[10,5,2,14,23,18]
//[9,6,2,14,23,18]
//[8,7,2,14,23,18]

//стоянка - ВПП ближняя взлёт влево
//[13,1,7,21]
//[12,3,7,21]
//[11,4,7,21]
//[10,5,7,21]
//[9,6,7,21]
//[8,7,7,21]

//стоянка - ВПП дальняя взлёт влево
//[13,1,7,21,22,19]
//[12,3,7,21,22,19]
//[11,4,7,21,22,19]
//[10,5,7,21,22,19]
//[9,6,7,21,22,19]
//[8,7,21,22,19]

//взлёт по ближней вправо
//[15,25,24,28,33,35]
//взлёт по ближней влево
//[20,24,25,29,32,36]
//взлёт по дальней вправо
//[16,26,27,38,34,37]
//взлёт по дальней влево
//[17,27,26,40,30,31,39]

//уход на 2й круг:
//[36,41,42,] - c 35й будет начинаться новый заход
var trajectoriesList = [
[13,1,7,21,22,19,17,27,26,40,30,31,39],
[12,3,7,21,22,19,17,27,26,40,30,31,39],
[11,4,7,21,22,19,17,27,26,40,30,31,39],
[10,5,7,21,22,19,17,27,26,40,30,31,39],
[9,6,7,21,22,19,17,27,26,40,30,31,39],
[8,7,21,22,19,17,27,26,40,30,31,39],

[35,33,28,24,25,15,14,2,1,13],
[35,33,28,24,25,15,14,2,3,12],
[35,33,28,24,25,15,14,2,4,11],
[35,33,28,24,25,15,14,2,5,10],
[35,33,28,24,25,15,14,2,6,9],
[35,33,28,24,25,15,14,2,7,8]
];

var secondCircleStart = [36,41,42];

var trajectoryId:int;


//var trajectoryNodes = [0,0,0];
var tempEmptyTrajectoryNodes = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

//x, y, z, v, pitch, trajectoryType
var wayPoints = 
[
	[0,0,0,0,0,0],
	[0,0,0,0,0,0],	
	[0,0,0,0,0,0],
	[0,0,0,0,0,0],
	[0,0,0,0,0,0],
	[0,0,0,0,0,0],	
	[0,0,0,0,0,0],
	[0,0,0,0,0,0],
	[0,0,0,0,0,0],
	[0,0,0,0,0,0],
	[0,0,0,0,0,0],
	[0,0,0,0,0,0],
	[0,0,0,0,0,0],
	[0,0,0,0,0,0],
	[0,0,0,0,0,0],
	[0,0,0,0,0,0],
	[0,0,0,0,0,0],
	[0,0,0,0,0,0],
	[0,0,0,0,0,0],
	[0,0,0,0,0,0],
	[0,0,0,0,0,0],
	[0,0,0,0,0,0],
	[0,0,0,0,0,0],
	[0,0,0,0,0,0],
	[0,0,0,0,0,0],
	[0,0,0,0,0,0]
];


var currentDestPoint:int;
var pointsInTrajectory:int;
var lambda:float;
var v:float = 0;
var vav:float;
var tav:float;
var d:float;

var x0:float;
var y0:float;
var z0:float;
var v0:float; 
var pitch0: float;

var x1:float;
var y1:float;
var z1:float;
var v1:float;
var pitch1: float;

var prevHeading:float;//курс
var prevYaw:float;//тангаж
var prevBank:float;//крен

var nextHeading:float;//курс
var nextYaw:float;//тангаж
var nextBank:float;//крен

var nowHeading:float;//курс
var nowYaw:float;//тангаж
var nowBank:float;//крен

var deltaHeading:float;//
var deltaBank:float;//

var currentPitch:float = 0;


var acceleration:float;

var timePassed:float;

var isStopped:boolean;

var moveMode:int;//1 - движение по траектории, 2 - ожидание в подпространстве после вылета, 3 - ожидание в подпространстве перед прилётом
var trajectoryType:int;//1 - рулит, 2 - разбег, 3 - взлёт, улетает, 4 - прибытие, на глиссаде, 5 - пробег, 6 - второй круг
var waitTimeBeforeStart:float;

var LUR = 0;
function Start () {
	buildTempTrajectory(trajectoryId, false);
	calcTrajectoryCoords();
	//Debug.Log(trajectoryNodes);


//	if ((moveMode==1)||(moveMode==2)){
	Move2Point(0);
//	}

	//StartNewEdge(0);
}

function calcTrajectoryCoords(){
		for (var i=0; i<pointsInTrajectory; i++){
		//Debug.Log(trajectoryNodes[i]);
		var cube = GameObject.Find("Cube"+tempEmptyTrajectoryNodes[i]);
		//Debug.Log(cube);
		var pos = cube.transform.position;
		var scl = cube.transform.localScale;
		wayPoints[i][0] = pos.x;
		wayPoints[i][1] = pos.y;
		wayPoints[i][2] = pos.z;
		wayPoints[i][3] = (scl.x-1)*10000;	
		wayPoints[i][4] = (scl.y-1)*100;			
		wayPoints[i][5] = Mathf.Round(scl.z-1)*10;
	}
}

function buildTempTrajectory(trid, needs2ndCircle){
	var trajectoryNodes = trajectoriesList[trajectoryId];
	var len1 = trajectoryNodes.length;
	
	if (needs2ndCircle){
		var len0 = secondCircleStart.length;
		for (var i=0; i<len0; i++){
			tempEmptyTrajectoryNodes[i] = secondCircleStart[i];
		}
	}
	else{
		len0 = 0;
	}
	
	for (i=0; i<len1; i++){
		tempEmptyTrajectoryNodes[i+len0] = trajectoryNodes[i];
	}	
	
	pointsInTrajectory = len1+len0;
}

function build2ndCircleTrajectory(){
	buildTempTrajectory(trajectoryId, true);
	calcTrajectoryCoords();
	Move2Point(0);
}

function OnMouseDown(){
	if (trajectoryType==1){
		isStopped = !isStopped;
	}
	
	if (trajectoryType==4){
		build2ndCircleTrajectory();
		trajectoryType = 6;
	}
	
	Debug.Log('Click!');
}

function Update () {
	if (moveMode==1){
		if (!isStopped){
			lambda+=v*Time.deltaTime/d;
			timePassed+=Time.deltaTime;
			
			this.transform.position.x = x0*(1-lambda)+x1*lambda;
			this.transform.position.y = y0*(1-lambda)+y1*lambda;
			this.transform.position.z = z0*(1-lambda)+z1*lambda;
			
			currentPitch = pitch0*(1-lambda)+pitch1*lambda;
			
			v = v0+acceleration*timePassed;
			
			var courseLambda = 10*lambda;
			if (courseLambda>1){
				courseLambda = 1;
			}
			
			nowHeading = prevHeading+courseLambda*deltaHeading;
			nowBank = prevBank+courseLambda*deltaBank;
			this.transform.eulerAngles = Vector3(currentPitch, nowHeading, 0);
			//this.transform.rotation = Quaternion.AngleAxis(nowHeading, Vector3.up);
			
			if (lambda >= 1){
				Move2Point(currentDestPoint+1);
			}		
		}	
	}
	if (moveMode==3){
		timePassed+=Time.deltaTime;
		if (timePassed>=waitTimeBeforeStart){
			setMoveMode(1);
			Move2Point(0);
		}
	}
}

function setMoveMode (mid:int) {
	moveMode = mid;
	//if (moveMode==2){
		//GetComponent.<Renderer>().enabled = false;
	//}
	//else{
		//GetComponent.<Renderer>().enabled = true;
	//}
	
}
function Move2Point (pid:int) {
	
	currentDestPoint = pid;
	
	if (currentDestPoint>=pointsInTrajectory){
		setMoveMode(2); //засыпает и исчезает, чтобы не дёргать несуществующие точки
		return;
	}

	x0 = this.transform.position.x;
	y0 = this.transform.position.y;
	z0 = this.transform.position.z;
	v0 = v;
	pitch0 = currentPitch;	
	
	x1 = wayPoints[currentDestPoint][0];
	y1 = wayPoints[currentDestPoint][1];
	z1 = wayPoints[currentDestPoint][2];
	v1 = wayPoints[currentDestPoint][3];
	pitch1 = wayPoints[currentDestPoint][4];
	
	lambda = 0;
	vav = (v0+v1)/2;
	var dx = x1-x0;
	var dy = y1-y0;
	var dz = z1-z0;
	
	d = Mathf.Sqrt(dx*dx+dy*dy+dz*dz);
	tav = d/vav;
	
	v = v0;
	
	timePassed = 0;
	if (tav>0){
		acceleration = (v1-v0)/tav;}
	else{
		acceleration = 1;
	}
	
	var dest = new Vector3(x1-x0,y1-y0,z1-z0);
	nextHeading = Mathf.Atan2(dest.z, -dest.x) * Mathf.Rad2Deg+90;
	prevHeading = nowHeading;
	this.transform.eulerAngles = Vector3(currentPitch, nowHeading, 0);
	
	deltaHeading = nextHeading - prevHeading;
	if (deltaHeading>180){deltaHeading-=360;}
	if (deltaHeading<-180){deltaHeading+=360;}
	
	
}