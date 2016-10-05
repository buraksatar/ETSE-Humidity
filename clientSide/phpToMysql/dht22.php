 <?php 
 $host='tryhumidty.x10host.com';
 $user='tryhumid_burak';
 $password='hadibakalim';
 $db='tryhumid_deneme';

 //PHP 5.5 (New method)
 $connection =  mysqli_connect($host,$user,$password,$db);
   
 $id = $_GET["id"];
 $mux = $_GET["mux"];
 $res = $_GET["res"];
 $temp = $_GET["temp"];
	
 mysqli_query($connection, 'INSERT INTO datas (id, mux, res, temp) VALUES (3, 8, 10, 24);');
?>
