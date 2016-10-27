<!-- views/pages/about.ejs -->

<!DOCTYPE html>
<html lang="en">
<head>
        <link rel="stylesheet" type="text/css" href="https://github.com/epochjs/epoch/blob/master/tests/render/css/tests.css">
        <script src="http://code.jquery.com/jquery-1.10.1.min.js"></script>
        <script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
        <script src="https://cdn.jsdelivr.net/epoch/0.8.4/epoch.min.js"></script>
        <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/epoch/0.8.4/epoch.min.css">
        <style>
        .test .epoch {
            width: 350px;
            height: 350px;
        }
        </style>
    </head>

<meta charset='UTF-8'> 
<meta name='viewport' content='width=device-width', initial-scale=1.0></head>


<body>
        
<div id="area" class="test">
            <div class="epoch"></div>
</div>


<script>
		
	var idData = [];
        	<%for(var i=0;i < tagId1.length; i++){ %>
     			idData.push(<%=tagId1[i]%>);
        	<% } %>
	//var myJsonString = JSON.stringify(idData);
	

	
	

	var tempMux = [];
        	<%for(var i=0;i < tagId1.length; i++){ %>
     			tempMux.push(<%=tagMux1[i]%>);
        	<% } %>

	var lineChartData =  [
  		// The first layer
  		{
    			label: "Layer 1",
    			values: [ 
				]			
  		}
	];


	var pluginArrayArg = new Array();

	console.log(lineChartData[0]);

	for(var i=0;i < 10; i++){ 
			var data = new Object();
    			data.x= idData[i];
    			data.y= tempMux[i];
    			pluginArrayArg.push(data);
			lineChartData[0].values.push(pluginArrayArg[i]);
        	 } 

	/*
	var data = new Object();
    		data.x= idData[0];
    		data.y= tempMux[0];
	
	var data2 = new Object();
    		data2.x= idData[1];
    		data2.y= tempMux[1];

	var pluginArrayArg = new Array();
    		pluginArrayArg.push(data);
		pluginArrayArg.push(data2);
	*/


	//console.log(pluginArrayArg[0]);
	//var jsonArray = JSON.parse(JSON.stringify(pluginArrayArg))

		
	//lineChartData[0].values[0].y = 100;
	//lineChartData[0].values[1].y = tempMux[1];
	/*
	lineChartData[0].values.push(pluginArrayArg[0]);
	lineChartData[0].values.push(pluginArrayArg[1]);
	*/
	//console.log(lineChartData[0].values[1]);


	/* 2
	var lineChartData = [
  		// The first layer
  		{
    			label: "Layer 1",
    			values: [ {x: <%=tagId1[0]%>, y: <%=tagMux1[0]%>}, {x: <%=tagId1[1]%>, y: <%=tagMux1[1]%>} ]
  		}
	];
	*/

        $(function() {
            $('#area .epoch').epoch({
                 type: 'line',
      	         data: lineChartData,
		 axes: ['left', 'bottom'],
		 ticks: { bottom: 2, left: 2 },
		 domain: [0, 10],
		 margins: { top: 50, right: 30, bottom: 100, left: 40 },
		 width: 600,
		 height: 370
            });
        });

</script>


</body>
</html>
