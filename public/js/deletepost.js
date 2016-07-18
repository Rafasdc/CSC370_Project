$(document).ready(function() {

	$.get("/getUsersPosts", function(data,status){
		//console.log(data);
		//console.log(data[0].title);
		for (var i = 0; i < data.length ; i++){
			$(".top-posts-list").append("<a href='#'class='list-group-item top-post' id='"+data[i].url+"'><span class='badge'>"+data[i].rating+"</span>"+data[i].title+"</a><button id='"+data[i].url+"' type='button' class='btn btn-danger delete-button'>Delete</button>");
		}
	}).fail(function(){
		console.log('error getting posts');
	});


	$('body').on('click','.top-post', function(data){
		//alert(this.innerHTML);
		window.location =  window.location.origin + "/s" + this.id;
	});

	$('body').on('click','#myPage', function(data){
		//alert(this.innerHTML);
		window.location = window.location.origin + "/mypage.html";
	});

	$('body').on('click','.delete-button', function(data){
		var info = {url : this.id}
		//alert(this.id);
		$.ajax({
			url: '/deletePost',
			type: 'POST',
			contentType: "application/json",
			data: JSON.stringify(info),
			success: function(){
				console.log("worked");
				window.location.href = window.location.pathname;
			},
			error: function() {
				//$('#post-creation-status-failed').removeClass('hidden');
			}
		});
	});





});
