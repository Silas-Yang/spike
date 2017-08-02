'use strict';

const NET = require("net");
const Cmd_Socket = require("./CommandSocket");
const DataSocketPair = require("./DataSocketPair");

class Server {
    /**
     * Create a Server instance
     * 
     * @author Silas <i@silas.hk>
     * @param {Number} external_port 
     * @param {Number} cmd_port 
     * @param {String} host 
     */
    constructor(external_port = 80, cmd_port = 8123, host = "0.0.0.0") {
        var self = this;
        this.cmd = null;

        /********************************************
         ** Create a Command Server for Proxy User **
         ********************************************/
        this._cmd_server = new NET.Server();
        this._cmd_server.listen({ port: cmd_port, host: host });
        this._cmd_server.on("connection", initCmdServer.bind(this));

        /*********************************
         ** Create a Server for Clients **
         *********************************/
        this._external_server = new NET.Server();
        this._external_server.listen({ port: external_port, host: host });
        this._external_server.on("connection", initConnection.bind(this));
    }
}

module.exports = Server;

/*!
 * spike: a node.js reverse proxy
 * Copyright(c) 2017 Silas Yang <i@silas.hk>
 * MIT Licensed
 */

function initCmdServer(socket) {
    this.cmd = new Cmd_Socket(socket);
}

var internal_connections = [];
function initConnection(external_socket) {
    if (this.cmd == null) {
        console.log("The proxy client is not ready.");
        external_socket.end();
        return;
    }

    var internal_connection = new NET.Server();
    internal_connections.push(internal_connection);
    var self = this;
    internal_connection.listen({ port: 0, host: "0.0.0.0" }, function () {
        var addr = this.address();
        self.cmd.sendCommand("new connection", { port: addr.port });
    });

    internal_connection.on("connection", (socket) => {
        var socket_pair = new DataSocketPair(external_socket, socket);
    });
}