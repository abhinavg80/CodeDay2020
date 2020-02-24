import React from 'react';
import { useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import './GameDisplay.css';

function GridTile(props) {

  const moveChar = props.moveGrid[props.position[0]][props.position[1]];
  const regChar = props.grid[props.position[0]][props.position[1]];

  const gameState = useSelector(state => state.gameState);
  for (const playerId in props.players) {
    if (props.players[playerId].position[0] === props.position[0] &&
      props.players[playerId].position[1] === props.position[1]) {
        if (moveChar === 'A' && playerId != props.socketId) return (
          <span
          onClick={() => props.attackAndReset(props.position)}
          className="gridTile"
          style={{'backgroundColor':'maroon'}}></span>
        )

        if (Math.abs(playerId - props.socketId) <= 0.00001) {
          console.log(gameState);

          if (gameState.userIdArray != undefined && gameState.userIndex != undefined && Math.abs(playerId - gameState.userIdArray[gameState.userIndex]) <= 0.00001) {
            return (
              <span
              onClick={() => props.openSituational(props.players[playerId])}
              className="gridTile"
              style={{'backgroundColor':'yellow'}}></span>
            );
          }

          return (
            <span
            onClick={() => props.openSituational(props.players[playerId])}
            className="gridTile"
            style={{'backgroundColor':'red'}}></span>
          );
        }

        return (
          <span
          onClick={() => props.openSituational(props.players[playerId])}
          className="gridTile"
          style={{'backgroundColor':'grey'}}></span>
        );

      }
  }


  switch (moveChar) {
    case 'M':
      return (<span className="gridTile" style={{'backgroundColor':'green'}}></span>);
    case 'W':
      return (<span className="gridTile" style={{'backgroundColor':'cyan'}}></span>);
    case 'F':
      return (<span className="gridTile" onClick={() => props.moveAndReset(props.position, props.playerGrid[props.position[0]][props.position[1]])} style={{'backgroundColor':'blue'}}></span>);
    case 'A':
      return (<span className="gridTile" onClick={() => props.attackAndReset(props.position)} style={{'backgroundColor':'orange'}}></span>);
    default:
      return (<span className="gridTile"></span>);
  }
}

export default GridTile;
