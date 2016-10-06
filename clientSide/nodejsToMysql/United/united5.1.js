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
  
  var dataTemp = 0;
  var dataRes = 0;
  var dataAdc = 0;
  var dataMux = 0; 

    if(topic == '/data/temp') {
       var deneme = [message.toString()];
       dataTemp = deneme[0];
       console.log(dataTemp)      
    }

    if(topic == '/data/res') {
    	dataRes = message.toString();
    }

    if(topic == '/data/adc') {
       dataAdc = message.toString();
    }

    if(topic == '/data/mux') {
       dataMux = message.toString();
    }
  
  var post  = {
    temp: dataTemp, 
    res: dataRes, 
    adc: dataAdc, 
    mux: dataMux
  };
   

  var query = connection.query('INSERT INTO newDatas SET ?', post , function (err, result) {
     if (err) {
      console.error(err);
      return;
     }
  
  console.error(result);
});

})
