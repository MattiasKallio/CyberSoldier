/**
 * Character stuff
 */
var process_path = "http://localhost/facebook_cs/app/";
var images_path = "http://localhost/facebook_cs/images/";
var process_path = "http://cybersoldier.com/app/";
var images_path = "http://cybersoldier.com/images/";
var mega_secret_code = "0ed75fcaffd55c3326efccf12f3ae737";
var db;
$(document).ready(function() {
	
	db = window.openDatabase("cybersoldier", "1.0", "CyberSoldier DB", 1000000);
	getCharacterItems();
	
	$('#body_1').colorPicker();
	$('#top_1').colorPicker();
	$('#eyes_1').colorPicker();
	$('#shirt_1').colorPicker();
	$('#accessories_1').colorPicker();
	$('#pants_1').colorPicker();
	$('#shoes_1').colorPicker();
	$('#laces_1').colorPicker();

	$.get('/vectorimage.svg', function(svg) {
		console.log(svg);
	}, 'text');

	var a = document.getElementById("c_body1");
	a.addEventListener("load", function() {
		var svgDoc = a.contentDocument; // get the inner DOM of alpha.svg
		svgDoc.documentElement.setAttribute("width", 300);
		svgDoc.documentElement.setAttribute("height", 500);
		var svgRoot = svgDoc.documentElement;
		$("#svgintro").html(svgRoot);
	}, false);

	$('.color_changer').change(function() {
		var current_color = $(this);
		var current_color_id = $(this).attr("id").split("_")[0];
		//alert(current_color_id);
		$("." + current_color_id + "_color1").attr("fill", current_color.val());
		var dataString = 'item_name=' + current_color.attr("name") + '&item_value=' + current_color.val();

		// alert(dataString);
		/*
		 * $.ajax({ type: "POST", url:
		 * process_path+"process/c_change_process.php", data: dataString, cache:
		 * false, success: function(data){
		 * $("#player_swf_"+user_id).get(0).updateCharacter(); } });
		 */
		//canvasAndImage();
	});

	$('.character_icons').on("click", "img", function() {
		var item_id = $(this).attr("id");
		var id_arr = item_id.split("_");
		
		if (id_arr[1] == 0) {
			$("#character_" + id_arr[0]).html("");
		} else {
		getCharacterItem(id_arr[1]);
		}
		/*if (id_arr[1] == 0) {
			$("#character_" + id_arr[0]).html("");
		} else {

			var dataArray = {
				mega_secret_code : mega_secret_code,
				action : "get_item",
				type : id_arr[0],
				item_id : id_arr[1]
			}

			$.ajax({
				type : "POST",
				url : process_path + "character_handler.php",
				data : dataArray,
				cache : false,
				success : function(data) {
					console.log(data);
					var response = JSON.parse(data);
					if (response.result == "ok") {
						var item_type = response.item_type;
						
						$("#character_" + item_type).text("");
						$("#character_" + item_type).append("<svg>" + response.svg + "</svg>");
						$("." + item_type + "_color1").attr("fill", $("#" + item_type + "_1").val());
					}
				}
			});
		}*/
		
	});
	
	$("#save_character_button").on("click", function(){
		saveImage();
	});
});

function setCharacterItem(tx, results) {
	
	var len = results.rows.length;
	console.log("character_items table: " + len + " rows found.");
	var last_type = "";
	for (var i=0; i<len; i++){
		var type = results.rows.item(i).type;
		var svg = results.rows.item(i).svg_info;
		var id = results.rows.item(i).id;
		console.log("character_items table: " + len + " rows found." +id + " svg:" + svg);
		$("#character_" + type).text("");
		$("#character_" + type).append("<svg>" + svg + "</svg>");
		$("." + type + "_color1").attr("fill", $("#" + type + "_1").val());
	}

	//canvasAndImage();
	
}
function getCharacterItem(id) {
	if (db && id>0) {
		db.transaction(function(tx) {
			tx.executeSql('SELECT * FROM character_items WHERE id='+id, [], setCharacterItem, queryFail);
		}, queryFail);
	}
}


function setTheIcons(tx, results) {	
	var len = results.rows.length;
	console.log("character_items table: " + len + " rows found.");
	var append_str = "<tr><td><h4>Accs</h4>";
	var last_type = "";
	for (var i=0; i<len; i++){
		var type = results.rows.item(i).type;
		if(type != last_type && append_str != "<tr><td><h4>Accs</h4>"){
			console.log(last_type + " is not "+type);
			append_str += "<img src='"+images_path+"character_icons/remove.png' id='"+last_type+"_0'/></td><td><h4>"+type+"</h4>";
		}
		append_str += "<img src='"+images_path+"character_icons/"+results.rows.item(i).icon+"' id='"+results.rows.item(i).type+"_"+results.rows.item(i).id+"' />"
		last_type = type;
	}
	append_str += "<img src='"+images_path+"character_icons/remove.png' id='"+last_type+"_0'/></td></tr>";
	
	$("#character_icons").append("<table id='ci_table'>"+append_str+"</table>");
}

function getCharacterItems(type) {
	var type_str = type == null || type == undefined ? "" : ' AND type="' + type + '"';
	if (db) {
		db.transaction(function(tx) {
			tx.executeSql('SELECT * FROM character_items ORDER BY type ASC', [], setTheIcons, queryFail);
		}, queryFail);
	}
}
/* bara när den sparas.
function canvasAndImage(){
	canvg("canvas", $("#svgintro").html());		
	var c=document.getElementById("canvas");
	var d=c.toDataURL("image/png");
	$("#user_image").attr("src",d);	
}
*/
function saveImage(){
	canvg("canvas", $("#svgintro").html());		
	var c=document.getElementById("canvas");
	var d=c.toDataURL("image/png");
	
	var data_arr = {
		mega_secret_code : mega_secret_code,
		action:"save_character",
		imageData: d, 
		user_id:"43468"
	};
    // Sending the image data to Server
    $.ajax({
        type: 'POST',
        url : path_to_process + "character_handler.php",
        data: data_arr,
        success: function (data) {
        	$("#canvas").hide();
            //alert(data);
        },
		error: function(jqXHR, exception) {
            if (jqXHR.status === 0) {
                alert('Not connect.\n Verify Network.');
            } else if (jqXHR.status == 404) {
                alert('Requested page not found. [404]');
            } else if (jqXHR.status == 500) {
                alert('Internal Server Error [500].');
            } else if (exception === 'parsererror') {
                alert('Requested JSON parse failed.');
            } else if (exception === 'timeout') {
                alert('Time out error.');
            } else if (exception === 'abort') {
                alert('Ajax request aborted.');
            } else {
                alert('Uncaught Error.\n' + jqXHR.responseText);
            }
            $("#send_thinking").fadeOut();
        }
    });
}