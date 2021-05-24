const { lookup } = require('dns')
const express = require('express')
const fstat  = require('fs')
const app = express()
const path = require('path')
const { client } = require('websocket')
const { createWebSocketStream } = require('ws')
const WebsocketServer = require('ws');
//const port = process.env.PORT || 3000
const Port = 3000

var imageData
var id = 0
var raspi

//const server = http.createServer(app)
//const wss = new WebSocket.Server({server})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/node_modules/base64-js/base64js.min.js', (req, res) => {
  res.sendFile(path.join(__dirname, '/node_modules/base64-js/base64js.min.js'))
})

app.listen(Port, () => {
  console.log(`Example app listening at http://localhost:${Port}`)
})
/*
const server = express()
  .use((req, res) => res.sendFile('index.html', { root: __dirname }))
  .listen(port, () => console.log(`Listening on ${port}`));
*/
const socketServer = new WebsocketServer.Server({ port: 3030 })

socketServer.on('connection', (socketClient) => {
  console.log('connected')
  console.log('client set length: ', socketServer.clients.size)

  socketClient.on('message', function incoming(data) {
    console.log(typeof data)
    if (typeof data == 'string') {
      console.log('The data type is String')
      console.log(typeof raspi)
      socketClient.send(data)
      if (typeof raspi === 'undefined') {
        console.log("No robot connected!")
      } else {
        raspi.send('this is hell')
      }
    } else {
      imageData = Buffer.from(data, 'binary')
      socketServer.clients.forEach(function each(client) {
        if (client !== socketClient && client.readyState === WebsocketServer.OPEN) {
           client.send(imageData);
        } else {
          raspi = socketClient
        }
      });

    }
    

  })

  socketClient.on('close', (socketClient) => {
    console.log('closed')
    console.log('number of clients: ', socketServer.clients.size)
  })
})
