import React, {useState, useEffect} from 'react'
import { Navigate } from 'react-router'
// import axios from 'axios'

import CustomBoard from './CustomBoard'
// import GenerateBoard from './GenerateBoard'

import { startKeyListener, stopKeyListener } from '../keyPressListener'

import '../../css/board.css'

// Set board up with false values to trick the parser into moving on to the next step when Custom Board is called before other gamemodes
let board
let style
let time
let node_env = 'development'
let playing = true
let start = false
let clicks = 0

function Board ({difficulty}) {

    const [game, setGame] = useState([])
    const [level, setLevel] = useState(difficulty)
    const [bombsLeft, setBombsLeft] = useState(0)
    const [prevBombsLeft, setPrevBombsLeft] = useState(0) // Make sure when a user flags a square, before bombsLeft goes down, to set prevBombsLeft to current bombsLeft value, then decrement bombsLeft
    const [userGame, setUserGame] = useState([])
    const [face, setFace] = useState('facesmile')
    const [_, setCurrentBoard] = useState([]) //eslint-disable-line
    const [elapsedTime, setElapsedTime] = useState(1)
    const [divider, setDivider] = useState([])
    const [coords, setCoords] = useState([])

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

    // Sets board dimensions on first render
    useEffect(() => {
        setLevel(difficulty)

        if (difficulty === 'easy') {
            board = {
                bombs: 10,
                width: 9,
                height: 9,
            }
            setBombsLeft(10)
            setPrevBombsLeft(10)
        } else if (difficulty === 'medium') {
            board = {
                bombs: 40,
                width: 16,
                height: 16,
            }
            setBombsLeft(40)
            setPrevBombsLeft(40)
        } else if (difficulty === 'hard') {
            board = {
                bombs: 99,
                width: 30,
                height: 16,
            }
            setBombsLeft(99)
            setPrevBombsLeft(99)
        } else if (difficulty === 'custom') {
            board = {
                bombs: 8,
                width: 8,
                height: 8,
            }; 
            setBombsLeft(8);
            setPrevBombsLeft(8); // Placeholder info
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
            setPrevBombsLeft(bombsLeft)
        }

        // Sets the game that the user will see. Updates with values that correspond to the game state
        let hiddenGame = []

        for (let i = 0; i < board.height; i++) {
            let row = []
            for (let j = 0; j < board.width; j++) {
                row.push('O')
            }
            hiddenGame.push(row)
        }

        let bombPlacement = createGameBoard(board)
        setGame(bombPlacement)
        setUserGame(hiddenGame)
        let newGameData = renderClues(bombPlacement)
        setGame(newGameData)

        setElapsedTime(1)
        
    }, [difficulty]);

    // For dev use only - shows board placements
    useEffect(() => {
        // console.clear()
        console.info('Game has been updated.')
        console.info('Show placements:')
        console.table(game)
        console.info('Hide placements:')
        console.table(userGame)
        if (difficulty !== 'custom') {
            const data = renderBoard()
            setCurrentBoard(data)
        } // Placeholder statement
    }, [game])

    // Updates board
    useEffect(() => {
        if (playing && start) {
            const intervalId = setInterval(() => {
                setElapsedTime((prevTime) => prevTime + 1);
                if (difficulty !== 'custom') {
                    const updatedBoard = updateBoard()
                    for (let i = 0; i < updatedBoard.boardLocation.length; i++) {
                        
                        setDivider((prevBoard) => {
                            // Clone the previous board to avoid mutating it directly
                            const updatedBoardCopy = [...prevBoard];
                            
                            for (let i = 0; i < updatedBoard.boardLocation.length; i++) {
                                updatedBoardCopy[updatedBoard.boardLocation[i]] = updatedBoard.element[i]
                            }
                            
                            return updatedBoardCopy;
                        });
                    }
                } // Placeholder statement
            }, 1000);
    
            return () => {
                clearInterval(intervalId);
            };
        }
    }, [playing, start, elapsedTime]);
    
    // Checks for certain key presses
    useEffect(() => {
        function handleKeyPress(event) {
            if (event) console.log(event)

            if (event.key === 'F2') {
                newBoard()
            } 
            // Middle Click sequence
            else if (
                (event.shiftKey 
                    && (event.keyCode === 13 
                    || event.key === ' ')) 
                || (event.button === 1) // Double check that left + right and middle clicks work
            ) {
                    handleMiddleClick()
            }
            else if (event.button === 0 && event.clientX >= 380 && event.clientX <= 410 && event.clientY >= 70 && event.clientY <= 90) {
                setFace('facepressed')
            
                newBoard();
              
                setTimeout(() => {
                      setFace('facesmile')
                      console.log(face)
                }, 100);

                return divider;
            }
            else if (event.button === 2) {
                console.log(coords)
            }              
        }

        startKeyListener(handleKeyPress)

        return () => {
            // Remove the event listener when the component unmounts
            stopKeyListener(handleKeyPress)
        }
    }, [])

    // Checks for changes in face
    useEffect(() => {
        const intervalId = setInterval(() => {
          if (face !== 'facesmile') {
            setFace('facesmile');
          }
          setDivider((prevBoard) => {
            const updatedBoardCopy = [...prevBoard]

            updatedBoardCopy[board.width + 6] = {key: 'face', class: `face ${face}`, style: { marginLeft: style.margin, marginRight: style.margin}, id: 'face'}

            return updatedBoardCopy
          })
        }, 500);
      
        return () => {
          clearInterval(intervalId);
        };
      }, [face]);
      

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
        } else if (level === 'medium') {
            board = {
                bombs: 40,
                width: 16,
                height: 16,
            };
        } else if (difficulty === 'hard') {
            board = {
                bombs: 99,
                width: 30,
                height: 16,
            }
        }
        setBombsLeft(board.bombs)
        setPrevBombsLeft(bombsLeft)
        const bombPlacement = createGameBoard(board);
        return bombPlacement;
    }

    // Function to start a new board
    function newBoard() {
        start = false
        clicks = 0
        time = null
        setGame([]);
        const newGame = createBoard();
        setGame(newGame);
        // Sets the game that the user will see. Updates with values that correspond to the game state
        let hiddenGame = []

        for (let i = 0; i < board.height; i++) {
            let row = []
            for (let j = 0; j < board.width; j++) {
                row.push('O')
            }
            hiddenGame.push(row)
        }

        setUserGame(hiddenGame)
        const newGameData = renderClues(newGame)
        setGame(newGameData);

        setElapsedTime(1)
    }

    function handleMiddleClick() {
        console.log('Middle button/equivalent pressed')
    }

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

    function updateBoard(xpos, ypos, id) {
        // Tests to see if it is the first click. If it is, time starts
        if (clicks === 1 && (time === undefined || time === null)) {
            setElapsedTime(1)
            time = 1
        }
        setPrevBombsLeft(bombsLeft)
        setBombsLeft(bombsLeft - 1) // Placeholder
        const element = []
        const boardLocation = []
        
        // Calculate square pressed: (width * xpos) + (xpos * 2) + (width * 2) + ypos + 14
        if (xpos && ypos) { // Edges of board do not work still
            start = true
            element.push({key: `cell-${xpos}-${ypos}`, xpos: xpos, ypos: ypos, class: `square open${game[xpos][ypos]}`})
            boardLocation.push((board.width * xpos) + (xpos * 2) + (board.width * 2) + ypos + 14)
            console.table(divider)
            console.log(boardLocation)
            console.log(element)
            console.log(`X-cord: ${xpos}\nY-cord: ${ypos}`)
            console.log(`Answer key board's corresponding position is: ${game[xpos][ypos]}`)
        }

        // Calculate starting position of time: board.width + 7
        if (time) {
            time = String(elapsedTime).padStart(3, '0')
            if (elapsedTime >= 1000) time = '999'
    
            element.push({key: 'seconds-hundreds', class: `time time${time[0]}`, id: 'seconds_hundreds'})
            element.push({key: 'seconds-tens', class: `time time${time[1]}`, id: 'seconds_tens'})
            element.push({key: 'seconds-ones', class: `time time${time[2]}`, id: 'seconds_ones'})

            boardLocation.push(board.width + 7, board.width + 8, board.width + 9)
        }

        // Check to see if bomb value has changed
        if (prevBombsLeft !== bombsLeft) {
            let bombs = String(bombsLeft).padStart(3, '0');

            if (bombsLeft < -99) {
                bombs = '-99';
            } else if (bombsLeft < 0 && bombsLeft > -10) {
                bombs = `-0${String(Math.abs(bombsLeft))}`;
            } else if (bombsLeft <= -10 && bombsLeft > -100) {
                bombs = `-${String(Math.abs(bombsLeft))}`
            }

            element.push({key: 'mines-hundreds', class: `time time${bombs[0]}`, id: 'mines_hundreds'})
            element.push({key: 'mines-tens', class: `time time${bombs[1]}`, id: 'mines_tens'})
            element.push({key: 'mines-ones', class: `time time${bombs[2]}`, id: 'mines_ones'})


            // Calculate starting position of bombs: board.width + 3
            boardLocation.push(board.width + 3, board.width + 4, board.width + 5)
        }

        return {element, boardLocation}
    }
    
    function renderClues(game) {
        const newGame = [...game]
        let bombs = 0
        for (let i = 0; i < game.length; i++) {
            for (let j = 0; j < game[i].length; j++) {
                bombs = 0;
                  
                // Helper function to check if a cell is valid (within bounds)
                const isValidCell = (row, col) => {
                    return row >= 0 && row < game.length && col >= 0 && col < game[i].length;
                };
                  
                switch (true) {
                    case i === 0 && j === 0: // Top-left corner
                        if (game[i][j] !== 'X') {
                            if (isValidCell(i, j + 1) && game[i][j + 1] === 'X') bombs++;
                            if (isValidCell(i + 1, j) && game[i + 1][j] === 'X') bombs++;
                            if (isValidCell(i + 1, j + 1) && game[i + 1][j + 1] === 'X') bombs++;
                        } else if (game[i][j] === 'X') {
                            bombs = 9
                        }
                        break;
                    case i === 0 && j === game[i].length - 1: // Top-right corner
                        if (game[i][j] !== 'X') {
                            if (isValidCell(i, j - 1) && game[i][j - 1] === 'X') bombs++;
                            if (isValidCell(i + 1, j) && game[i + 1][j] === 'X') bombs++;
                            if (isValidCell(i + 1, j - 1) && game[i + 1][j - 1] === 'X') bombs++;
                        } else if (game[i][j] === 'X') {
                            bombs = 9
                        }
                        break;
                    case i === game.length - 1 && j === 0: // Bottom-left corner
                        if (game[i][j] !== 'X') {
                            if (isValidCell(i, j + 1) && game[i][j + 1] === 'X') bombs++;
                            if (isValidCell(i - 1, j) && game[i - 1][j] === 'X') bombs++;
                            if (isValidCell(i - 1, j - 1) && game[i - 1][j - 1] === 'X') bombs++;
                        } else if (game[i][j] === 'X') {
                            bombs = 9
                        }
                        break;
                    case i === game.length - 1 && j === game[i].length - 1: // Bottom-right corner
                        if (game[i][j] !== 'X') {
                            if (isValidCell(i, j - 1) && game[i][j - 1] === 'X') bombs++;
                            if (isValidCell(i - 1, j) && game[i - 1][j] === 'X') bombs++;
                            if (isValidCell(i - 1, j - 1) && game[i - 1][j - 1] === 'X') bombs++;
                        } else if (game[i][j] === 'X') {
                            bombs = 9
                        }
                        break;
                    case i === 0 && (j > 0 && j < game[i].length - 1): // Top edge
                        if (game[i][j] !== 'X') {
                            if (isValidCell(i, j + 1) && game[i][j + 1] === 'X') bombs++;
                            if (isValidCell(i, j - 1) && game[i][j - 1] === 'X') bombs++;
                            if (isValidCell(i + 1, j) && game[i + 1][j] === 'X') bombs++;
                            if (isValidCell(i + 1, j + 1) && game[i + 1][j + 1] === 'X') bombs++;
                            if (isValidCell(i + 1, j - 1) && game[i + 1][j - 1] === 'X') bombs++;
                        } else if (game[i][j] === 'X') {
                            bombs = 9
                        }
                        break;
                    case i === game.length - 1 && (j > 0 && j < game[i].length - 1): // Bottom edge
                        if (game[i][j] !== 'X') {
                            if (isValidCell(i, j + 1) && game[i][j + 1] === 'X') bombs++;
                            if (isValidCell(i, j - 1) && game[i][j - 1] === 'X') bombs++;
                            if (isValidCell(i - 1, j) && game[i - 1][j] === 'X') bombs++;
                            if (isValidCell(i - 1, j + 1) && game[i - 1][j + 1] === 'X') bombs++;
                            if (isValidCell(i - 1, j - 1) && game[i - 1][j - 1] === 'X') bombs++;
                        } else if (game[i][j] === 'X') {
                            bombs = 9
                        }
                        break;
                    case j === 0 && (i > 0 && i < game.length - 1): // Left edge
                        if (game[i][j] !== 'X') {
                            if (isValidCell(i, j + 1) && game[i][j + 1] === 'X') bombs++;
                            if (isValidCell(i + 1, j) && game[i + 1][j] === 'X') bombs++;
                            if (isValidCell(i - 1, j) && game[i - 1][j] === 'X') bombs++;
                            if (isValidCell(i - 1, j + 1) && game[i - 1][j + 1] === 'X') bombs++;
                            if (isValidCell(i + 1, j + 1) && game[i + 1][j + 1] === 'X') bombs++;
                        } else if (game[i][j] === 'X') {
                            bombs = 9
                        }
                        break;
                    case j === game[i].length - 1 && (i > 0 && i < game.length - 1): // Right edge
                        if (game[i][j] !== 'X') {
                            if (isValidCell(i, j - 1) && game[i][j - 1] === 'X') bombs++;
                            if (isValidCell(i - 1, j) && game[i - 1][j] === 'X') bombs++;
                            if (isValidCell(i + 1, j) && game[i + 1][j] === 'X') bombs++;
                            if (isValidCell(i + 1, j - 1) && game[i + 1][j - 1] === 'X') bombs++;
                            if (isValidCell(i - 1, j - 1) && game[i - 1][j - 1] === 'X') bombs++;
                        } else if (game[i][j] === 'X') {
                            bombs = 9
                        }
                        break;
                    default: // Middle of the board
                        if (game[i][j] !== 'X') {
                            if (isValidCell(i, j + 1) && game[i][j + 1] === 'X') bombs++;
                            if (isValidCell(i, j - 1) && game[i][j - 1] === 'X') bombs++;
                            if (isValidCell(i - 1, j) && game[i - 1][j] === 'X') bombs++;
                            if (isValidCell(i + 1, j) && game[i + 1][j] === 'X') bombs++;
                            if (isValidCell(i - 1, j - 1) && game[i - 1][j - 1] === 'X') bombs++;
                            if (isValidCell(i - 1, j + 1) && game[i - 1][j + 1] === 'X') bombs++;
                            if (isValidCell(i + 1, j - 1) && game[i + 1][j - 1] === 'X') bombs++;
                            if (isValidCell(i + 1, j + 1) && game[i + 1][j + 1] === 'X') bombs++;
                        } else if (game[i][j] === 'X') {
                            bombs = 9
                        }
                        break;
                }
                  
                // Update the cell with the bomb count
                // Assuming 'setGame' is a function that takes a new game state
                // You should pass the entire updated 'game' array, not just a single cell
                // Modify this part based on how you update your game state
                bombs !== 9 ? newGame[i][j] = bombs.toString() : newGame[i][j] = 'X'
            }
        }
        return newGame
    }

    function renderBoard(clicked) { // Change game to user game so that positions are not revealed
        // DimensionRender() runs before this, meaning you can plug in the specific style into face to make things seamless
        const element = []

        // Variable 'board' is unavailable, so use the stylized properties to calculate the total width of the board
        let length = { ...style.width }
        length = `${length[0]}${length[1]}${length[2]}`
        length = Number((length) - 20) / 16

        // Rendering start of information top border
        element.push({key: 'tl-border', class: 'border tl'})

        // Rendering information top border
        for (let i = 0; i < length; i++) {
            let borderNum = i + 1
            element.push({key: `top-border-${borderNum}`, class: 'tb'})
        }

        // Rendering end of information top border
        element.push({key: 'end-info-border', class: 'border tr'})

        // Rendering start of information container
        element.push({key: 'start-info-container', class: 'lb'})

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
        let time = String(elapsedTime).padStart(3, '0')

        if (elapsedTime >= 1000) time = '999'

        // Rendering information container

        // Rendering bomb attributes
        element.push({key: 'mines-hundreds', class: `time time${bombs[0]}`, id: 'mines_hundreds'})
        element.push({key: 'mines-tens', class: `time time${bombs[1]}`, id: 'mines_tens'})
        element.push({key: 'mines-ones', class: `time time${bombs[2]}}`, id: 'mines_ones'})

        // Rendering face attributes
        element.push({key: 'face', class: `face ${face}`, style: {marginLeft: style.margin, marginRight: style.margin}, id: 'face'})

        // Rendering time attributes
        element.push({key: 'seconds-hundreds', class: `time time${time[0]}`, id: 'seconds_hundreds'})
        element.push({key: 'seconds-tens', class: `time time${time[1]}`, id: 'seconds_tens'})
        // Hard coded so that it will display 0 until a cell is clicked
        element.push({key: 'seconds-ones', class: `time time0`, id: 'seconds_ones'})

        // Rendering end of information container
        element.push({key: 'lb-border', class: 'lb'})

        // Rendering start of information bottom border
        element.push({key: 'jbl-border', class: 'border jbl'})

        // Rendering information bottom border
        for (let i = 0; i < length; i++) {
            let borderNum = i + 1
            element.push({key: `info-bottom-border-${borderNum}`, class: 'tb'})
        }

        // Rendering end of information bottom border
        element.push({key: 'jbr-border', class: 'border jbr'})
      
        for (let i = 0; i < userGame.length; i++) {
          for (let j = 0; j < userGame[i].length; j++) {
            const cellValue = userGame[i][j];
      
            // Determine the class name based on the cell value
            let className;
            // Rendering start of playing board border
            if ( j === 0) {
                element.push({key: `left-border-${i}-${j}`, class: 'sb'})
            }
            if ( cellValue === 'X' && clicked === true) { // Convert only after clicking
              className = `square bombdeath`;
            } else if ( cellValue === 'O' ) {
              className = `square blank`;
            } else if ( cellValue === '1' ) { // Convert only after clicking
              className = `square open1`;
            } else if ( cellValue === '2' ) { // Convert only after clicking
              className = `square open2`;
            } else if ( cellValue === '3' ) { // Convert only after clicking
                className = 'square open3'
            } else if ( cellValue === '4' ) { // Convert only after clicking
                className = 'square open4'
            } else if ( cellValue === '5' ) { // Convert only after clicking
                className = 'square open5'
            } else if ( cellValue === '6' ) { // Convert only after clicking
                className = 'square open6'
            } else if ( cellValue === '7' ) { // Convert only after clicking
                className = 'square open7'
            } else if ( cellValue === '8' ) { // Convert only after clicking
                className = 'square open8'
            } else if ( cellValue === '0' ) { // Convert only after clicking
                className = 'square open0'
            } else if ( cellValue === 'F' && clicked === true ) { // When cell is clicked, change array value to the letter it was followed by F, ex: OF or XF
                className = 'square bombflagged'
                setBombsLeft(bombsLeft - 1)
            } else if ( cellValue === 'FF' && clicked === 'end') { // Upon game ending, if array value has OF, convert it to a falsebomb
                className = 'square falsebomb'
            } else if ( ( cellValue === 'R' && clicked === 'end' ) || node_env === 'development' && ( cellValue === 'X' && !clicked ) ) { // Upon game ending, shift all squares with 'X' to 'R' to show where bombs were
                className = 'square bombrevealed'
            }
            // Add JSX elements to the array
            element.push({key: `cell-${i}-${j}`, xpos: i, ypos: j, class: className})

            // Rendering end of playing board border
            if (j === userGame[i].length - 1) {
                element.push({key: `right-border-${i}-${j}`, class: 'sb'})
            }
          }
        }

        // Rendering bottom left of board
        element.push({key: 'bl-border', class: 'border bl'})

        // Rendering bottom of board
        for (let i = 0; i < length; i++) {
            let borderNum = i + 1
            element.push({key: `bottom-border-${borderNum}`, class: 'tb'})
        }

        // Rendering bottom right of board
        element.push({key: 'br-border', class: 'border br'})

        setDivider(element)
      
        console.table(element)
        return divider;
    }

    return (
        <div className='placeholder'>
            <br /><br /><br />
            {/* {playing && <TimeElapsed onTimeUpdate={handleTimeUpdate}/>} */}
            {level !== 'custom' && dimensionRender() && (
                <div id='game' style={{height: style.height, width: style.width}}>
                    {
                        divider.map((item) => (
                            <div
                              key={item.key}
                              className={item.class}
                              id={item.id ? item.id : undefined}
                              style={
                                item.style
                                  ? {
                                      marginLeft: `${item.style.marginLeft}`,
                                      marginRight: `${item.style.marginRight}`,
                                    }
                                  : undefined
                              }
                              onClick={
                                (item.xpos && item.ypos) || item.id
                                  ? () => {
                                    start = true;
                                    item.id !== 'face' 
                                        ? clicks++
                                        : undefined;
                                    item.id
                                        ? updateBoard(item.xpos, item.ypos, item.id)
                                        : updateBoard(item.xpos, item.ypos)
                                  }
                                  : undefined
                              }
                              onMouseOver={
                                (item.xpos && item.ypos)
                                    ? () => {
                                        setCoords([item.xpos, item.ypos])
                                    }
                                    : undefined
                              }
                            />
                        ))
                    }
                </div>
            )}
            <br/>
        </div>
    );
}

export default Board
