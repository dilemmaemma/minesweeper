import React, {useState, useEffect} from 'react'
// import axios from 'axios'

import CustomBoard from './CustomBoard'

function Board ({difficulty}) {

    const [game, setGame] = useState([])

    useEffect(() => {
        let board

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
            console.log('Here');
            return <CustomBoard/>;
            // axios get from custom board api
        } else {
            board = {
                bombs: 8,
                width: 8,
                height: 10,
            }
        }
        if (game.length < 8 || !game) {
            let bombPlacement = createGameBoard(board)
            setGame(bombPlacement)
        } else return
    }, [difficulty]);

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

    console.log(game)

    function newBoard() {
        setGame([])
    }

    return (
        <div>
            
        </div>
    )
}

export default Board

