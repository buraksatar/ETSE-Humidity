DEVICE_ID  = 1
ADS_10000_addr = 0x49
LM75_addr = 0x4F
en = 2
sda = 4
scl = 3
muxa = 7
muxb = 6
muxc = 5

server_response="";

print("Init sequence starting");
cfg={}
cfg.ssid="humidcheck"
cfg.pwd="12345678"
wifi.ap.config(cfg)
wifi.setmode(wifi.SOFTAP)
print ("ESP mode "..wifi.getmode())
dhcp_config ={}
dhcp_config.start = "192.168.1.100"
wifi.ap.dhcp.config(dhcp_config)
wifi.ap.dhcp.start()
tmr.delay(1000);
ip = wifi.ap.getip()
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
------------------------------

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

-------------------------------------
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
    
    print ("ADC "..currMeasure.." MUX "..currMUX.." R="..adc2r(currMeasure,currMUX))
    if (currMeasure<minMval and currMUX<6) then
        currMUX=currMUX+1
        mux(currMUX)
    elseif currMeasure>maxMval and currMUX>0 then
        currMUX=currMUX-1
        mux(currMUX)
    end
end

    
tmr.register(0, 2000, tmr.ALARM_AUTO, makeMeasure)
tmr.start(0);

--Web UI
--function sendreport(adc,mux,stable)
--    r=adc2r(adc,mux)
--    server_response="<body><div class=\"wrap\">";
 --   server_response=server_response.."<p>R="..r.."</p>";
--    server_response=server_response.."<p>ADC="..adc.."</p>";
 --   server_response=server_response.."<p>Stability "..stable.."</p><p>ID "..DEVICE_ID.."</p>";
 --   server_response=server_response.."<body>"
--end

if srv~=nil then
  srv:close()
end

srv=net.createServer(net.TCP)
srv:listen(80,function(conn)
    conn:on("receive", function(client,request)
--    sendreport(currMeasure,currMUX,0)
    t=measureTemp()
    denemeVar=t/10
        local buf = "";
        buf = buf.."<!DOCTYPE html> <html><head> <style> table {border: 2px solid black; border-collapse: collapse; width:80%; }"
        buf = buf.."th { background-color: black; color: white; border: 2px solid black; padding: 10px; }"
        buf = buf.."td { border: 2px solid black;  padding: 15px; text-align: center; } td {border: 2px solid black; padding: 15px; text-align: center;}"
        buf = buf.."tr:nth-child(even) { background-color: #eee; } </style> <meta charset=UTF-8>"
        buf = buf.."<meta name=viewport content=width=device-width, initial-scale=1.0></head>"
        buf = buf.."<body> <form action= name=materialform id=materialform onsubmit=return false;>"
        buf = buf.."<article> <div class=city> <table align=center> <tr> <th>Data Type</th> <th>Value</th> </tr> <tr>"
        buf = buf.."<td>Temperature</td> <td>255</td>  </tr> <tr> <td>ADC</td>  <td>4543</td> </tr>  <tr><td>R</td> <td>1</td> </tr>  "
        buf = buf.."<tr><td> Moisture <select id=materialList name=filling onchange=totalamount.value = filling.value>"
        buf = buf.."<option value=None selected>Select Material</option> <option value=15.84 * x^-0.2576 + 8.923>Material 1</option>"
        buf = buf.."<option value=13.20 * x^-0.2515 + 10.77>Material 2</option> <option value=17.06 * x^-0.2832 + 10.64>Material 3</option>"
        buf = buf.."<option value=11.57 * x^-0.2447 + 9.538>Material 4</option> <option value=13.07 * x^-0.2664 + 7.812>Material 5</option> "        
        buf = buf.."<option value=11.34 * x^-0.2485 + 7.965>Material 6</option> <option value=10.03 * x^-0.3146 + 12.35>Material 7</option>"
        buf = buf.."<option value=14.62 * x^-0.2774 + 11.50>Material 8</option> <option value=13.69 * x^-0.2404 + 8.352>Material 9</option>"
        buf = buf.."</select></td><td><output name=totalamount id=totalamount for=principal period interest></output></td>"
        buf = buf.."</tr></table></div><footer><h1></h1><p>29.09.2016</p></footer></article></form></body></html>"

        
        client:send(buf..server_response);
       -- client:send(server_response);
        client:close();
        collectgarbage();
    end)
end)
