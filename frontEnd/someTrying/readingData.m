% Reading data from module
% Read until you exit

s1 = serial('COM15','BaudRate',115200,'DataBits',8);

%115200 baudrate for ESP8266

fopen(s1)

while 1
    fscanf(s1)
end
    fclose(s1)
delete(s1)
clear s1
