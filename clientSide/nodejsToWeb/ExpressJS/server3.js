// server.js
// load the things we need
var express = require('express');
var app = express();
var mysql = require('mysql');

var connection = mysql.createConnection({
host : 'localhost',
user : 'root',
password : 'HADIBAKALIM',
database: "datas"
});

//var test = "NABER LAN";
// set the view engine to ejs
app.set('view engine', 'ejs');


// about page 
app.get('/about', function(req, res) {
    res.render('pages/about');
});


var query = connection.query('SELECT * FROM sensor1;', function (error, rows, fields) 
{    	
	//console.log(str);
	//console.log(rows.length + ' ROWS found');
	// index page
	app.get('/', function(req, res) {

    		var sensors = [
        		{ name: 'data1', row: 1 },
      			{ name: 'data2', row: 2 },
        		{ name: 'data3', row: 3 }
    		];
    		var tagTemp = str;

    		var abc = "Just trying";
		
		// use res.render to load up an ejs view file
    		res.render('pages/index', {
        		sensors: sensors,
        		tagTemp: tagTemp,
        		abc: abc
    		});
	});

	var str= "";
   	   
	for(i=0;i<rows.length;i++)
     		str = str + rows[i].temp +'\n';

	//var str= rows[1].temp;

});

//console.log(query.sql.toString());

app.listen(8080);
console.log('8080 is the port');
