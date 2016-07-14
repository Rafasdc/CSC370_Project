$(document).ready(function(){

	$('.create-account').click(function(){


		var info = 	{username: $('#inputUsername').val(), email: $('#inputEmail').val(),password: $('#inputPassword').val()};

		//alert(JSON.stringify(info));



		$.ajax({
			url: '/api/register',
			type: 'POST',
			contentType: "application/json",
			data: JSON.stringify(info),
			success: function(){
				console.log("worked");
			}
		});

	console.log("form submitted");
	//return false;
	});




});
