// load the things we need
// libraries : mqtt, mysql, express, bodyparser, events

var mqtt = require('mqtt');
var client  = mqtt.connect('mqtt://147.156.81.149', {
   username: 'burak',
   password: 'hadibakalim',
   port: 1883
});

var mysql = require('mysql');

var express = require('express');
var http = require('http');

var app = express();
var server = http.createServer(app);

var bodyParser = require('body-parser');
var events = require('events');
var eventEmitter = new events.EventEmitter();

// this is an event function
// that event add new client to database

var addClientCreateDatabaseFunction = function addClientCreateDatabaseFunction()
{
    // Checking Process
    // read the table if there is any, with the same name

    connection.query('SELECT * FROM registeredClients;', 
        function (error, rows) 
        {
            // error handling

            if (error) throw error;

            // console.log(dat |aFromForm.description);
            // local value for comparison

            var checkValue = 0;

            // if the number which we want to add into database is already installed
            // checkValue can't be zero.
	        
            for(var i=0;i<rows.length;i++){
                if ( dataFromForm.number == registeredClients.subscriptionName[i] ){
                    checkValue++;
                }
            }
            
            if( !isNaN(dataFromForm.number) ){
                if( dataFromForm.number.length == 7 ){
            
                    // if zero, the number hasnt installed into database yet.
            
                    if (checkValue == 0){
            
                        // if the client isnt registred yet,
                        // save the new client to the chipID table in mysqldatabase            
                        // insert the client value into chipID table

                        connection.query('INSERT INTO chipID SET ?', {clientName: dataFromForm.number, 
                                                                    description: dataFromForm.description} , 
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
                        
                        // create a new table according to new client, 
                        // so that the data comes to new client can be saved in related table
                        
                        connection.query('CREATE TABLE s'  + dataFromForm.number + 
                            ' ( id INT PRIMARY KEY AUTO_INCREMENT, temp VARCHAR(255) NOT NULL,'+
                            ' res VARCHAR(255) NOT NULL, adc VARCHAR(255) NOT NULL, mux VARCHAR(255) NOT NULL,'+
                            ' time TIMESTAMP DEFAULT CURRENT_TIMESTAMP);',
                        
                            // error handling
                        
                            function(err, result){
                        
                                // Case there is an error during the creation
                        
                                if(err) {
                                    console.log(err);
                                } 
                                else {
                                    console.log("New client's table created succesfully");
                                }
                            }
                        );

                        // STORE THE REGISTERED AND SUBSCRIBED CLIENTS AT VARIABLE TABLE
                        
                        connection.query('INSERT INTO registeredClients SET ?', {clientName: dataFromForm.number, 
                                                                            description: dataFromForm.description}  , 
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
                        
                        var post  = {
                            temp: 0, 
                            res: 0, 
                            adc: 0, 
                            mux: 0
                        };
            
                        // put post values to table of sensor1 in MYSQL database
                        
                        connection.query('INSERT INTO s'+ dataFromForm.number + ' SET ?', post , function (err, result) {
            
                            if (err) {
        		                return;
      		                }

                        });  

                        alertMessages.addedSuccessfully++;

                    }
                    else {
                        console.log('This client ID is already registered');
                        alertMessages.alreadyRegisteredClient++;
                    }
                }
                else {
                    console.log('It has to be seven digit');
                    alertMessages.wrongClientID7Digit++;
                }        
            }
            else {
                console.log('Wrong ClientID Syntax! It cant has any letters');
                alertMessages.wrongClientIDSyntax++;
            }
        }
    );
    
    // subscribe to all clients from starting over
    
    subscribeAll();
        
}

// when addClientCreateDatabase event emitted, addClientCreateDatabaseFunction starts

eventEmitter.on('addClientCreateDatabase', addClientCreateDatabaseFunction);

// this is an event function
// that event delete the client from database

var deleteClientFromDatabaseFunction = function deleteClientFromDatabaseFunction()
{
    // if form is not blank
 
    if(dataFromForm.number != ''){
        connection.query('SELECT * FROM registeredClients;', 
            function (error, rows) {
                
                for(var k=0; k<dataFromForm.number.length; k++){
                    
                    // error handling
                    
                    if (error) throw error;
                    
                    //var k=0; 
                    //console.log('sikerler- ' + dataFromForm.number[k]);
                        
                    var checkValue = 0;
                
                    // if the number we want to delete is in database
                    // check value cant be zero
                
                    for(var i=0;i<rows.length;i++){
                    
                        //console.log('2- ' + dataFromForm.number[k]);
                        
                        if ( dataFromForm.number[k] == registeredClients.subscriptionName[i] ){
                            checkValue++;
                        }
                    }
    
                    //console.log(checkValue);
                    //console.log(dataFromForm.number);
                    // if checkValue is not zero, that means the number registered in database
    
                    if (checkValue != 0){
                           
                        getDatafromchipIDtable();
                          
                        // if the client isnt registred yet,
                        // save the new client to the chipID table in mysqldatabase 
                        // delete from chipId table
        
                        connection.query('DELETE FROM chipID WHERE clientName = "'+ dataFromForm.number[k] +'"' ,
                            function (err, result) {
                                if(err) {
                                    console.log(err);
                                } 
                                else {
            
                                    //console.log(result);
                                    
                                    console.log("Deleted succesfully from chipID table");
                                }
                            }
                        );

                        // delete related table from the database 
                        
                        connection.query('DROP TABLE s'+ dataFromForm.number[k] ,
                            function(err, result){
                                
                                // Case there is an error during the creation
                                
                                if(err) {
                                    console.log(err);
                                } 
                                else {
                                        //console.log(result);
                                        console.log("Client's table deleted succesfully");
                                    
                                    }
                                }
                            );

                            // DELETE FROM registeredClients TABLE
                            
                            connection.query('DELETE FROM registeredClients WHERE clientName = "'+ dataFromForm.number[k] +'"' ,
                                function (err, result) {
                                    if(err) {
                                        console.log(err);
                                    } 
                                    else {
                                        console.log("ALSO UNSUBSCRIBED");
                                    }
                                }
                            );

                            alertMessages.deletedSuccessfully++;
                            
                        }
                        else{
                                console.log('This ID is not registered');
                        }
                    }
                }
            );
        }
    
    // subscribe to all clients from starting over

    subscribeAll();      
}

// when deleteClientFromDatabase event emitted, deleteClientFromDatabaseFunction starts

eventEmitter.on('deleteClientFromDatabase', deleteClientFromDatabaseFunction);

var unsubsribeClientFunction = function unsubsribeClientFunction()
{
    // if form is not blank

    if(dataFromForm.unsubscribeNumber != ''){
         connection.query('SELECT * FROM registeredClients;', 
            function (error, rows) 
            {
                for(var k=0; k<dataFromForm.unsubscribeNumber.length; k++){

                    // error handling

                    if (error) throw error;

                    var checkValue = 0;
                    var checkIndex = 0;
                    var checkSubscribe = 0;

                    // if the number we want to delete is in database
                    // check value cant be zero

                    for(var i=0;i<rows.length;i++){
                        if ( dataFromForm.unsubscribeNumber[k] == registeredClients.subscriptionName[i] ){
                            checkValue++;
                            checkIndex = i;
                        }
                    }

                    // if checkValue is not zero, that means the number registered in database
                    
                    if (checkValue != 0){
                        
                        getDatafromchipIDtable();
                        getDatafromRegisteredClientsTable();
 
                        for(var i=0;i<tagDatas.subscriptionName.length;i++){
                            if ( dataFromForm.unsubscribeNumber[k] == tagDatas.subscriptionName[i] ){
                                checkSubscribe++;
                            }
                        }
                            
                        if (checkSubscribe != 0){
                            
                            // if the client isnt registred yet,
                            // save the new client to the chipID table in mysqldatabase 
                            // delete from chipId table
                            
                            connection.query('DELETE FROM chipID WHERE clientName  = "'+ dataFromForm.unsubscribeNumber[k] +'"' ,
                                function (err, result) {
                                    if(err) {
                                        console.log(err);
                                    } 
                                    else {
                                        console.log("Deleted succesfully from chipID table");
                                    }
                                }
                            );
                            alertMessages.unsubscribedSuccessfully++;
                        }
                        else {        
                                connection.query('INSERT INTO chipID SET ?', {clientName: dataFromForm.unsubscribeNumber[k], 
                                                                        description: dataFromForm.unsubscribeDescription[k]} , 
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
                                
                                alertMessages.subscribedSuccessfully++;

                                console.log(' subscribe oldu ');
                                
                        }                         
                    }
                    else{
                        console.log('Wrong client ID');
                    }
                }
            }
        );
    }

    // subscribe to all clients from starting over

    subscribeAll();
       
}

// when unsubsribeClient event emitted, unsubsribeClientFunction starts

eventEmitter.on('unsubsribeClient', unsubsribeClientFunction);

var clickPageFunction = function clickPageFunction()
{    
    //console.log(dataFromForm.linkClicked);
 
    tagDatas.routePage++;
 
    // call the webpage with that name

	app.get('/pageofSensor1', function(req, res) {

		// reaching the related table in database, for example sensor1, sensor2, sensor3 ...

		connection.query('SELECT * FROM s' + dataFromForm.linkClicked + ';', function (error, rows) 
		{ 

			// gets data from database and assing them related array

			for(var i=0;i<rows.length;i++){
    			pageOfSensor.temp.push(rows[i].temp);
				pageOfSensor.res.push(rows[i].res);
				pageOfSensor.adc.push(rows[i].adc);
				pageOfSensor.mux.push(rows[i].mux);
				pageOfSensor.id.push(rows[i].id);
                pageOfSensor.time.push(rows[i].time);
   			}

			// use res.render to load up an ejs view file

			res.render('pages/pageofSensor1' ,{

				//send the data with those names as an array

        		pageTemp : pageOfSensor.temp,
				pageRes : pageOfSensor.res,
				pageAdc : pageOfSensor.adc,
				pageMux : pageOfSensor.mux,
				pageId : pageOfSensor.id,
                pageTime : pageOfSensor.time
 			});
            
            //res.json({ user: 'tobi' });
			// make the variables zero to prevent overriding

			pageOfSensor.temp =[]; 
			pageOfSensor.res = [];
			pageOfSensor.adc=[];
			pageOfSensor.mux=[];
			pageOfSensor.id=[];
            pageOfSensor.time=[];
		});			

	});

    app.get('/pageofSensor1Live', function(req, res) {

		// reaching the related table in database, for example sensor1, sensor2, sensor3 ...

		connection.query('SELECT * FROM s' + dataFromForm.linkClicked + ';', function (error, rows) 
		{ 

			// gets data from database and assing them related array

			for(var i=0;i<rows.length;i++){
    			pageOfSensor.temp.push(rows[i].temp);
				pageOfSensor.res.push(rows[i].res);
				pageOfSensor.adc.push(rows[i].adc);
				pageOfSensor.mux.push(rows[i].mux);
				pageOfSensor.id.push(rows[i].id);
                pageOfSensor.time.push(rows[i].time);
   			}

			// use res.render to load up an ejs view file

			res.render('pages/pageofSensor1Live' ,{

				//send the data with those names as an array

        		pageTemp : pageOfSensor.temp,
				pageRes : pageOfSensor.res,
				pageAdc : pageOfSensor.adc,
				pageMux : pageOfSensor.mux,
				pageId : pageOfSensor.id,
                pageTime : pageOfSensor.time
 			});
            
            //res.json({ user: 'tobi' });
			// make the variables zero to prevent overriding

			pageOfSensor.temp =[]; 
			pageOfSensor.res = [];
			pageOfSensor.adc=[];
			pageOfSensor.mux=[];
			pageOfSensor.id=[];
            pageOfSensor.time=[];
		});			

	});

    app.get('/pageofSensor1Static', function(req, res) {

		// reaching the related table in database, for example sensor1, sensor2, sensor3 ...

		connection.query('SELECT * FROM s' + dataFromForm.linkClicked + ';', function (error, rows) 
		{ 

			// gets data from database and assing them related array

			for(var i=0;i<rows.length;i++){
    			pageOfSensor.temp.push(rows[i].temp);
				pageOfSensor.res.push(rows[i].res);
				pageOfSensor.adc.push(rows[i].adc);
				pageOfSensor.mux.push(rows[i].mux);
				pageOfSensor.id.push(rows[i].id);
                pageOfSensor.time.push(rows[i].time);
   			}

			// use res.render to load up an ejs view file

			res.render('pages/pageofSensor1Static' ,{

				//send the data with those names as an array

        		pageTemp : pageOfSensor.temp,
				pageRes : pageOfSensor.res,
				pageAdc : pageOfSensor.adc,
				pageMux : pageOfSensor.mux,
				pageId : pageOfSensor.id,
                pageTime : pageOfSensor.time
 			});
            
            //res.json({ user: 'tobi' });
			// make the variables zero to prevent overriding

			pageOfSensor.temp =[]; 
			pageOfSensor.res = [];
			pageOfSensor.adc=[];
			pageOfSensor.mux=[];
			pageOfSensor.id=[];
            pageOfSensor.time=[];
		});			

	});

    app.get('/pageofSensor1Time', function(req, res) {

		// reaching the related table in database, for example sensor1, sensor2, sensor3 ...

		connection.query('SELECT * FROM s' + dataFromForm.linkClicked + ';', function (error, rows) 
		{ 

			// gets data from database and assing them related array

			for(var i=0;i<rows.length;i++){
    			pageOfSensor.temp.push(rows[i].temp);
				pageOfSensor.res.push(rows[i].res);
				pageOfSensor.adc.push(rows[i].adc);
				pageOfSensor.mux.push(rows[i].mux);
				pageOfSensor.id.push(rows[i].id);
                pageOfSensor.time.push(rows[i].time);
   			}

			// use res.render to load up an ejs view file

			res.render('pages/pageofSensor1Time' ,{

				//send the data with those names as an array

        		pageTemp : pageOfSensor.temp,
				pageRes : pageOfSensor.res,
				pageAdc : pageOfSensor.adc,
				pageMux : pageOfSensor.mux,
				pageId : pageOfSensor.id,
                pageTime : pageOfSensor.time
 			});
            
            //res.json({ user: 'tobi' });
			// make the variables zero to prevent overriding

			pageOfSensor.temp =[]; 
			pageOfSensor.res = [];
			pageOfSensor.adc=[];
			pageOfSensor.mux=[];
			pageOfSensor.id=[];
            pageOfSensor.time=[];
		});			

	});
    
}

// when clickPage event emitted, clickPageFunction starts

eventEmitter.on('clickPage', clickPageFunction);

//database settingsd

var connection = mysql.createConnection({
  	host: 'localhost',
  	user: 'burak',
  	password: 'hadibakalim',
  	database: 'mqttdb',
  	multipleStatements: true
});

connection.connect();

// to give a link to SensorPage, all of them have been used

var pageOfSensor = {
    id : [],
	res : [],
    temp : [],
    adc : [],
    mux : [],
    time : []
}

// to give alert message, all of them have been used

var alertMessages = {
    alreadyRegisteredClient : 0,
    addedSuccessfully : 0,
    deletedSuccessfully : 0,
    unsubscribedSuccessfully : 0,
    subscribedSuccessfully : 0,
    wrongClientIDSyntax : 0,
    wrongClientID7Digit : 0,
    reloadPage : 0
}

//to store only subscribed Clients

var tagDatas = {
    chipIDname : [],
	subscriptionName : [],
    chipIDUnixTime : [],
    chipIDid : [],
    chipIDdescription : [],
    deneme : 0,
    routePage : 0
};

//for call main function

var sensorAll = [];

// to get data from http post request

var dataFromForm = {
	number : [],
    description : [],
    unsubscribe : [],
    unsubscribeDescription : [],
    linkClicked : []
};

//to store registeredClients

var registeredClients = {
	subscriptionName : [],
    description : [],
    ID : []
};

var latestValue = {
    temp : [],
    res : []
}


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
        tagDatas.subscriptionName = [];
        tagDatas.chipIDUnixTime = [];
        tagDatas.chipIDid = [];
        tagDatas.chipIDdescription = [];

        for(var i=0;i<rows.length;i++){
     	    tagDatas.subscriptionName.push(rows[i].clientName);
            tagDatas.chipIDUnixTime.push(rows[i].time);
            tagDatas.chipIDid.push(rows[i].id);
            tagDatas.chipIDdescription.push(rows[i].description);
    	}
    });
}

function getDatafromRegisteredClientsTable(){
    
    connection.query('SELECT * FROM registeredClients;', function (error, rows) 
    {
        registeredClients.subscriptionName = [];
        registeredClients.description = [];
        latestValue.temp = [];
        latestValue.res = [];

        for(var i=0;i<rows.length;i++){

            registeredClients.subscriptionName.push(rows[i].clientName);
            registeredClients.description.push(rows[i].description);
    	}
        
        for(var k=0; k<registeredClients.subscriptionName.length; k++){
            
            connection.query('SELECT * FROM s'+ registeredClients.subscriptionName[k] +';', function (error, rows) 
            {
        
                    latestValue.temp.push( rows[rows.length-1].temp );
                    latestValue.res.push( getCalculate(15.84,-0.2576,8.923,rows[rows.length-1].res).toString() );
            });
        }

    });
}

function getCalculate(a,b,c,x){
 		var result1 = a * (Math.pow(x, b)) + c;
     	var result2 = result1.toPrecision(5);
         
        if(result2 == 'Infinity'){
            result2 = 'N/A';
            return result2;
        }
        else{
            return result2;
        }
}

app.get('/configuration', function(req, res) {
    res.render('pages' + '/configuration',{
	
    //send the data with those names as an array
        
        tagNumber : tagDatas.subscriptionName,
        tagUnixTime : tagDatas.chipIDUnixTime,
        tagId : tagDatas.chipIDid,
        tagDescription : tagDatas.chipIDdescription,
        tagRegistered : registeredClients.subscriptionName,
        descriptionOfRegistered : registeredClients.description,
        latestTemp : latestValue.temp,
        latestRes : latestValue.res
 	});
});

app.post('/configuration', function(req, res) {
    
    if ( req.body.number ){
        dataFromForm.number = req.body.number;
        dataFromForm.description = req.body.description;
        eventEmitter.emit('addClientCreateDatabase');
    }
    if ( req.body.numberForDelete ){

        var buffForDeleteNumber = req.body.numberForDelete.split(",");

        dataFromForm.number = buffForDeleteNumber;     
        eventEmitter.emit('deleteClientFromDatabase');
    }
    if ( req.body.numberForUnsubscribe && req.body.descriptionForUnsubscribe ){
        var buffForUnsubscribeNumber = req.body.numberForUnsubscribe.split(",");
        var buffForUnsubscribeDescription = req.body.descriptionForUnsubscribe.split(",");

        dataFromForm.unsubscribeNumber = buffForUnsubscribeNumber;
        dataFromForm.unsubscribeDescription = buffForUnsubscribeDescription;

        console.log(dataFromForm.unsubscribeNumber);
        console.log(dataFromForm.unsubscribeDescription);

        eventEmitter.emit('unsubsribeClient');     
    }
    if ( req.body.sikko ){
        dataFromForm.linkClicked = req.body.sikko;
        eventEmitter.emit('clickPage'); 
    }
    tagDatas.deneme = 1;

});

app.get('/dashboard', function(req, res) {
    res.render('pages' + '/dashboard',{
	
    //send the data with those names as an array
        
        tagNumber : tagDatas.subscriptionName,
        tagUnixTime : tagDatas.chipIDUnixTime,
        tagId : tagDatas.chipIDid,
        tagDescription : tagDatas.chipIDdescription,
        tagRegistered : registeredClients.subscriptionName,
        descriptionOfRegistered : registeredClients.description,
        latestTemp : latestValue.temp,
        latestRes : latestValue.res
 	});
});

app.post('/dashboard', function(req, res) {
    
    if ( req.body.number ){
        dataFromForm.number = req.body.number;
        dataFromForm.description = req.body.description;
        eventEmitter.emit('addClientCreateDatabase');
    }
    if ( req.body.numberForDelete ){

        var buffForDeleteNumber = req.body.numberForDelete.split(",");

        dataFromForm.number = buffForDeleteNumber;     
        eventEmitter.emit('deleteClientFromDatabase');
    }
    if ( req.body.numberForUnsubscribe && req.body.descriptionForUnsubscribe ){
        var buffForUnsubscribeNumber = req.body.numberForUnsubscribe.split(",");
        var buffForUnsubscribeDescription = req.body.descriptionForUnsubscribe.split(",");

        dataFromForm.unsubscribeNumber = buffForUnsubscribeNumber;
        dataFromForm.unsubscribeDescription = buffForUnsubscribeDescription;

        console.log(dataFromForm.unsubscribeNumber);
        console.log(dataFromForm.unsubscribeDescription);

        eventEmitter.emit('unsubsribeClient');     
    }
    if ( req.body.sikko ){
        dataFromForm.linkClicked = req.body.sikko;
        eventEmitter.emit('clickPage'); 
    }
    tagDatas.deneme = 1;

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

    client  = mqtt.connect('mqtt://147.156.81.149', {
        username: 'burak',
        password: 'hadibakalim',
        port: 1883
    });

    client.on('connect', function () {

        getDatafromchipIDtable();
        
        connection.query('SELECT * FROM chipID;', function (error, rows) 
        {

            // gets data from database and assing them related array
	        for(var i=0;i<rows.length;i++){
                sensorAll[i] = new sensorObject( tagDatas.subscriptionName[i] );
                sensorAll[i].calling();
                console.log(sensorAll[i]);
                client.subscribe('/data/' + tagDatas.subscriptionName[i]);
            }
        });
    })
}


// send it every 5 seconds

app.post('/getBuff', function(req, res) {
   
    // gets data from database and assing them related array               
    // use res.render to load up an ejs view file

    getDatafromchipIDtable();
    getDatafromRegisteredClientsTable();
    
    res.send({
        tagNumber : tagDatas.subscriptionName,
        tagUnixTime : tagDatas.chipIDUnixTime,
        tagId : tagDatas.chipIDid,
        tagDescription : tagDatas.chipIDdescription,
        tagRegistered : registeredClients.subscriptionName,
        descriptionOfRegistered : registeredClients.description,
        deneme : tagDatas.deneme,
        alertAlreadyAdd : alertMessages.alreadyRegisteredClient,
        alertSuccessAdded : alertMessages.addedSuccessfully,
        alertSuccessDeleted : alertMessages.deletedSuccessfully,
        alertSuccessUnsubscribed : alertMessages.unsubscribedSuccessfully,
        alertSuccessSubscribed : alertMessages.subscribedSuccessfully,
        alertWrongClientIDSyntax : alertMessages.wrongClientIDSyntax,
        alertWrongClientID7Digit : alertMessages.wrongClientID7Digit,
        routePage : tagDatas.routePage,
        latestTemp : latestValue.temp,
        latestRes : latestValue.res,
        tiklananPage : dataFromForm.linkClicked,
        reloadPage : alertMessages.reloadPage
	});
    
  
    tagDatas.deneme = 0;
    alertMessages.alreadyRegisteredClient = 0;
    alertMessages.addedSuccessfully = 0;
    alertMessages.deletedSuccessfully = 0;
    alertMessages.unsubscribedSuccessfully = 0 ;
    alertMessages.subscribedSuccessfully = 0;
    alertMessages.wrongClientIDSyntax = 0;
    alertMessages.wrongClientID7Digit = 0;
    tagDatas.routePage = 0;
    alertMessages.reloadPage = 0;
});


// if a data goes to mqtt broker and if server subscribe one those topic
// gets the data and write them into sqldatabase

function mqtt2sql(chipIDofSensor) {

    //mqtt client is on
    //console.log(chipIDofSensor);

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

            //assign the data to related post values

            var post  = {
                temp: newbuff[0], 
                res: newbuff[1], 
                adc: newbuff[2], 
                mux: newbuff[3]
            };
            
            // put post values to table of sensor1 in MYSQL database
            // put post values to table of sensor1 in MYSQL database
            if( parseInt(post.res) > 0 && (post.temp.length == 3) ){

                post.temp = parseInt(post.temp)/10 ;

                var query = connection.query('INSERT INTO s'+ chipIDofSensor + ' SET ?', post , function (err, result) {            
                    if (err) {
        		        return;
      		        }
                });
            
                if(chipIDofSensor == dataFromForm.linkClicked){
                    console.log('sic');
                    alertMessages.reloadPage++;
                }
            }
        }              
    })
}

server.listen(8080);
//server.listen(80, '127.0.0.5');
server.on('listening', function() {});

console.log('the port: 8080, is active ');
