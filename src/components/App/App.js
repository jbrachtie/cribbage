import React from 'react';
import './App.css';
import {Client} from 'boardgame.io/react';
import {Cribbage} from '../../game/Game';

const Game = Client({
  game: Cribbage
});

function App() {
  return (
    <div className="App">
      <Game />
    </div>
  );
}

export default App;
