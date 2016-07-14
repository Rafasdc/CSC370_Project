$(document).ready(function(){

	/*
	$.post("/api/checkLogin",function(data,status){
		console.log("logged in");
	});
	*/


	$('.form-sign-in').click(function(){

		var data = 	{username: $('.request-username').val() , password: $('.request-password').val()};
		console.log(data);



		$.ajax({
			url: '/api/login',
			type: 'POST',
			contentType: "application/json",
			data: JSON.stringify(data),
			success: function(data){
				console.log("worked");
				$('.form-group').addClass("hidden");
				$('.form-logout').removeClass("hidden");
				$('.login-logout-form').append("Welcome "+data.username + "!        ");	
			}

		});

		//$('.login-form').addClass("hidden");

	})

	$(".form-logout").click(function(){
		$.post("/api/logout",function(data,status){
			console.log(status);
		});
	})




});	