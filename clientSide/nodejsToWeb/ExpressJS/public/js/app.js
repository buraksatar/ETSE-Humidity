var chartData;

$(function(){
  $.ajax({

    url: 'http://localhost:8080/deneme',
    type: 'GET',
    success : function(data) {
      chartData = data;

      var data = {
  		labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  		series: [
    		[5, 2, 4, 2, 0]
  		]
		};

      var lineChart = new Chartist.Line('#chart-location', data);
      lineChart.render();
    }
  });
});
