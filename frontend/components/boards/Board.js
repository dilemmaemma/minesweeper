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
    const [bombsLeft, setBombsLeft] = useState(0)
    const [userGame, setUserGame] = useState([])
    const [face, setFace] = useState('facesmile')
    const [currentTime, setCurrentTime] = useState(0)

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
            setBombsLeft(10)
        } else if (difficulty === 'medium') {
            board = {
                bombs: 40,
                width: 16,
                height: 16,
            }
            setBombsLeft(40)
        } else if (difficulty === 'hard') {
            board = {
                bombs: 99,
                width: 30,
                height: 16,
            }
            setBombsLeft(99)
        } else if (difficulty === 'custom') {
            <CustomBoard/>
            // axios get from custom board api
            // axios.get('localhost:9000/api/custom/board')
            //     .then(res => {
            //        board = {
            //         bombs: res.data.bombs
            //         width: res.data.width
            //         height: res.data.height
            //        }
            //     })
            //     .catch(err => {
            //         console.error(err)
            //     })
            // setBombsLeft(board.bombs)
        } else {
            board = {
                bombs: 8,
                width: 8,
                height: 10,
            }
            setBombsLeft(8)
        }

        if (difficulty !== 'custom') {
            let bombPlacement = createGameBoard(board)
            setGame(bombPlacement)
            setUserGame(game)
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
                width: 9,
                height: 9,
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
        setUserGame(game)
    }

    console.log(game)

    function dimensionRender() {
        if (difficulty === 'easy') return (
            style = { 
                height: '206px',
                width: '164px', 
                margin: '14px' 
            }
        )
        else if (difficulty === 'medium') return (
            style = { 
                height: '318px',
                width: '276px', 
                margin: '70px' 
            }
        )
        else if (difficulty === 'hard') return (
            style = { 
                height: '318px', 
                width: '500px', 
                margin: '182px' 
            }
        )
        // else if (difficulty === 'custom') {
        //     axios.get(l`localhost:9000/api/board/custom`)
        //         .then(res => {
        //             console.log(res.data)
        //             return (
        //                style = { 
        //                    height: `${String((res.data.height * 16) + 62)}px`, 
        //                    width: `${String((res.data.width * 16) + 20)}px`, 
        //                    margin: `${String(((res.data.width * 16) - 116) / 2)}`, 
        //                })
        //         })
        //         .catch(err => {
        //             console.error(err)
        //         })
        // }
    }      

    function renderBoard(clicked) { // Change game to user game so that positions are not revealed
        // DimensionRender() runs before this, meaning you can plug in the specific style into face to make things seamless
        const boardElements = [];

        // Variable 'board' is unavailable, so use the stylized properties to calculate the total width of the board
        let length = { ...style.width }
        length = `${length[0]}${length[1]}${length[2]}`
        length = Number((length) - 20) / 16

        // Rendering start of information top border
        boardElements.push(<div key={'tl-border'} className='border tl' />)

        // Rendering information top border
        for (let i = 0; i < length; i++) {
            let borderNum = i + 1
            boardElements.push(<div key={`top-border-${borderNum}`} className='tb' />)
        }

        // Rendering end of information top border
        boardElements.push(<div key={'end-info-border'} className='border tr' />)

        // Rendering start of information container
        boardElements.push(<div key={'start-info-container'} className='lb' />)

        // Creating a variable to hold how many bombs are left in an array with three digits
        let bombs = bombsLeft
        bombs = bombs.toString().split('')
        if (bombs.length < 2) bombs.unshift('0', '0')
        else if (bombs.length < 3) bombs.unshift('0')

        if (bombsLeft < -99) bombs = ['-', '9', '9']
        
        if (bombsLeft < 0) {
            bombs.shift()
            bombs.unshift('-')
        }

        // Creating a variable to hold how many seconds have passed in an array with three digits
        let time = String(currentTime).split('')
        if (time.length < 2) time.unshift('0', '0')
        else if (time.length < 3) time.unshift('0')

        if (currentTime >= 1000) time = ['9', '9', '9']

        //Rendering information container
        // Rendering bomb attributes
        boardElements.push(<div key={'mines-hundreds'} className={`time time${bombs[0]}`} id='mines_hundreds' />)
        boardElements.push(<div key={'mines-tens'} className={`time time${bombs[1]}`} id='mines_tens' />)
        boardElements.push(<div key={'mines-ones'} className={`time time${bombs[2]}`} id='mines_ones' />)

        // Rendering face attributes
        boardElements.push(<div key={'face'} className={`face ${face}`} style={{marginLeft: style.margin, marginRight: style.margin}} id='face' />)

        // Rendering time attributes
        boardElements.push(<div key={'second- hundreds'} className={`time time${time[0]}`} id='seconds_hundreds' />)
        boardElements.push(<div key={'seconds-tens'} className={`time time${time[1]}`} id='seconds_tens' />)
        boardElements.push(<div key={'seconds-ones'} className={`time time${time[2]}`} id='seconds_ones' />)

        // Rendering end of information container
        boardElements.push(<div key={'lb-border'} className='lb' />)

        // Rendering start of information bottom border
        boardElements.push(<div key={'jbl-border'} className='border jbl' />)

        // Rendering information bottom border
        for (let i = 0; i < length; i++) {
            let borderNum = i + 1
            boardElements.push(<div key={`info-bottom-border-${borderNum}`} className='tb' />)
        }

        // Rendering end of information bottom border
        boardElements.push(<div key={'jbr-border'} className='border jbr' />)
      
        for (let i = 0; i < game.length; i++) {
          for (let j = 0; j < game[i].length; j++) {
            const cellValue = game[i][j];
      
            // Determine the class name based on the cell value
            let className;
            // Rendering start of playing board border
            if (j === 0) boardElements.push(<div key={`left-border-${i}-${j}`} className='sb' />)
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
                setBombsLeft(bombsLeft - 1)
            } else if (cellValue === 'FF' && clicked === 'end') { // Upon game ending, if array value has OF, convert it to a falsebomb
                className = 'square falsebomb'
            } else if ((cellValue === 'R' && clicked === 'end') || node_env === 'development' && (cellValue === 'X' && !clicked)) { // Upon game ending, shift all squares with 'X' to 'R' to show where bombs were
                className = 'square bombrevealed'
            }
            // Add JSX elements to the array
            boardElements.push(<div key={`cell-${i}-${j}`} className={className} />);
            // Rendering end of playing board border
            if (j === game[i].length - 1) boardElements.push(<div key={`right-border-${i}-${j}`} className='sb' />)
          }
        }

        // Rendering bottom left of board
        boardElements.push(<div key={'bl-border'} className='border bl' />)

        // Rendering bottom of board
        for (let i = 0; i < length; i++) {
            let borderNum = i + 1
            boardElements.push(<div key={`bottom-border-${borderNum}`} className='tb' />)
        }

        // Rendering bottom right of board
        boardElements.push(<div key={`br-border`} className='border br' />)
      
        return boardElements;
    }
      

    return (
        <div className='placeholder'>
            {console.log(style)}
            <br /><br /><br />
            {level !== 'custom' && dimensionRender() && (
                <div id='game' style={{height: style.height, width: style.width}}>{renderBoard()}</div>
            )}
            <br/>
            {level === 'custom' ? <CustomBoard /> : <button onClick={newBoard}>Get New Board</button>}
        </div>
    );
}

export default Board
