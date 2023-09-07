import React, {useState, useEffect} from 'react'
import { Navigate } from 'react-router'
// import axios from 'axios'

import CustomBoard from './CustomBoard'

let board

function Board ({difficulty}) {

    const [game, setGame] = useState([])
    const [level, setLevel] = useState(difficulty)

    if (!level) {
        <Navigate to='/' error={'Your session has timed out due to inactivity. Please select a new gamemode to continue'}/>
    }

    useEffect(() => {
        setLevel(difficulty)

        if (difficulty === 'easy') {
            board = {
                bombs: 10,
                width: 8,
                height: 8,
            }
        } else if (difficulty === 'medium') {
            board = {
                bombs: 40,
                width: 16,
                height: 16,
            }
        } else if (difficulty === 'hard') {
            board = {
                bombs: 99,
                width: 30,
                height: 16,
            }
        } else if (difficulty === 'custom') {
            <CustomBoard/>
            // axios get from custom board api
        } else {
            board = {
                bombs: 8,
                width: 8,
                height: 10,
            }
        }

        let bombPlacement = createGameBoard(board)
        setGame(bombPlacement)

        // Navigate to home page when component unmounts
        return () => {<Navigate to='/'/>}
    }, [difficulty]);

    localStorage.setItem('board', JSON.stringify(game))

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

    function createBoard() {
        if (level === 'easy') {
            board = {
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
        // } else if (level === 'custom') {
        //     board = {
        //         bombs: 99,
        //         width: 30,
        //         height: 16,
        //     };
        //     const bombPlacement = createGameBoard(board);
        //     return bombPlacement;
        }
    }

    // Function to start a new board
    function newBoard() {
        setGame([]);
        const newGame = createBoard();
        setGame(newGame);
        localStorage.removeItem('board');
        localStorage.setItem('board', JSON.stringify(game));
    }

    console.log(game)

    return (
        <div className='placeholder'>
            <br/><br/><br/>
            {level === 'custom' && <CustomBoard />}
            {level !== 'custom' && <button onClick={newBoard}>Get New Board</button>}
        </div>
    );
}

export default Board
