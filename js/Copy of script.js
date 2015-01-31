var last_fetch_from = -99;
var ad_platform_type = "";
var ininrtipernt = "no";
var last_is_fetched = false;
var page_is_loading = false;
var last_type_and_id = "";
var db;

 var fbid = ""; 
 var fbname = ""; 
 var path_to_process = "http://www.cybersoldier.com/app/"; 
 var uid = window.localStorage.getItem("user_id"); 
 var logedin_user_id = uid != null ? uid : 0;
 var gmc_regkeyvar = 0000;
 var apnregkeyen = 000;

 
 /*
	 * var path_to_process = "http://localhost/facebook_cs/app/"; var fbid =
	 * "633198662"; var fbname = "Mattias Urbanus Kallio";
	 * 
	 * var logedin_user_id = 1418;
	 * 
	 * window.localStorage.setItem("name", "Kaylooooo");
	 * window.localStorage.setItem("fbid", fbid);
	 * window.localStorage.setItem("friends_csv",
	 * "796045376,524929316,100003932599803,100000609515555,587005481");
	 */
var mega_secret_code = "0ed75fcaffd55c3326efccf12f3ae737";

$(function() {
	$(document).ready(function() {
		document.addEventListener('deviceready', function() {
			
			try {
				// alert('Device is ready! Make sure you set your app_id
				// below this alert.');
				FB.init({
					appId : "370101043065651",
					nativeInterface : CDV.FB,
					useCachedDialogs : false
				});
				db = window.openDatabase("cybersoldier", "1.0", "CyberSoldier DB", 1000000);
				
				setCharacterBaseItems();
				

				
			try{
				pushNotification = window.plugins.pushNotification;
		    	if (device.platform == 'android' || device.platform == 'Android') {
					//$("#app-status-ul").append('<li>registering android</li>');
		        	pushNotification.register(pushSuccessHandler, pushErrorHandler, {"senderID":"305121912452","ecb":"onNotificationGCM"});		// required!
				} else {
					//Do some iphone magic
					//$("#app-status-ul").append('<li>registering iOS</li>');
		        	pushNotification.register(pushSuccessHandler, pushErrorHandler, {"badge":"true","sound":"true","alert":"true","ecb":"onNotificationAPN"});	// required!

		    	}
		    }
			catch(err) 
			{ 
				txt="There was an error on this page.\n\n"; 
				txt+="Error description: " + err.message + "\n\n"; 
				alert(txt); 
			}	 		
				
				
				// $("#mainbox").html("Yey, facebook initad!");
			} catch (e) {
				alert(e);
			}

			/*
			 * navigator.notification.alert( 'You are the winner!', // message
			 * alert("sweet..."), // callback to invoke with index of button
			 * pressed 'Game Over', // title 'Restart,Exit' // buttonLabels );
			 */

		}, false);

		if (logedin_user_id != 0) {
			var name = window.localStorage.getItem("name");
			var tfbid = window.localStorage.getItem("fbid");
			var name_out = name != null ? name : "Hittade inget namn...";
			// alert(name_out+" "+logedin_user_id);
			if (name != null) {
				doLogin(name, tfbid, true);
			}
		}
		
		$("body").on("click", "#save_userinfo", function(){
			window.localStorage.setItem("name",$("#streetname").val());
			window.localStorage.setItem("description",$("#description").val());
			window.localStorage.setItem("language",$("#language_pref").val());
			
			var data = {
				mega_secret_code : mega_secret_code,
				action : "add",
				user_id : window.localStorage.getItem("user_id"),
				name : $("#streetname").val(),
				description : $("#description").val(),
				language : $("#language_pref").val()
			};

			$.ajax({
				type : "POST",
				url : path_to_process + "user_handler.php",
				data : data,
				cache : false,
				success : function(data) {
					var response = JSON.parse(data);
					if (response.result == "ok") {
						$.mobile.changePage('index.html', {
							transition : 'slide',
							changeHash : true,
							role : 'page'
						});
					} else {
						// $("#listbox").html(data);
					}
					page_is_loading = false;
				},
				error : function() {
					page_is_loading = false;
				}
			});
		});

		$("body").on("click", ".facebook_login", function() {
			var lt = $(".facebook_login").html();
			if (lt != "Logout") {
				try {
					FB.login(function(response) {
						FB.api('/me', function(response) {
							// alert('Good to see you, ' + response.name +
							// '.');
							fbname = response.name;
							fbid = response.id;
							doLogin(fbname, fbid, true);
						});

						FB.api('/me/friends', function(response) {
							// Iterate through the array of friends object
							// and create a checkbox for each one.
								
							var somestring = "";
							var somestring2 = "";
							for ( var i = 0; i < Math.min(response.data.length); i++) {
								somestring2 += response.data[i].name + " " + response.data[i].id + "\n";
								somestring += response.data[i].id;
								if (i < Math.min(response.data.length) - 1)
									somestring += ",";
							}
							window.localStorage.setItem("friends_csv", somestring);
						});

					}, {
						scope : "email"
					});
				} catch (e) {
					alert(e);
				}
			} else {
				doLogout();
			}
		});

		var data = {
			mega_secret_code : mega_secret_code,
			action : "battles",
			from : 0,
			screen_w : window.innerWidth,
			logedin_user_id : logedin_user_id,
			language : window.localStorage.getItem("language")
		};
		
		$("#morebutton").html("Loading page, gif?");
		page_is_loading = false;
		$("#morebutton").fadeIn();

		$.ajax({
			type : "POST",
			url : path_to_process + "battles.php",
			data : data,
			cache : false,
			success : function(data) {
				// console.log(data);
				var response = JSON.parse(data);
				if (response.result == "ok") {
					$("#mainbox").html(response.html_mainbox);
					$("#listbox").append(response.html);
					$("#morebutton").html(" - Click for more - ");
				} else {
					$("#listbox").html(data);
				}
				$("#list_from").val(response.from);
				$("#list_type").val("battles");
				$("#list_id").val("latest");

				page_is_loading = false;

			},
			error : function() {
				page_is_loading = false;
			}
		});

		$("body").on("click", ".menu_button", function(e) {
			e.preventDefault();
			$("#list_from").val(0);
			last_is_fetched = false;
			$.mobile.changePage('#home', {
				transition : 'slide',
				changeHash : true,
				role : 'page'
			});
			if (!$(this).hasClass("facebook_login")) {
				var ths = $(this).attr("id").split("_");
				var menu_type = ths[0];
				var menu_id = ths[1];
				var from = $("#list_from").val();
				var order = "latest";
				setpage(menu_type, menu_id, from, false);
				$("html, body").animate({
					scrollTop : 0
				}, "slow");
			}
		});

		$("#mainbox, #mainbox_battlefield").on("click", ".startbattle", function(e) {
			// e.preventDefault();
			var logedin_user_id = window.localStorage.getItem("user_id");
			if (logedin_user_id != null) {
				var user_id = $(this).attr("id").split("_")[1];
				var page_name = "startbattle.php";

				$.mobile.changePage('#start_battle', {
					transition : 'slide',
					changeHash : true,
					role : 'page'
				});

				var data = {
					mega_secret_code : mega_secret_code,
					action : "start_battle",
					user_id : user_id
				};

				$.ajax({
					type : "POST",
					url : path_to_process + page_name,
					data : data,
					cache : false,
					success : function(data) {
						// console.log(data);
						var response = JSON.parse(data);
						if (response.result == "ok") {
							$("#listbox_startbattle").html(response.html);
							// $("#mainbox").html(response.html_mainbox);
						} else {
							$("#listbox_startbattle").html(data);
						}
					}
				});

			} else {
				alert("Sorry you are not logged in.");
			}
		});

		$("#listbox_startbattle").on("click", "#start_battle", function(e) {
			// alert("BOOM, start.");
			var head = $("#head").val();
			var tail = $("#tail").val();
			var type = $("#type").val();
			var opponent_id = $("#opponent_id").val();
			var clean_battle = $("#clean_battle").val();
			var rhyme = $("#clean_battle").val();
			var language = $("#language").val();

			$("#thinking2").fadeIn(5);

			var head_ok = head.length > 5;
			var opponent_ok = opponent_id != 0;
			var language_ok = language != 0;
			var all_ok = head_ok && opponent_ok && language_ok;

			if (all_ok) {

				var data = {
					mega_secret_code : mega_secret_code,
					action : "add",
					head : head,
					tail : tail,
					type : type,
					logedin_user_id:logedin_user_id,
					opponent_id : opponent_id,
					clean_battle : clean_battle,
					rhyme : rhyme,
					language : language
				};

				$.ajax({
					type : "POST",
					url : path_to_process + "battle_handler.php",
					data : data,
					cache : false,
					success : function(response) {
						console.log(response);
						var response = JSON.parse(response);
						if (response.result == "ok") {
							$.mobile.changePage('#home', {
								transition : 'slide',
								changeHash : true,
								role : 'page'
							});
							$("#thinking2").fadeOut();
							var page = "battle.php";
							fetchInfo(response.battle_id, page);
						} else {
							$("#thinking2").fadeOut();
						}
					}
				});
			} else {
				var alert_str = "";
				if (!head_ok)
					alert_str += "Battle name is to short\n";
				if (!opponent_ok)
					alert_str += "There is no opponent\n";
				if (!language_ok)
					alert_str += "Pick a language\n";
				alert(alert_str);
				$("#thinking2").fadeOut();
			}
			return false;
		});

		$("#listbox, #mainbox, #listbox_battlefield, #mainbox_battlefield").on("click", "a", function(e) {
			e.preventDefault();
			$("#morebutton").fadeOut();
			var id = $(this).attr("href").split("id=")[1];
			var type = $(this).attr("href").split(".php")[0];
			var page = "battle.php";
			switch (type) {
				case "userinfo":
					page = "userinfo.php";
					fetchInfo(id, page);
				break;
				case "battle":
					page = "battle.php";
					fetchInfo(id, page);
				break;
			}
		});

		$("#listbox, #listbox_battlefield").on("click", "#reply_button", function() {
			var texten = $("#reply_texten").val();
			var code = $("#reply_code").val();
			var bid = $("#battles_id").val();

			var data = {
				mega_secret_code : mega_secret_code,
				action : "add_item",
				texten : texten,
				code : code,
				battles_id : bid,
				language : window.localStorage.getItem("language")
			};

			$.ajax({
				type : "POST",
				url : path_to_process + "battle_handler.php",
				data : data,
				cache : false,
				success : function(response) {
					// alert(response);
					var response = JSON.parse(response);
					if (response.result == "ok") {
						$("#reply_box").fadeOut();
						$("#listbox_battlefield").fadeOut("slow", function() {
							$("#listbox_battlefield").append(response.html);
							$("#listbox_battlefield").fadeIn("slow");
						});
					} else
						alert(response.msg);
				}
			});
			return false;
		});

		$("#listbox, #listbox_battlefield").on("click", ".battle_score_button", function(e) {
			e.preventDefault();
			var thiss = $(this);
			var ths = $(this).attr("id").split("_");
			var type = ths[0];
			var parent_id = ths[1];
			var score = ths[2];

			var data = {
				mega_secret_code : mega_secret_code,
				type : type,
				parent_id : parent_id,
				score : score
			};

			$.ajax({
				type : "POST",
				url : path_to_process + "score_process.php",
				data : data,
				cache : false,
				success : function(response) {
					thiss.addClass("battle_score_button_marked");
					// alert(response);
					// Borde vara n�t som �ndrar score, och markerar att man
					// r�stat p� n�t s�tt.
				}
			});

		});

		/*
		 * $(window).scroll(function() { if ($(window).scrollTop() +
		 * $(window).height() >= $(document).height() * 0.80) { var from =
		 * $("#list_from").val(); var list_type = $("#list_type").val(); var
		 * list_id = $("#list_id").val(); if (!last_is_fetched && from != 0)
		 * setpage(list_type, list_id, from, true); } });
		 */
		
		$(".morebutton").on("click", function() {
			var from = $("#list_from").val();
			var list_type = $("#list_type").val();
			var list_id = $("#list_id").val();
			// alert(list_type+" "+from+" "+list_id+" ");
			if (!last_is_fetched && from != 0) {
				setpage(list_type, list_id, from, true);
			}
		});

		function getUsersThatAreFriends(csv_friend_str) {
			var dataString = 'friends=' + csv_friend_str;

			$.ajax({
				type : "POST",
				url : path_to_process + "facebook_process.php",
				data : dataString,
				cache : false,
				success : function(data) {
					$("#popcontent .small_select_user_box").remove();
					$("#popcontent").append(data);
					$("#pop").fadeIn();
				}
			});
			return false;
		}

		function setpage(menu_type, menu_id, from, append_list) {
			if (!page_is_loading) {
				page_is_loading = true;
				var somestring = "";
				var menu_type_and_id = menu_type + menu_id;
				$("#morebutton").html("Loading page");
				$("#morebutton").fadeIn();
				if (menu_type == "user") {
					switch (menu_id) {
						case "settings":
							page_is_loading = false;
							$.mobile.changePage('settings.html', {
								transition : 'slide',
								changeHash : true,
								role : 'page'
							});
						break;
						case "challe":
							page_is_loading = false;
							$.mobile.changePage('user.html', {
								transition : 'pop',
								changeHash : true,
								role : 'page'
							});
						break;
					}
				}

				else if (menu_type == "battles") {
					$.mobile.changePage('#home', {
						transition : 'slide',
						changeHash : true,
						role : 'page'
					});
					switch (menu_id) {
						case "latest":
							order = "latest";
						break;
						case "top":
							order = "top";
						break;
						case "mine":
							order = "mine";
						break;
						case "friends":
							order = "friends";
							somestring = window.localStorage.getItem("friends_csv");
						break;
					}

					var data = {
						mega_secret_code : mega_secret_code,
						action : "battles",
						order : order,
						from : from,
						friends_csv : somestring,
						logedin_user_id : window.localStorage.getItem("user_id"),
						language : window.localStorage.getItem("language"),
						screen_w : window.innerWidth
					};
					
					$.ajax({
						type : "POST",
						url : path_to_process + "battles.php",
						data : data,
						cache : false,
						success : function(data) {
							// console.log(data);
							$("#firstpanel").panel("close");
							$("#morebutton").html(" - Click for More - ");
							var response = JSON.parse(data);
							if (response.result == "ok") {
								$("#mainbox").html(response.html_mainbox);
								if (append_list)
									$("#listbox").append(response.html);
								else
									$("#listbox").html(response.html);
								if ("No more" != response.from) {
									console.log(response.from +"< from");
									$("#list_from").val(response.from);
								} else {
									last_is_fetched = true;
									$("#morebutton").fadeOut();
								}
								$("#list_type").val("battles");
								$("#list_id").val(order);
								setting_page = false;

							} else {
								console.log(data);
							}
							page_is_loading = false;
						},
						error : function() {
							page_is_loading = false;
						}
					});

				}

				else if (menu_type == "quotes") {
					$.mobile.changePage('#home', {
						transition : 'slide',
						changeHash : true,
						role : 'page'
					});

					switch (menu_id) {
						case "latest":
							order = "latest";
						break;
						case "top":
							order = "top";
						break;
						case "friends":
							order = "friends";
							somestring = window.localStorage.getItem("friends_csv");
						break;
					}

					var data = {
						mega_secret_code : mega_secret_code,
						action : "quotes",
						order : order,
						from : from,
						logedin_user_id : window.localStorage.getItem("user_id"),
						friends_csv : somestring,
						screen_w : window.innerWidth,
						language : window.localStorage.getItem("language")
					};

					$.ajax({
						type : "POST",
						url : path_to_process + "quotes.php",
						data : data,
						cache : false,
						success : function(data) {
							// console.log(data);
							$("#firstpanel").panel("close");
							$("#morebutton").html(" - Click for More - ");
							var response = JSON.parse(data);
							if (response.result == "ok") {
								$("#mainbox").html(response.html_mainbox);
								if (append_list)
									$("#listbox").append(response.html);
								else
									$("#listbox").html(response.html);
								if ("No more" != response.from) {
									$("#list_from").val(response.from);
								} else {
									last_is_fetched = true;
									$("#morebutton").fadeOut();
								}
								$("#list_type").val("quotes");
								$("#list_id").val(order);
								setting_page = false;

							} else {
								alert(data);
							}
							page_is_loading = false;
						},
						error : function() {
							page_is_loading = false;
						}
					});

				}
				last_type_and_id = menu_type_and_id;
			}
		}
	});
});
/*
 * function setTheIcons(tx, results) { var len = results.rows.length;
 * console.log("character_items table: " + len + " rows found."); for (var i=0;
 * i<len; i++){ console.log("Row = " + i + " ID = " + results.rows.item(i).id + "
 * Name = " + results.rows.item(i).name + " Icon = " +
 * results.rows.item(i).icon); } }
 */
function querySuccess(tx, results) {
	var str_uuut = "DB query done";
	console.log(str_uuut);
}

function queryFail(tx, err) {
	console.log("Error processing SQL: " + err.code + " " + err.message);
}
/*
 * function getCharacterItems(type) { var type_str = type == null || type ==
 * undefined ? "" : ' AND type="' + type + '"';
 * 
 * if (db) { db.transaction(function(tx) { tx.executeSql('SELECT * FROM
 * character_items', [], setTheIcons, queryFail); }, queryFail); } }
 */
function setCharacterBaseItems(){
	// TODO: check if they're set in local db.
	$.getScript("js/base_items.js", function(){
		   var clizt = base_items_data.char_list;
	
	if (db) {
		db.transaction(function(tx) {
			tx.executeSql('DROP TABLE IF EXISTS character_items');
			tx.executeSql('CREATE TABLE IF NOT EXISTS character_items (id unique, type, name, icon, svg_info, date_added)');
		}, queryFail, function(){});
		db.transaction(txede_first, queryFail, querySuccess);
	}
	function txede_first(tx) {
		for ( var i in clizt) {
			var svg_cl = clizt[i].svg_info.replace(/\"/g,"'");
			tx.executeSql('INSERT INTO character_items (id, type, name, icon, svg_info, date_added) VALUES ('+clizt[i].id+',"'+clizt[i].type+'","'+clizt[i].name+'","'+clizt[i].icon+'","'+svg_cl+'","'+clizt[i].date_added+'")');
		}
		console.log("character items loaded");
	}
	});
}

function updateCharacterItems() {
	// TODO:[needs ids from current]
	var data = {
		mega_secret_code : mega_secret_code,
		action : "update_items",
		logedin_user_id : window.localStorage.getItem("user_id")
	};

	$.ajax({
		type : "POST",
		url : path_to_process + "character_handler.php",
		data : data,
		cache : false,
		success : function(data) {
			// alert(data);
			var response = JSON.parse(data);
			if (response.result == "ok") {
				var db_done = false;
				var clizt = response.char_list;
				var str_ut = "";
				if (db) {
					db.transaction(function(tx) {
						tx.executeSql('DROP TABLE IF EXISTS character_items');
						tx.executeSql('CREATE TABLE IF NOT EXISTS character_items (id unique, type, name, icon, svg_info, date_added)');
					}, queryFail, function(){});
					db.transaction(txede, queryFail, querySuccess);
				}
				function txede(tx) {
					// var svg_cl = clizt[i].svg_info.replace(/\"/g,'');
					// str_ut += 'INSERT INTO character_items (id, type, name,
					// icon, svg_info, date_added) VALUES
					// ("'+clizt[i].id+'","'+clizt[i].type+'","'+clizt[i].name+'","'+clizt[i].icon+'","'+clizt[i].svg_info.replace(/\"/g,'')+'",,"'+clizt[i].date_added+'",)';
					// tx.executeSql('INSERT INTO character_items (id, type,
					// name, icon, svg_info, date_added) VALUES
					// ('+clizt[i].id+',"'+clizt[i].type+'","'+clizt[i].name+'","'+clizt[i].icon+'","'+svg_cl+'","'+clizt[i].date_added+'")');
					// tx.executeSql('INSERT INTO character_items (id, type)
					// VALUES (2,"bla")');
					
						for ( var i in clizt) {
							// str_ut += clizt[i].name+"\n";
							// tx.executeSql("INSERT INTO character_items (id,
							// type) VALUES (" + i + ",'bla')", [],
							// querySuccess, queryFail);
							var svg_cl = clizt[i].svg_info.replace(/\"/g,"'");
							tx.executeSql('INSERT INTO character_items (id, type, name, icon, svg_info, date_added) VALUES ('+clizt[i].id+',"'+clizt[i].type+'","'+clizt[i].name+'","'+clizt[i].icon+'","'+svg_cl+'","'+clizt[i].date_added+'")');
							// str_ut += " " + i;
						}
					// console.log(str_ut);
					// console.log("Rows Affected = " + results.rowAffected);
				}

				// console.log(str_ut);

			} else {
				console.log(data);
			}
		}
	});
}

function fetchInfo(id, page) {
	$.mobile.changePage('#battle_field', {
		transition : 'slide',
		changeHash : true,
		role : 'page'
	});
	var data = {
		mega_secret_code : mega_secret_code,
		id : id,
		logedin_user_id : window.localStorage.getItem("user_id"),
		screen_w : window.innerWidth
	};

	$.ajax({
		type : "POST",
		url : path_to_process + page,
		data : data,
		cache : false,
		success : function(data) {
			// console.log(data);
			var response = JSON.parse(data);
			if (response.result == "ok") {
				$("html, body").animate({
					scrollTop : 0
				}, "slow");
				$("#listbox_battlefield").html(response.html);
				var mb_str = response.html_mainbox != "" ? response.html_mainbox : "";
				$("#mainbox_battlefield").html(mb_str);
			} else {
				$("#mainbox_battlefield").html(data);
			}
		}
	});
}

function doLogin(name, fbid) {
	alert("login!");
	
	if (device.platform == 'android' || device.platform == 'Android') {
		var gcmregkeyen = window.localStorage.getItem("gcmregkeyen") == null ? gmc_regkeyvar : window.localStorage.getItem("gcmregkeyen") ;
	}
	else{
		var apnregkeyen = window.localStorage.getItem("apnregkeyen") == null ? apn_regkeyvar : window.localStorage.getItem("apnregkeyen") ;
	}
	
	var dataarr = {
		mega_secret_code : mega_secret_code,
		name : name,
		fbid : fbid,
		gcmregkeyen : gcmregkeyen,
		apnregkeyen : apnregkeyen,
		action : "login"
	};
	$.ajax({
		type : "POST",
		url : path_to_process + "user_handler.php",
		data : dataarr,
		cache : false,
		success : function(data) {
			// alert(data);
			var response = JSON.parse(data);
			if (response.result == "ok") {
				window.localStorage.setItem("user_id", response.user_id);
				window.localStorage.setItem("name", response.csuserinfo.name);
				window.localStorage.setItem("description", response.csuserinfo.description);
				window.localStorage.setItem("fbid", response.csuserinfo.fbid);
				window.localStorage.setItem("language", response.csuserinfo.language);
				window.localStorage.setItem("gcmregkeyen", gcmregkeyen);
				window.localStorage.setItem("apnregkeyen", apnregkeyen);
				
				for(var i in response.csuser_colors){
					window.localStorage.setItem(i, response.csuser_colors[i]);
					console.log(i + " " + response.csuser_colors[i]);
				}
				
				

				logedin_user_id = response.user_id;
				$(".facebook_login").html("Logout");
				$(".user_loggedin_button").slideDown();
			} else if (response.result == "newuser") {
				window.localStorage.setItem("user_id", response.user_id);
				window.localStorage.setItem("name", response.csuserinfo.name);
				window.localStorage.setItem("description", response.csuserinfo.description);
				window.localStorage.setItem("fbid", response.csuserinfo.fbid);
				window.localStorage.setItem("language", response.csuserinfo.language);
				window.localStorage.setItem("gcmregkeyen", gcmregkeyen);
				window.localStorage.setItem("apnregkeyen", apnregkeyen);
				$.mobile.changePage('settings.html', {
					transition : 'slide',
					changeHash : true,
					role : 'page'
				});
				
			} else
				alert("error" + data);
		}
	});
	return false;
}

function doLogout() {
	window.localStorage.removeItem("user_id");
	window.localStorage.removeItem("name");
	window.localStorage.removeItem("fbid");
	window.localStorage.removeItem("language");
	logedin_user_id = null;
	$(".facebook_login").html("Login");
	$(".user_loggedin_button").slideUp();
}

function showAlert(message, title) {
	if (navigator.notification) {
		navigator.notification.alert(message, null, title, 'OK');
	} else {
		alert(title ? (title + ": " + message) : message);
	}
}

function handleStatusChange(response) {
	if (response.authResponse) {
		console.log(response);
		// window.location.hash = '#menu';
		// updateUserInfo(response);
	} else {
		console.log(response);
		// window.location.hash = '#login';
	}
}


function pushSuccessHandler(result) {
    //alert('Callback Success! Result = '+result)
	if (device.platform == 'android' || device.platform == 'Android') {
		//Do android stuff, but key i set in onNotificationGCM.
	}
	else{
		apnregkeyen = result;
		window.localStorage.setItem("apnregkeyen", apnregkeyen);
		alert(apnregkeyen);
	}
}
function pushErrorHandler(error) {
    alert("push error: "+error);
}

function onNotificationGCM(e) {
	//alert(e.event);
	 switch( e.event )
	 {
		case 'registered':
	    	if ( e.regid.length > 0 ){
				gmc_regkeyvar = e.regid;
				window.localStorage.setItem("gcmregkeyen", gmc_regkeyvar);
	            console.log("Regid " + gmc_regkeyvar);
	            //alert('registration id = '+gmc_regkeyvar);
			}
		break;
		case 'message':
	    	// this is the actual push notification. its format depends
			// on the data model from the push server
	        //alert('message = ' + e.message + 'message count = ' + e.msgcnt + 'battle_id = ' + e.payload.battle_id);
			var page = "battle.php";
			fetchInfo(e.payload.battle_id, page);
			
		break;
	 
	    case 'error':
	    	alert('GCM error = '+e.msg);
		break;
	 
		default:
	    	alert('An unknown GCM event has occurred');
		break;
	}
}

function onNotificationAPN(e){
	var pushNotification = window.plugins.pushNotification;
    if (e.alert) {
        navigator.notification.alert(e.alert);
    }
    if (e.badge) {
        console.log("Set badge on  " + pushNotification);
        pushNotification.setApplicationIconBadgeNumber(this.successHandler, e.badge);
    }
    if (e.sound) {
        var snd = new Media(e.sound);
        snd.play();
    }	
}