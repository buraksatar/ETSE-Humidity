var express = require('express');
var app = express();
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'HADIBAKALIM',
  database: 'datas'
});

connection.connect();

connection.query('SELECT * FROM sensor1',function(err,rows){
  if(err) throw err;

  console.log('Data received from Db:\n');
  console.log(rows);

});

app.get('/', function (req, res) {

  var deneme = 'denemeLANBU';
  res.send(deneme);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
