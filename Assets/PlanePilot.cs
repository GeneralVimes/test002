using UnityEngine;
using System.Collections;

public class PlanePilot : MonoBehaviour {
	public float speed = 90.0f;

	// Use this for initialization
	void Start () {
		Debug.Log ("plane pilot script added to: : " + gameObject.name);
	
	
	}
	
	// Update is called once per frame
	void Update () {
	//	Debug.Log(Camera.main.transform.position-transform.position);
		
		

		
		transform.position += -transform.forward * Time.deltaTime * speed;
		
		speed -= (-transform.forward.y * Time.deltaTime * 50.0f);
		if (speed < 40.0f) {
			speed = 40.0f;
		}
			
		
		 
		transform.Rotate( Input.GetAxis("Vertical"), 0.0f, Input.GetAxis("Horizontal") );

		Vector3 moveCamTo = transform.position + transform.forward * 5.0f + Vector3.up * 1.0f;
		Camera.main.transform.position = moveCamTo;
		Camera.main.transform.LookAt (transform.position);		
		
		float terrainHeightWhereWeAre = Terrain.activeTerrain.SampleHeight (transform.position);

		if (terrainHeightWhereWeAre > transform.position.y) {
			transform.position = new Vector3(transform.position.x,
			                                 terrainHeightWhereWeAre,
			                                 transform.position.z);
		}
	
	}
}
