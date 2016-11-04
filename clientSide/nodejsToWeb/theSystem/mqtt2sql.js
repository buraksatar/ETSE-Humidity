//load the things we need
var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://test.mosquitto.org')
var mysql = require('mysql');
var express = require('express');
var app = express();

//make client on
client.on('connect', function () {
  //sensor1
  client.subscribe('/data/8794332')
  //sensor2
  client.subscribe('/data/1496449')
  //sensor3
  client.subscribe('/data/1505613')
})
 
//database settings
var connection = mysql.createConnection({
  	host: 'localhost',
  	user: 'root',
  	password: 'HADIBAKALIM',
  	database: 'datas',
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




connection.connect();


//mqtt client is on
client.on('message', function (topic, message) {
  // message is Buffer



   //if topic is sensor1
   if(topic == '/data/8794332') {
      
      //get data as a string 
      data1 = message.toString(); 
      
      //split it by comma
      var newbuff1 = data1.split(",");
      console.log(newbuff1);
      //assign the data to related post1 values   
      var post1  = {
         temp: newbuff1[0], 
         res: newbuff1[1], 
         adc: newbuff1[2], 
         mux: newbuff1[3]
      };
   
      // put post1 values to table of sensor1 in MYSQL database
      var query = connection.query('INSERT INTO sensor1 SET ?', post1 , function (err, result) {
     
      		if (err) {
         		console.error(err);
        		 return;
      		}
  
      		console.error(result);

      });        



	//PART OF SQLTOWEB, PART OF SQLTOWEB, PART OF SQLTOWEB
    connection.query('SELECT * FROM sensor1 ; SELECT * FROM material', function (error1, rows1, fields1)
    {    	
	
	// sensor1 page
	app.get('/RealTimeDeneme2', function(req, res1) {

		// use res.render to load up an ejs view file
    		res1.render('pages/RealTimeDeneme2', {
        		tagTemp1: tagTemp1,
			tagRes1: tagRes1,
			tagAdc1: tagAdc1,
			tagMux1: tagMux1,
			tagId1: tagId1
    		});
	});

	var tagTemp1 =[]; 
	for(var i=0;i<rows1[0].length;i++){
     		tagTemp1.push(rows1[0][i].temp);
        }
 
	var tagRes1=[];
	//var tagRes = rows1[0].res;   	   
	for(var i=0;i<rows1[0].length;i++){
     		tagRes1.push(rows1[0][i].res);
        }

	var tagAdc1=[]; 	   
	for(var i=0;i<rows1[0].length;i++){
     		tagAdc1.push(rows1[0][i].adc);
        }

	var tagMux1=[]; 
	for(var i=0;i<rows1[0].length;i++){
     		tagMux1.push(rows1[0][i].mux);
        }
  	
        var tagId1=[];	   
	for(var i=0;i<rows1[0].length;i++){
     		tagId1.push(rows1[0][i].id);
        }
	console.log(tagRes1);

     });


}







   //if topic is sensor2
   if(topic == '/data/1496449') {
      
      //get data as a string
      data2 = message.toString(); 
      
      //split it by comma
      var newbuff2 = data2.split(",");
      
      //assign the data to related post2 values 
      var post2  = {
         temp: newbuff2[0], 
         res: newbuff2[1], 
         adc: newbuff2[2], 
         mux: newbuff2[3]
      };
   
      // put post2 values to table of sensor2 in MYSQL database
      var query = connection.query('INSERT INTO sensor2 SET ?', post2 , function (err, result) {
     
      		if (err) {
         		console.error(err);
         		return;
      		}
  
      		console.error(result);

      });        


   }
   
   //if topic is sensor2
   if(topic == '/data/1505613') {
      
      //get data as a string
      data3 = message.toString(); 
      
      //split it by comma
      var newbuff3 = data3.split(",");
      
      //assign the data to related post3 values 
      var post3  = {
         temp: newbuff3[0], 
         res: newbuff3[1], 
         adc: newbuff3[2], 
         mux: newbuff3[3]
      };
   
      // put post3 values to table of sensor3 in MYSQL database
      var query = connection.query('INSERT INTO sensor3 SET ?', post3 , function (err, result) {
     
      if (err) {
         console.error(err);
         return;
      }
  
      console.error(result);

      });        
   }

})


app.listen(8080);
console.log('the port: 8080, is active ');
