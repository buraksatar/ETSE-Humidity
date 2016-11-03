// load the things we need : 1- express, 2-mysql, 3- mqtt
var express = require('express');
var app = express();
var mysql = require('mysql');
var mqtt = require('mqtt');
var client  = mqtt.connect('mqtt://test.mosquitto.org');
var fs = require('fs');
var timeoutHandle = null;

// set the view engine to ejs
app.set('view engine', 'ejs');

//main page
app.get('/', function(req, res) {
		// use res.render to load up an ejs view file
    		res.render('pages/index');
	});

//express ajax
app.use('/public', express.static('public'));


function startTimeout() {
  stopTimeout();
  timeoutHandle = setTimeout(updateStream, 1000);
}

function stopTimeout() {
  clearTimeout(timeoutHandle);
}

function updateStream(){
	fs.readFile('/home/burak/path/test.txt', 'utf8', function(err, data) {
  		if (err) throw err;
  		console.log('Data Reading from Text : Done');
  		console.log(data);

        	app.get('/mqtt2web', function(req, res1) {

		// use res.render to load up an ejs view file
    			res1.render('pages/mqtt2web', {
        			data : data
    			});


		});

	});
}






//make client on
client.on('connect', function () {
  //sensor1
  client.subscribe('/data/8794332');
  console.log('connected the topic');
})
 

//mqtt client is on
client.on('message', function (topic, message, packet) {
   // message is Buffer
   //if topic is sensor1
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

        fs.writeFile("/home/burak/path/test.txt", post1.res, function(err) {
      		if(err) {
        		return console.log(err);
    		}
    		console.log("The file was saved!");
        });
   }
})


//For error handling and offline reconnect
client.on('offline', function() {
    console.log("offline");
});

client.on('reconnect', function() {
    console.log("reconnect");
});

client.on('error', function (err) {
  console.log(err)
  client.end()
})

startTimeout();

app.listen(8080);
console.log('the port: 8080, is active ');
