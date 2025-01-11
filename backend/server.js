require("dotenv").config();
const http = require('http');
const app = require('./app')
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const connect = require("../backend/db/db")
const { Server } = require('socket.io')
const jwt = require('jsonwebtoken');
const { default: mongoose } = require("mongoose");
const projectModel = require('./db/models/project.model')
const aiservice = require('./services/ai.service')

connect();
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

io.use(async (socket, next) => {
  const token = socket.handshake.auth?.token || socket.handshake.headers?.token;
  const projectId = socket.handshake.query.projectId;
  if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) return next(new Error('no projectId error or not valid pid'));

  socket.project = await projectModel.findOne({ _id: projectId });

  socket.roomId=projectId;

  if (!token) return next(new Error('no token  error'));

  console.log(token)
  const decoded = jwt.verify(token, process.env.SECRET);
  console.log(decoded.email)

  if (!decoded) return next(new Error('authentication error'));
  return next();
})

io.on('connection', (socket) => {
  console.log('user connected');

  socket.join(socket.roomId);
  socket.on('project-message-send', async(data) => {
    console.log(data)
    if(data.message.includes('@ai')){
      console.log('ai msg');
      const result=await aiservice.generateResult(data.message)
      // console.log(result)
      io.to(socket.roomId).emit('project-message-receive', {message:result,sender:'ai'})  
    }
    else{
      socket.broadcast.to(socket.roomId).emit( 'project-message-receive',data)
    }
  })
  socket.on('disconnect', () => {
    console.log('user disconnected');
  })
})

server.listen(port, () => {
  console.log(`server running on port ${port}`);
})

process.on('SIGINT', () => {
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});