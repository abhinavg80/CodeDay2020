import React from 'react';
import Button from '@material-ui/core/Button';
import './GameDisplay.css';

import GameGrid from './GameGrid';

function GameDisplay(props) {

  const renderGamePlayerDisplays = () => {
    const renderSelfDisplay = (playerData, key) => {
      return (
        <div key={key}>
          <div>
            <p>Name: {playerData.name}</p>
            <p>Class: {playerData.class}</p>
          </div>
          <div>
            <p>HP: {playerData.health}</p>
            <p>ATK: {playerData.attack}</p>
            <p>SPD: {playerData.speed}</p>
          </div>
          {playerData.dead && <p> You are Dead </p>}
        </div>
      );
    }

    const renderOtherDisplay = (playerData, key) => {
      return (
        <div key={key}>
          <div>
            <p>HP: {playerData.health}</p>
            <p>ATK: {playerData.attack}</p>
          </div>
        </div>
      );
    }

    const selfDisplay = Object.keys(props.players).map((playerId, i) => {
      const precision = 0.00001;
      if (Math.abs(playerId - props.socketId) <= precision) {
        return renderSelfDisplay(props.players[playerId], i);
      }
    });

    const otherDisplay = Object.keys(props.players).map((playerId, i) => {
      const precision = 0.00001;
      if (!(Math.abs(playerId - props.socketId) <= precision)) {
        return renderOtherDisplay(props.players[playerId], i);
      }
    });
    return selfDisplay.concat(otherDisplay);
  };

  return (
    <div>
      <div className="gameGridWrapper">
        <GameGrid socket={props.socket}  nextMover={props.nextMover} moveTo={props.moveTo} attackAt={props.attackAt} players={props.players} gameState={props.gameState} grid={props.grid} socketId={props.socketId}/>
      </div>
      <div className="actionUIWrapper">
        <div>
          {renderGamePlayerDisplays()}
        </div>
        <div>
          <Button variant="contained">Pass</Button>
        </div>
      </div>

    </div>
  );
}

export default GameDisplay;
