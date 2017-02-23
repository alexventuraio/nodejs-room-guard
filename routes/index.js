var express = require("express");
var router = express.Router();
var fs = require("fs");
//include http, fs and url module
var path = require("path"),
	url = require("url");

/* GET home page. */
router.get("/", function(req, res, next) {
	res.render("index", { title: "Room-Guard" });
});

/* GET home page. */
router.get("/history", function(req, res, next) {
	// Get the list of jpeg files in the image dir
	var imageDir = path.join(__dirname, "../uploads"),
		fileType = ".jpeg",
		files = [];

	console.log(imageDir);

	fs.readdir(imageDir, function (err, list) {
		if (list === undefined || list === null) {
			console.log("Eroooooores");
			callback(null, []);
		} else {
			console.log("Biiiiiien");
			for (var k = list.length - 1; k >= 0; k--) {
				if (path.extname(list[k]) === fileType) {
					//store the file name into the array files
					files.push(list[k]);
				}
			}

			res.render("history", { title: "Historial", images: files });
		}
	});
});

router.get("/history/:photo_name", function (req, res, next) {
	var imageDir = path.join(__dirname, "../uploads/");
	var photoName = req.params.photo_name;

	console.log(imageDir);

	console.log("----------", photoName);
	console.log("----------", imageDir);

	// Read the image using fs and send the image content back in the response
	fs.readFile(imageDir + photoName, function (err, content) {
		if (err) {
			console.log(err);

			res.writeHead(400, {"Content-type":"text/html"})
			res.end("No such image");
		} else {
			//specify the content type in the response will be an image
			res.writeHead(200, {"Content-type":"image/jpg"});
			res.end(content);
		}
	});
});

/* POST to handle upload image*/
router.post("/upload", function(req, res, next) {
	console.log(req.body.image_data.length);

	//console.log("FormData "+ req.body.base64);
	// var base64ImageData = req.body.base64.replace(/^data:image\/png;base64,/, "");
	var base64ImageData = req.body.image_data;
	// 20150812113509
	var fileName = (new Date(Date.now()-(new Date()).getTimezoneOffset() * 60000)).toISOString().slice(0, 19).replace(/[^0-9]/g, "");

	fs.writeFile("uploads/" + fileName + ".jpeg", base64ImageData, "base64", function (err) {
		if (err) {
			console.log(err);
		} else {
			res.send(JSON.stringify({"status": 1, "msg": "Image Uploaded"}));
		}
	});
});

module.exports = router;
