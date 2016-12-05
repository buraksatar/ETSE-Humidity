This is for configuration 

1- open the config file
```
$ sudo leafpad /etc/mosquitto/mosquitto.conf
```
2- on that file, delete that line  
```
$ include_dir /etc/mosquitto/mosquitto.conf
```
3- add those lines
```
$ allow_anonymous false
$ password_file /etc/mosquitto/pwfile
$ listener 1883
```
4- close and exit. After to add username and password:
```
$ sudo mosquitto_passwd -c /etc/mosquitto/pwfile burak
```
it will require password, type password 2 times.

5- After all for testing

subscribe with that code
```
$ sudo mosquitto_sub -u burak -P hadibakalim -h localhost -t "mqtt" -v
```
and publish with that code 
```
$ sudo mosquitto_pub -u burak -P hadibakalim -h localhost -t "mqtt" -m "Hello MQTT"
```
Resource : https://www.youtube.com/watch?v=AsDHEDbyLfg
