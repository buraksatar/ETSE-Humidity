local module = {}

module.SSID = {}  
module.SSID["gpdswpa"] = "puercoespin"

module.HOST = "147.156.81.149"  
module.PORT = 1883
module.USERNAME = "burak"
module.PASSWORD = "hadibakalim"  
module.ID = node.chipid()
print ("Module ID "..node.chipid())
       

module.ENDPOINTtemp = "/data/"..node.chipid()
    
return module  
