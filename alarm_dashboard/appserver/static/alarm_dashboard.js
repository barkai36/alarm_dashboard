//# sourceURL=alarm_dashboard.js

function play_sound() {
	var audio = new Audio('/static/app/alarm_dashboard/alarm.wav');
	audio.play();
}
//play_sound() // Test the sound function


require([
    "splunkjs/mvc",
    "splunkjs/mvc/simplexml/ready!"
], function(mvc) {

	var tokens = mvc.Components.get("default");
	// Retrieve the value of a token $mytoken$
	var play_sound_token = tokens.get("play_sound");

	alarm_search = mvc.Components.get("alarm_search")
	var alarm_rows;
	alarm_search.on('search:done', function(properties) {
		// console.log("Search is done");
		// Print the search job properties
		//console.log("Alert search DONE!\nSearch job properties:", properties.content);
	})

		
	var alarm_results = alarm_search.data("results", {count:0});
	first_run = 0; // Verify we run the sound function once. Sometimes on.data() occurs twice on the same search.
	alarm_results.on( "data", function() {
		if(first_run==0) {
			first_run = 1;
			alarm_rows = alarm_results.data().rows;
			//console.log(alarm_rows);
			incidents=alarm_rows[0][1]
			state=alarm_rows[0][2]
			play_sound_token = tokens.get("play_sound");
			console.log("incidents:"+incidents+" , state:"+state+" , play_sound_token="+play_sound_token);
			if(alarm_rows[0][2]=='Alarm' && play_sound_token=='play'){
				// Alarm state found, play the alarm sound
				console.log("Alarm is enabled and found state:"+alarm_rows[0][2]+", playing sound.");
				play_sound();
			}
			else {
				console.log("Alarm in state:"+play_sound_token+" , Found state:"+alarm_rows[0][2]+", NOT playing sound.");
			}
			first_run=0;
		}
	});

});
