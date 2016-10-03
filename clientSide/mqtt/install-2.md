definitely watch this video : https://www.youtube.com/watch?v=AsDHEDbyLfg

1-
$ sudo leafpad /etc/mosquitto/mosquitto.conf

2- on that file, delete the line of $ include_dir /etc/mosquitto/mosquitto.conf

3- add those lines
$ allow_anonymous false
$ password_file /etc/mosquitto/pwfile
$ listener 1883

4- close, exit. after to add username, type:
$ sudo mosquitto_passwd -c /etc/mosquitto/pwfile burak
it will require password, type password 2 times.

After all;
5- to subscribe
$ sudo mosquitto_sub -u burak -P hadibakalim -h localhost -t "mqtt" -v

6- to publish
$ sudo mosquitto_pub -u burak -P hadibakalim -h localhost -t "mqtt" -m "Hello MQTT"
