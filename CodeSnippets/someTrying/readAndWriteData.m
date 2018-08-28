delete(instrfindall);
clc;
clear all;
module = serial('COM15','BaudRate',115200,'DataBits',8);
fopen(module)
fileID = fopen('exp.txt','wt');
x = 0;

while x<3
  
    
    x=x+1
    %fread(module)
    
    A = fgets(module);

    %fileID = fopen('exp.txt','wt');
    fprintf(fileID,'%6s\r\n',A);
    
  
    
end

fclose(fileID);
fclose(module)
delete(module)
clear module
