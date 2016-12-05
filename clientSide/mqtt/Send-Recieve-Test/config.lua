local module = {}

module.SSID = {}  
module.SSID["gpdswpa"] = "puercoespin"

module.HOST = "test.mosquitto.org"  
module.PORT = 1883  
module.ID = node.chipid()
print ("Module ID "..node.chipid())
       

module.ENDPOINTtemp = "/data/"..node.chipid()
    
return module  
