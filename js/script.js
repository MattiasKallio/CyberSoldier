var last_fetch_from = -99;
var ad_platform_type = "";
var path_to_process = "http://localhost/facebook_cs/app/";
var path_to_process = "http://www.cybersoldier.com/app/";

var app = {
	// Application Constructor
	initialize : function() {
		this.bindEvents();
	},
	// 'load', 'deviceready', 'offline', and 'online'.
	bindEvents : function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},
	onDeviceReady : function() {
		app.receivedEvent('deviceready');
		FB.init({ appId: "1399179707001858", nativeInterface: CDV.FB, useCachedDialogs: false });
		//app.receivedEvent('facebook initied');
	},
	receivedEvent : function(id) {
		alert('Received Event: ' + id);
		//document.getElementById('mainbox').innerHTML = 'Received Event: ' + id;
		//ad_platform_type = device.platform != "undefined" ? device.platform : ad_platform_type;
	}
};

$(function() {
	$(document).ready(function() {
		
		app.initialize();
		var catname = $("#cliplist_bottom_category").val();

		var data = {
			mega_secret_code : "0ed75fcaffd55c3326efccf12f3ae737",
			action : "battles",
			screen_w : window.innerWidth
		};

		$.ajax({
			type : "POST",
			url : path_to_process+"battles.php",
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
			
			switch(type){
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
				url : path_to_process+page,
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
