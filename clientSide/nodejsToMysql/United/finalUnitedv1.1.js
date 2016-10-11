var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://test.mosquitto.org')
var mysql = require('mysql');

client.on('connect', function () {
  client.subscribe('/data/8794332')
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

  connection.query('SELECT * FROM sensor1',function(err,rows){
  if(err) throw err;

  console.log('Data received from Db:\n');
  console.log(rows);

});
  

});

})
