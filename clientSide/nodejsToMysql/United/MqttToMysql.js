var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://test.mosquitto.org')
var mysql = require('mysql');

client.on('connect', function () {
  client.subscribe('/data/8794332')
})
 

var connection = mysql.createConnection({
  host: 'localhost',         // host of database
  user: 'root',             // user of database
  password: 'HADIBAKALIM', // password of database
  database: 'datas'       // name of database
});
connection.connect();

client.on('message', function (topic, message) {
  // message is Buffer
    
  str = message.toString(); 

  var newbuff = str.split(",");
         
  var post  = {
    temp: newbuff[0], 
    res: newbuff[1], 
    adc: newbuff[2], 
    mux: newbuff[3]
  };
   

  var query = connection.query('INSERT INTO sensor1 SET ?', post , function (err, result) {
     if (err) {
      console.error(err);
      return;
     }
  
  console.error(result);
});

})
