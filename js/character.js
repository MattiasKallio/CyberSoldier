/**
 * Character stuff
 */
var process_path = "http://localhost/facebook_cs/app/";
var images_path = "http://localhost/facebook_cs/images/";
var process_path = "http://cybersoldier.com/app/";
var images_path = "http://cybersoldier.com/images/";
var mega_secret_code = "0ed75fcaffd55c3326efccf12f3ae737";
var db;
var cuser_items = {};

$(document).ready(function() {

    db = window.openDatabase("cybersoldier", "1.0", "CyberSoldier DB", 1000000);

    $.getScript("js/jquery.colorPicker.js", function() {
	$('#body_1').colorPicker();
	$('#top_1').colorPicker();
	$('#eyes_1').colorPicker();
	$('#mouth_1').colorPicker();
	$('#shirt_1').colorPicker();
	$('#accessories_1').colorPicker();
	$('#pants_1').colorPicker();
	$('#shoes_1').colorPicker();
	$('#laces_1').colorPicker();
    });

    $('#body_1').val("#" + window.localStorage.getItem("c_color"));
    $('#top_1').val("#" + window.localStorage.getItem("c_top_color"));
    $('#eyes_1').val("#" + window.localStorage.getItem("c_eyes_color"));
    $('#mouth_1').val("#" + window.localStorage.getItem("c_mouth_color"));
    $('#shirt_1').val("#" + window.localStorage.getItem("c_body_color"));
    $('#accessories_1').val("#" + window.localStorage.getItem("c_accessories_color"));
    $('#pants_1').val("#" + window.localStorage.getItem("c_pants_color"));
    $('#shoes_1').val("#" + window.localStorage.getItem("c_shoes_color"));
    $('#laces_1').val("#" + window.localStorage.getItem("c_shoes_color2"));

    cuser_items["c_top"] = window.localStorage.getItem("c_top");
    cuser_items["c_mouth"] = window.localStorage.getItem("c_mouth");
    cuser_items["c_eyes"] = window.localStorage.getItem("c_eyes");
    cuser_items["c_body"] = window.localStorage.getItem("c_body");
    cuser_items["c_accessories"] = window.localStorage.getItem("c_accessories");
    cuser_items["c_pants"] = window.localStorage.getItem("c_pants");
    cuser_items["c_shoes"] = window.localStorage.getItem("c_shoes");

    /*
     * $.get('/vectorimage.svg', function(svg) { console.log(svg); }, 'text');
     */

    var a = document.getElementById("c_body1");
    a.addEventListener("load", function() {
	var svgDoc = a.contentDocument; // get the inner DOM of alpha.svg
	svgDoc.documentElement.setAttribute("width", 300);
	svgDoc.documentElement.setAttribute("height", 500);
	var svgRoot = svgDoc.documentElement;
	$("#svgintro").html(svgRoot);
	for ( var i in cuser_items) {
	    getCharacterItem(cuser_items[i]);
	}
	$(".body_color1").attr("fill", "#" + window.localStorage.getItem("c_color"));
    }, false);

    $(".soldier_table").on("change", '.color_changer', function() {
	var current_color = $(this);
	var current_color_id = $(this).attr("id").split("_")[0];
	$("." + current_color_id + "_color1").attr("fill", current_color.val());
    });

    $('.soldier_table').on("click", "img", function() {
	var item_id = $(this).attr("id");
	var id_arr = item_id.split("_");
	var kname = id_arr[1];
	// var kname = id_arr[0] == "laces" ? "shoes_2" : id_arr[0];
	getCharacterItems(kname);
    });

    $('.character_icons').on("click", "img", function() {
	var item_id = $(this).attr("id");
	var id_arr = item_id.split("_");
	var kname = id_arr[0] == "shirt" ? "body" : id_arr[0];
	// var kname = id_arr[0] == "laces" ? "shoes_2" : id_arr[0];
	cuser_items["c_" + kname] = id_arr[1];

	if (id_arr[1] == 0) {
	    $("#character_" + id_arr[0]).text("");
	}
	else {
	    getCharacterItem(id_arr[1]);
	}
    });

    $("#save_character_button").on("click", function() {
	saveImage();
    });
});

function setCharacterItem(tx, results) {
    var len = results.rows.length;
    // console.log("character_items table: " + len + " rows found.");
    var last_type = "";
    for (var i = 0; i < len; i++) {
	var type = results.rows.item(i).type;
	console.log("typen: " + type);
	switch (type) {
	    case "body":
		type = "shirt";
		break;
	    case "color":
		var type = "body";
		break;
	    default:
		type = type;
		break;
	}

	var svg = results.rows.item(i).svg_info;
	var id = results.rows.item(i).id;
	// console.log("character_items table: " + len + " rows found." +id + "
	// type:" + type);
	$("#character_" + type).text("");
	$("#character_" + type).append("<svg>" + svg + "</svg>");
	$("." + type + "_color1").attr("fill", $("#" + type + "_1").val());
	switch (type) {
	    case "shoes":
		$(".laces_color1").attr("fill", "#" + window.localStorage.getItem("c_shoes_color2"));
		break;
	}
    }

    // canvasAndImage();

}
function getCharacterItem(id) {
    if (db && id > 0) {
	db.transaction(function(tx) {
	    tx.executeSql('SELECT * FROM character_items WHERE id=' + id, [], setCharacterItem, queryFail);
	}, queryFail);
    }
}

function setTheIcons(tx, results) {
    var len = results.rows.length;
    // console.log("character_items table: " + len + " rows found.");
    var append_str = "";
    var last_type = "";
    for (var i = 0; i < len; i++) {
	var type = results.rows.item(i).type;
	append_str += "<img src='" + images_path + "character_icons/" + results.rows.item(i).icon + "' id='" + results.rows.item(i).type + "_"
	        + results.rows.item(i).id + "' />"
	last_type = type;
    }
    if (len) {
	append_str += "<img src='" + images_path + "character_icons/remove.png' id='" + last_type + "_0'/>";
    }
    else {
	append_str += "";
    }

    $("#character_icons").html("<div id='ci_table'>" + append_str + "</div>");
}

function getCharacterItems(type) {

    var type_str = type == null || type == undefined ? "" : ' AND type="' + type + '"';
    if (db) {
	db.transaction(function(tx) {
	    tx.executeSql('SELECT * FROM character_items WHERE id>0 ' + type_str + ' ORDER BY type ASC', [], setTheIcons, queryFail);
	}, queryFail);
    }
}

function saveImage() {
    canvg("canvas", $("#svgintro").html());
    var c = document.getElementById("canvas");
    var d = c.toDataURL("image/png");

    var data_arr = {
	mega_secret_code : mega_secret_code,
	action : "save_character",
	imageData : d,
	user_id : window.localStorage.getItem("user_id")
    };

    var color_list = $(".color_changer");

    $(color_list).each(function() {
	var cli = $(this);
	var name = cli.attr("id").split("_")[0];
	switch (name) {
	    case "body":
		var name_db = "c_color";
		break;
	    case "laces":
		var name_db = "c_shoes_color2";
		break;
	    case "shirt":
		var name_db = "c_body_color";
		break;
	    default:
		var name_db = "c_" + name + "_color";
		break;
	}
	data_arr[name_db] = cli.val().replace('#', '0x');
	window.localStorage.setItem(name_db, cli.val().replace('#', ''));
	console.log(name_db + " " + cli.val().replace('#', '0x'));
    });

    // var color_list = $(".color_changer");

    for ( var i in cuser_items) {
	window.localStorage.setItem(i, cuser_items[i]);
	data_arr[i] = cuser_items[i];
	console.log(i + " " + cuser_items[i]);
    }

    // Sending the image data to Server
    $.ajax({
	type : 'POST',
	url : path_to_process + "character_handler.php",
	data : data_arr,
	success : function(data) {
	    $("#canvas").hide();
	    console.log(data);
	},
	error : function(jqXHR, exception) {
	    if (jqXHR.status === 0) {
		alert('Not connect.\n Verify Network.');
	    }
	    else if (jqXHR.status == 404) {
		alert('Requested page not found. [404]');
	    }
	    else if (jqXHR.status == 500) {
		alert('Internal Server Error [500].');
	    }
	    else if (exception === 'parsererror') {
		alert('Requested JSON parse failed.');
	    }
	    else if (exception === 'timeout') {
		alert('Time out error.');
	    }
	    else if (exception === 'abort') {
		alert('Ajax request aborted.');
	    }
	    else {
		alert('Uncaught Error.\n' + jqXHR.responseText);
	    }

	    $("#send_thinking").fadeOut();
	}
    });
}