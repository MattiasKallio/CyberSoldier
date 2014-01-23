function logout() {
	FB.logout(function(response) {
		alert('logged out');
	});
}

function login() {
	alert("trying to login");
	FB.login(function(response) {
		alert(response);
		if (response.session) {
			alert('logged in');
		} else {
			alert('not logged in');
		}
	}, {
		scope : "email"
	});
}
