//load the things we need
var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://192.168.24.130')
var mysql = require('mysql');

//database settingsd
var connection = mysql.createConnection({
  	host: 'localhost',
  	user: 'root',
  	password: 'HADIBAKALIM',
  	database: 'datas',
  	multipleStatements: true
});

connection.connect();

var tagDatas = {
		chipIDnumber : [],
                chipIDqueue : []
};

var sensorAll = [];

// main base for prototype
var sensorObjectBase = function  (){ 
	this.testValue = true;
};

// define name of the variables, call from main base
var sensorObject = function( chipId ){
	sensorObjectBase.call(this);
	this.chipId = chipId;
}

// use prototype from sensorObjectBase, even if it is not defined
sensorObject.prototype = Object.create(sensorObjectBase.prototype);
// create the prototype
sensorObject.prototype.constructor = sensorObject;
// define the function of prototype
sensorObject.prototype.calling = function(){
	// call the main function with variables
	databaseToWeb(this.chipId);
}

// for reading clients from databaseToWeb
client.on('connect', function () {
        connection.query('SELECT * FROM chipID;', function (error, rows, fields) 
        {
                // gets data from database and assing them related array
	        for(var i=0;i<rows.length;i++){
     	                tagDatas.chipIDnumber.push(rows[i].number);
                        tagDatas.chipIDqueue.push(rows[i].queue);
                        sensorAll[i] = new sensorObject( tagDatas.chipIDnumber[i] + tagDatas.chipIDqueue[i] );
                        console.log('You have ' + rows.length + ' sensors' );
                        sensorAll[i].calling();
                        client.subscribe('/data/' + tagDatas.chipIDnumber[i] + tagDatas.chipIDqueue[i]);
    	        } 
        });
})

// main function
function databaseToWeb(chipIDofSensor) {
        console.log('Ana fonksyion works');
        //mqtt client is on
        client.on('message', function (topic, message) {
        // message is Buffer

                //if topic is sensor1
                if(topic == '/data/' + chipIDofSensor) {

                        var dynamicChipValue = chipIDofSensor.slice(-1);
                        console.log(dynamicChipValue);

                        //get data as a string 
                        data = message.toString(); 
      
                        //split it by comma
                        var newbuff = data.split(",");
                        console.log(newbuff);
                        //assign the data to related post values   
                        var post  = {
                                temp: newbuff[0], 
                                res: newbuff[1], 
                                adc: newbuff[2], 
                                mux: newbuff[3]
                        };
   
                        // put post values to table of sensor1 in MYSQL database
                        var query = connection.query('INSERT INTO sensor'+ dynamicChipValue + ' SET ?', post , function (err, result) {
     
      		                if (err) {
         		                console.error(err);
        		                return;
      		                }
  
      		                console.error(result);

                        });        
                }
        })
}

//app.listen(8080);
console.log('the port: 8080, is active ');
