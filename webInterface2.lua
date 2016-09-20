DEVICE_ID  = 1
ADS_10000_addr = 0x49
LM75_addr = 0x4F
en = 2
sda = 4
scl = 3
muxa = 7
muxb = 6
muxc = 5

print("Init sequence starting");
wifi.setmode(wifi.STATION)
reg=wifi.getmode();
print(wifi.STATION)
print("Connecting to gpdswpa...");
wifi.sta.config("gpdswpa", "puercoespin")
tmr.delay(100);
wifi.sta.connect()
tmr.delay(1000);
ip = wifi.sta.getip()
print(ip)
gpio.mode(muxa,gpio.OUTPUT)
gpio.mode(muxb,gpio.OUTPUT)
gpio.mode(muxc,gpio.OUTPUT)
i2c.setup(0, sda, scl, i2c.SLOW)

function read_reg(dev_addr,bytes)
    i2c.start(0)
    i2c.start(0)
    i2c.address(0, dev_addr, i2c.RECEIVER)
    c = i2c.read(0, bytes) -- bytes read and returned
    i2c.stop(0)
    return c
end

function write_reg(dev_addr, reg_addr, val)
    i2c.start(0)
    i2c.address(0, dev_addr, i2c.TRANSMITTER)
    i2c.write(0, val)
    i2c.stop(0)
    return c
end

function setmux(c,b,a)
   gpio.write(muxa,a)
   gpio.write(muxb,b)
   gpio.write(muxc,c)
end

function measureTemp()
    reg = read_reg(LM75_addr,2) --for brd#3
    temp=10*tonumber(string.byte(reg,1))+(tonumber(string.byte(reg,2))/32)
  --  print(string.format("%x %x \r\n", string.byte(reg,1),string.byte(reg,2)))
    print(string.format("Temperature= %d.%d \r\n",temp/10,temp-(temp/10)*10)) 
    return temp
end

function sendreport(adc,mux,stable)
    r=adc2r(adc,mux)
    srv = net.createConnection(net.TCP, 0)
    srv:on("receive", function(sck, c) print(c) end)
    srv:connect(80,"tryhumidty.x10host.com")
    srv:on("connection", function(sck, c)
  -- Wait for connection before sending.
--    sck:send("GET /esppost.php?r="..r.."&a="..adc.."&m="..mux.."&s="..stable.."&id="..DEVICE_ID.." HTTP/1.1\r\nHost: humidcheck.x10host.com\r\nConnection: keep-alive\r\nAccept: */*\r\n\r\n")
--    sck:send("GET /esppost.php?adc="..adc.." HTTP/1.1\r\nHost: tryhumidty.x10host.com\r\nConnection: keep-alive\r\nAccept: */*\r\n\r\n")
  
end)
end

function readADC()
    reg = read_reg(ADS_10000_addr,2) --for brd#3
   -- print("New adc: "..reg)
    result=256*tonumber(string.byte(c,1))+tonumber(string.byte(c,2))
    return result
end
function mux(a)
    if a==0 then setmux(0,0,0)
    elseif a==1 then setmux (0,0,1)
    elseif a==2 then setmux (0,1,0)
    elseif a==3 then setmux (0,1,1)
    elseif a==4 then setmux (1,0,0)  --500 meg
    elseif a==5 then setmux (1,1,1) --1 gig
    elseif a==6 then setmux (1,1,1) --1 gig
    else print("Wrong mux val")
    end
    if a<6 then
        print("PGA OFF")
        write_reg(ADS_10000_addr,0x00,0)
    else
        write_reg(ADS_10000_addr,0x00,2)
        print("PGA ON")
    end
end
-----------
function avgmeasures(measures,numsamples)
    avg=0
    for i=0,(numsamples-1) do
        avg=measures[i]+avg
    end
    avg=avg/numsamples;
    maxdev=math.abs(avg-measures[0])
    for i=1,(numsamples-1) do
        if math.abs(avg-measures[i])>maxdev then 
            maxdev=math.abs(avg-measures[i])
        end
    end
return avg, maxdev
end
-------------------------------------
function adc2r(adc,mux)
    if adc==0 then
        return 99999999
    else      
        if currMUX==0 then r=2350/adc 
        elseif currMUX==1 then r=5000/adc
        elseif currMUX==2 then r=50000/adc
        elseif currMUX==3 then r=500000/adc
        elseif currMUX==4 then r=10*(250000/adc)
        elseif currMUX==5 then r=10*(500000/adc)
        elseif currMUX==6 then r=1000*(20000/adc) -- PGA==4 on
        end
    end
return r   
end           

-------------Here be main measuring setup
setmux(0,0,0)
currMeasure=0
measures={}
measurecounter=0
currMUX=0
minMval=250
maxMval=2100 --mV, assuming upper range of nonlinearity

function makeMeasure()
    currMeasure=readADC()
    currMeasure=currMeasure*5000/2048
    measures[measurecounter]=currMeasure
    measurecounter=measurecounter+1
    if(measurecounter==10) then measurecounter=0 end
    
    print ("ADC "..currMeasure.." MUX "..currMUX.."R="..adc2r(currMeasure,currMUX))
    if (currMeasure<minMval and currMUX<6) then
        currMUX=currMUX+1
        mux(currMUX)
    elseif currMeasure>maxMval and currMUX>0 then
        currMUX=currMUX-1
        mux(currMUX)
    end
end

function cyclicreport()
    avg, maxdev=avgmeasures(measures,10)
    if maxdev>10 then stable=0 else stable=1 end
    sendreport(avg,currMUX,stable)
end

    
tmr.register(0, 2000, tmr.ALARM_AUTO, makeMeasure)
tmr.start(0);
    
tmr.register(1, 20000, tmr.ALARM_AUTO, cyclicreport)
tmr.start(1);

tmr.register(2, 4000, tmr.ALARM_AUTO, measureTemp)
tmr.start(2);

