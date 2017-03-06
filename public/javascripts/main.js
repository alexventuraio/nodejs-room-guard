// Document already loaded
$(function () {
	// Get the HTML elements
	var video = document.getElementById('myvideo');
	var canvas = document.getElementById('mycanvas');
	// Get the miliseconds to take a snapshot each
	var timeOutParameter = document.getElementById('myTimeOutParameter').value;
	// Get the 'canvas' context
	var ctx = canvas.getContext('2d');
	// 'ul' Console element
	var myConsole = $("#console");

	// Set the canvas width/height to the size of the video
	canvas.width = 450;
	canvas.height = 320;
	// Set the canvas width/height to the size of the video
	ctx.width = canvas.width;
	ctx.height = canvas.height;

	// Each browsers provide their own vendor-specific versions for 'getUserMedia'. To standardize across these differences, let's set up some aliases, this will allow us to refer to navigator.getUserMedia in a unified way across the major browsers (Chrome, Firefox, IE)
	navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia);

	// Then verify if there's a valid object
	if (navigator.getUserMedia) {
		navigator.getUserMedia({ video: true },
			function (stream) {
				// Do stuff with the video stream here...
				video.src = window.URL.createObjectURL(stream);

				myConsole.append('<li>Loading video...</li>');
			},
			function (err) {
				// errors...
				myConsole.append('<li>Error al cargar la cámara: ' + err + '</li>');
			}
		);

		// Take a snapshot from the cam each 500 milliseconds
		setInterval(function () {
			// Draw the video frame to the canvas
			ctx.drawImage(video, 0, 0, ctx.width, ctx.height);

			// Extract the image data from the canvas in base64 encoded PNG format
			// var imageData = canvas.toDataURL("image/jpeg");
			var imageData = canvas.toDataURL("image/jpeg", 0.9);

			// Remove extraneous data from start of string
			// imageData = imageData.replace("data:image/png;base64,", "");
			imageData = imageData.replace("data:image/jpeg;base64,", "");
			myConsole.append('<li>' + imageData + '</li>');
			// JSON-encode it
			var postData = {image_data: imageData};
			// POST it to the server
			$.ajax({
				url: '/upload',
				type: 'POST',
				dataType: 'json',
				data: postData,
			}).done(function(resp) {
				console.log("success", resp);
			}).fail(function(err) {
				console.log("error", err);
			}).always(function(jqXHR, textStatus) {
				console.log("complete", jqXHR, textStatus);
			});
		}, timeOutParameter);
	} else {
		alert('User Media is not supported in your browser');
	}
});
