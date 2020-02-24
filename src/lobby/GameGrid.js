import React, {useState, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import GridTile from './GridTile';
import './GameDisplay.css';

function GameGrid(props) {
  let [moveTiles, setMoveTiles] = useState([]);
  let [moveGrid, setMoveGrid] = useState(props.grid);
  let [activePlayer, setActivePlayer] = useState(null);
  let [playerGrid, setPlayerGrid] = useState(props.grid);

  useEffect(() => {
    setMoveGrid(props.grid);
  }, [props.grid]);

  const openSituational = (player) => {
    const playerTurn = props.gameState.userIdArray[props.gameState.userIndex];
    if (!(Math.abs(player.id - props.socketId) <= 0.00001) || !(Math.abs(playerTurn - props.socketId) <= 0.00001)) return;

    if (props.gameState.currentState=='move') {
      openPathing(player);
    } else {
      openAttack(player.position, player.range);
    }

  }
  const openPathing = (player) => {
    let q = [];
    let dirs = [[0, 1], [1, 0], [-1, 0], [0, -1]];
    let newMoveGrid = JSON.parse(JSON.stringify(moveGrid));
    let newPlayerGrid = JSON.parse(JSON.stringify(moveGrid));


    q.push([...player.position, player.speed + 1]);

    let seen = new Set();
    while (q.length > 0) {
      const cur = q.shift();


      const key = cur[0] + ',' + cur[1];

      if (cur[0] < 0 || cur[0] >= moveGrid.length || cur[1] < 0
        || cur[1] >= moveGrid[0].length || seen.has(key) || cur[2] === 0 || moveGrid[cur[0]][cur[1]] == 'M') continue;

      let playerBlocked = false;
      for (const playerId in props.players) {
        if (Math.abs(playerId - props.socketId) <= 0.00001) continue;
        if (props.players[playerId].position[0] === cur[0] && props.players[playerId].position[1] === cur[1]) playerBlocked = true;
      }
      if (playerBlocked) {
        continue;
      }

      if (cur[0] != player.position[0] || cur[1] != player.position[1]) {
        newMoveGrid[cur[0]][cur[1]] = 'F';
        newPlayerGrid[cur[0]][cur[1]] = player;
      }
      if (moveGrid[cur[0]][cur[1]] === 'W') continue;
      seen.add(key);


      for (let d of dirs) {
        q.push([cur[0] + d[0], cur[1] + d[1], cur[2] - 1]);
      }
    }

    setPlayerGrid(newPlayerGrid);
    setActivePlayer(player);
    setMoveGrid(newMoveGrid);

  }

  const openAttack = (position, range) => {
    let q = [];
    let dirs = [[0, 1], [1, 0], [-1, 0], [0, -1]];
    let newMoveGrid = JSON.parse(JSON.stringify(moveGrid));

    q.push([...position, range + 1]);

    let seen = new Set();
    while (q.length > 0) {
      const cur = q.shift();
      const key = cur[0] + ',' + cur[1];

      if (cur[0] < 0 || cur[0] >= moveGrid.length || cur[1] < 0
        || cur[1] >= moveGrid[0].length || seen.has(key) || cur[2] === 0 || moveGrid[cur[0]][cur[1]] == 'M') continue;

      newMoveGrid[cur[0]][cur[1]] = 'A';
      seen.add(key);

      for (let d of dirs) {
        q.push([cur[0] + d[0], cur[1] + d[1], cur[2] - 1]);
      }
    }

    setMoveGrid(newMoveGrid);
  }

  const moveAndReset = (position, player) => {
    props.socket.emit('moveTo', {position: position});
  }

  const attackAndReset = (position) => {
    props.socket.emit('attackAt', {position: position});
  }

  const getTileMatrix = () => {
    let matrix = [];
    for (const i in moveGrid) {
      let matRow = moveGrid.map((char, j) => {
        return <GridTile key={j}
        position={[parseInt(i), parseInt(j)]}
        socketId={props.socketId}
        grid={props.grid}
        gameState={props.gameState}
        moveGrid={moveGrid}
        attackAndReset={attackAndReset}
        moveAndReset={moveAndReset}
        openAttack={openAttack}
        playerGrid={playerGrid}
        nextMover={props.nextMover}
        openSituational={openSituational}
        players={props.players}
        activePlayer={props.activePlayer}
        />;
      });
      matrix.push(<div key={i} className="gridRow">{matRow}</div>);
    }
    return matrix;
  }
  return (
    <div>
      {getTileMatrix()}
    </div>
  );
}

export default GameGrid;
