    var server = "server";
    var options = {
        client_id : "test_machine",
        keep_alive: 60,
        port: 12345,
        clean_session: true,
        username: "user",
        password: "password",
        protocol_name: "MQTT",
        protocol_level: 4,
      };

var wifi = require("Wifi");
var mqtt = require("MQTT").create(server, options);

wifi.on('connected', function(details) {
  mqtt.connect();
});


mqtt.on('connected', function() {
      mqtt.subscribe("test");
    });

mqtt.on('disconnected', function() {
      mqtt.connect();
    });

var topic = "test";
var message = 1;

mqtt.on('publish', function (pub) {
      console.log("topic: "+pub.topic);
      console.log("message: "+pub.message);
    });

setInterval('mqtt.publish(topic, message++);', 2000);