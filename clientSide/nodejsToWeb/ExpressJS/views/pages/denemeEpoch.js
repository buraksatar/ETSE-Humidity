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

	var tempMux = [];
        	<%for(var i=0;i < tagId1.length; i++){ %>
     			tempMux.push(<%=tagMux1[i]%>);
        	<% } %>


	var areaChartData = [
  		// The first layer
  		{
    			label: "Layer 1",
    			values: [ {x: 1, y: 5}, {x: 2, y: 10} ]
  		}

  		// Add as many layers as you would like!
	];

        $(function() {
            $('#area .epoch').epoch({
                 type: 'area',
      	         data: areaChartData
            });
        });
        </script>


</body>
</html>
