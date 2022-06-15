import express from 'express'
import { fileURLToPath } from 'url';
import path from 'path';
import http from 'http'
import { Server, Socket } from 'socket.io'
import Filter from 'bad-words'
import generateMessage from './utils/messages.js'
import {generatePosition} from './utils/messages.js'
import {removeUser, getUser, getUsersInRoom ,default as addUser} from './utils/user.js'

const app = express()
const server = http.createServer(app)
const io =new Server(server)
const port = process.env.PORT || 5000

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDirectoryPath=path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))

io.on('connection',(socket)=>{
    socket.on('join',({userName,room},callback)=>{
        const {error , user }=addUser({id:socket.id , username:userName,room})

        if (error) {
            return callback(error)
        }
        socket.join(room)
            // socket.broadcast.emit('message',generateMessage(`${username}`))
            // socket.emit('message',generateMessage('welcome'))
                socket.emit('message',generateMessage('Admin','welcome'))
                socket.broadcast.to(user.room).emit('message',generateMessage('Admin',`${user.username} has joined`))
                io.to(user.room).emit('roomData',{
                    room:user.room,
                    users:getUsersInRoom(user.room)
                })
            callback()
    })


    socket.on('message',(message,callBack)=>{
        const filter = new Filter()
        if (filter.isProfane(message)) {
            return callBack('profanity is not allowed')
        }
        io.to(getUser(socket.id).room).emit('message',generateMessage(getUser(socket.id).username,message)) //emite para center city

        callBack()
    })
    socket.on('position',(coords,callBack)=>{
        if (!coords) {
            return callBack('position error')
        }
        io.to(getUser(socket.id).room).emit('position',generatePosition(getUser(socket.id).username,`https://maps.google.com/?q=${coords.latitude},${coords.longitude}`))
        callBack()
    })

    socket.on('disconnect',()=>{
        const user=removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('message',generateMessage('Admin',`${user.username} has left!!`))
            io.to(user.room).emit('roomData',{
                room:user.room,
                users:getUsersInRoom(user.room)
            })
        }
  
    })
})


server.listen(port, () => {
    console.log('server is up on port:' + 5000)
})