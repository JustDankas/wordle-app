import React, { Component, useEffect } from 'react';
function GameOver({word,gameState,attempts,handleRestart}) {
    useEffect(()=>{
        console.log(gameState,attempts)
    })
    return ( 
      <div 
      className={gameState=='won'?"game-over won":
      gameState=='lost'?"game-over lost":
      "game-over hidden"
      }>
        <h1>{gameState=='won'?"Won":"Lost"}</h1>
        <div className="info">
          <div className="word">Word: {word}</div>
          <div className="attempts">Turns: {attempts+1}</div>
        </div>
        <button className="restart" onClick={()=>handleRestart()}>Restart</button>
      </div>
     );
}

export default GameOver;