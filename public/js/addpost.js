$(document).ready(function(){

	var subsaiddit_name = window.location.pathname.split('/')[2];

	$('.create-post').click(function(){

		var url = "/"+subsaiddit_name+"/"+$("#postTitle").val().split(' ').join('_');
		var info = {subsaiddit: subsaiddit_name, text: $("#postText").val() , title: $("#postTitle").val(), url: url}
		console.log(info);

		$.ajax({
			url: '/insertPost',
			type: 'POST',
			contentType: "application/json",
			data: JSON.stringify(info),
			success: function(){
				console.log("worked");
				window.location = "/s/"+subsaiddit_name;
			},
			error: function() {
				console.log("error in function");
				//$('#post-creating-failed').removeClass('hidden');
			}
			
		});

		//return false;
	});

});
