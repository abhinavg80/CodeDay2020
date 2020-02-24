const serverConstants = require('./common/serverConstants');
const testRandom = require('./test.js');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const PORT = process.env.PORT || 8000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const getVitalLobbySocketInfo = (roomSockets) => {
    let info = {};
    for (const socketId in roomSockets['users']) {
      info[socketId] = {
        socketId: socketId,
        name: roomSockets['users'][socketId].name,
        class: serverConstants.CLASS_CHOICES[roomSockets['users'][socketId].classIndex]
      };
    }


    return info;
}

const getVitalGameSocketInfo = (roomSockets) => {
  let info = {
    users: {}
  };
  for (const socketId in roomSockets['users']) {
    if (roomSockets['users'][socketId].gameData.dead) continue;
    info['users'][socketId] = roomSockets['users'][socketId].gameData;
  }
  info['grid'] = roomSockets['grid'];
  info['gameState'] = roomSockets['gameState'];
  info['gameState']['nextMover'] = roomSockets['gameState']['userIdArray'][roomSockets['gameState']['userIndex']];
  return info;
}

server.listen(PORT, () => console.log('started'));

let socketList = {};

io.on('connection', socket => {
  socket.id = Math.random();
  socket.name = Math.random();
  socket.classIndex = 0;

  socket.on('join', (data, callback) => {
    if (socketList.hasOwnProperty(data.roomId) &&
    (socketList[data.roomId]['active'] === true || Object.keys(socketList[data.roomId]['users']).length >= 4)
    ) {
      callback();
      return;
    }

    socket.roomId = data.roomId;

    if (!socketList.hasOwnProperty(socket.roomId)) {
      socketList[socket.roomId] = {};
      socketList[socket.roomId]['users'] = {};
      socketList[socket.roomId]['userIdArray'] = [];
      socketList[socket.roomId]['active'] = false;
    }

    socketList[socket.roomId]['users'][socket.id] = socket;
    socketList[socket.roomId]['userIdArray'].push(socket.id);
    updateAllUsers(socket);
  });

  socket.on('moveTo', (data) => {
    socket.gameData.position = data.position;
    socketList[socket.roomId]['gameState']['currentState'] = 'attack';
    updateAllUsers(socket);
  });

  socket.on('attackAt', (data) => {
    for (let roommate in socketList[socket.roomId]['users']) {
      userSocket = socketList[socket.roomId]['users'][roommate];
      if (userSocket.gameData.position[0] == data.position[0] && userSocket.gameData.position[1] == data.position[1]) {
        userSocket.gameData.health -= socket.gameData.attack;
        if (userSocket.gameData.health <= 0) userSocket.gameData.dead = true;
      }
    }
    socketList[socket.roomId]['gameState']['currentState'] = 'move';

    let nextUser;
    do {
      socketList[socket.roomId]['gameState']['userIndex'] = (socketList[socket.roomId]['gameState']['userIndex'] + 1) % socketList[socket.roomId]['gameState']['userIdArray'].length;
      nextUser = socketList[socket.roomId]['gameState']['userIdArray'][socketList[socket.roomId]['gameState']['userIndex']];
    }
    while (socketList[socket.roomId]['users'][nextUser].gameData.dead);

    updateAllUsers(socket);
  })
  socket.on('startGame', () => {
    if (socketList[socket.roomId]['active']) return;
    socketList[socket.roomId]['active'] = true;
    socketList[socket.roomId]['grid'] = testRandom.generate(4,4,11,0.5);
    socketList[socket.roomId]['gameState'] = {};

    socketList[socket.roomId]['gameState']['userIdArray'] = socketList[socket.roomId]['userIdArray'];
    socketList[socket.roomId]['gameState']['userIndex'] = 0;
    socketList[socket.roomId]['gameState']['currentState'] = 'move';

    Object.keys(socketList[socket.roomId]['users']).forEach((roommate, i) => {
      userSocket = socketList[socket.roomId]['users'][roommate];

      userSocket.gameData = {
        id: userSocket.id,
        dead: false,
        name: userSocket.name,
        class: serverConstants.CLASS_CHOICES[userSocket.classIndex],
        position: serverConstants.CHARACTER_POSITIONS[i],
        maxHp: serverConstants.CLASS_STATS[serverConstants.CLASS_CHOICES[userSocket.classIndex]].health,
        ...serverConstants.CLASS_STATS[serverConstants.CLASS_CHOICES[userSocket.classIndex]]
      };
    });
    for (roommate in socketList[socket.roomId]['users']) {
      socketList[socket.roomId]['users'][roommate].emit('gameStarted');
    }
    updateAllUsers(socket);
  });

  socket.on('requestLobbyData', (data, callback) => {
    callback({classChoices: serverConstants.CLASS_CHOICES, socketId: socket.id});
  });

  socket.on('changeName', data => {
    socket.name = data.name;
    updateAllUsers(socket);
  });

  socket.on('changeClass', data => {
    socket.classIndex = data.classIndex;
    updateAllUsers(socket);
  })

  socket.on('disconnect', ()=>{
    if (!socket.hasOwnProperty('roomId')) return;

    delete socketList[socket.roomId]['users'][socket.id];
    if (Object.keys(socketList[socket.roomId]['users']).length === 0) {
      delete socketList[socket.roomId];
    } else {
      updateAllUsers(socket);
    }
  });

  const updateAllUsers = (socket) => {
    if (socketList[socket.roomId]['active']) {
      for (roommate in socketList[socket.roomId]['users']) {
        socketList[socket.roomId]['users'][roommate].emit('updateGameUsers', getVitalGameSocketInfo(socketList[socket.roomId]));
      }
    } else {
      for (roommate in socketList[socket.roomId]['users']) {
        socketList[socket.roomId]['users'][roommate].emit('updateLobbyUsers', {users: getVitalLobbySocketInfo(socketList[socket.roomId])});
      }
    }
  }
});
