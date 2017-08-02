'use strict'

const Client = require("./lib/Client");
if(process.argv.length < 4){
    console.log("usage: node client <Server Host> <Local Port>");
    return;
}
var cmd_host = process.argv[2];
var internal_port = process.argv[3];
var client = new Client(cmd_host, 55335, "localhost", internal_port);