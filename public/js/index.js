var posts;
$(document).ready(function(){

	

	$.get("/gettop", function(data,status){
		console.log(data);
		console.log(data[0].title);
		for (var i = 0; i < data.length ; i++){
			$(".list-group").append("<a href='#'class='list-group-item'><span class='badge'>14</span>"+data[i].title+"</a>");
		}
	}).fail(function(){
		console.log('error getting posts');
	});


	

});