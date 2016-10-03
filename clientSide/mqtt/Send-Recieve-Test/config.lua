local module = {}

module.SSID = {}  
module.SSID["gpdswpa"] = "puercoespin"

module.HOST = "test.mosquitto.org"  
module.PORT = 1883  
module.ID = node.chipid()

module.ENDPOINT = "/test"  
return module  
