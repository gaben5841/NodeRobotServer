const { lookup } = require('dns')
const express = require('express')
const fstat  = require('fs')
const app = express()
const path = require('path')
const { client } = require('websocket')
const { createWebSocketStream } = require('ws')
const WebSocket = require('ws')
const port = 3000

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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

const socketServer = new WebSocket.Server({port: 3030})

socketServer.on('connection', (socketClient) => {
  console.log('connected')
  console.log('client set length: ', socketServer.clients.size)

  socketClient.on('message', function incoming(data) {
    console.log(typeof data)
    if (typeof data == 'string') {
      console.log('The data type is String')
      console.log(typeof raspi)
      if (typeof raspi === 'undefined') {
        console.log("No robot connected!")
      } else {
        raspi.send('this is hell')
      }
    } else {
      imageData = Buffer.from(data, 'binary')
      console.log(imageData)
      //console.log("this function is running")
      //socketClient.send("response")
      socketServer.clients.forEach(function each(client) {
        if (client !== socketClient && client.readyState === WebSocket.OPEN) {
           client.send(imageData);
        } else {
          raspi = socketClient
          console.log(raspi)
        }
      });

    }
    

  })

  socketClient.on('close', (socketClient) => {
    console.log('closed')
    console.log('number of clients: ', socketServer.clients.size)
  })
})
