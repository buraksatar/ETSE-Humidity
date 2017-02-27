#!/bin/sh
echo "Start service humiditySystem"
cd /home/labserver/humiditySystem
sudo forever start serverLab.js
