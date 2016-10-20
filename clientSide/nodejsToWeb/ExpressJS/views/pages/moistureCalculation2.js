<!-- views/pages/about.ejs -->

<!DOCTYPE html>
<html lang="en">
<head>
    
    <% include ../partials/head %>
</head>

<style>
table{
    border: 1px solid black;
    border-collapse: collapse;
    }
th {
    background-color: black;
    color: white; 
    border: 1px solid black; 
    padding: 25px;
}
td { 
    border: 1px solid black; 
    padding: 7px; 
    text-align: center;
} 
    tr:nth-child(even) { 
    background-color: #eee;
}
.wrapper {
    text-align: center;
}
.button {
    position: auto;
    top: 100%;
}
p {
  white-space: pre;
 }
</style>

<meta charset='UTF-8'> 
<meta name='viewport' content='width=device-width', initial-scale=1.0></head>


<body class="container", onload=generate_table() >

    <header>
        <% include ../partials/header %>
    </header>

   <button onclick="myFunction()">Show The Result</button>

   <form id="idForm">
   	ID number: <input id="idList" type="number" value=""><br>
   </form>

   <form id="materialform2">
    
       <select id="materialList2" name='filling' onchange="calculateTotal2()">
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

   </form>

   <form action="" id="materialform" onsubmit="return false;">
                <select id="materialList" name='filling' onchange="calculateTotal()">
                <option value="None">Select The Sensor</option>
                <option value="Sensor1">Sensor 1</option>
		<option value="Sensor2">Sensor 2</option>
                <option value="Sensor3">Sensor 3</option>
                </select>            
    </form>

    <div id="totalPrice"></div>

<script>

	var calcuRes = [];
        	<%for(var i=0;i < tagId1.length; i++){ %>
     			calcuRes.push(<%=tagRes1[i]%>);
        	<% } %>

	function getCalculate(a,b,c,x){
 		var result1 = a * (Math.pow(x, b)) + c;
     		var result2 = result1.toPrecision(5);
     		return result2;
	}
   
	function calculateTotal2(){    
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
		var e = document.getElementById("materialList2");
		var strUser = e.options[e.selectedIndex].value;
	
		if ( strUser == "Material1" ){
	    		var x = document.forms["idForm"].elements["idList"].value;
	    		divobj.innerHTML = getCalculate(15.84,-0.2576,8.923,calcuRes[x]);
			//divobj.innerHTML = "gdgfdgdf!!!";
	
		}
		else if ( strUser == "Material2" ){
			var x = document.forms["idForm"].elements["idList"].value;
			divobj.innerHTML = getCalculate(13.2,-0.2515,10.77,x);
		}
		else if ( strUser == "Material3" ){
			var x = document.forms["idForm"].elements["idList"].value;
			divobj.innerHTML = getCalculate(17.06,-0.2832,10.64,x);
		}
		else {
			divobj.innerHTML = "PROBLEM!!!";
		}
	}

</script>   

<script>
	 var filling_material= new Array();
		filling_material["None"]= 0;
		filling_material["Sensor1"]= 1;
		filling_material["Sensor2"]= 2;
		filling_material["Sensor3"]= 3;
 
	function getResult()
	{
    		var moistureResult=0;
    		var theForm = document.forms["materialform"];
     		var selectedFilling = theForm.elements["materialList"];
     
    		moistureResult = filling_material[selectedFilling.value];

    		return moistureResult;
	}
   
	function calculateTotal()
	{    
    		if (getResult() == 1){
			window.location.href = '/sensor1'
    		}	
		else if (getResult() == 2){
			window.location.href = '/sensor2'
    		}	
    		else if (getResult() == 3){
			window.location.href = '/sensor3'
    		}  
	}
</script>

<script>

	function generate_table() {
		// get the reference for the body
  		var body = document.getElementsByTagName("body")[0];
  		var idData = [];
        	<%for(var i=0;i < tagId1.length; i++){ %>
     			idData.push(<%=tagId1[i]%>);
        	<% } %>

        	var tempData = [];
        	<%for(var i=0;i < tagId1.length; i++){ %>
     			tempData.push(<%=tagTemp1[i]%>);
        	<% } %>

		var tempAdc = [];
        	<%for(var i=0;i < tagId1.length; i++){ %>
     			tempAdc.push(<%=tagAdc1[i]%>);
        	<% } %>

		var tempRes = [];
        	<%for(var i=0;i < tagId1.length; i++){ %>
     			tempRes.push(<%=tagRes1[i]%>);
        	<% } %>

		var tempMux = [];
        	<%for(var i=0;i < tagId1.length; i++){ %>
     			tempMux.push(<%=tagMux1[i]%>);
        	<% } %>

 		// creates a <table> element and a <tbody> element
  		var tbl     = document.createElement("table");
  		var tblBody = document.createElement("tbody");
 	
		var row1 = document.createElement("tr");
		var TH1 = document.createElement("th");
     		var th1 = document.createTextNode("ID");
    		TH1.appendChild(th1);
		row1.appendChild(TH1)
		tblBody.appendChild(row1)

		var TH2 = document.createElement("th");
     		var th2 = document.createTextNode("Temperature");
    		TH2.appendChild(th2);
		row1.appendChild(TH2)
		tblBody.appendChild(row1)

		var TH3 = document.createElement("th");
     		var th3 = document.createTextNode("ADC");
    		TH3.appendChild(th3);
		row1.appendChild(TH3)
		tblBody.appendChild(row1)

		var TH4 = document.createElement("th");
     		var th4 = document.createTextNode("Resistor");
    		TH4.appendChild(th4);
		row1.appendChild(TH4)
		tblBody.appendChild(row1)

		var TH5 = document.createElement("th");
     		var th5 = document.createTextNode("Mux");
    		TH5.appendChild(th5);
		row1.appendChild(TH5)
		tblBody.appendChild(row1)

		// var TH6 = document.createElement("th");
     		// var th6 = document.createTextNode("Date and Time");
    		// TH6.appendChild(th6);
		// row1.appendChild(TH6)
		// tblBody.appendChild(row1)

  		// creating all cells
  		for(var i=0;i < <%=tagId1.length%>; i++){
    			
			// creates a table row
    			var row = document.createElement("tr");
   		
			for (var j = 0; j < 1; j++) {
      				var cell = document.createElement("td");
      				var cellText = document.createTextNode(idData[i]);
      				cell.appendChild(cellText);
      				row.appendChild(cell);
    			}

			for (var j = 1; j < 2; j++) {
      				var cell = document.createElement("td");
      				var cellText = document.createTextNode(tempData[i]);
      				cell.appendChild(cellText);
      				row.appendChild(cell);
    			}

			for (var j = 2; j < 3; j++) {
      				var cell = document.createElement("td");
      				var cellText = document.createTextNode(tempAdc[i]);
      				cell.appendChild(cellText);
      				row.appendChild(cell);
    			}

			for (var j = 3; j < 4; j++) {
      				var cell = document.createElement("td");
      				var cellText = document.createTextNode(tempRes[i]);
      				cell.appendChild(cellText);
      				row.appendChild(cell);
    			}

			for (var j = 4; j < 5; j++) {
      				var cell = document.createElement("td");
      				var cellText = document.createTextNode(tempMux[i]);
      				cell.appendChild(cellText);
      				row.appendChild(cell);
    			}

			// for (var j = 5; j < 6; j++) {
      				//	var cell = document.createElement("td");
      				//	var cellText = document.createTextNode(tempTim[i]);
      			//	cell.appendChild(cellText);
      			//	row.appendChild(cell);
    			// }
 
    			// add the row to the end of the table body
    			tblBody.appendChild(row);
  		}
 
  		// put the <tbody> in the <table>
  		tbl.appendChild(tblBody);
  		// appends <table> into <body>
  		body.appendChild(tbl);
  		// sets the border attribute of tbl to 2;
  		tbl.setAttribute("border", "2");
	}

</script>

    <footer>
        <% include ../partials/footer %>
    </footer>
    
</body>
</html>
