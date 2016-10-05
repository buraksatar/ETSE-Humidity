var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://test.mosquitto.org')
var mysql = require('mysql');

client.on('connect', function () {
  client.subscribe('/test')
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
  
  console.log(message.toString())

  var dataArray = {
  data: message.toString()
};

var query = connection.query('insert into datas set ?', dataArray, function (err, result) {
  if (err) {
    console.error(err);
    return;
  }
  console.error(result);
});

})
