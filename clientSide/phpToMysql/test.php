 <?php 
 $host='tryhumidty.x10host.com';
 $user='tryhumid_burak';
 $password='hadibakalim';
 $db='tryhumid_deneme';

 //PHP 5.5 (New method)
 $connection =  mysqli_connect($host,$user,$password,$db);
 
 if (mysqli_connect_errno())
  {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
  }
	
 $result = mysqli_query($connection, 'SELECT * FROM datas;');
 
  // Fetch one and one row
  while ($row=mysqli_fetch_row($result))
    {
    printf ("%d \n",$row[1]);
    }
  // Free result set
  mysqli_free_result($result);
 
 
 $id = $_GET["id"];
 $mux = $_GET["mux"];
 $res = $_GET["res"];
 $temp = $_GET["temp"];
 
 mysqli_close($connection);
?>
