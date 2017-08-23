var express = require('express')
var bodyParser = require("body-parser")
var request = require('request')
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'))

app.post('/', function (req, res) {
	objJSON = req.body
	request({ url: "http://localhost:3001/Employees", method: "POST", json: objJSON }, function (error, response, body) {
		console.log(req.body)
		res.redirect("http://localhost:3000");
	})
})

module.exports = app;

app.listen(3000, function() {
	console.log('%s listening at %s', "Express Static", "http://localhost:3000");
}) ;