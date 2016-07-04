$(document).ready(function(){

	$('.form-register').submit(function(){
		console.log("form submitted");

		var info = 	{username: $('#inputUsername').val(), email: $('#inputEmail').val(),password: $('#inputPassword').val()};

		alert(JSON.stringify(info));

		$.ajax({
			url: '/register',
			type: 'POST',
			contentType: "application/json",
			data: JSON.stringify(info),
			success: function(){
				alert(info);
				console.log("worked");
			}
		});
	});




});