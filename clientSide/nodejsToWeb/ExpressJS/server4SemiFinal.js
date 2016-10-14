// server.js, load the things we need
var express = require('express');
var app = express();
var mysql = require('mysql');

var connection = mysql.createConnection({
host : 'localhost',
user : 'root',
password : 'HADIBAKALIM',
database: "datas"
});

// set the view engine to ejs
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
		// use res.render to load up an ejs view file
    		res.render('pages/index');
	});

var query = connection.query('SELECT * FROM sensor1;', function (error, rows, fields) 
{    	
	// sensor1 page
	app.get('/sensor1', function(req, res) {

    		var tagTemp = strTemp;
		var tagRes = strRes;
		var tagAdc = strAdc;
		var tagMux = strMux;
		var tagId = strId;
		// use res.render to load up an ejs view file
    		res.render('pages/sensor1', {
        		tagTemp: tagTemp,
			tagRes: tagRes,
			tagAdc: tagAdc,
			tagMux: tagMux,
			tagId: tagId
    		});
	});

	var strTemp= "";  	   
	for(i=0;i<rows.length;i++)
     		strTemp = strTemp + rows[i].temp +'\n';

	var strRes= "";  	   
	for(i=0;i<rows.length;i++)
     		strRes = strRes + rows[i].res +'\n';

	var strAdc= "";  	   
	for(i=0;i<rows.length;i++)
     		strAdc = strAdc + rows[i].adc +'\n';

	var strMux= "";  	   
	for(i=0;i<rows.length;i++)
     		strMux = strMux + rows[i].mux +'\n';

	var strId= "";  	   
	for(i=0;i<rows.length;i++)
     		strId = strId + rows[i].id +'\n';

});



var query = connection.query('SELECT * FROM sensor2;', function (error, rows, fields) 
{    	
	// sensor2 page
	app.get('/sensor2', function(req, res) {

    		var tagTemp = strTemp;
		var tagRes = strRes;
		var tagAdc = strAdc;
		var tagMux = strMux;
		var tagId = strId;
		// use res.render to load up an ejs view file
    		res.render('pages/sensor2', {
        		tagTemp: tagTemp,
			tagRes: tagRes,
			tagAdc: tagAdc,
			tagMux: tagMux,
			tagId: tagId
    		});
	});

	var strTemp= "";  	   
	for(i=0;i<rows.length;i++)
     		strTemp = strTemp + rows[i].temp +'\n';

	var strRes= "";  	   
	for(i=0;i<rows.length;i++)
     		strRes = strRes + rows[i].res +'\n';

	var strAdc= "";  	   
	for(i=0;i<rows.length;i++)
     		strAdc = strAdc + rows[i].adc +'\n';

	var strMux= "";  	   
	for(i=0;i<rows.length;i++)
     		strMux = strMux + rows[i].mux +'\n';

	var strId= "";  	   
	for(i=0;i<rows.length;i++)
     		strId = strId + rows[i].id +'\n';

});

var query = connection.query('SELECT * FROM sensor3;', function (error, rows, fields) 
{    	
	// sensor3 page
	app.get('/sensor3', function(req, res) {

    		var tagTemp = strTemp;
		var tagRes = strRes;
		var tagAdc = strAdc;
		var tagMux = strMux;
		var tagId = strId;
		// use res.render to load up an ejs view file
    		res.render('pages/sensor3', {
        		tagTemp: tagTemp,
			tagRes: tagRes,
			tagAdc: tagAdc,
			tagMux: tagMux,
			tagId: tagId
    		});
	});

	var strTemp= "";  	   
	for(i=0;i<rows.length;i++)
     		strTemp = strTemp + rows[i].temp +'\n';

	var strRes= "";  	   
	for(i=0;i<rows.length;i++)
     		strRes = strRes + rows[i].res +'\n';

	var strAdc= "";  	   
	for(i=0;i<rows.length;i++)
     		strAdc = strAdc + rows[i].adc +'\n';

	var strMux= "";  	   
	for(i=0;i<rows.length;i++)
     		strMux = strMux + rows[i].mux +'\n';

	var strId= "";  	   
	for(i=0;i<rows.length;i++)
     		strId = strId + rows[i].id +'\n';

});

app.listen(8080);
console.log('8080 is the port');
