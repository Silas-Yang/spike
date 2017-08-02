/*!
 * spike: a node.js reverse proxy
 * Copyright(c) 2017 Silas Yang <i@silas.hk>
 * MIT Licensed
 */

const NET = require("net");

class DataSocketPair {
    constructor(socketA = null, socketB = null) {
        if (socketA != null) {
            this.socketA = socketA;
        }
        if (socketB != null) {
            this.socketB = socketB;
        }
    }

    set socketA(A) {
        A.message_buffer = [];
        A.counterpart = this.socketB;
        // A.setTimeout(30000);
        // A.on("timeout", onTimeout);
        A.on("data", onData);
        A.on("end", onEnd);
        A.on("connect", onConnect);
        A.on("error", onError);
        A.on("drain", onDrain);
        this._A = A;
        if(this.socketB != null)
            this.socketB.counterpart = A;
    }

    set socketB(B) {
        B.message_buffer = [];
        B.counterpart = this.socketA;
        // B.setTimeout(30000);
        // B.on("timeout", onTimeout);
        B.on("data", onData);
        B.on("end", onEnd);
        B.on("connect", onConnect);
        B.on("error", onError);
        B.on("drain", onDrain);
        this._B = B;
        if(this.socketA != null)
            this.socketA.counterpart = B;
    }

    get socketA() {
        return this._A;
    }

    get socketB() {
        return this._B;
    }
}

function onData(buffer) {
    this.message_buffer.push(buffer);
    sendData.call(this);
}

function onEnd() {
    if(this.counterpart != null){
        this.counterpart.end();
        this.counterpart.destroy();
    }
    this.end();
    this.destroy();
}

function onConnect() {
    this.counterpart.message_buffer.forEach((buf) => {
        this.write(buf);
    });
    this.counterpart.message_buffer = [];
}

function onError(err) {
    console.log(err);
    this.end();
    this.counterpart.end();
    this.counterpart.destroy();
    this.destroy();
}

function onDrain(){
    sendData.call(this);
}

function onTimeout(){
    this.end();
}

module.exports = DataSocketPair;

function sendData(){
    if (this.counterpart != null) {

        this.message_buffer.forEach((buf, index) => {
            if(buf!=null && this.counterpart.write(buf) == false){
                this.message_buffer[index] = null;
                return;
            }
        });
        this.message_buffer = [];
    }
}