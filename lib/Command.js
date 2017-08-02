/*!
 * spike: a node.js reverse proxy
 * Copyright(c) 2017 Silas Yang <i@silas.hk>
 * MIT Licensed
 */

'use strict'

const NET = require("net");
const EventEmitter = require("events");

const CmdSocket = require("./CommandSocket");

class Command extends EventEmitter {
    /**
     * Create a Command Handler
     * 
     * @param {net.Socket} socket 
     * 
     * @author Silas <i@silas.hk>
     */
    constructor(command_socket = null) {
        super();
        if (command_socket == null) {
            throw "Need a command_socket";
        }
        this.cmd_socket = new CmdSocket(command_socket);
        this.cmd_socket.on("message", onMessage.bind(this));
    }

    sendCommand(command, meta_data){
        this.cmd_socket.send({cmd: command, meta_data, meta_data});
    }
    /**
     * Send new connection command
     * 
     * @param {String} host 
     * @param {Number} port 
     * @param {Object} meta_data 
     * 
     * @author Silas <i@silas.hk>
     */
    newConnection(meta_data = {}) {
        console.log("send a new connection comand");
        this.cmd_socket.send({ cmd: "new connection", meta_data: meta_data });
    }

}

module.exports = Command;

function onMessage(msg_obj) {
    console.log("Received Package: ");
    console.log(msg_obj);
    if(typeof(msg_obj.cmd) == "undefined"){
        throw "Undefined Command.";
    }
    this.emit(msg_obj.cmd);
}