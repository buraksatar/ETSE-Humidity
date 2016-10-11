var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://test.mosquitto.org')
var mysql = require('mysql');

client.on('connect', function () {
  //sensor1
  client.subscribe('/data/8794332')
  //sensor2
  client.subscribe('/data/1496449')
  //sensor3
  client.subscribe('/data/1505613')
})
 

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'HADIBAKALIM',
  database: 'datas'
});
connection.connect();

client.on('message', function (topic, message) {
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
   
      // put post1 values to table of sensor1 in MYSQL database
      var query = connection.query('INSERT INTO sensor1 SET ?', post1 , function (err, result) {
     
      if (err) {
         console.error(err);
         return;
      }
  
      console.error(result);

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
