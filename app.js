const { lookup } = require('dns')
const express = require('express')
const fstat  = require('fs')
const app = express()
const path = require('path')
const { client } = require('websocket')
const { createWebSocketStream } = require('ws')
const { Server, OPEN } = require('ws')
const port = process.env.PORT || 3000

var imageData
var id = 0
var raspi
var clientLength = 0

//const server = http.createServer(app)
//const wss = new WebSocket.Server({server})
/*
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/node_modules/base64-js/base64js.min.js', (req, res) => {
  res.sendFile(path.join(__dirname, '/node_modules/base64-js/base64js.min.js'))
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
*/
const server = express()
  .use((req, res) => res.sendFile('index.html', { root: __dirname }))
  .listen(port, () => console.log(`Listening on ${port}`))

const socketServer = new Server({ server })

socketServer.on('connection', (socketClient) => {
  console.log('connected')
  console.log('client set length: ', socketServer.clients.size)
  clientLength = socketServer.clients.size
  socketServer.clients.forEach(function each(client) {
    if (client !== socketClient && client.readyState === OPEN && client !== raspi) {
       client.send(clientLength);
    }
  })

  socketClient.on('message', function incoming(data) {
    //console.log(typeof data)
    if (typeof data == 'string') {
      console.log('The data type is String')
      console.log(typeof raspi)
      if (typeof raspi === 'undefined') {
        console.log("No robot connected!")
      } else {
        raspi.send(data)
      }
    } else {
      imageData = Buffer.from(data, 'binary')
      socketServer.clients.forEach(function each(client) {
        if (client !== socketClient && client.readyState === OPEN) {
           client.send(imageData);
        } else {
          raspi = socketClient
          //console.log(raspi)
        }
      })

    }
    

  })

  socketClient.on('close', (socketClient) => {
    console.log('closed')
    console.log('number of clients: ', socketServer.clients.size)
    clientLength = socketServer.clients.size
    socketServer.clients.forEach(function each(client) {
      if (client !== socketClient && client.readyState === OPEN && client !== raspi) {
         client.send(clientLength);
      }
    })
  })
})
