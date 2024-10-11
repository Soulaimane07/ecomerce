require('dotenv').config()
const http = require('http')
const app = require('./app')

const port = process.env.PORT || 3005

const server = http.createServer(app)

server.listen(port, function(error){
    if(error){
        console.log('Error', error);
    } else {
        console.log("Server is runing on Port", port);
        console.log(`Local url: http://localhost:${port}`);
    }
})