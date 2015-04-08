#pragma strict
var fowMin:float = 5;
var fowMax:float = 60;
var currentFow:float = 60;
var fowSpeed:float = 1;
function Start () {

}

function Update () {
	//Debug.Log('Update');
	
	if(Input.GetKey('m')){
		if (currentFow>fowMin){
			currentFow-=fowSpeed;
		}
	}
	else{
		if (currentFow<fowMax){
			currentFow+=fowSpeed;
		}
	}
	
	GetComponent.<Camera>().fieldOfView = currentFow;
	//this.transform.
	//this.transform.position.x+=(Input.GetAxis("Horizontal"));
	//this.transform.Rotate(Vector3.up, Time.deltaTime);
	
	
	//transform.Rotate(Vector3.right * Time.deltaTime*);
    transform.Rotate(Vector3.up * Input.GetAxis("Horizontal"), Space.World);
    transform.Rotate(Vector3.left * Input.GetAxis("Vertical"));

}