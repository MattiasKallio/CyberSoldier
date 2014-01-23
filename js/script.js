var last_fetch_from = -99;
var ad_platform_type = "";
var ininrtipernt = "no";
var path_to_process = "http://localhost/facebook_cs/app/";
var path_to_process = "http://www.cybersoldier.com/app/";

$(function() {
	$(document).ready(function() {
	        document.addEventListener('deviceready', function() {
	        	alert("Device ready\nTrying to login");
	        	 try {
	        		 alert('Device is ready! Make sure you set your app_id below this alert.');
	                 FB.init({ appId: "370101043065651", nativeInterface: CDV.FB, useCachedDialogs: false });
	                 $("#mainbox").html("Yey, facebook initad!");
	        	 } catch (e) {
	                 alert(e);
	        	 }
	        }, false);			
			

		var catname = $("#cliplist_bottom_category").val();

		var data = {
			mega_secret_code : "0ed75fcaffd55c3326efccf12f3ae737",
			action : "battles",
			screen_w : window.innerWidth
		};

		$.ajax({
			type : "POST",
			url : path_to_process + "battles.php",
			data : data,
			cache : false,
			success : function(data) {
				//console.log(data);
				var response = JSON.parse(data);
				if (response.result == "ok") {
					$("#listbox").html(response.html);
				} else {
					$("#listbox").html(data);
				}
			}
		});

		/*$("#listbox").on("click", ".clickable", function(e) {
			e.preventDefault();
			var id = $(this).attr("id").split("_")[1];
			var data = {
				mega_secret_code : "0ed75fcaffd55c3326efccf12f3ae737",
				battle_id : id,
				screen_w : window.innerWidth
			};

			$.ajax({
				type : "POST",
				url : path_to_process+"battle.php",
				data : data,
				cache : false,
				success : function(data) {
					console.log(data);
					var response = JSON.parse(data);
					if (response.result == "ok") {
						$("html, body").animate({
							scrollTop : 0
						}, "slow");
						$("#listbox").html(response.html);
						$("#mainbox").html(response.html_mainbox);
					} else {
						$("#cliplist").html(data);
					}
				}
			});
		});*/

		$("#listbox, #mainbox").on("click", "a", function(e) {
			e.preventDefault();
			var id = $(this).attr("href").split("id=")[1];
			var type = $(this).attr("href").split(".php")[0];

			var page = "battle.php";
			//alert(id);

			switch (type) {
				case "userinfo":
					page = "userinfo.php";
				break;
				case "battle":
					page = "battle.php";
				break;
			}

			var data = {
				mega_secret_code : "0ed75fcaffd55c3326efccf12f3ae737",
				id : id,
				screen_w : window.innerWidth
			};

			$.ajax({
				type : "POST",
				url : path_to_process + page,
				data : data,
				cache : false,
				success : function(data) {
					console.log(data);
					var response = JSON.parse(data);
					if (response.result == "ok") {
						$("html, body").animate({
							scrollTop : 0
						}, "slow");
						$("#listbox").html(response.html);
						$("#mainbox").html(response.html_mainbox);
					} else {
						$("#cliplist").html(data);
					}
				}
			});
		});

		/*

			$("#firstpanel").on("click", ".menu_button", function() {
				var catid = $(this).attr("id").split("_")[1];
				$("#cliplist_bottom_category").val(catid);

				var data = {
					mega_secret_code : "0ed75fcaffd55c3326efccf12f3ae737",
					action : "clip_box",
					catname : catid,
					screen_w : window.innerWidth
				};

				$.ajax({
					type : "POST",
					url : "http://www.petsalami.com/app/getcontent.php",
					data : data,
					cache : false,
					success : function(data) {
						var response = JSON.parse(data);
						if (response.result == "ok") {
							$("#clipcontainer").html(response.html);
						} else {
							$("#clipcontainer").html(data);
						}
					}
				});

				var action = "get_latest_bottom";
				var dataString = {
					mega_secret_code : "0ed75fcaffd55c3326efccf12f3ae737",
					action : action,
					from : 0,
					catname : catid,
					num_clips : 10
				};

				$.ajax({
					type : "POST",
					url : "http://www.petsalami.com/app/getclips.php",
					data : dataString,
					cache : false,
					success : function(data) {
						var response = JSON.parse(data);
						if (response.result == "ok") {
							// $("#bottom_ad").appendTo("#cliplist_bottom");
							$("#cliplist_bottom_from").val(response.top_from);
							$("#cliplist").html(response.html);
						} else
							alert("error: ".response.msg);
					}
				});

				$("#firstpanel").panel("close");
			});
		 */

		$(window).scroll(function() {
			if ($(window).scrollTop() + $(window).height() >= $(document).height() * 0.80) {
				var action = "get_latest_bottom";
				var from = $("#cliplist_bottom_from").val();
				var catname = $("#cliplist_bottom_category").val();
				if (last_fetch_from != from) {
					last_fetch_from = from;
					var dataString = {
						mega_secret_code : "0ed75fcaffd55c3326efccf12f3ae737",
						action : action,
						catname : catname,
						from : from,
						num_clips : 10
					};

					$.ajax({
						type : "POST",
						url : "http://www.petsalami.com/app/getclips.php",
						data : dataString,
						cache : false,
						success : function(data) {
							var response = JSON.parse(data);
							if (response.result == "ok") {
								// $("#bottom_ad").appendTo("#cliplist_bottom");
								$("#cliplist_bottom_from").val(response.top_from);
								$("#cliplist").append(response.html);
							} else
								alert("error: ".response.msg);
						}
					});
				}
			}
		});

	});
});

showAlert = function(message, title) {
	if (navigator.notification) {
		navigator.notification.alert(message, null, title, 'OK');
	} else {
		alert(title ? (title + ": " + message) : message);
	}
}

function handleStatusChange(response) {
	if (response.authResponse) {
		console.log(response);
		window.location.hash = '#menu';
		updateUserInfo(response);
	} else {
		console.log(response);
		window.location.hash = '#login';
	}
}

$(".facebook_login").on("click", function() {
	FB.login(function(response) {
		FB.api('/me', function(response) {
			console.log('Good to see you, ' + response.name + '.');
			doLogin(response.name, response.id, true);
		});
	});
});
