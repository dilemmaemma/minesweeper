import React, {useState, useEffect} from 'react'
import { Navigate } from 'react-router'
// import axios from 'axios'

import CustomBoard from './CustomBoard'

import '../../css/board.css'

// Set board up with false values to trick the parser into moving on to the next step when Custom Board is called before other gamemodes
let board
let style
let node_env = 'development'

function Board ({difficulty}) {

    const [game, setGame] = useState([])
    const [level, setLevel] = useState(difficulty)

    // Navigate to home with custom error message if DOM unmounts
    if (!['easy', 'medium', 'hard', 'custom'].includes(level)) {
        return (
            <Navigate 
                to='/' 
                state={{
                    error: 'Your session has timed out due to inactivity. Please select a new gamemode to continue'
                }}
            />
        )
    }

    useEffect(() => {
        setLevel(difficulty)

        if (difficulty === 'easy') {
            board = {
                bombs: 10,
                width: 9,
                height: 9,
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

        if (difficulty !== 'custom') {
            let bombPlacement = createGameBoard(board)
            setGame(bombPlacement)
        }

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
        } else if (difficulty === 'hard') {
            board = {
                bombs: 99,
                width: 30,
                height: 16,
            }
            const bombPlacement = createGameBoard(board);
            return bombPlacement;
        }
    }

    // Function to start a new board
    function newBoard() {
        setGame([]);
        const newGame = createBoard();
        setGame(newGame);
    }

    console.log(game)

    function dimensionRender() {
        if (difficulty === 'easy') return (
            style = { height: '144px', width: '144px', margin: '14px' }
        )
        else if (difficulty === 'medium') return (
            style = { height: '256px', width: '256px', margin: '70px' }
        )
        else if (difficulty === 'hard') return (
            style = { height: '256px', width: '480px', margin: '182px' }
        )
        // else if (difficulty === 'custom') {
        //     axios.get(l`localhost:9000/api/board/custom`)
        //         .then(res => {
        //             console.log(res.data)
        //             return (
        //                style = { 
        //                    height: `${String(res.data.height * 16)}px`, 
        //                    width: `${String(res.data.width * 16)}px`, 
        //                    margin: `${String(((res.data.width * 16) - 116) / 2)}`, 
        //                })
        //         })
        //         .catch(err => {
        //             console.error(err)
        //         })
        // }
    }      

    function renderBoard(clicked) {
        // DimensionRender() runs before this, meaning you can plug in the specific style into face to make things seamless
        const boardElements = [];

        boardElements.push(<div className='border tl')

        for (let i = 0; i < board.width; i++) {
            boardElements.push(<div className='tb' />)
        }
      
        for (let i = 0; i < game.length; i++) {
          for (let j = 0; j < game[i].length; j++) {
            const cellValue = game[i][j];
      
            // Determine the class name based on the cell value
            let className;
            if (cellValue === 'X' && clicked === true) { // Convert only after clicking
              className = `square bombdeath`;
            } else if (cellValue === 'O' ) {
              className = `square blank`;
            } else if (cellValue === '1' && clicked === true) { // Convert only after clicking
              className = `square open1`;
            } else if (cellValue === '2' && clicked === true) { // Convert only after clicking
              className = `square open2`;
            } else if (cellValue === '3' && clicked === true) { // Convert only after clicking
                className = 'square open3'
            } else if (cellValue === '4' && clicked === true) { // Convert only after clicking
                className = 'square open4'
            } else if (cellValue === '5' && clicked === true) { // Convert only after clicking
                className = 'square open5'
            } else if (cellValue === '6' && clicked === true) { // Convert only after clicking
                className = 'square open6'
            } else if (cellValue === '7' && clicked === true) { // Convert only after clicking
                className = 'square open7'
            } else if (cellValue === '8' && clicked === true) { // Convert only after clicking
                className = 'square open8'
            } else if (cellValue === '0' && clicked === true) { // Convert only after clicking
                className = 'square open0'
            } else if (cellValue === 'F' && clicked === true) { // When cell is clicked, change array value to the letter it was followed by F, ex: OF or XF
                className = 'square bombflagged'
            } else if (cellValue === 'FF' && clicked === 'end') { // Upon game ending, if array value has OF, convert it to a falsebomb
                className = 'square falsebomb'
            } else if ((cellValue === 'R' && clicked === 'end') || node_env === 'development' && (cellValue === 'X' && !clicked)) { // Upon game ending, shift all squares with 'X' to 'R' to show where bombs were
                className = 'square bombrevealed'
            }
            // Add JSX elements to the array
            boardElements.push(<div key={`cell-${i}-${j}`} className={className} />);
          }
        }
      
        return boardElements;
      }
      

    return (
        <div className='placeholder'>
            {console.log(style)}
            <br /><br /><br />
            {level !== 'custom' && dimensionRender() && (
                <div id='game' style={{height: style.height, width: style.width}}>{renderBoard()}</div>
            )}
            {level === 'custom' ? <CustomBoard /> : <button onClick={newBoard}>Get New Board</button>}
        </div>
    );
}

export default Board
