var last_fetch_from = -99;
var ad_platform_type = "";
var ininrtipernt = "no";
//var path_to_process = "http://localhost/facebook_cs/app/";
var path_to_process = "http://www.cybersoldier.com/app/";
//var fbid = "633198662";
//var fbname = "Mattias Urbanus Kallio";
var uid = window.localStorage.getItem("user_id");
var logedin_user_id = uid != null ? uid : 0;
var mega_secret_code = "0ed75fcaffd55c3326efccf12f3ae737";


$(function() {
	$(document).ready(function() {
		
	        document.addEventListener('deviceready', function() {
	        	try {
	        		//alert('Device is ready! Make sure you set your app_id below this alert.');
	                FB.init({ appId: "370101043065651", nativeInterface: CDV.FB, useCachedDialogs: false });
	                //$("#mainbox").html("Yey, facebook initad!");
	        	} catch (e) {
	                alert(e);
	        	}
	        	
	    		/*navigator.notification.alert(
	    	            'You are the winner!',  // message
	    	            alert("sweet..."),              // callback to invoke with index of button pressed
	    	            'Game Over',            // title
	    	            'Restart,Exit'          // buttonLabels
	    	        );*/
	        	
	        }, false);			
			
	        if(logedin_user_id != 0){
	        	var name = window.localStorage.getItem("name");
	        	var tfbid = window.localStorage.getItem("fbid");
	        	var name_out = name != null ? name : "Hittade inget namn...";
	        	alert(name_out+logedin_user_id);
	        	if(name != null){
	        		doLogin(name, tfbid, true);
	        	}
	        }
	        
	        $("body").on("click",".facebook_login", function() {
	        	var lt = $(".facebook_login").html();
	        	alert(lt);
	        	if(lt!="Logout"){
	        		FB.login(function(response) {
	        			FB.api('/me', function(response) {
	        			 	alert('Good to see you, ' + response.name + '.');
	        			 	fbid = response.id;
	        			});
	        		},
					{ scope: "email" }
	        		);
	        		doLogin(fbname, fbid, true);
	        	}
	        	else{
	        		doLogout();
	        	}
	        });	  	        
	        
	        

		var catname = $("#cliplist_bottom_category").val();

		var data = {
			mega_secret_code : mega_secret_code,
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
					$("#mainbox").html(response.html_mainbox);
					$("#listbox").html(response.html);
				} else {
					$("#listbox").html(data);
				}
			}
		});
		
		$("body").on("click", ".menu_button", function(e){
			e.preventDefault();
			$.mobile.changePage('#home', {
	            transition: 'slide',
	            changeHash: true,
	            role: 'page'
	        });	
			if(!$(this).hasClass("facebook_login")){
			var ths = $(this).attr("id").split("_");
			var menu_type = ths[0];
			var menu_id = ths[1];
			var order = "latest";
			
			if(menu_type == "user"){
				switch(menu_id){
					case "settings":
						$.mobile.changePage('#settings', {
				            transition: 'slide',
				            changeHash: true,
				            role: 'page'
				        });		
					break;					
				}
			}
			
			else if(menu_type == "battles"){
				switch(menu_id){
					case "latest":
						order = "latest";
					break;
					case "top":
						order = "top";
					break;
					case "mine":
						order = "mine";
					break;					
				}
				
				//alert(menu_id);
				
				var data = {
						mega_secret_code : mega_secret_code,
						action : "battles",
						order : order,
						logedin_user_id:window.localStorage.getItem("user_id"),
						screen_w : window.innerWidth
					};

					$.ajax({
						type : "POST",
						url : path_to_process + "battles.php",
						data : data,
						cache : false,
						success : function(data) {
							//console.log(data);
							$( "#firstpanel" ).panel( "close");
							var response = JSON.parse(data);
							if (response.result == "ok") {
								$("#mainbox").html(response.html_mainbox);
								$("#listbox").fadeOut("slow", function(){
									$("#listbox").html(response.html);
									$("#listbox").fadeIn("slow");
								});
								
							} else {
								$("#listbox").html(data);
							}
						}
					});
				
			}
			
			else if(menu_type == "quotes"){				
				switch(menu_id){
					case "latest":
						order = "latest";
					break;
					case "top":
						order = "top";
					break;
					case "mine":
						order = "mine";
					break;					
				}
				
				//alert(menu_id);
				
				var data = {
						mega_secret_code : mega_secret_code,
						action : "quotes",
						order : order,
						logedin_user_id:window.localStorage.getItem("user_id"),
						screen_w : window.innerWidth
					};

					$.ajax({
						type : "POST",
						url : path_to_process + "quotes.php",
						data : data,
						cache : false,
						success : function(data) {
							//console.log(data);
							$( "#firstpanel" ).panel( "close");
							var response = JSON.parse(data);
							if (response.result == "ok") {
								$("#mainbox").html(response.html_mainbox);
								$("#listbox").fadeOut("slow", function(){
									$("#listbox").html(response.html);
									$("#listbox").fadeIn("slow");
								});
								
							} else {
								alert(data);
							}
						}
					});
				
				}			
			}			
		});		

		$("#mainbox").on("click", ".startbattle", function(e) {
			//e.preventDefault();
			var user_id = $(this).attr("id").split("_")[1];
			var page_name = "startbattle.php";
			
			$.mobile.changePage('#start_battle', {
	            transition: 'slide',
	            changeHash: true,
	            role: 'page'
	        });			
			
			var data = {
				mega_secret_code : mega_secret_code,
				action : "start_battle",
				user_id : user_id
			};

			$.ajax({
				type : "POST",
				url : path_to_process+page_name,
				data : data,
				cache : false,
				success : function(data) {
					//console.log(data);
					var response = JSON.parse(data);
					if (response.result == "ok") {
						$("#listbox_startbattle").html(response.html);
						//$("#mainbox").html(response.html_mainbox);
					} else {
						$("#listbox_startbattle").html(data);
					}
				}
			});
		});
		
		$("#listbox_startbattle").on("click", "#start_battle", function(e) {
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
			
			if(all_ok){
			
				var data = {
					mega_secret_code : mega_secret_code,
					action:"add",
					head:head,
					tail:tail,
					type:type,
					opponent_id:opponent_id,
					clean_battle:clean_battle,
					rhyme:rhyme,
					language:language
				};
			
				$.ajax({
					type : "POST",
					url : path_to_process+"battle_handler.php",
					data : data,
					cache : false,
					success : function(response) {
						var response = JSON.parse(response);
						if(response.result=="ok"){
							$.mobile.changePage('#home', {
					            transition: 'slide',
					            changeHash: true,
					            role: 'page'
					        });	
							$("#thinking2").fadeOut();	
							var page = "battle.php";
							fetchInfo(response.battl_id,page);
						}
						else{
							$("#thinking2").fadeOut();
							alert(response.msg);
						}
					}
				});
			}
			else{
				var alert_str = "";
				if(!head_ok)
					alert_str += "Battle name is to short\n";
				if(!opponent_ok)
					alert_str += "There is no opponent\n";
				if(!language_ok)
					alert_str += "Pick a language\n";
				alert(alert_str);
				$("#thinking2").fadeOut();
			}
			return false;	
		});		
		
		

		$("#listbox, #mainbox").on("click", "a", function(e) {
			e.preventDefault();
			var id = $(this).attr("href").split("id=")[1];
			var type = $(this).attr("href").split(".php")[0];

			var page = "battle.php";
			//alert(id);

			switch (type) {
				case "userinfo":
					page = "userinfo.php";
					fetchInfo(id,page);
				break;
				case "battle":
					page = "battle.php";
					fetchInfo(id,page);
				break;
			}
		});

		$("#listbox").on("click","#reply_button",function(){
			var texten = $("#reply_texten").val();
			var code = $("#reply_code").val();
			var bid = $("#battles_id").val();
			
			var data = {
				mega_secret_code : mega_secret_code,
				action:"add_item",
				texten:texten,
				code:code,
				battles_id:bid
			};
			
			$.ajax({
				type : "POST",
				url : path_to_process+"battle_handler.php",
				data : data,
				cache : false,
				success : function(response) {
					//alert(response);
					var response = JSON.parse(response);
					if(response.result == "ok"){
						$("#reply_box").fadeOut();
						$("#battle_field").fadeOut("slow",function(){
							$("#battle_field").append(response.html);
							$("#battle_field").fadeIn("slow");
						});
					}
					else
						alert(response.msg);
				}
			});
			return false;	
		});
		
		$("#listbox").on("click", ".battle_score_button", function(e){
			e.preventDefault();
			var ths = $(this).attr("id").split("_");
			var type = ths[0];
			var parent_id = ths[1];
			var score = ths[2];

			var data = {
				mega_secret_code : mega_secret_code,
				type:type,
				parent_id:parent_id,
				score:score
			};
			
			$.ajax({
				type : "POST",
				url : path_to_process+"score_process.php",
				data : data,
				cache : false,
				success : function(response) {
					//alert(response);
					//Borde vara nåt som ändrar score, och markerar att man röstat på nåt sätt.
				}
			});			
			
		});
		
		/*var options_text = {
				'maxCharacterSize' : 160,
				'originalStyle' : 'originalTextareaInfo',
				'warningStyle' : 'warningTextareaInfo',
				'warningNumber' : 40,
				'displayFormat' : '#input/#max | #words words'
			};
		$('#reply_texten').textareaCount(options_text);*/		
		
		function getUsersThatAreFriends(csv_friend_str){
			var dataString = 'friends=' + csv_friend_str;
			
			$.ajax({
				type : "POST",
				url : path_to_process+"facebook_process.php",
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
		
				
		
	});
});

function fetchInfo(id,page){
	
	var data = {
		mega_secret_code : mega_secret_code,
		id : id,
		logedin_user_id:window.localStorage.getItem("user_id"),
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
				var mb_str = response.html_mainbox != "" ? response.html_mainbox : "";
				//alert(mb_str);
				$("#mainbox").html(mb_str);
			} else {
				$("#cliplist").html(data);
			}
		}
	});	
}

function doLogin(name, fbid){
	var dataarr = {
		mega_secret_code : mega_secret_code,
		name:name,
		fbid:fbid,
		action:"login"
	};
	$.ajax({
		type : "POST",
		url : path_to_process+"user_handler.php",
		data : dataarr,
		cache : false,
		success : function(data) {
			//alert(data);
			var response = JSON.parse(data);
			if(response.result == "ok"){
				window.localStorage.setItem("user_id", response.user_id);
				window.localStorage.setItem("name", response.csuserinfo.name);
				window.localStorage.setItem("fbid", response.csuserinfo.fbid);
				window.localStorage.setItem("language", response.csuserinfo.language);
				
				logedin_user_id = response.user_id;
				$(".facebook_login").html("Logout");
				$(".user_loggedin_button").slideDown();
			}
			else if(response.result=="newuser"){
				alert("new user, get form: "+response.html);
				//window.location = "user.php";
				/*var formstr = "<h1>Welcome "+name+"!</h1><h4>Get a cool streetname</h4><input type='text' id='streetname' value='"+name+"' /><h4>Write something insanly ego about your self to terrify your enemies</h4><textarea id='description'></textarea><input type='button' id='new_user_button' value='Save user' />";
				$("#new_user_box").html(formstr);
				$("#new_user_box").slideDown();*/
			}
			else
				alert("error");
		}
	});
	return false;	
}

function doLogout(){
	window.localStorage.removeItem("user_id");
	window.localStorage.removeItem("name");
	window.localStorage.removeItem("fbid");
	window.localStorage.removeItem("language");
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
		//window.location.hash = '#menu';
		//updateUserInfo(response);
	} else {
		console.log(response);
		//window.location.hash = '#login';
	}
}
