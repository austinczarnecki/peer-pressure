window.onload = function() {
	var elt = document.createElement('iframe');
	elt.id = 'facebook_load_frame';
	elt.src = 'https://s3.amazonaws.com/peer-pressure-pennapps/iframe.html';
	document.getElementsByTagName('body')[0].appendChild(elt);
	var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
	var eventer = window[eventMethod];
	var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
	eventer(messageEvent, function(e) {
		console.log("Connection status: "+e.data.connectStatus+"; UserID: "+e.data.userID+"; AccessToken: "+e.data.accessToken);
	}, false);
}