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

// use res.render to load up an ejs view file

// index page 


// about page 
app.get('/about', function(req, res) {
    res.render('pages/about');
});



var query = connection.query('SELECT * FROM sensor1;', function (error, rows, fields) 
{    
	
  	
	
	//console.log(str);

	//console.log(rows.length + ' ROWS found');

	

	app.get('/', function(req, res) {

    		var drinks = [
        		{ name: 'Bloody Mary', drunkness: 3 },
      			{ name: 'Martini', drunkness: 5 },
        		{ name: 'Scotch', drunkness: 10 }
    		];
    		var tagline = str;

    		var abc = query.sql.toString() ;
    	
    		res.render('pages/index', {
        		drinks: drinks,
        		tagline: tagline,
        		abc: abc
    		});
	});


	var str= rows[1].temp;

});
//console.log(query.sql.toString());

app.listen(8080);
console.log('8080 is the magic port');
