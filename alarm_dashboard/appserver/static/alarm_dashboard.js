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
	
	var search_done_c = 1; //counter
	var results_c = 1; //counter

	var tokens = mvc.Components.get("default");
	// Retrieve the value of a token $mytoken$
	var play_sound_token = tokens.get("play_sound");

	alarm_search = mvc.Components.get("alarm_search")
	var alarm_rows;
	alarm_search.on('search:done', function(properties) {
		run_alarm_search(alarm_search);
	})
	
	function run_alarm_search(alarm_search) {
		//console.log("Search is done");
		//console.log("search done # - "+search_done_c);
		search_done_c+=1;
		var alarm_results = alarm_search.data("results", {count:0});
		alarm_results.on("data", function() {
			run_alarm_on_results(alarm_results);
		})
	}
	
	function run_alarm_on_results(alarm_results) {
		//console.log("Results arrived");
		//console.log("results # - "+results_c);
		results_c+=1;
		//console.log(alarm_results._data.rows[0][2])
		state=alarm_results._data.rows[0][2];
		play_sound_token = tokens.get("play_sound");
		if(state=='Alarm' && play_sound_token=='play'){
				// Alarm state found, play the alarm sound
				console.log("Alarm is enabled and found state:"+state+", playing sound.");
				play_sound();
		}
		alarm_results.off();
	}
	

});
