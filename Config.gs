//Ambient Weather Application Key
var applicationKey = "0000000000000000000000000000000000000000000000000000000000000000";

// Ambient Weather API Key
var apiKey = "0000000000000000000000000000000000000000000000000000000000000000"  

// Ambient Weather API URL
var url = 'https://api.ambientweather.net/v1/devices?applicationKey='+applicationKey+'&apiKey='+apiKey;

// Email address used to message the temperature switch
var emailAddress = "xxxxxxxxx@xxxxxxxxx.com"; 

// Labels for all Temperature Sensors; determines the amount of sensors
var sensorLabels = ["Living","Outdoor","Bedroom","Attic","Attic2","Kids","Crawlspace", "Kitchen"];

// Index of the indoor sensor used to detect temperature switch
var indexIndoorSensor=2;

// Index of the outdoor sensor used to detect temperature switch
var indexOutdoorSensor=1;

// If thresholdTemp is set, indoor temp needs to be above thresholdTemp to trigger a message.
var thresholdTemp=0;  



