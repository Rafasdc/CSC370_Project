$(document).ready(function(){

	$('.create-account').click(function(){

		var info = 	{username: $('#inputUsername').val(), email: $('#inputEmail').val(),password: $('#inputPassword').val()};
		$('#register-status-failed').addClass('hidden');

		$.ajax({
			url: '/register',
			type: 'POST',
			contentType: "application/json",
			data: JSON.stringify(info),
			success: function(){
				console.log("worked");
				window.location.href = window.location.origin + "/index.html";
			},
			error: function() {
				$('#register-status-failed').removeClass('hidden');
			}
		});

		console.log("form submitted");
		//return false;
	});

});
