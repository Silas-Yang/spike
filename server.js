'use strict'

const Server = require("./lib/Server");
if(process.argv.length < 3){
    console.log("usage: node server <Server Port>");
    return;
}
var external_port = process.argv[2];
var server = new Server(external_port, 55335);