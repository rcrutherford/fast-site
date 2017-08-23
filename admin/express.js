var express = require('express')
var bodyParser = require("body-parser")
var request = require('request')
var path = require('path')
var app = express()

// var form = require('./routes/form');

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('public'))

//get all
app.get('/', function (req, res) {
	request({ url: "http://localhost:3001/Employees", method: "GET"}, function (error, response, body) {
		console.log("get: all "+body)
		objbody = JSON.parse(body)
		res.render('form',{ title: "List All Employees", results: objbody })
	})
})
// view id
app.get('/:id', function (req, res) {
	var id = req.params.id
	request({ url: "http://localhost:3001/Employees/"+id, method: "GET"}, function (error, response, body) {
		console.log("get: "+id+" "+body)
		res.redirect("http://localhost:3002")
		// objbody = JSON.parse(body)
		// res.render('form',{ title: "List All Employees", results: [objbody] })
	})
})
// delete id
app.get('/del/:id', function (req, res) {
	var id = req.params.id
	console.log('admin delete:'+id)
	request({ url: "http://localhost:3001/Employees/"+id, method: "DELETE"}, function (error, response, body) {
		res.redirect("http://localhost:3002")
	})
})
// update id
app.get('/put/:id', function (req, res) {
	var id = req.params.id
	var fname = req.query.fname
	var lname = req.query.lname
	var objToSend = {"fname": fname, "lname": lname}
	console.log('admin put:'+id+" "+fname+" "+lname)
	request({ url: "http://localhost:3001/Employees/"+id, method: "PUT", json: objToSend }, function (error, response, body) {
		res.redirect("http://localhost:3002")
	})
})
 
//routes
// app.use('/', form); 

module.exports = app

app.listen(3002, function() {
	console.log('%s listening at %s', "Express Admin", "http://localhost:3002");
}) 