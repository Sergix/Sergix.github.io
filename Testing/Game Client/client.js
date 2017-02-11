var output = document.getElementById("output");

var websocket = new WebSocket("ws://192.168.1.104:1234");

output.innerHTML = "Connecting...";

websocket.onopen = function (e) {
    output.innerHTML += "<p>CONNECTION OPENED</p>";
};

websocket.onclose = function (e) {
    output.innerHTML += "<p>CONNECTION CLOSED</p>";
}; 

websocket.onmessage = function (e) {
    output.innerHTML += "<p>" + e.data + "</p>";
};

websocket.onerror = function (e) {
    output.innerHTML += "<p>ERROR:" + e.data + "</p>";
};