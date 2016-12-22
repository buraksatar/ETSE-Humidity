//load the things we need
var mqtt = require('mqtt');
var client  = mqtt.connect('mqtt://192.168.24.130');
var mysql = require('mysql');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var events = require('events');
var eventEmitter = new events.EventEmitter();

var addClientCreateDatabaseFunction = function addClientCreateDatabaseFunction()
{
        console.log('ring ring ring'); 

        connection.query('INSERT INTO chipID SET ?', dataFromForm , function (err, result) {
                if (err) {
                        console.error(err);
        		return;
      		}
      		        console.error(result);
        }); 

        connection.query('CREATE TABLE sensor'+ dataFromForm.queue.slice(-1) +' ( id INT PRIMARY KEY AUTO_INCREMENT, temp VARCHAR(255) NOT NULL,'+
                         ' res VARCHAR(255) NOT NULL, adc VARCHAR(255) NOT NULL, mux VARCHAR(255) NOT NULL,'+
                         ' time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, unixTime INT );',
                function(err, result){
                // Case there is an error during the creation
                        if(err) {
                                console.log(err);
                        } else {
                                console.log("Table Ter_Stops Created");
                                //subscribeAll();
                        }
        });
        client  = '';

        console.log("iptal abonelik");
        subscribeAll();
        

}
eventEmitter.on('addClientCreateDatabase', addClientCreateDatabaseFunction);






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
                chipIDunixTime : [],
                chipIDid : []
};

var sensorAll = [];


var dataFromForm = {
		number : [],
                queue : []
};


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


app.use(bodyParser.urlencoded({ extended: true }))
// parse application/json 
app.use(bodyParser.json())





function getDatafromchipIDtable(){
                connection.query('SELECT * FROM chipID;', function (error, rows, fields) 
        {
                tagDatas.chipIDnumber = [];
                tagDatas.chipIDqueue = [];
                tagDatas.chipIDunixTime = [];
                tagDatas.chipIDid = [];

                for(var i=0;i<rows.length;i++){
     	                tagDatas.chipIDnumber.push(rows[i].number);
                        tagDatas.chipIDqueue.push(rows[i].queue);
                        tagDatas.chipIDunixTime.push(rows[i].unixTime);
                        tagDatas.chipIDid.push(rows[i].id);
    	        }
        });
}




app.get('/configuration', function(req, res) {

        dataFromForm.number = req.param('number');
        dataFromForm.queue = req.param('queue');
        
        if(dataFromForm.number && dataFromForm.queue )
        {

        eventEmitter.emit('addClientCreateDatabase');

        }

        //res.redirect(req.get('referer'));

        //getDatafromchipIDtable();
        // use res.render to load up an ejs view file
        res.render('pages' + '/configuration',{
		//send the data with those names as an array
        	    tagNumber : tagDatas.chipIDnumber,
	            tagQueue : tagDatas.chipIDqueue,
                tagUnixTime : tagDatas.chipIDunixTime,
                tagId : tagDatas.chipIDid
 	    });
});




subscribeAll();

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


function subscribeAll(){
        console.log('subscribe0');
        client  = mqtt.connect('mqtt://192.168.24.130')
        //client.end();

        client.on('connect', function () {
                console.log('subscribe1');
                 getDatafromchipIDtable();
                 console.log('subscribe2');
                connection.query('SELECT * FROM chipID;', function (error, rows, fields) 
                {
                        // gets data from database and assing them related array
	                for(var i=0;i<rows.length;i++){
                                sensorAll[i] = new sensorObject( tagDatas.chipIDnumber[i] + tagDatas.chipIDqueue[i] );
                                sensorAll[i].calling();
                                client.subscribe('/data/' + tagDatas.chipIDnumber[i] + tagDatas.chipIDqueue[i]);
                                console.log('abone olundu');
                    }
                    console.log('subscribe3');
                        
                });
        })
}






app.post('/getBuff', function(req, res) {

        // gets data from database and assing them related array               
        // use res.render to load up an ejs view file
        getDatafromchipIDtable();

        //console.log(tagDatas.chipIDqueue);

        res.send({
       	        tagNumber : tagDatas.chipIDnumber,
	            tagQueue : tagDatas.chipIDqueue,
                tagUnixTime : tagDatas.chipIDunixTime,
                tagId : tagDatas.chipIDid
	});

});


// main function
function databaseToWeb(chipIDofSensor) {
        console.log('Ana fonksyion works');
        //console.log(tagDatas.chipIDqueue);
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
