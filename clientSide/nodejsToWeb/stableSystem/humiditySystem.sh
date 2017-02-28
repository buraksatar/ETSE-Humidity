#!/bin/sh
echo "Starting The Humidity System"
cd /home/labserver/humiditySystem
sudo forever start serverLab.js
sleep 1
sudo service mosquitto stop
sleep 2
sudo service mosquitto start
echo "Designed for ETSE Valencia by Burak Satar"

# installed in /etc/init.d/
