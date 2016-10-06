var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://test.mosquitto.org')
var mysql = require('mysql');

client.on('connect', function () {
  client.subscribe('/data/+')
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
  
  

   if(topic == '/data/temp') {
        var temp = message.toString();
        console.log(temp)
    }

    if(topic == '/data/res') {
    	var res = message.toString();
    }

    if(topic == '/data/adc') {
       var adc = message.toString();
    }

    if(topic == '/data/mux') {
       var mux = message.toString();
    }
   
  var dataArray = [    
     temp,
     res,
     adc,
     mux
  ];

var query = connection.query('INSERT INTO newDatas SET `temp`=dataArray[0], `res`=dataArray[1],`adc`=dataArray[2],`mux`=dataArray[3]', function (err, result) {
  if (err) {
    console.error(err);
    return;
  }
  console.error(result);
});

})
