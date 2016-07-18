$(document).ready(function(){


	var subsaiddit_name = window.location.pathname.split('/')[2];

	$(".subsaiddit-title").append(subsaiddit_name + "    ");
	$(".subsaiddit-title").append("<button type='button' class='btn btn-primary unsubscribe-button hidden'>Unsubscribe</button>");
	$(".subsaiddit-title").append("<button type='button' class='btn btn-primary subscribe-button hidden'>Subscribe</button>");

	$.get("/getSubscribed/"+subsaiddit_name, function(data,status){
		if(data.subscribed == true) {
			$(".unsubscribe-button").removeClass('hidden');
		} else {
			$(".subscribe-button").removeClass('hidden');
		}
	}).fail(function(){
		console.log('error getting subscription status');
	});

	$.get("/getPostsList/"+subsaiddit_name, function(data,status){
		//console.log(data);
		//console.log(data[0].title);
		for (var i = 0; i < data.length ; i++){
			if (data[i].rating != null){
				$(".top-posts-list").append("<a href='#'class='list-group-item top-post' id='"+data[i].url+"'><span class='badge'>"+data[i].rating+"</span>"+data[i].title+"</a>");
			} else {
				$(".top-posts-list").append("<a href='#'class='list-group-item top-post' id='"+data[i].url+"'><span class='badge'>0</span>"+data[i].title+"</a>");
			}
		}
	}).fail(function(){
		console.log('error getting posts');
	});

	$.get("/getSubsaiddits", function(data,status){
		//console.log(data);
		//console.log(data[0].title);
		for (var i = 0; i < data.length ; i++){
			if(data[i].title != subsaiddit_name) {
				$(".subsaiddits-list").append("<button class='list-group-item' id='subsaiddits'>"+data[i].title+"</button>");
			}
		}
	}).fail(function(){
		console.log('error getting posts');
	});


	$('body').on('click','#subsaiddits', function(data){
		//alert(this.innerHTML);
		var route = "/s/"+this.innerHTML;
		window.location = route;

	});

	$('body').on('click','.top-post', function(data){
		//alert(this.innerHTML);
		//alert(this.id);
		window.location = "/s" + this.id;
	});

	$('body').on('click','#myPage', function(data){
		//alert(this.innerHTML);
		window.location = "../../mypage.html";
	});


	$('body').on('click','.subscribe-button', function(data){
		$.post("/subscribe/"+subsaiddit_name, function(data,status){
			$(".subscribe-button").addClass('hidden');
			$(".unsubscribe-button").removeClass('hidden');
		})

	});
	$('body').on('click','.unsubscribe-button', function(data){
		$.post("/unsubscribe/"+subsaiddit_name, function(data,status){
			$(".unsubscribe-button").addClass('hidden');
			$(".subscribe-button").removeClass('hidden');
		})

	});

	$('body').on('click','.add-post', function(data){
		//alert(this.innerHTML);
		window.location = "../../mypage.html";
	});





});
