import React, {useState, useEffect} from 'react'
// import axios from 'axios'

import CustomBoard from './CustomBoard'

import '../../css/home.css'

function Board ({difficulty}) {
    const [game, setGame] = useState([])
    if (!localStorage.getItem('difficulty')) localStorage.setItem('difficulty', difficulty)

    useEffect(() => {
        let board
        // Keeps difficulty the same if move away from current page
        if (localStorage.getItem('difficulty')) difficulty = localStorage.getItem('difficulty')
        
        // To prevent errors, state is only set if difficulty is not equal to custom
        // If it is custom difficulty, useEffect is ignored and the component is rendered in the DOM

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
            // axios call here
        } 
        if (difficulty !== 'custom') {
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
        <div className='placeholder'>
            <br/><br/><br/>
            {difficulty === 'custom' && <CustomBoard/>}
        </div>
    )
}

export default Board

