$(document).ready(function(){

	$.get("/getPosts", function(data,status){
		//console.log(data);
		//console.log(data[0].title);
		for (var i = 0; i < data.length ; i++){
			$(".top-posts-list").append("<a href='#'class='list-group-item' id='top-post'><span class='badge'>"+data[i].rating+"</span>"+data[i].title+"</a>");
		}
	}).fail(function(){
		console.log('error getting posts');
	});

	$.get("/getSubsaiddits", function(data,status){
		//console.log(data);
		//console.log(data[0].title);
		for (var i = 0; i < data.length ; i++){
			$(".subsaiddits-list").append("<button class='list-group-item' id='subsaiddits'>"+data[i].title+"</button>");
		}
	}).fail(function(){
		console.log('error getting posts');
	});



	$('body').on('click','#subsaiddits', function(data){
		//alert(this.innerHTML);

		$.get("/api/"+this.innerHTML, function(data,status){
			console.log(data.redirect);
			window.location.href = data.redirect;
			//window.location = window.load(data);
		})
	});

	$('body').on('click','#top-post', function(data){
		alert(this.innerHTML);
	});


	

});