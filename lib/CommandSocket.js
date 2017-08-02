/*!
 * spike: a node.js reverse proxy
 * Copyright(c) 2017 Silas Yang <i@silas.hk>
 * MIT Licensed
 */

'use strict'

const NET = require("net");
const EventEmitter = require('events');

class CommandSocket extends EventEmitter {

    /**
     * Create a Socket to send data
     * 
     * @param {net.Socket} socket 
     */
    constructor(socket = null) {
        super();
        if (typeof (socket) == null) {
            throw "undefined socket";
        }
        this._message = "";
        socket.on("data", this._socket_on_data.bind(this));
        this.socket = socket;
        this.on("onCommand", this._onCommand);
    }

    /**
     * Convert object to base64
     * 
     * @param {Object} obj 
     */
    _encode(obj) {
        var string = JSON.stringify(obj);
        return Buffer(string).toString("base64") + "\n";
    }

    /**
     * Convert base64 to Object
     * 
     * @author Silas <i@silas.hk>
     * @param {String} string 
     */
    _decode(string) {
        var obj = Buffer(string, "base64").toString();
        return JSON.parse(obj);
    }

    /**
     * callback for data
     * @param {Buffer} buffer 
     */
    _socket_on_data(buffer) {
        this._message += buffer.toString();
        for(let pos = this._message.indexOf("\n"); pos > -1; pos = this._message.indexOf("\n")){
            var message = this._message.substring(0, pos);
            this._message = this._message.substring(pos + 1);
            this.emit("onCommand", this._decode(message));
        }
    }

    /**
     * Send a Object to socket
     * 
     * @param {Object} obj 
     */
    _send(obj) {
        var str = this._encode(obj);
        this.socket.write(str);
    }

    sendCommand(command = null, meta_data = null){
        this._send({cmd: command, meta_data: meta_data});
    }

    _onCommand(msg_obj){
        console.log("Command Socket Received Package: ");
        console.log(msg_obj);
        if(typeof(msg_obj.cmd) == "undefined"){
            throw "Undefined Command.";
        }
        this.emit(msg_obj.cmd, msg_obj.meta_data);
    }
}

module.exports = CommandSocket;