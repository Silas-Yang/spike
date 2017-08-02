# spike
a node.js reverse proxy (for NAT)

## Server
### <code>node server <server_port></code>
The <code>server_port</code> can be accessed by computers on the internet. This port will be mapped to your local port.

## Client
### <code>node client <server_address> <your_local_port></code>
Generally the client is your localhost
<code>server_address</code> is the IP or domain of the server.

## Example
If you have a server which is www.example.com, and want to let people access your local service like HTTP, which runs at port 8080.
then you need:

> Server runs: <code>node server 80</code>

> Localhost runs: <code>node client www.example.com 8080</code>

Then your local http server can be exposed by accessing http://www.example.com.

## License
MIT Licensed
