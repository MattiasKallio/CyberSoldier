function logout() {
	FB.logout(function(response) {
		alert('logged out');
	});
}

function login() {
	FB.login(function(response) {
		document.getElementById('mainbox').innerHTML = JSON.stringify(response);
		if (response.session) {
			alert('logged in');
		} else {
			alert('not logged in');
		}
		console.log(response);
	}, {
		scope : "email"
	});
}
