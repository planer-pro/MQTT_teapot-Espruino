//WEBSERVER---------------------------------------------------------

function onPageRequest(req, res) {
 res.writeHead(200, {'Content-Type':'text/html'});
 res.write('Hello Planer');
 res.end('');
}

var wifi = require("Wifi");

function startServer(){
   console.log("server started");
   require("http").createServer(onPageRequest).listen(8080);
   console.log("APIp="+wifi.getAPIP().ip);
   console.log("StationIP="+wifi.getIP().ip);
}

wifi.on('connected', startServer);

//------------------------------------------------------------------
//MQTT_controller HARD WEIGHT---------------------------------------
var server = "m13.cloudmqtt.com";
var options = {
    client_id : "test_machine",
    keep_alive: 60,
    port: 16208,
    clean_session: true,
    username: "wijmvjfu",
    password: "QZsB6Hs25p8d",
    protocol_name: "MQTT",
    protocol_level: 4,
  };
var mqtt = require("MQTT").create(server, options /*optional*/);

mqtt.connect();

mqtt.on('connected', function() {
  mqtt.subscribe("test");
});

mqtt.on('publish', function (pub) {
  console.log("topic: "+pub.topic);
  console.log("message: "+pub.message);
});

var topic = "test";
var message = 1;
setInterval('mqtt.publish(topic, message++);', 2000);
//-----------------------------------------------------------------
//MQTT_controller Light WEIGHT-------------------------------------
var mqtt = require("https://github.com/olliephillips/tinyMQTT/blob/master/tinyMQTT.min.js").create("m13.cloudmqtt.com", {
    username: "wijmvjfu",
    password: "QZsB6Hs25p8d",
    port: 16208
});

var wifi = require("Wifi");

mqtt.on("connected", function(){
    mqtt.subscribe("test");
});

mqtt.on("message", function(msg){
    //console.log(msg.topic);
    console.log(msg.message);
});

mqtt.on("published", function(){
    console.log("message sent");
});

mqtt.on("disconnected", function(){
    console.log("disconnected");
    mqtt.connect();
});

var topic = "test";
var message = 0;

wifi.on('connected', function(){
    mqtt.connect();
    setInterval('mqtt.publish(topic, ""+message++);', 2000);
});
//-----------------------------------------------------------------
//Sample temp------------------------------------------------------
var mqtt = require("https://github.com/olliephillips/tinyMQTT/blob/master/tinyMQTT.min.js").create("m13.cloudmqtt.com", {
    username: "wijmvjfu",
    password: "QZsB6Hs25p8d",
    port: 16208
});

var wifi = require("Wifi");

var reconnect=0;

function doReconnect(){
    reconnect++;
    if (reconnect==2){
    console.log("no MQTT connection");
    mqtt.connect();
    console.log("restart MQTT connection");
    reconnect = 0;
    }
}

mqtt.on("connected", function(){
    mqtt.cl.on('end', doReconnect);
    mqtt.subscribe("test");
});

mqtt.on("message", function(msg){
    //console.log(msg.topic);
    console.log(msg.message);
});

/*mqtt.on("published", function(){
    console.log("message sent");
});*/

/*mqtt.on("disconnected", function(){
    console.log("Disconnected from MQTT server");
    mqtt.connect();
    console.log("Restart MQTT server");
});*/

var topic = "test";
var message = 0;

wifi.on('connected', function(){
    mqtt.connect();
    console.log("connected to MQTT brocker");
    setInterval('mqtt.publish(topic, ""+message++);', 2000);
});
//-----------------------------------------------------------
//Button presed simple---------------------------------------
setWatch(function(e) {
  //console.log("Button pressed");
  mqtt.publish(topic, "Button pressed");
}, 0, { repeat: true, edge: 'falling', debounce: 50 });
//-----------------------------------------------------------
//Button presed advance--------------------------------------
function AnalyseButt() {
    setWatch(function (e) {
        var time = e.time - e.lastTime;
        if (time < 0.5)
            console.log("Short");
        else if (time >= 0.5 && time < 1.5)
            console.log("Middle");
        else
            console.log("Long");
    }, 0, {repeat: true, edge: 'rising', debounce: 50});
}

AnalyseButt();
//-----------------------------------------------------------
//18B20 Sensor-----------------------------------------------
var ow = new OneWire(4);
var sensor = require("DS18B20").connect(ow);

setInterval(function() {
    sensor.getTemp(function (temp) {
    mqtt.publish(topic, "Temp is "+temp+"°C");
    });
    }, 1000);
//-----------------------------------------------------------
//Water Sensor-----------------------------------------------
setInterval(function() {
  var waterLevel = digitalRead([13,12,14]);
  if(waterLevel === 0){
    console.log("Full tank");
  }
  else if(waterLevel == 1){
    console.log("Medium water");
  }
  else if(waterLevel == 3){
    console.log("Low water");
  }
  else if(waterLevel == 7){
    console.log("warning NO water!");
  }
  else console.log("clear sensors");
}, 250);
//-----------------------------------------------------------
//All_Temp---------------------------------------------------
var mqtt = require("https://github.com/olliephillips/tinyMQTT/blob/master/tinyMQTT.min.js").create("m13.cloudmqtt.com", {
    username: "wijmvjfu",
    password: "QZsB6Hs25p8d",
    port: 16208
});

var wifi = require("Wifi");

mqtt.on("connected", function(){
    mqtt.subscribe("test");
});

mqtt.on("message", function(msg){
    //console.log(msg.topic);
    console.log(msg.message);
});

/*mqtt.on("published", function(){
    console.log("message sent");
});*/

mqtt.on("disconnected", function(){
    console.log("Disconnected from MQTT server");
    mqtt.connect();
    console.log("Restart MQTT server");
});

var topic = "test";
var message = 0;

var ow = new OneWire(4);
var sensor = require("DS18B20").connect(ow);

wifi.on('connected', function(){
    mqtt.connect();
    console.log("connected to MQTT brocker");

    setInterval('mqtt.publish(topic, ""+message++);', 5000);

    setInterval(function() {
    sensor.getTemp(function (temp) {
    mqtt.publish(topic, "Temp is "+temp+"°C");
    });
    }, 1000);
});

setWatch(function(e) {
  mqtt.publish(topic, "Button pressed");
}, 0, { repeat: true, edge: 'falling', debounce: 50 });
//---------------------------------------------------------
