local module = {}

module.SSID = {}  
module.SSID["gpdswpa"] = "puercoespin"

module.HOST = "test.mosquitto.org"  
module.PORT = 1883  
module.ID = node.chipid()

module.ENDPOINTtemp = "/data/temp"
module.ENDPOINTres = "/data/res"
module.ENDPOINTadc = "/data/adc" 
module.ENDPOINTmux = "/data/mux"
    
return module  
