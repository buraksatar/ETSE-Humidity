This Nodejs code provides to subscribe & publish data to 'test.mosquitto.org' broker

1 - Setup apache server on Ubuntu
```
$ sudo apt-get install apache2 -y
```
2- learn the IP 
```
$ hostname -I
```
3 - Get Socket.IO, Node.js and the MQTT client
```
$ wget http://node-arm.herokuapp.com/node_latest_armhf.deb

$ sudo dpkg -i node_latest_armhf.deb

$ sudo apt-get install npm

$ cd /var/www

$ sudo npm install mqtt

$ sudo npm install socket.io 
```

3- Test Your Node.js and MQTT client creating the file /var/www/mqtt_test.js
```
$ sudo node mqtt_test.js
```
