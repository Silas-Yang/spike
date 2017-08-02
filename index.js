const Server = require("./lib/Server");
const Client = require("./lib/Client");

var role = process.argv[2];
switch(role){
    case 'client':
        var cmd_host = process.argv[3];
        var internal_port = process.argv[4];
        var client = new Client(cmd_host, 55335, "localhost", internal_port);
        break;
    case 'server':
        var external_port = process.argv[3];
        var server = new Server(external_port, 55335);
        break;
    default:
        console.log("Unknown Parameter: " + process.argv[2] + "\nParameters: [client | server]");
        console.log("client usage: node index.js client <Server Host> <Local Port>");
        console.log("server usage: node index.js server <Port>");
}