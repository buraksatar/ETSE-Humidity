- mqtt2sql.js :
	Gets data from MQTT broker and write them on MYSQL database, 
	in real time.

- sql2web.js : 
	Gets data from MYSQL database and show them in ExpressJS as a frontend,
	in static.That means, showing the all data until the time script&server just started.

- sql2webRealtime.js :
	It is a mix of those two. But there is a problem with realtiming. Second part doesnt work properly.

- realtimeAjax.js :
	Gets data from MQTT and show them in ExpressJS as a fronted,
	in realtime. 
	However, it doesn write the datas to database.
	First action: Gets all data from database and draw it,
	Second action : depending realtime data continue to draw.  
