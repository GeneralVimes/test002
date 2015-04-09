#pragma strict
var testAr = [1,2,3,4];
function Start () {
	Debug.Log("I'm the Overmind!");
	Debug.Log(testAr);
	logAr ();
	
}

function Update () {

}

function logAr () {
	var str:String = "Array: ";
	for (var i=0; i<testAr.length; i++){
		str+=testAr[i];
		str+=', ';
	}
	Debug.Log(str);
}