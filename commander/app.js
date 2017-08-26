#!/usr/bin/env node

/**
 * Module dependencies.
 */

var program = require('commander');
var request = require('request');
var bodyParser = require("body-parser");
var prompt = require('prompt');

function list(val) {
    return val.split(',');
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

program
    .version('0.1.0')
    .option('-g, --get [n]', 'get employee(s) id or all')
    .option('-p, --put [fname lname]', 'update employeee id "fname lname"')
    .option('-P, --post [id fname lname]', 'add employeee "fname lname"')
    .option('-d, --delete <n>', 'delete employee')
    // .option('-i, --id <n>', 'id of emplyoee ', parseInt)
    .parse(process.argv);



if (program.delete && isNumeric(program.delete)) {
    request({ url: `http://localhost:3001/Employees/${program.delete}`, method: "DELETE" }, function(error, response, body) {
        console.log("delete: " + JSON.stringify(body));
    })
}

if (program.put && isNumeric(program.put)) {
    var id = parseInt(program.put)
    var vfname=""
    var vlname=""
    request({ url: `http://localhost:3001/Employees/${id}`, method: "GET" }, function(error, response, body) {
    	if (body=='"not found"') {
    		console.log("not found")
    		return 
    	}
    	else {
    		body=JSON.parse(body)
    		vfname=body.fname
        	vlname=body.lname
        	console.log(vfname)
    		prompt.start();
		    var schema = {
		    	properties: {
		      		fname: {
		      			description: `fname=${vfname}`,
		      			required: true
		      		},
		      		lname: {
		      			description: `lname=${vlname}`,
		      			required: true
		      		}
		      	}
		    }
		    prompt.get(schema, function(err, result) {
		        //var arrNames =program.put.split(" ");
		        // var objToSend = {"fname":arrNames[0],"lname":arrNames[1]}
		        var objToSend = { "fname": result.fname, "lname": result.lname }
		        request({ url: `http://localhost:3001/Employees/${id}`, method: "PUT", json: objToSend }, function(error, response, body) {
		            console.log("put: " + program.put + " " + JSON.stringify(objToSend))
		        });
		    });
    	}
        
    })
    console.log(vfname+" "+vlname)
    
}

if (program.post) {
	var objToSend={}
	if ((typeof program.post) =="string") {
    	var arrNames =program.post.split(" ");
	    if (arrNames.length==2) {
	    	objToSend = {"fname":arrNames[0],"lname":arrNames[1]}
	    	request({ url: `http://localhost:3001/Employees`, method: "POST", json: objToSend }, function(error, response, body) {
		        console.log("post:" + JSON.stringify(objToSend));
		        console.log(body);
		    });
	    }
	}
	else {	
    	prompt.start();
    	prompt.get(['fname', 'lname'], function(err, result) {
        	objToSend = { "fname": result.fname, "lname": result.lname }
        	request({ url: `http://localhost:3001/Employees`, method: "POST", json: objToSend }, function(error, response, body) {
		        console.log("post:" + JSON.stringify(objToSend));
		        console.log(body);
    		});
         })
	}
}
    
if (program.get && !isNumeric(program.get)) {
    request({ url: "http://localhost:3001/Employees", method: "GET" }, function(error, response, body) {
        console.log("get all: ");
        console.log(body);
    })
}

if (program.get && isNumeric(program.get)) {
    var id = parseInt(program.get)
    request({ url: `http://localhost:3001/Employees/${id}`, method: "GET" }, function(error, response, body) {
        console.log("get by id: ")
        console.log(body);
    })
}