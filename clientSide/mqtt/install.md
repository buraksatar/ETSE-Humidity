It has to be MQTT libraries on Ubuntu.

Add the mosquitto repository by given below commands

1. Getting the system ready

$ sudo apt-add-repository ppa:mosquitto-dev/mosquitto-ppa
$ sudo apt-get update

2. To Install the library

$sudo apt-get install mosquitto

3. Install Mosquitto developer libraries to develop MQTT clients

$sudo apt-get install libmosquitto-dev

4. Execute the given below command to install Mosquitto client packages

$sudo apt-get install mosquitto-clients

5. Ensure that Mosquitto broker is running

$sudo service mosquitto status 

6. Testing
Open a terminal and issue the given below command to subscribe the topic “mqtt”

$ mosquitto_sub -h localhost -t "mqtt" -v

Open another terminal and issue the given below command to publish message to the topic “mqtt”

$ mosquitto_pub -h localhost -t "mqtt" -m "Hello MQTT"

Now the message “Hello MQTT” will be displayed in the first terminal where the topic “mqtt” is subscribed.

------------------

Also use mqtt-spy to see or publish it
https://kamilfb.github.io/mqtt-spy/
