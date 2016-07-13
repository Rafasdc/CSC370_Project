$(document).ready(function(){

	$('.form-sign-in').click(function(){
		$.post("/testPost",function(e,data,status){
			e.preventDefault();
			console.log("stasus is " + status);
			console.log(data);
			//document.location.href = data.redirect;
			return false;
		});

		$('.login-form').addClass("hidden");

	})


	$.get("/gettop", function(data,status){
		console.log(data);
		console.log(data[0].title);
		for (var i = 0; i < data.length ; i++){
			$(".top-posts-list").append("<a href='#'class='list-group-item'><span class='badge'>"+data[i].rating+"</span>"+data[i].title+"</a>");
		}
	}).fail(function(){
		console.log('error getting posts');
	});

	$.get("/getSubsaiddits", function(data,status){
		console.log(data);
		console.log(data[0].title);
		for (var i = 0; i < data.length ; i++){
			$(".subsaiddits-list").append("<a href='#'class='list-group-item'>"+data[i].title+"</a>");
		}
	}).fail(function(){
		console.log('error getting posts');
	});


	

});