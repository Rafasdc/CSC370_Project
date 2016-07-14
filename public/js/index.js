$(document).ready(function(){

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