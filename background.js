var fb_ready = false;
// code to load the facebook sdk javascript
window.fbAsyncInit = function() {
	FB.init({appId: '511390792282394', status: true, cookie: true, xfbml: true});

	FB.Event.subscribe('auth.authResponseChange', function(response) {
		if (response.status === 'connected') {
			testAPI();
		} else if (repsonse.status === 'not_authorized') {
			FB.login();
		} else {
			FB.login();
		}
	});
};

(function() {
	var e = document.createElement('script'); e.async = true;
	e.src = 'https://connect.facebook.net/en_US/all.js';
	document.body.appendChild(e);
	fb_ready = true;
}());

function testAPI() {
	console.log('Welcome! Fetching your info...');
	FB.api('/me', function(response) {
		console.log('Good to see you, ' + response.name + '.');
	});
}