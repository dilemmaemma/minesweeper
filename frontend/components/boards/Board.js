import React, {useState, useEffect} from 'react'
import { Navigate } from 'react-router'
// import axios from 'axios'

import CustomBoard from './CustomBoard'
// import GenerateBoard from './GenerateBoard'

import '../../css/board.css'

// Set board up with false values to trick the parser into moving on to the next step when Custom Board is called before other gamemodes
let board
let style
let node_env = 'development'
let playing = true

function Board ({difficulty}) {

    const [game, setGame] = useState([])
    const [level, setLevel] = useState(difficulty)
    const [bombsLeft, setBombsLeft] = useState(0)
    const [prevBombsLeft, setPrevBombsLeft] = useState(0) // Make sure when a user flags a square, before bombsLeft goes down, to set prevBombsLeft to current bombsLeft value, then decrement bombsLeft
    const [userGame, setUserGame] = useState([])
    const [face, setFace] = useState('facesmile')
    const [currentBoard, setCurrentBoard] = useState([])
    const [elapsedTime, setElapsedTime] = useState(1)

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

        setElapsedTime(0)
        
    }, [difficulty]);

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

    useEffect(() => {
        if (playing) {
            const intervalId = setInterval(() => {
                setElapsedTime((prevTime) => prevTime + 1);
                if (difficulty !== 'custom') {
                    const updatedBoard = updateBoard()
                    for (let i = 0; i < updatedBoard.boardLocation.length; i++) {
                        
                        setCurrentBoard((prevBoard) => {
                            // Clone the previous board to avoid mutating it directly
                            const updatedBoardCopy = [...prevBoard];
                            
                            for (let i = 0; i < updatedBoard.boardLocation.length; i++) {
                                updatedBoardCopy[updatedBoard.boardLocation[i]] = updatedBoard.boardElements[i]
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
    }, [playing, elapsedTime]);
    
    

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

        setElapsedTime(0)
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

    function updateBoard(coords) {
        setPrevBombsLeft(bombsLeft)
        setBombsLeft(bombsLeft - 1)
        if (coords) {
            let ycord
            let xcord = coords.split(4, 7)
            xcord[1] === '-' ? xcord.pop() : null
            xcord.length === 1 ? ycord = coords.split(7) : ycord = coords.split(8)
        }
        console.log(bombsLeft, prevBombsLeft)
        const boardElements = []
        // Calculate starting position of time: board.width + 7
        const boardLocation = [board.width + 7, board.width + 8, board.width + 9]
        // Calculate square pressed: (width * xpos) + (xpos * 2) + (width * 2) + ypos + 14
        // Calculate position of face: board.width + 6
        let time = String(elapsedTime).padStart(3, '0')
        if (elapsedTime >= 1000) time = '999'

        boardElements.push(<div key={'second- hundreds'} className={`time time${time[0]}`} id='seconds_hundreds' />)
        boardElements.push(<div key={'seconds-tens'} className={`time time${time[1]}`} id='seconds_tens' />)
        boardElements.push(<div key={'seconds-ones'} className={`time time${time[2]}`} id='seconds_ones' />)

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

            boardElements.push(<div key={'mines-hundreds'} className={`time time${bombs[0]}`} id='mines_hundreds' />)
            boardElements.push(<div key={'mines-tens'} className={`time time${bombs[1]}`} id='mines_tens' />)
            boardElements.push(<div key={'mines-ones'} className={`time time${bombs[2]}`} id='mines_ones' />)

            // Calculate starting position of bombs: board.width + 3
            boardLocation.push(board.width + 3, board.width + 4, board.width + 5)
        }

        return {boardElements, boardLocation}
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
        let time = String(elapsedTime).padStart(3, '0')
        // time = String(time).split('')
        // if (time.length < 2) time.unshift('0', '0')
        // else if (time.length < 3) time.unshift('0')

        if (elapsedTime >= 1000) time = '999'

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
      
        for (let i = 0; i < userGame.length; i++) {
          for (let j = 0; j < userGame[i].length; j++) {
            const cellValue = userGame[i][j];
      
            // Determine the class name based on the cell value
            let className;
            // Rendering start of playing board border
            if ( j === 0) boardElements.push(<div key={`left-border-${i}-${j}`} className='sb' />)
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
            boardElements.push(<div key={`cell-${i}-${j}`} className={className} />);
            // Rendering end of playing board border
            if (j === userGame[i].length - 1) boardElements.push(<div key={`right-border-${i}-${j}`} className='sb' />)
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
      
        console.table(boardElements)
        return boardElements;
    }

    return (
        <div className='placeholder'>
            <br /><br /><br />
            {/* {playing && <TimeElapsed onTimeUpdate={handleTimeUpdate}/>} */}
            {level !== 'custom' && dimensionRender() && (
                <div id='game' style={{height: style.height, width: style.width}}>{currentBoard}</div>
            )}
            <br/>
            {level === 'custom' ? <CustomBoard /> : <button onClick={newBoard}>Get New Board</button>}
        </div>
    );
}

export default Board
