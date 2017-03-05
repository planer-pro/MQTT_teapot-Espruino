//Button check---------------------------------------------------
var buttChange = false;
var buttState = 0;

setWatch(function (e) {
    var time = e.time - e.lastTime;
    if (time < 0.5)
        buttState = 1;
    else if (time >= 0.5 && time < 1.5)
        buttState = 2;
    else
        buttState = 3;
    //console.log(buttState);
    buttChange = true;
}, 0, {repeat: true, edge: 'rising', debounce: 50});

//18b20 temperature check----------------------------------------
var ow = new OneWire(4);
var sensor = require("DS18B20").connect(ow);

var targetBoilTemp = 100;
var targetHoldTemp = 70;
var currentTemp;
var oldTemp;
var tempChange = false;

setInterval(function () {
    sensor.getTemp(function (currentTemp) {
        if (currentTemp != oldTemp){
            tempChange = true;
            oldTemp = currentTemp;
            console.log(currentTemp);
        }
        //mqtt.publish(topic, "Temp is " + temp + "°C");
    });
}, 1000);