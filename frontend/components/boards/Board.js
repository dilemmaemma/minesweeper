import React, { useState, useEffect } from 'react';
// import axios from 'axios'

import CustomBoard from './CustomBoard';

let board

function Board({ difficulty }) {
  const [game, setGame] = useState([]);
  const [level, setLevel] = useState(difficulty); //eslint-disable-line

  // Load board data from localStorage when component mounts
  useEffect(() => {
    if (localStorage.getItem('board')) {
      setGame(JSON.parse(localStorage.getItem('board')));
    }
    const newGame = createBoard()
    setGame(newGame)
    localStorage.setItem('board', JSON.stringify(game));
  }, []);

  // Function to create a new board based on the given level or difficulty
  function createBoard() {
    if (level === 'easy') {
      const board = {
        bombs: 10,
        width: 8,
        height: 8,
      };
      const bombPlacement = createGameBoard(board);
      return bombPlacement;
    } else if (level === 'medium') {
        board = {
            bombs: 40,
            width: 16,
            height: 16,
        };
        const bombPlacement = createGameBoard(board);
        return bombPlacement;
    } else if (level === 'custom') {
        board = {
            bombs: 99,
            width: 30,
            height: 16,
        }
        const bombPlacement = createGameBoard(board);
        return bombPlacement;
    }
  }

  // Function to generate bomb positions for a given board
  function generateRandomBombPositions(board) {
    const bombPositions = [];
      
        while (bombPositions.length < board.bombs) {
          const x = Math.floor(Math.random() * board.width);
          const y = Math.floor(Math.random() * board.height);
          const position = `${x}-${y}`;
      
          // Ensure there are no duplicates
          if (!bombPositions.includes(position)) {
            bombPositions.push(position);
          }
        }
      
        return bombPositions;
  }

  // Function to create a game board based on a board configuration
  function createGameBoard(board) {
    const bombPositions = generateRandomBombPositions(board);
        const newGame = [];
      
        for (let i = 0; i < board.height; i++) {
          const row = [];
      
          for (let j = 0; j < board.width; j++) {
            const isBomb = bombPositions.includes(`${j}-${i}`);
            row.push(isBomb ? 'X' : 'O');
          }
      
          newGame.push(row);
        }
      
        return newGame;
  }

  // Function to start a new board
  function newBoard() {
    setGame([]);
    localStorage.removeItem('board');
    const newGame = createBoard();
    setGame(newGame);
    localStorage.setItem('board', JSON.stringify(game));
  }

  console.log(game)

  return (
    <div className='placeholder'>
      <br/><br/><br/>
      {level === 'custom' && <CustomBoard />}
      <button onClick={newBoard}>Get New Board</button>
    </div>
  );
}

export default Board;
