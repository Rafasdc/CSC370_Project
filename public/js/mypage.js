$(document).ready(function(){


	$.ajax({
		  type: "POST",
		  url: "/checkLogin",
		  success: function(status,data){
		  },
		  error: function(status,data) {
		  	console.log(data);
		    window.location.href = ("/notAuthorized");
		  }
	});


	var data = {username: $(".user-name").innerHTML};
	console.log(data);

	$.ajax({
			url: '/getSubscribed',
			type: 'POST',
			contentType: "application/json",
			data: JSON.stringify(data),
			success: function(data){
				for (var i = 0; i < data.length ; i++){
					$(".subsaiddits-list").append("<button class='list-group-item' id='subsaiddits'>"+data[i].subsaiddit+"</button>");
					$.get("/getPostsList/"+data[i].subsaiddit, function(data,status){
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

				}
			}

	});

	$.get("/getFriends", function(data,status){
		console.log(data);
		for(var i = 0; i < data.length; i++) {
			$(".friends-list").append("<li>" + data[i] + "</li>")
		}
	}).fail(function(){
		console.log('error getting friends');
	});


	$('body').on('click','#subsaiddits', function(data){
		//alert(this.innerHTML);
		var route = "/s/"+this.innerHTML;
		window.location = route;

	});

	$('body').on('click','.top-post', function(data){
		//alert(this.innerHTML);
		window.location = "/s/" + this.id;
	});




});
