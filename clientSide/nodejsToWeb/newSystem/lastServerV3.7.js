//load the things we need
// libraries : mqtt, mysql, express, bodyparser, events
var mqtt = require('mqtt');
var client  = mqtt.connect('mqtt://192.168.24.130');
var mysql = require('mysql');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var events = require('events');
var eventEmitter = new events.EventEmitter();

// this is an event function
// that event add new client to database
var addClientCreateDatabaseFunction = function addClientCreateDatabaseFunction()
{
    // Checking Process
    // read the table if there is any, with the same name
    connection.query('SELECT * FROM chipID;', 
        function (error, rows) 
        {
            var checkVAlue = 0;
            // comparison
	        for(var i=0;i<rows.length;i++){
                if ( dataFromForm.queue == tagDatas.chipIDqueue[i] ){
                    checkVAlue++;
                }
            }

            if (checkVAlue == 0){
                // if the client isnt registred yet,
                // save the new client to the chipID table in mysqldatabase 
                connection.query('INSERT INTO chipID SET ?', dataFromForm , 
                    function (err, result) {
                        // error handling
                        if (err) {
                            console.error(err);
      	                }
                        else{
                            console.error(result);
                        }
                    }
                );
            }

        }
    );

    // create a new table according to new client, so that the data comes to new client can be saved in related table
    connection.query('CREATE TABLE sensor'+ dataFromForm.queue.slice(-1) +
                     ' ( id INT PRIMARY KEY AUTO_INCREMENT, temp VARCHAR(255) NOT NULL,'+
                     ' res VARCHAR(255) NOT NULL, adc VARCHAR(255) NOT NULL, mux VARCHAR(255) NOT NULL,'+
                     ' time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, unixTime INT );',
            // error handling
            function(err, result){
                // Case there is an error during the creation
                if(err) {
                    console.log(err);
                } 
                else {
                    console.log("New client's table created succesfully");
                }
    });
    // subscribe to all clients from starting over
    subscribeAll();
        
}
// when addClientCreateDatabase event emitted, addClientCreateDatabaseFunction starts
eventEmitter.on('addClientCreateDatabase', addClientCreateDatabaseFunction);

// this is an event function
// that event delete the client from database
var deleteClientFromDatabaseFunction = function deleteClientFromDatabaseFunction()
{
    if(dataFromForm.number != ''){
         connection.query('SELECT * FROM chipID;', 
            function (error, rows) 
            {
                var checkVAlue = 0;
                var checkIndex = 0;
                // comparison
	            for(var i=0;i<rows.length;i++){
                    if ( dataFromForm.number == tagDatas.chipIDnumber[i] ){
                        checkVAlue++;
                        checkIndex = i;
                    }
                }

                if (checkVAlue != 0){
                    // if the client isnt registred yet,
                    // save the new client to the chipID table in mysqldatabase 
                    // delete from chipId table
                    connection.query('DELETE FROM chipID WHERE number = "'+ dataFromForm.number +'"' , 
                        function (err, result) {
                            if(err) {
                                console.log(err);
                            } 
                            else {
                                console.log("Deleted succesfully from chipID table");
                            }
                        }
                    );
                    
                    // delete related table from the database 
                    connection.query('DROP TABLE sensor'+ ++checkIndex,
                        function(err, result){
                        // Case there is an error during the creation
                            if(err) {
                                console.log(err);
                            } 
                            else {
                                console.log("Client's table deleted succesfully");
                            }
                        }
                    );
                }
            }
        );
    }
    else{
       
        // delete from chipId table
        connection.query('DELETE FROM chipID WHERE queue = "'+ dataFromForm.queue +'"' , 
            function (err, result) {
                if(err) {
                    console.log(err);
                } 
                else {
                    console.log("Deleted succesfully from chipID table");
                }
            }
        );


        // delete related table from the database 
        connection.query('DROP TABLE sensor'+ dataFromForm.queue.slice(-1),
            function(err, result){
            // Case there is an error during the creation
                if(err) {
                    console.log(err);
                } 
                else {
                    console.log("Client's table deleted succesfully");
                }
        });
    }
    
    // subscribe to all clients from starting over
    subscribeAll();
       
}
// when deleteClientFromDatabase event emitted, deleteClientFromDatabaseFunction starts
eventEmitter.on('deleteClientFromDatabase', deleteClientFromDatabaseFunction);


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
    
    connection.query('SELECT * FROM chipID;', function (error, rows) 
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

    if (req.param('number') && req.param('queue') ){
        dataFromForm.number = req.param('number');
        dataFromForm.queue = req.param('queue');
        eventEmitter.emit('addClientCreateDatabase');
    }
    else if (req.param('numberForDelete') || req.param('queueForDelete')){
        dataFromForm.number = req.param('numberForDelete');
        dataFromForm.queue = req.param('queueForDelete');
        eventEmitter.emit('deleteClientFromDatabase');
    }

    // use res.render to load up an ejs view file
    res.render('pages' + '/configuration',{
	//send the data with those names as an array
        tagNumber : tagDatas.chipIDnumber,
	    tagQueue : tagDatas.chipIDqueue,
        tagUnixTime : tagDatas.chipIDunixTime,
        tagId : tagDatas.chipIDid
 	});

    if (req.param('value') == 'sensor1')
    {
        //console.log('fuck');

    }

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
	mqtt2sql(this.chipId);
}


function subscribeAll(){
    // define client
    client.end();

    client  = mqtt.connect('mqtt://192.168.24.130')

    client.on('connect', function () {

        getDatafromchipIDtable();
        
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
}


// send it every 5 seconds
app.post('/getBuff', function(req, res) {

    // gets data from database and assing them related array               
    // use res.render to load up an ejs view file
    getDatafromchipIDtable();

    res.send({
        tagNumber : tagDatas.chipIDnumber,
	    tagQueue : tagDatas.chipIDqueue,
        tagUnixTime : tagDatas.chipIDunixTime,
        tagId : tagDatas.chipIDid
	});
});


// if a data goes to mqtt broker and if server subscribe one those topic
// gets the data and write them into sqldatabase
function mqtt2sql(chipIDofSensor) {
        //mqtt client is on
    client.on('message', function (topic, message) {
        // message is Buffer
        
        // if topic equals to one of topic that client(server) subscribe
        if(topic == '/data/' + chipIDofSensor) {
    
            var dynamicChipValue = chipIDofSensor.slice(-1);
            //console.log(dynamicChipValue);

            //get data as a string 
            data = message.toString(); 
      
            //split it by comma
            var newbuff = data.split(",");
            //console.log(newbuff);
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
                    //console.error(err);
        		    return;
      		    }
      		    //console.error(result);

            });        
        }              
    })
}
app.listen(8080);
console.log('the port: 8080, is active ');
