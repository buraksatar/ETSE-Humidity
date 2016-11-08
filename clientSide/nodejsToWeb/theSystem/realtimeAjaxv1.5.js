// load the things we need : 1- express, 2-mysql
var express = require('express');
var app = express();
var mysql = require('mysql');
var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://test.mosquitto.org')

var buff = {};

//make client on
client.on('connect', function () {
  //sensor1
  client.subscribe('/data/8794332')
  //sensor2
  client.subscribe('/data/1496449')
  //sensor3
  client.subscribe('/data/1505613')
})



// Make Settings for Mysql database
var connection = mysql.createConnection({
host : 'localhost',
user : 'root',
password : 'HADIBAKALIM',
database: "datas",
multipleStatements: true
});

connection.connect();

// set the view engine to ejs
app.set('view engine', 'ejs');

//main page
app.get('/', function(req, res) {
		// use res.render to load up an ejs view file
    		res.render('pages/index');
	});

//express ajax
app.use('/public', express.static('public'));

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


var tagTemp1 =[]; 
var tagRes1 = [];  

//mqtt client is on
client.on('message', function (topic, message) {
  // message is Buffer
	//sensor1

	if(topic == '/data/8794332') {
      
      	//get data as a string 
      	data1 = message.toString(); 
      
      	//split it by comma
      	var newbuff1 = data1.split(",");
      	//console.log(newbuff1);
      	//assign the data to related post1 values   
      	var post1  = {
         	temp: newbuff1[0], 
         	res: newbuff1[1], 
         	adc: newbuff1[2], 
        	mux: newbuff1[3]
      	};
   
		//console.log(post1.temp[0]);
		//console.log(post1.res[0]);
		app.post('/getBuff', function(req, res) {
			// use res.render to load up an ejs view file
    			res.send({
        			tagTemp1: tagTemp1,
					tagRes1: tagRes1
 				});
		});

		
     		tagTemp1.push(post1.temp);
		console.log(post1.temp)
  		tagRes1.push(post1.res);


		//app.listen(8080);
		console.log('topic1');

	}
});

app.listen(8080);
console.log('the port: 8080, is active ');
