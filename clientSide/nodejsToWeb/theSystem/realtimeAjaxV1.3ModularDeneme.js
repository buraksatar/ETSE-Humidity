// load the things we need : 1- express, 2-mysql 3-mqtt
var express = require('express');
var app = express();
var mysql = require('mysql');
var mqtt = require('mqtt')
// we use mqtt broker called mosquitto
var client  = mqtt.connect('mqtt://test.mosquitto.org')

//unique chip ID's
var chipIDofSensor1 = '/8794332';
var chipIDofSensor2 = '/1496449';
var chipIDofSensor3 = '/1505613';


//make client on and subscribe to topics
client.on('connect', function () {
  	//sensor1
  	client.subscribe('/data' + chipIDofSensor1)
  	//sensor2
  	client.subscribe('/data' + chipIDofSensor2)
  	//sensor3
  	client.subscribe('/data' + chipIDofSensor3)
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
var tagTemp =[]; 
var tagRes = [];
var tagAdc=[];
var tagMux=[];
var tagId=[];
var tagTim=[];

// FOR PageofSensor1 
// table name in database
var tableNameOfSensor1 = 'sensor1';
var tableNameOfSensor2 = 'sensor2';
var tableNameOfSensor3 = 'sensor3';
var pageNameOfSensor1 = '/pageofSensor1';
var pageNameOfSensor2 = '/pageofSensor2';
var pageNameOfSensor3 = '/pageofSensor3';
var rowsNameOfSensor1 = 'rows1';
var rowsNameOfSensor2 = 'rows2';

getDatasFromDatabase(tableNameOfSensor1, pageNameOfSensor1, rowsNameOfSensor1);
getDatasFromDatabase(tableNameOfSensor2, pageNameOfSensor2, rowsNameOfSensor2);

function getDatasFromDatabase (tableNameOfSensor,pageNameOfSensor, rowsNameOfSensor) {
	//making connection with sensor1 table in Database
	connection.query('SELECT * FROM ' + tableNameOfSensor + ';', function (error, rowsNameOfSensor, fields) 
	{    	
		// call the webpage with that name
		app.get(pageNameOfSensor, function(req, res) {

			// use res.render to load up an ejs view file
			res.render('pages' + pageNameOfSensor,{
				//send the data with those names as an array
        		tagTemp: tagTemp,
				tagRes: tagRes,
				tagAdc: tagAdc,
				tagMux: tagMux,
				tagId: tagId
 			});
		});
	
		// gets data from database and assing them related array
		for(var i=0;i<rowsNameOfSensor.length;i++){
     		tagTemp.push(rowsNameOfSensor[i].temp);
			tagRes.push(rowsNameOfSensor[i].res);
			tagAdc.push(rowsNameOfSensor[i].adc);
			tagMux.push(rowsNameOfSensor[i].mux);
			tagId.push(rowsNameOfSensor[i].id);
			tagTim.push(rowsNameOfSensor[i].time);
    	}
	});
}


//make mqtt client is on and listen
client.on('message', function (topic, message) {
// message is Buffer
	
	// for topic of sensor1
	if(topic == '/data' + chipIDofSensor1) {
      
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
        			tagTemp: tagTemp,
					tagRes: tagRes
 				});
		});

     	tagTemp.push(post1.temp);
  		tagRes.push(post1.res);

	}
});

app.listen(8080);
console.log('the port: 8080, is active ');
