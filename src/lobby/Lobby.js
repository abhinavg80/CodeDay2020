import React, { useState, useEffect, useRef } from 'react';
import openSocket from 'socket.io-client';
import { useSelector, useDispatch } from "react-redux";
import queryString from 'query-string';
import InvalidLobby from './InvalidLobby';
import GameDisplay from './GameDisplay';
import './Lobby.css';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { ArrowLeft, ArrowRight } from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';
let socket;

const Lobby = (props) => {
  const dispatch = useDispatch();
  let [lobbyUsers, setLobbyUsers] = useState({});
  let [roomIdDisplay, setRoomIdDisplay] = useState("")
  let [lobbyValid, setLobbyValid] = useState(true);
  let [gameStarted, setGameStarted] = useState(false);
  let [classChoices, setClassChoices] = useState([]);
  let [classSelectionIndex, setClassSelectionIndex] = useState(0);
  let [socketId, setSocketId] = useState(0);

  let [grid, setGrid] = useState([]);
  let [players, setPlayers] = useState({});
  let [gameState, setGameState] = useState({});
  let [playerList, setPlayerList] = useState([]);
  let [nextMover, setNextMover] = useState(0);

  const nameInputRef = useRef(null);

  useEffect(() => {
    const { roomId } = queryString.parse(props.location.search);
    socket = openSocket('http://localhost:8000');

    let lobbyValidSync = true;
    socket.emit('join', {roomId: roomId}, () => {
      setLobbyValid(false);
      lobbyValidSync = false;
    });

    if (lobbyValidSync) {
      socket.emit('requestLobbyData', {}, (data)=> {
        setClassChoices(data.classChoices);
        setSocketId(data.socketId);
      });

      socket.on('updateLobbyUsers', (data) => {
        setLobbyUsers(data.users);
      });

      socket.on('updateGameUsers', (data) => {
        setGrid(data.grid);
        setPlayers(data.users);
        dispatch({type: 'gameState', 'payload': data.gameState})
        setGameState(data.gameState);
        setPlayerList(data.gameState.userIdArray);
        setNextMover(data.gameState.nextMover);
      });
      socket.on('gameStarted', (data) => {
        setGameStarted(true);
      });

      setRoomIdDisplay(roomId);
    }
  }, []);


  const renderLobbyUsers = () => {
    const listElements = Object.keys(lobbyUsers).map((userId, i) => {
      return <li className="playerName" key={i}>{lobbyUsers[userId].name} ({lobbyUsers[userId].class})</li>;
    });
    return listElements;
  }

  const handleStartGame = () => {
    socket.emit('startGame');
  }

  const handleChangeName = () => {
    console.log(nameInputRef.current.value);
    socket.emit('changeName', {name: nameInputRef.current.value});
  }

  const adjustClassSelectionIndex = (shift) => {
    let nextClassSelectionIndex = classSelectionIndex + shift;
    if (nextClassSelectionIndex < 0) nextClassSelectionIndex += classChoices.length;
    else if (nextClassSelectionIndex >= classChoices.length) nextClassSelectionIndex -= classChoices.length;

    socket.emit('changeClass', {classIndex: nextClassSelectionIndex});
    setClassSelectionIndex(nextClassSelectionIndex);
  }

  const moveTo = (position) => {
  }

  const attackAt = (position) => {
    socket.emit('attackAt', {position: position});
  }

  
  const lobbyDisplay = () => {
    if (gameStarted) {
      return (
        <GameDisplay socket={socket} nextMover={nextMover} attackAt={attackAt} moveTo={moveTo} grid={grid} activePlayer={playerList[gameState.userIndex]} gameState={gameState} players={players} socketId={socketId}/>
      );
    } else if (lobbyValid) {
      return (
        <div>
          <div className='leftSideUIWrapper'>
            <div>
              {}
              <h1>Character Select</h1>
              <div>
              <span>
                <IconButton onClick={()=>adjustClassSelectionIndex(-1)} aria-label="left">
                  <ArrowLeft />
                </IconButton>
                {classChoices[classSelectionIndex]}
                <IconButton onClick={()=>adjustClassSelectionIndex(1)} aria-label="right">
                  <ArrowRight />
                </IconButton>
                </span>
              </div>
            </div>
            <div>
              <TextField style={{'marginRight': 20, 'marginLeft':20}} type="text" inputRef={nameInputRef}></TextField>
              <Button variant="contained" onClick={handleChangeName}>Set Name</Button>
            </div>
          </div>
          <div className='rightSideUIWrapper'>
            <div className="playerNamesWrapper">
              <ul>
                <li className="playerNamesHeader">Players:</li>
                {renderLobbyUsers()}
              </ul>
            </div>
            <div className="buttonStartWrapper">
              <Button variant="contained" fullWidth onClick={handleStartGame}>Start Game</Button>
            </div>
            <div className="roomIdWrapper">
              <p>Room Id: {roomIdDisplay}</p>
            </div>
          </div>
        </div>
      );
    } else {
      return <InvalidLobby/>;
    }

  }

  return (
    lobbyDisplay()
  );
}

export default Lobby;
