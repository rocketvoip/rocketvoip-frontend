var express = require('express'),
    app = express();
    
var replace = require("replace");
var backendURL   = process.env.BACKEND_URL || "https://localhost:8080";
console.log("Backend URL: " + backendURL);

replace({
    regex: "http://localhost:8080",
    replacement: backendURL,
    paths: ['app/app.js'],
    silent: true
});

app.use(express.static(__dirname));
app.get('/', function(req, res) {
    res.sendfile('index.html', {root: __dirname })
});
var server = app.listen(process.env.PORT || 5000);