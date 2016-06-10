$(document).ready(function(){

	$('.form-register').submit(function(){
		console.log("button clicked");

		var info = {
			username : $('#inputUsername').val(),
			email : $('#inputEmail').val(),
			password : $('#inputPassword').val()
		};

		console.log(info);

		$.ajax({
			type: 'POST',
			url: '/register',
			data: info,
			success: function(){
				console.log("worked");
			},
			error: function(){
				alert('error');
			}
		});
	});




});