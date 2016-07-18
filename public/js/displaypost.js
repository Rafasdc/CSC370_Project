$(document).ready(function(){


	var subsaiddit_name = window.location.pathname.split('/')[2];
	var post_name = window.location.pathname.split('/')[3];

	function toTitleCase(str){
    	return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	}

	post_title = post_name.split('_').join(' ')


	$(".subsaiddit-title").append(subsaiddit_name + "    ");
	$(".post-title").append(toTitleCase(post_title));

	$.get("/getPost/"+subsaiddit_name+"/"+post_name, function(data,status){
		//console.log(data);
		//console.log(data[0].title);
		$(".post-text").append(data.text);
		$(".post-rating").append(data.rating);
	}).fail(function(){
		console.log('error getting posts');
	});

	$('#post-upvote').click(function(){
		var data = 	{rating: 1};
		$.ajax({
			url: '/vote/' + subsaiddit_name + "/" + post_name,
			type: 'POST',
			contentType: "application/json",
			data: JSON.stringify(data),
			success: function(result){
				$.get("/getRating/"+subsaiddit_name+"/"+post_name, function(data, status) {
					$(".post-rating").html(data.rating);
				})
			}
		});
	});

	$('#post-downvote').click(function(){
		var data = 	{rating: -1};
		$.ajax({
			url: '/vote/' + subsaiddit_name + "/" + post_name,
			type: 'POST',
			contentType: "application/json",
			data: JSON.stringify(data),
			success: function(result){
				$.get("/getRating/"+subsaiddit_name+"/"+post_name, function(data, status) {
					$(".post-rating").html(data.rating);
				})
			}
		});
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
		var route = "/s/"+this.innerHTML;
		window.location = window.location.origin + route;

	});

	$('body').on('click','.top-post', function(data){
		//alert(this.innerHTML);
		//alert(this.id);
		window.location = window.location.origin + "/s" + this.id;
	});

	$('body').on('click','#myPage', function(data){
		//alert(this.innerHTML);
		window.location = window.location.origin + "/mypage.html";
	});


	$('body').on('click','.subscribe-button', function(data){
		$.post("/subscribe/"+subsaiddit_name, function(data,status){
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
