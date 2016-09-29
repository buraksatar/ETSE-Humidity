<?php
	$Temp=$_GET["r"];
	/*$Write="<p>Temperature: ". $Temp "</p>";
	file_put_contents('deneme.htm',$Write);*/
	$fileContent = "R is ".$Temp." \n";
	$fileStatus = file_put_contents('myFile.txt',$fileContent,FILE_APPEND);
	if($fileStatus != false)
	{
		echo "success: data written to file";
	}
	else
	{
		echo "FAIL: could not write to file";
	} 
?>
