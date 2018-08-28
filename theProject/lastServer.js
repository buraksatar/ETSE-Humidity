// load the things we need
// libraries : mqtt, mysql, express, bodyparser, events

var mqtt = require('mqtt');
var client  = mqtt.connect('mqtt://192.168.24.130');
var mysql = require('mysql');
var Math = require('mathjs');

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
                            function (error, result) {

                                // error handling
                                if (error) throw error;
                            
                            }
                        );
                        
                        // create a new table according to new client, 
                        // so that the data comes to new client can be saved in related table
                        
                        connection.query('CREATE TABLE s'  + dataFromForm.number + 
                            ' ( id INT PRIMARY KEY AUTO_INCREMENT, temp VARCHAR(255) NOT NULL,'+
                            ' res VARCHAR(255) NOT NULL, adc VARCHAR(255) NOT NULL, mux VARCHAR(255) NOT NULL,'+
                            ' time TIMESTAMP DEFAULT CURRENT_TIMESTAMP);',
                        
                            // error handling
                            function(error, result){
                        
                                // Case there is an error during the creation
                                if (error) throw error;
                            
                            }
                        );

                        // STORE THE REGISTERED AND SUBSCRIBED CLIENTS AT VARIABLE TABLE
                        
                        connection.query('INSERT INTO registeredClients SET ?', {clientName: dataFromForm.number, 
                                                                            description: dataFromForm.description}  , 
                            function (error, result) {
                        
                                // error handling
                                if (error) throw error;
                            }
                        );
                        
                        var post  = {
                            temp: 0, 
                            res: 0, 
                            adc: 0, 
                            mux: 0
                        };
            
                        // put post values to table of sensor1 in MYSQL database
                        
                        connection.query('INSERT INTO s'+ dataFromForm.number + ' SET ?', post , function (error, result) {
            
                            if (error) {
        		                return;
      		                }

                        });  

                        alertMessages.addedSuccessfully++;

                    }
                    else {
                        alertMessages.alreadyRegisteredClient++;
                    }
                }
                else {
                    alertMessages.wrongClientID7Digit++;
                }        
            }
            else {
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
                        
                    var checkValue = 0;
                
                    // if the number we want to delete is in database
                    // check value cant be zero
                
                    for(var i=0;i<rows.length;i++){
                    
                        
                        if ( dataFromForm.number[k] == registeredClients.subscriptionName[i] ){
                            checkValue++;
                        }
                    }
    
       
                    // if checkValue is not zero, that means the number registered in database
    
                    if (checkValue != 0){
                           
                        getDatafromchipIDtable();
                          
                        // if the client isnt registred yet,
                        // save the new client to the chipID table in mysqldatabase 
                        // delete from chipId table
        
                        connection.query('DELETE FROM chipID WHERE clientName = "'+ dataFromForm.number[k] +'"' ,
                            function (error, result) {
                                
                                if (error) throw error;
                            }
                        );

                        // delete related table from the database 
                        
                        connection.query('DROP TABLE s'+ dataFromForm.number[k] ,
                            function(error, result){
                                
                                // Case there is an error during the creation
                                if (error) throw error;
                                }
                            );

                            // DELETE FROM registeredClients TABLE
                            
                            connection.query('DELETE FROM registeredClients WHERE clientName = "'+ dataFromForm.number[k] +'"' ,
                                function (error, result) {
                                    if (error) throw error;
                                }
                            );

                            alertMessages.deletedSuccessfully++;
                            
                        }
                        else{
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
                                function (error, result) {
                                    if (error) throw error;
                                }
                            );
                            alertMessages.unsubscribedSuccessfully++;
                        }
                        else {        
                                connection.query('INSERT INTO chipID SET ?', {clientName: dataFromForm.unsubscribeNumber[k], 
                                                                        description: dataFromForm.unsubscribeDescription[k]} , 
                                    function (error, result) {
                                      
                                        // error handling
                                        if (error) throw error;
                                    }
                                );
                                
                                alertMessages.subscribedSuccessfully++;

                                
                        }                         
                    }
                    else{
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
 
    tagDatas.routePage++;
 
    // call the webpage with that name

	app.get('/pageofSensor1', function(req, res) {

        connection.query('SELECT * FROM s' + dataFromForm.linkClicked + ';', function (error, rows) 
		{ 
            tagDatas.asilSayac = Math.ceil(rows.length / 50);         
		});	

        tagDatas.pageSayac = 0 ;

         app.post('/pageofSensor1', function(req, res) {
            
            if ( req.body.sortNumber == 2 ){
                
                connection.query('SELECT * FROM s' + dataFromForm.linkClicked + ';', function (error, rows) 
                    { 
                        
                        if (tagDatas.pageSayac+1 < tagDatas.asilSayac){
                            
                            for(var i=rows.length-51*(tagDatas.pageSayac+1); i<rows.length-51*tagDatas.pageSayac ;i++){
                                    pageOfSensor.temp.push(rows[i].temp);
                                    pageOfSensor.res.push(rows[i].res);
                                    pageOfSensor.adc.push(rows[i].adc);
                                    pageOfSensor.mux.push(rows[i].mux);
                                    pageOfSensor.id.push(rows[i].id);
                                    pageOfSensor.time.push(rows[i].time);
                                }

                           
                         tagDatas.pageSayac++;
                        }
                        else{
                             for(var i=0; i<51 ;i++){
                                    pageOfSensor.temp.push(rows[i].temp);
                                    pageOfSensor.res.push(rows[i].res);
                                    pageOfSensor.adc.push(rows[i].adc);
                                    pageOfSensor.mux.push(rows[i].mux);
                                    pageOfSensor.id.push(rows[i].id);
                                    pageOfSensor.time.push(rows[i].time);
                                }

                            tagDatas.pageSayac--;
                            //tagDatas.pageSayac=0;
                        }
                        //tagDatas.pageSayac++;

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


            }
            else if ( req.body.sortNumberForward == 1 ){
                
                tagDatas.pageSayac = tagDatas.asilSayac - tagDatas.pageSayac +1;

                
                connection.query('SELECT * FROM s' + dataFromForm.linkClicked + ';', function (error, rows) 
                    { 
                        
                        if (tagDatas.pageSayac+1 < tagDatas.asilSayac){
                            
                            for(var i=51*(tagDatas.pageSayac); i<51*(tagDatas.pageSayac+1) ;i++){
                                    pageOfSensor.temp.push(rows[i].temp);
                                    pageOfSensor.res.push(rows[i].res);
                                    pageOfSensor.adc.push(rows[i].adc);
                                    pageOfSensor.mux.push(rows[i].mux);
                                    pageOfSensor.id.push(rows[i].id);
                                    pageOfSensor.time.push(rows[i].time);
                                }

                            tagDatas.pageSayac++;

                        }
                        else{
                             for(var i=rows.length-51; i<rows.length ;i++){
                                    pageOfSensor.temp.push(rows[i].temp);
                                    pageOfSensor.res.push(rows[i].res);
                                    pageOfSensor.adc.push(rows[i].adc);
                                    pageOfSensor.mux.push(rows[i].mux);
                                    pageOfSensor.id.push(rows[i].id);
                                    pageOfSensor.time.push(rows[i].time);
                                }
  
                            tagDatas.pageSayac--;
                            //tagDatas.pageSayac=0;
                        }
                        //tagDatas.pageSayac++;

                            
                        
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


            }
         });
            connection.query('SELECT * FROM s' + dataFromForm.linkClicked + ';', function (error, rows) 
                    { 

                        //check the rows lengh
                        if (rows.length > 49){
                            // gets data from database and assing them related array
                            for(var i=rows.length-49; i<rows.length ;i++){
                                pageOfSensor.temp.push(rows[i].temp);
                                pageOfSensor.res.push(rows[i].res);
                                pageOfSensor.adc.push(rows[i].adc);
                                pageOfSensor.mux.push(rows[i].mux);
                                pageOfSensor.id.push(rows[i].id);
                                pageOfSensor.time.push(rows[i].time);
                            }
                        }
                        else if (rows.length <= 49){
                            // gets data from database and assing them related array
                            for(var i=0; i<rows.length ;i++){
                                pageOfSensor.temp.push(rows[i].temp);
                                pageOfSensor.res.push(rows[i].res);
                                pageOfSensor.adc.push(rows[i].adc);
                                pageOfSensor.mux.push(rows[i].mux);
                                pageOfSensor.id.push(rows[i].id);
                                pageOfSensor.time.push(rows[i].time);
                            }
                            tagDatas.pageSayac=0;
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

            //check the rows lengh
            if (rows.length > 99){
                // gets data from database and assing them related array
                for(var i=rows.length-99; i<rows.length ;i++){
                    pageOfSensor.res.push(rows[i].res);
                }
            }
            else if (rows.length <= 99){
                // gets data from database and assing them related array
                for(var i=0; i<rows.length ;i++){
                    pageOfSensor.res.push(rows[i].res);
                }
            }
            
            

			// use res.render to load up an ejs view file

			res.render('pages/pageofSensor1Live' ,{

				//send the data with those names as an array

				pageRes : pageOfSensor.res
 			});
            
			// make the variables zero to prevent overriding

			pageOfSensor.res = [];
		});			

	});

    app.get('/pageofSensor1Static', function(req, res) {

		// reaching the related table in database, for example sensor1, sensor2, sensor3 ...

		connection.query('SELECT * FROM s' + dataFromForm.linkClicked + ';', function (error, rows) 
		{ 

			//check the rows lengh
            if (rows.length > 199){
                // gets data from database and assing them related array
                for(var i=rows.length-199; i<rows.length ;i++){
                    pageOfSensor.res.push(rows[i].res);
                }
            }
            else if (rows.length <= 199 ){
                // gets data from database and assing them related array
                for(var i=0; i<rows.length ;i++){
                    pageOfSensor.res.push(rows[i].res);
                }
            }

			// use res.render to load up an ejs view file

			res.render('pages/pageofSensor1Static' ,{

				//send the data with those names as an array
                
				pageRes : pageOfSensor.res
 			});
            
			// make the variables zero to prevent overriding

			pageOfSensor.res = [];
		});			

	});

    app.get('/pageofSensor1Time', function(req, res) {

		// reaching the related table in database, for example sensor1, sensor2, sensor3 ...

		connection.query('SELECT * FROM s' + dataFromForm.linkClicked + ';', function (error, rows) 
		{ 
			// gets data from database and assing them related array

			pageOfSensor.res.push(rows[rows.length-1].res);
			// use res.render to load up an ejs view file

			res.render('pages/pageofSensor1Time' ,{

				//send the data with those names as an array
				pageRes : pageOfSensor.res
 			});
            
			// make the variables zero to prevent overriding 
			pageOfSensor.res = [];

		});			

	});
    
}

// when clickPage event emitted, clickPageFunction starts

eventEmitter.on('clickPage', clickPageFunction);

//database settingsd

var connection = mysql.createConnection({
  	host: 'localhost',
  	user: 'root',
  	password: 'HADIBAKALIM',
  	database: 'datas',
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
    routePage : 0,
    mqttRes : [],
    mqttChipID : [],
    pageSayac : 0,
    asilSayac : 0
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
        // chipID number of subscribed nodes, like 1234567
        tagNumber : tagDatas.subscriptionName,
        // shows how many nodes subscribed
        tagRegistered : registeredClients.subscriptionName,
        // description name of subscribed nodes, like kitchen
        descriptionOfRegistered : registeredClients.description,
        latestTemp : latestValue.temp,
        latestRes : latestValue.res
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

	mqtt2sql(this.chipId);
}


function subscribeAll(){

    // define client

    client.end();

    client  = mqtt.connect('mqtt://192.168.24.130')

    client.on('connect', function () {

        getDatafromchipIDtable();
        
        connection.query('SELECT * FROM chipID;', function (error, rows) 
        {

            // gets data from database and assing them related array
	        for(var i=0;i<rows.length;i++){
                sensorAll[i] = new sensorObject( tagDatas.subscriptionName[i] );
                sensorAll[i].calling();
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
        tagId : tagDatas.chipIDid,
        // to refresh page after a configuration change is made
        deneme : tagDatas.deneme,
        tagRegistered : registeredClients.subscriptionName,
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
        reloadPage : alertMessages.reloadPage,
        mqttRes : tagDatas.mqttRes,
        mqttChipID : tagDatas.mqttChipID
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
    tagDatas.mqttRes = 0;
    tagDatas.mqttChipID = 0;
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
            if( parseInt(post.res) > 0 && (post.temp.length == 3) ){

                post.temp = parseInt(post.temp)/10 ;

                var query = connection.query('INSERT INTO s'+ chipIDofSensor + ' SET ?', post , function (error, result) {            
                    if (error) {
        		        return;
      		        }
                });
            
                if(chipIDofSensor == dataFromForm.linkClicked){
                    alertMessages.reloadPage++;
                }

                tagDatas.mqttRes = post.res;
                tagDatas.mqttChipID = chipIDofSensor;

            }
        }              
    })
}

server.listen(8080);
server.on('listening', function() {});