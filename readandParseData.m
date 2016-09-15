delete(instrfindall);
clc;
clear all;
module = serial('COM15','BaudRate',115200,'DataBits',8);
fopen(module)

x = 0;

while x<5
    x=x+1
    a = fscanf(module)
    filteredData = textscan(a,'%s %d %s %d %s',5,'Delimiter',' ')
       
    y(x) = filteredData{2}    
    tf = strjoin(filteredData{5})   
    tf = tf(3:end)
    resistorData = str2num(tf)
    
    drawnow
    plot(y,'--')
    grid on
    title('Reading data from module')
    xlabel('Time')
    ylabel('Data from ADC')
    pause(0.1)  
    
end
    
fclose(module)
delete(module)
clear module
