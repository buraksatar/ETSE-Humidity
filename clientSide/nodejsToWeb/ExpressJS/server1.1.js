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

app.use('/public', express.static('public'));

app.get('/deneme', function(req, res) {
		// use res.render to load up an ejs view file
    		res.render('pages/deneme');
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
			tagId1: tagId1,
			tagTim1: tagTim1
    		});
	});

	var tagTemp1 =[]; 
	for(var i=0;i<rows1.length;i++){
     		tagTemp1.push(rows1[i].temp);
        }
 
	var tagRes1=[];
	//var tagRes = rows1[0].res;   	   
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

	var tagTim1=[];	   
	for(var i=0;i<rows1.length;i++){
     		tagTim1.push(String(rows1[i].time));
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
			tagId2: tagId2,
			tagTim2: tagTim2
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

	var tagTim2=[];	   
	for(var i=0;i<rows2.length;i++){
     		tagTim2.push(rows2[i].time);
        }
});


connection.query('SELECT * FROM sensor3;', function (error3, rows3, fields3) 
{    	
	// sensor3 page
	app.get('/sensor3', function(req, res) {

		// use res.render to load up an ejs view file
    		res.render('pages/sensor3', {
        		tagTemp3: tagTemp3,
			tagRes3: tagRes3,
			tagAdc3: tagAdc3,
			tagMux3: tagMux3,
			tagId3: tagId3,
			tagTim3: tagTim3
    		});
	});

	var tagTemp3 =[]; 
	for(var i=0;i<rows3.length;i++){
     		tagTemp3.push(rows3[i].temp);
        }
 
	var tagRes3=[];
	//var tagRes3 = rows3[0].res;   	   
	for(var i=0;i<rows3.length;i++){
     		tagRes3.push(rows3[i].res);
        }

	var tagAdc3=[]; 	   
	for(var i=0;i<rows3.length;i++){
     		tagAdc3.push(rows3[i].adc);
        }

	var tagMux3=[]; 
	for(var i=0;i<rows3.length;i++){
     		tagMux3.push(rows3[i].mux);
        }
  	
        var tagId3=[];	   
	for(var i=0;i<rows3.length;i++){
     		tagId3.push(rows3[i].id);
        }

	var tagTim3=[];	   
	for(var i=0;i<rows3.length;i++){
     		tagTim3.push(rows3[i].time);
        }
});

app.listen(8080);
console.log('8080 is the port');
