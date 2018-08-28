// load the things we need : 1- express, 2-mysql 3-mqtt
var express = require('express');
var app = express();
var mysql = require('mysql');
var mqtt = require('mqtt')
// we use mqtt broker called mosquitto
var client  = mqtt.connect('mqtt://test.mosquitto.org')

var sensorObjectBase = function  (){ 
	this.databaseTableName = true;
	this.sensorQueue = false;
};

var sensorObject = function(webPageName, chipId){
	sensorObjectBase.call(this);
	this.webPageName = webPageName;
	this.chipId = chipId;
}

sensorObject.prototype = Object.create(sensorObjectBase.prototype);
sensorObject.prototype.constructor = sensorObject;

sensorObject.prototype.calling = function(){
	databaseToWeb(this.webPageName,this.chipId);
}

var sensorAll = [];
var sensor1 = new sensorObject('/pageofSensor1','/8794332'+'s1');
sensorAll.push(sensor1);
var sensor2 = new sensorObject('/pageofSensor2','/1496449'+'s2');
sensorAll.push(sensor2);
var sensor3 = new sensorObject('/pageofSensor3','/1505613'+'s3');
sensorAll.push(sensor3);


function callSensors (){
	for (i=0;i<sensorAll.length;i++){
		sensorAll[i].calling();
	}
	console.log('You have ' + sensorAll.length + ' sensors' );
}

callSensors();

//make client on and subscribe to topics
client.on('connect', function () {
  	//sensor1
  	client.subscribe('/data' + sensor1.chipId)
  	//sensor2
  	client.subscribe('/data' + sensor2.chipId)
  	//sensor3
  	client.subscribe('/data' + sensor3.chipId)
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

var staticPage = 0;

// FOR PageofSensor1 
// table name in database

function databaseToWeb(pageNameOfSensor, chipIDofSensor) {
	//making connection with sensor1 table in Database
	   	
		// call the webpage with that name
		app.get(pageNameOfSensor, function(req, res) {

			staticPage = pageNameOfSensor.slice(-1);

			// reaching the related table in database, for example sensor1, sensor2, sensor3 ...
			connection.query('SELECT * FROM sensor' + staticPage + ';', function (error, rows, fields) 
			{ 
				// gets data from database and assing them related array
				for(var i=0;i<rows.length;i++){
     				tagTemp.push(rows[i].temp);
					tagRes.push(rows[i].res);
					tagAdc.push(rows[i].adc);
					tagMux.push(rows[i].mux);
					tagId.push(rows[i].id);
					tagTim.push(rows[i].time);
    			}

				// use res.render to load up an ejs view file
				res.render('pages' + pageNameOfSensor,{
					//send the data with those names as an array
        			tagTemp: tagTemp,
					tagRes: tagRes,
					tagAdc: tagAdc,
					tagMux: tagMux,
					tagId: tagId
 				});

				tagTemp =[]; 
				tagRes = [];
				tagAdc=[];
				tagMux=[];
				tagId=[];
				tagTim=[];

			});			

		});


		//make mqtt client is on and listen	
		client.on('message', function (topic, message) {
			// message is Buffer

			// for topic of sensor1
			if(topic == '/data' + chipIDofSensor ) {
			
				var dynamicPage =[];
				dynamicPage.push(chipIDofSensor.slice(-1));

			
				if ( staticPage == dynamicPage ){
					
      				//get data as a string 
      				data = message.toString();
      				//split it by comma
      				var newbuff = data.split(",");
      	
      				//assign the data to related post1 values   
      				var post  = {
        				temp: newbuff[0], 
        				res: newbuff[1], 
        				adc: newbuff[2], 
        				mux: newbuff[3]
      				};
   
					app.post('/getBuff', function(req, res) {
					// use res.render to load up an ejs view file
    					res.send({
        					tagTemp: tagTemp,
							tagRes: tagRes
 						});
					});

     				tagTemp.push(post.temp);
  					tagRes.push(post.res);
				}
			}
		});
		
	
}

app.listen(8080);
console.log('the port: 8080, is active ');
