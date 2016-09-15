% Reading data from module
s1 = serial('COM15','BaudRate',115200,'DataBits',8);
fopen(s1)

while 1
    fscanf(s1)
end
    fclose(s1)
delete(s1)
clear s1
