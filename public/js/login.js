$(document).ready(function(){


	$.post("/checkLogin",function(data,status){
		//console.log("logged in");
		//console.log(data.username);
		//console.log(status);
		if (status == "success"){
			$('.form-sign-in').addClass("hidden");
			$('.welcome-message').append(data);
			$('.form-logged-in').removeClass("hidden");
		} else {

		}
	});




	$('.form-sign-in').click(function(){

		var data = 	{username: $('.request-username').val() , password: $('.request-password').val()};
		console.log(data);



		$.ajax({
			url: '/login',
			type: 'POST',
			contentType: "application/json",
			data: JSON.stringify(data),
			success: function(data){
				console.log("worked");
				$('.form-sign-in').addClass("hidden");
				$('.welcome-message').append(data.username);
				$('.form-logged-in').removeClass("hidden");
			}

		});

		//$('.login-form').addClass("hidden");

	})

	$("#logout").click(function(){
		$.post("/logout",function(data,status){
			console.log(status);
			window.location.href = "index.html";
		});
	})







});
