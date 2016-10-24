var chartData;

$(function(){
  $.ajax({

    url: 'http://localhost:8080/deneme',
    type: 'GET',
    success : function(data) {

    	console.log(data);
      	var data = {
		labels: idData,
  		series: [tempAdc]
	};

	var options = {
  		
		
	};

	axisX: {
    		type: Chartist.AutoScaleAxis
  	}
	axisY: {
    		type: Chartist.AutoScaleAxis
  	}

      	var lineChart = new Chartist.Line('#chart-location', data, options);


      lineChart.render();
     }


  });
});
