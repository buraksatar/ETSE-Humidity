// load the things we need : 1- express, 2-mysql 3-mqtt
var express = require('express');
var app = express();
var mysql = require('mysql');
var mqtt = require('mqtt')
// we use mqtt broker called mosquitto
var client  = mqtt.connect('mqtt://test.mosquitto.org')

//make client on and subscribe to topics
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

// set the view engine to ejs on ExpressJS
app.set('view engine', 'ejs');

// set the main page on ExpressJS
app.get('/', function(req, res) {
		// use res.render to load up an ejs view file
    		res.render('pages/index');
	});

// express ajax, reachable website from public
app.use('/public', express.static('public'));

// declare variables
var tagTemp1 =[]; 
var tagRes1 = [];
var tagAdc1=[];
var tagMux1=[];
var tagId1=[];
var tagTim1=[];

//making connection with sensor1 table in Database
connection.query('SELECT * FROM sensor1;', function (error1, rows1, fields1) 
{    	
	// call the webpage with that name
	app.get('/RealTimeDeneme2', function(req, res1) {

		// use res.render to load up an ejs view file
		res1.render('pages/RealTimeDeneme2',{
			//send the data with those names as an array
        	tagTemp1: tagTemp1,
			tagRes1: tagRes1,
			tagAdc1: tagAdc1,
			tagMux1: tagMux1,
			tagId1: tagId1
 		});
	});
	
	// gets data from database and assing them related array
	for(var i=0;i<rows1.length;i++){
     		tagTemp1.push(rows1[i].temp);
			tagRes1.push(rows1[i].res);
			tagAdc1.push(rows1[i].adc);
			tagMux1.push(rows1[i].mux);
			tagId1.push(rows1[i].id);
			tagTim1.push(rows1[i].time);
    }
});

//make mqtt client is on and listen
client.on('message', function (topic, message) {
// message is Buffer
	
	// for topic of sensor1
	if(topic == '/data/8794332') {
      
      	//get data as a string 
      	data1 = message.toString(); 
      
      	//split it by comma
      	var newbuff1 = data1.split(",");
      	
      	//assign the data to related post1 values   
      	var post1  = {
         	temp: newbuff1[0], 
         	res: newbuff1[1], 
         	adc: newbuff1[2], 
        	mux: newbuff1[3]
      	};
   
		//console.log(post1.temp[0]);

		app.post('/getBuff', function(req, res) {
			// use res.render to load up an ejs view file
    			res.send({
        			tagTemp1: tagTemp1,
					tagRes1: tagRes1
 				});
		});

     	tagTemp1.push(post1.temp);
  		tagRes1.push(post1.res);

	}
});

app.listen(8080);
console.log('the port: 8080, is active ');
