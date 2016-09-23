 function getCalculate(a,b,c)
 {
	 var x = "x";
	 var result1 = a + "*" + x + "^" + b + "+" + c;
	 return result1;
 }
 
 var filling_material= new Array();
	filling_material["None"]= 1;
	filling_material["Material1"]= getCalculate(15.84,-0.2576,8.923);
	filling_material["Material2"]= getCalculate(13.2,-0.2515,10.77);
	filling_material["Material3"]= getCalculate(17.06,-0.2832,10.64);
	filling_material["Material4"]= getCalculate(11.57,-0.2447,9.538);
	filling_material["Material5"]= getCalculate(13.07,-0.2664,7.812);
	filling_material["Material6"]= getCalculate(11.34,-0.2485,7.965);
	filling_material["Material7"]= getCalculate(10.03,-0.3146,12.35);
	filling_material["Material8"]= getCalculate(14.62,-0.2774,11.5);
	filling_material["Material9"]= getCalculate(13.69,-0.2404,8.352);
 
	 
function getResult()
{
    var moistureResult=0;
    //Get a reference to the form id="materialform"
    var theForm = document.forms["materialform"];
    //Get a reference to the select id="materialList"
     var selectedFilling = theForm.elements["materialList"];
     
    moistureResult = filling_material[selectedFilling.value];

    //finally return moistureResult
    return moistureResult;
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
		divobj.innerHTML = "For selected material, f(x) is "+ getResult();
	}
	
    
}

function hideTotal()
{
    var divobj = document.getElementById('totalPrice');
    divobj.style.display='none';
}
