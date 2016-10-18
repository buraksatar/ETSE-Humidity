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



connection.query('SELECT * FROM sensor1;', function (error1, rows1, fields1) 
{    	
	// sensor1 page
	app.get('/sensor1', function(req, res1) {

		// use res.render to load up an ejs view file
    		res1.render('pages/sensor1', {
        		tagTemp1: tagTemp1,
			tagRes1: tagRes1,
			tagAdc1: tagAdc1,
			tagMux1: tagMux1,
			tagId1: tagId1
    		});
	});

	var tagTemp1 =[]; 
	for(var i=0;i<rows1.length;i++){
     		tagTemp1.push(rows1[i].temp);
        }
 
	var tagRes1=[];
	//var tagRes = rows[0].res;   	   
	for(var i=0;i<rows1.length;i++){
     		tagRes1.push(rows1[i].res);
        }

	var tagAdc1=[]; 	   
	for(var i=0;i<rows1.length;i++){
     		tagAdc1.push(rows1[i].adc);
        }

	var tagMux1=[]; 
	for(var i=0;i<rows1.length;i++){
     		tagMux1.push(rows1[i].mux);
        }
  	
        var tagId1=[];	   
	for(var i=0;i<rows1.length;i++){
     		tagId1.push(rows1[i].id);
        }
});



connection.query('SELECT * FROM sensor2;', function (error2, rows2, fields2) 
{    	
	// sensor2 page
	app.get('/sensor2', function(req, res2) {

		// use res.render to load up an ejs view file
    		res2.render('pages/sensor2', {
        		tagTemp2: tagTemp2,
			tagRes2: tagRes2,
			tagAdc2: tagAdc2,
			tagMux2: tagMux2,
			tagId2: tagId2
    		});
	});

	var tagTemp2 =[]; 
	for(var i=0;i<rows2.length;i++){
     		tagTemp2.push(rows2[i].temp);
        }
 
	var tagRes2=[];
	//var tagRes = rows2[0].res;   	   
	for(var i=0;i<rows2.length;i++){
     		tagRes2.push(rows2[i].res);
        }

	var tagAdc2=[]; 	   
	for(var i=0;i<rows2.length;i++){
     		tagAdc2.push(rows2[i].adc);
        }

	var tagMux2=[]; 
	for(var i=0;i<rows2.length;i++){
     		tagMux2.push(rows2[i].mux);
        }
  	
        var tagId2=[];	   
	for(var i=0;i<rows2.length;i++){
     		tagId2.push(rows2[i].id);
        }
});


connection.query('SELECT * FROM sensor3;', function (error, rows, fields) 
{    	
	// sensor3 page
	app.get('/sensor3', function(req, res) {

		// use res.render to load up an ejs view file
    		res.render('pages/sensor3', {
        		tagTemp3: tagTemp3,
			tagRes3: tagRes3,
			tagAdc3: tagAdc3,
			tagMux3: tagMux3,
			tagId3: tagId3
    		});
	});

	var tagTemp3 =[]; 
	for(var i=0;i<rows.length;i++){
     		tagTemp3.push(rows[i].temp);
        }
 
	var tagRes3=[];
	//var tagRes3 = rows[0].res;   	   
	for(var i=0;i<rows.length;i++){
     		tagRes3.push(rows[i].res);
        }

	var tagAdc3=[]; 	   
	for(var i=0;i<rows.length;i++){
     		tagAdc3.push(rows[i].adc);
        }

	var tagMux3=[]; 
	for(var i=0;i<rows.length;i++){
     		tagMux3.push(rows[i].mux);
        }
  	
        var tagId3=[];	   
	for(var i=0;i<rows.length;i++){
     		tagId3.push(rows[i].id);
        }
});

app.listen(8080);
console.log('8080 is the port');
