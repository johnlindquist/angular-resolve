#!/usr/bin/env node

var util = require('util'),
    fs = require('fs'),
    url = require('url'),
    express = require('express')

var DEFAULT_PORT = 3000;

app = express();

var appHelpers = {};
appHelpers.sendFile = function(pathname, res) {
    util.puts('sending: ' + pathname);
    var file = fs.createReadStream(pathname);
    file.on('data', res.write.bind(res));
    file.on('close', function () {
        res.end();
    });
    file.on('error', function (error) {
        util.puts(error);
    })
}

//send anything with a file extension as normal
app.get('*.*', function (req, res) {
    appHelpers.sendFile('.' + req.url, res);
})

//intercept any paths and send "./index.html":
app.get('*', function (req, res) {
    appHelpers.sendFile('./index.html', res);
})

app.listen(DEFAULT_PORT);
console.log('Listening on port: ' + DEFAULT_PORT)