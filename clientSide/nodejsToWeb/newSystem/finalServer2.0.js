//load the things we need
var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://192.168.24.130')
var mysql = require('mysql');
var express = require('express');
var app = express();

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
                chipIDqueue : [],
                chipIDsik : [],
                chipIDid : []
};

var sensorAll = [];

// set the view engine to ejs on ExpressJS
app.set('view engine', 'ejs');

// set the main page on ExpressJS
app.get('/', function(req, res) {
		// use res.render to load up an ejs view file
    		res.render('pages/index');
	});

app.get("/burak", function(request, response) {
  response.end("BURAK SATAR was here!");
});



// express ajax, reachable website from public
app.use('/public', express.static('public'));


app.get('/configuration', function(req, res) {
        // use res.render to load up an ejs view file
	res.render('pages' + '/configuration',{
		//send the data with those names as an array
        	tagTemp : tagDatas.chipIDnumber,
	        tagRes : tagDatas.chipIDqueue,
                tagSik : tagDatas.chipIDsik,
                tagId : tagDatas.chipIDid
 	});
});

app.get("*", function(request, response) {
  response.end("Error! 404! ");
});


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

function getdatafromchipIDTable() {
         connection.query('SELECT * FROM chipID;', function (error, rows, fields) 
        {
                // gets data from database and assing them related array
	        for(var i=0;i<rows.length;i++){
     	                tagDatas.chipIDnumber.push(rows[i].number);
                        tagDatas.chipIDqueue.push(rows[i].queue);
                        tagDatas.chipIDsik.push(rows[i].unixTime);
                        tagDatas.chipIDid.push(rows[i].id);
    	        } 


                 
                

                
        });
}


app.post('/getBuff', function(req, res) {
                       
// use res.render to load up an ejs view file
        connection.query('SELECT * FROM chipID;', function (error, rows, fields) 
        {
                // gets data from database and assing them related array
	        for(var i=0;i<rows.length;i++){
                        tagDatas.chipIDnumber = [];
                        tagDatas.chipIDqueue = [];
                        tagDatas.chipIDsik = [];
                        tagDatas.chipIDid = [];
    	        }  
                
                
                for(var i=0;i<rows.length;i++){
     	                tagDatas.chipIDnumber.push(rows[i].number);
                        tagDatas.chipIDqueue.push(rows[i].queue);
                        tagDatas.chipIDsik.push(rows[i].unixTime);
                        tagDatas.chipIDid.push(rows[i].id);
    	        }         
        });



        res.send({
       	        tagTemp : tagDatas.chipIDnumber,
	        tagRes : tagDatas.chipIDqueue,
                tagSik : tagDatas.chipIDsik,
                tagId : tagDatas.chipIDid
	});

});












client.on('connect', function () {
        connection.query('SELECT * FROM chipID;', function (error, rows, fields) 
        {
                // gets data from database and assing them related array
	        for(var i=0;i<rows.length;i++){
                        sensorAll[i] = new sensorObject( tagDatas.chipIDnumber[i] + tagDatas.chipIDqueue[i] );
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
app.listen(8080);
console.log('the port: 8080, is active ');
