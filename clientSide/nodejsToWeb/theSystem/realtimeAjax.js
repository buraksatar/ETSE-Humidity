// 1,1,1,1 ile çalıştı
// RealTimeDeneme2.ejs 


// load the things we need : 1- express, 2-mysql
var express = require('express');
var app = express();
var mysql = require('mysql');

var buff = {};


// Make Settings for Mysql database
var connection = mysql.createConnection({
host : 'localhost',
user : 'root',
password : 'HADIBAKALIM',
database: "datas",
multipleStatements: true
});

// set the view engine to ejs
app.set('view engine', 'ejs');

//main page
app.get('/', function(req, res) {
		// use res.render to load up an ejs view file
    		res.render('pages/index');
	});


//express ajax
app.use('/public', express.static('public'));


app.post('/getBuff', function(req, res) {
		// use res.render to load up an ejs view file
    		res.send({
        		tagTemp1: 1,
			tagRes1: 1,
			tagAdc1: 1,
			tagMux1: 1,
			tagId1: 1
 		});
	});

//sensor1
connection.query('SELECT * FROM sensor1;', function (error1, rows1, fields1) 
{    	

	app.get('/RealTimeDeneme2', function(req, res1) {

	// use res.render to load up an ejs view file
		res1.render('pages/RealTimeDeneme2',{
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
     		tagTim1.push(rows1[i].time);
        }
});

app.listen(8080);
console.log('the port: 8080, is active ');
