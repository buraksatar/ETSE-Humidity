<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>Moisture Material</title>
</head>


<script>
function getCalculate(a,b,c,x)
 {
     var result1 = a * (Math.pow(x, b)) + c;
     var result2 = result1.toPrecision(5);
     return result2;
 }
   
function calculateTotal()
{    
    //display the result
    var divobj = document.getElementById('totalPrice');
    divobj.style.display='block';
    
    if (getResult() == 1){
        divobj.innerHTML = "No material selected! Please select one! ";
    }   
    else{
        divobj.innerHTML = getResult();
    }   
}

function myFunction() {

	var divobj = document.getElementById('totalPrice');
    divobj.style.display='block';
	var e = document.getElementById("materialList");
	var strUser = e.options[e.selectedIndex].value;
	
	if ( strUser == "Material1" ){
	    var x = document.forms["idForm"].elements["idList"].value;
	    divobj.innerHTML = getCalculate(15.84,-0.2576,8.923,x);	
	}
	else if ( strUser == "Material2" ){
		var x = document.forms["idForm"].elements["idList"].value;
		divobj.innerHTML = getCalculate(13.2,-0.2515,10.77,x);
	}
	else if ( strUser == "Material3" ){
		var x = document.forms["idForm"].elements["idList"].value;
		divobj.innerHTML = getCalculate(17.06,-0.2832,10.64,x);
	}
	else if ( strUser == "Material4" ){
		var x = document.forms["idForm"].elements["idList"].value;
		divobj.innerHTML = getCalculate(11.57,-0.2447,9.538,x);
	}
	else if ( strUser == "Material5" ){
		var x = document.forms["idForm"].elements["idList"].value;
		divobj.innerHTML = getCalculate(13.07,-0.2664,7.812,x);
	}
	else if ( strUser == "Material6" ){
		var x = document.forms["idForm"].elements["idList"].value;
		divobj.innerHTML = getCalculate(11.34,-0.2485,7.965,x);
	}
	else if ( strUser == "Material7" ){
		var x = document.forms["idForm"].elements["idList"].value;
		divobj.innerHTML = getCalculate(10.03,-0.3146,12.35,x);
	}
	else if ( strUser == "Material8" ){
		var x = document.forms["idForm"].elements["idList"].value;
		divobj.innerHTML = getCalculate(14.62,-0.2774,11.5,x);
	}
	else if ( strUser == "Material9" ){
		var x = document.forms["idForm"].elements["idList"].value;
		divobj.innerHTML = getCalculate(13.69,-0.2404,8.352,x);
	}
	else {
		divobj.innerHTML = "PROBLEM!!!";
	}
}
</script>



<meta charset='UTF-8'> 
<meta name='viewport' content='width=device-width', initial-scale=1.0></head>
<body>
<button onclick="myFunction()">Show The Result</button>

<form id="idForm">
  ID number: <input id="idList" type="number" value=""><br>
</form>

<form id="materialform">
    
       <select id="materialList" name='filling' onchange="calculateTotal()">
           <option value="None">Select Material</option>
           <option value="Material1">Material 1</option>
           <option value="Material2">Material 2</option>
           <option value="Material3">Material 3</option>
		   <option value="Material4">Material 4</option>
		   <option value="Material5">Material 5</option>
		   <option value="Material6">Material 6</option>
		   <option value="Material7">Material 7</option>
		   <option value="Material8">Material 8</option>
		   <option value="Material9">Material 9</option>
        </select>
        <br/><br/>

        <div id="totalPrice"></div>
        <output name="totalamount" ></output>

</form><br/>
  
</body>
</html>
