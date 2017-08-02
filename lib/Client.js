/*!
 * spike: a node.js reverse proxy
 * Copyright(c) 2017 Silas Yang <i@silas.hk>
 * MIT Licensed
 */

'use strict'

const NET = require('net');

const Cmd_Socket = require("./CommandSocket");
const DataSocketPair = require("./DataSocketPair");

class Client {
    /**
     * Create a Client
     * 
     * @author Silas <i@silas.hk>
     * @param {String} host 
     * @param {Number} port 
     */
    constructor(cmd_host = null, cmd_port = null, internal_host = "localhost", internal_port = 8000) {
        if (cmd_host == null || cmd_port == null) {
            throw "Need remote host and port";
        }

        this._message = "";
        this.cmd = null;
        this.cmd_host = cmd_host;
        this.cmd_port = cmd_port;
        this.internal_host = internal_host;
        this.internal_port = internal_port;

        initCommandConnection.call(this, cmd_host, cmd_port);
    }

}

module.exports = Client;

function initCommandConnection(cmd_host, cmd_port) {
    var cmd_socket = new NET.Socket();
    cmd_socket.connect(cmd_port, cmd_host, () => {
        console.log("Connected to the server.");
    });
    cmd_socket.on("error", function (err) {
        throw err;
    });
    console.log("init command connection")
    this.cmd = new Cmd_Socket(cmd_socket);
    this.cmd.on("new connection", cmdNewConnection.bind(this));
    this.cmd.on("socket data", function (msg) {
        console.log(msg.data);
    })
}

function cmdNewConnection(msg) {
    console.log("Client received new connection command: ");
    console.log(msg);
    var external_socket = new NET.Socket();
    var internal_socket = null;
    var external_message = [];
    external_socket.connect(msg.port, this.cmd_host, () => {
        console.log("reverse connection completed");
        internal_socket = new NET.Socket();
        internal_socket.connect(this.internal_port, this.internal_host, ()=>{
            var socket_pair = new DataSocketPair(external_socket, internal_socket);
        });
    });
}