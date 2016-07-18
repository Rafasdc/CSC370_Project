$(document).ready(function(){


	var subsaiddit_name = window.location.pathname.split('/')[3];
	var post_name = window.location.pathname.split('/')[4];

	function toTitleCase(str){
    	return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	}

	post_title = post_name.replace("_", " ");


	$(".subsaiddit-title").append(subsaiddit_name + "    ");
	$(".post-title").append(toTitleCase(post_title));

	$.get("/api/getPost/"+subsaiddit_name+"/"+post_name, function(data,status){
		//console.log(data);
		//console.log(data[0].title);
		$(".post-text").append(data[0].text);
		//$(".")
		if (data[0].rating != null){
			$(".post-rating").append(data[0].rating);
		}else {
			$(".post-rating").append(0);
		}
	}).fail(function(){
		console.log('error getting posts');
	});

/*
	$.get("/getSubsaiddits", function(data,status){
		//console.log(data);
		//console.log(data[0].title);
		for (var i = 0; i < data.length ; i++){
			$(".subsaiddits-list").append("<button class='list-group-item' id='subsaiddits'>"+data[i].title+"</button>");
		}
	}).fail(function(){
		console.log('error getting posts');
	});
*/


	$('body').on('click','#subsaiddits', function(data){
		//alert(this.innerHTML);
		var route = "/api/s/"+this.innerHTML;
		window.location = route;
		
	});

	$('body').on('click','.top-post', function(data){
		//alert(this.innerHTML);
		//alert(this.id);
		window.location = "/api/s" + this.id;
	});

	$('body').on('click','#myPage', function(data){
		//alert(this.innerHTML);
		window.location = "../../mypage.html";
	});


	$('body').on('click','.subscribe-button', function(data){
		$.post("/api/subscribe/"+subsaiddit_name, function(data,status){
			if (data == "Already Subscribed"){
				alert("Already Subscribed to this Subsaiddit");
			}
		})

	});

	$('body').on('click','.add-post', function(data){
		//alert(this.innerHTML);
		window.location = "../../mypage.html";
	});



	

});