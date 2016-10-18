// server.js, load the things we need
var express = require('express');
var app = express();
var mysql = require('mysql');

var connection = mysql.createConnection({
host : 'localhost',
user : 'root',
password : 'HADIBAKALIM',
database: "datas"
});

// set the view engine to ejs
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
		// use res.render to load up an ejs view file
    		res.render('pages/index');
	});

var query = connection.query('SELECT * FROM sensor1;', function (error, rows, fields) 
{    	
	// sensor1 page
	app.get('/sensor1', function(req, res) {

		// use res.render to load up an ejs view file
    		res.render('pages/sensor1', {
        		tagTemp: tagTemp,
			tagRes: tagRes,
			tagAdc: tagAdc,
			tagMux: tagMux,
			tagId: tagId
    		});
	});

	var tagTemp =[]; 
	for(var i=0;i<rows.length;i++){
     		tagTemp.push(rows[i].temp);
        }
 
	var tagRes=[];
	//var tagRes = rows[0].res;   	   
	for(var i=0;i<rows.length;i++){
     		tagRes.push(rows[i].res);
        }

	var tagAdc=[]; 	   
	for(var i=0;i<rows.length;i++){
     		tagAdc.push(rows[i].adc);
        }

	var tagMux=[]; 
	for(var i=0;i<rows.length;i++){
     		tagMux.push(rows[i].mux);
        }
  	
        var tagId=[];	   
	for(var i=0;i<rows.length;i++){
     		tagId.push(rows[i].id);
        }
});



var query = connection.query('SELECT * FROM sensor2;', function (error, rows, fields) 
{    	
	// sensor2 page
	app.get('/sensor2', function(req, res) {

		// use res.render to load up an ejs view file
    		res.render('pages/sensor2', {
        		tagTemp: tagTemp,
			tagRes: tagRes,
			tagAdc: tagAdc,
			tagMux: tagMux,
			tagId: tagId
    		});
	});

	var tagTemp =[]; 
	for(var i=0;i<rows.length;i++){
     		tagTemp.push(rows[i].temp);
        }
 
	var tagRes=[];
	//var tagRes = rows[0].res;   	   
	for(var i=0;i<rows.length;i++){
     		tagRes.push(rows[i].res);
        }

	var tagAdc=[]; 	   
	for(var i=0;i<rows.length;i++){
     		tagAdc.push(rows[i].adc);
        }

	var tagMux=[]; 
	for(var i=0;i<rows.length;i++){
     		tagMux.push(rows[i].mux);
        }
  	
        var tagId=[];	   
	for(var i=0;i<rows.length;i++){
     		tagId.push(rows[i].id);
        }
});


var query = connection.query('SELECT * FROM sensor3;', function (error, rows, fields) 
{    	
	// sensor3 page
	app.get('/sensor3', function(req, res) {

		// use res.render to load up an ejs view file
    		res.render('pages/sensor3', {
        		tagTemp: tagTemp,
			tagRes: tagRes,
			tagAdc: tagAdc,
			tagMux: tagMux,
			tagId: tagId
    		});
	});

	var tagTemp =[]; 
	for(var i=0;i<rows.length;i++){
     		tagTemp.push(rows[i].temp);
        }
 
	var tagRes=[];
	//var tagRes = rows[0].res;   	   
	for(var i=0;i<rows.length;i++){
     		tagRes.push(rows[i].res);
        }

	var tagAdc=[]; 	   
	for(var i=0;i<rows.length;i++){
     		tagAdc.push(rows[i].adc);
        }

	var tagMux=[]; 
	for(var i=0;i<rows.length;i++){
     		tagMux.push(rows[i].mux);
        }
  	
        var tagId=[];	   
	for(var i=0;i<rows.length;i++){
     		tagId.push(rows[i].id);
        }
});

app.listen(8080);
console.log('8080 is the port');
