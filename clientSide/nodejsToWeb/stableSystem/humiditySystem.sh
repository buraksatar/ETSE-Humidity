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
# to make the script executable write this
# sudo chmod humiditySystem.sh
#
# and to make it auto-start with every start
# sudo update-rc.d humiditySystem.sh defaults
