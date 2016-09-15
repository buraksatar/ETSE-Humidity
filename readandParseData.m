delete(instrfindall);
clc;
clear all;
module = serial('COM15','BaudRate',115200,'DataBits',8);
fopen(module)

x = 0;

while x<3
    x=x+1
    a = fscanf(module)
    B = textscan(a,'%s',5,'Delimiter',' ')
    
    B{:}
    
    %fstring = fileread('test.txt'); % read the file as one string
    %fblocks = regexp(fstring,'[A-Za-z]','split'); % uses any single character as a separator
    %fblocks(1) = []; % removes anything before the first character
    %out = cell(size(fblocks));
    
    %for k = 1:numel(fblocks)
    %   out{k} = textscan(fblocks{k},'%f %f','delimiter',' ','MultipleDelimsAsOne', 1);
    %   out{k} = horzcat(out{k}{:});
end
    
    %y1(x)=fscanf(module, '%d')
    %drawnow
    %plot(y1,'r--','linewidth',3)
    %grid on
    %hold on
    %title('Reading data from module')
    %xlabel('dsfs')
    %ylabel('fsdgdsfsfdsfs')
    %pause(0.1)

fclose(module)
delete(module)
clear module
