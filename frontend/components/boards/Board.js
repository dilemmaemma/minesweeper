import React, {useState, useEffect} from 'react'
import { Navigate } from 'react-router'
import axios from 'axios'

import CustomBoard from './CustomBoard'

import { startKeyListener, stopKeyListener, startKeyUpListener, stopKeyUpListener } from '../keyPressListener'

import '../../css/board.css'

// Setting initial values needed by the app
let board
let time
let playing = true
let start = false
let clicks = 0
let isFlagged = false
let currentBombs = 0
let style

function Board ({difficulty}) {

    const [game, setGame] = useState([])
    const [level, setLevel] = useState(difficulty)
    const [userGame, setUserGame] = useState([])
    const [face, setFace] = useState('facesmile')
    const [_, setCurrentBoard] = useState([]) //eslint-disable-line
    const [elapsedTime, setElapsedTime] = useState(1)
    const [divider, setDivider] = useState([])
    const [coords, setCoords] = useState([])
    const [initialBombs, setInitialBombs] = useState(0)

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
        setFace('facesmile')
        if (difficulty === 'custom') {
            <div>
                <CustomBoard />
            </div>
        } else {
            playing = true
            dimensionRender()
            newBoard() 
        }
    }, [difficulty]);

    // For dev use only - shows board placements
    useEffect(() => {
        // console.clear()
        console.info('Game has been updated.')
        console.info('Board placements:')
        console.table(game)
        if (difficulty !== 'custom') {
            const data = renderBoard()
            setCurrentBoard(data)
        } // Placeholder statement
    }, [game])

    // Updates time
    useEffect(() => {
        if (start) {
          const intervalId = setInterval(() => {
            setElapsedTime((prevTime) => prevTime + 1);
            if (difficulty !== 'custom') {
              const updatedBoard = setTime();
              
              setDivider((prevBoard) => {
                // Clone the previous board to avoid mutating it directly
                const updatedBoardCopy = [...prevBoard];
                
                for (let i = 0; i < updatedBoard.boardLocation.length; i++) {
                    updatedBoardCopy[updatedBoard.boardLocation[i]] = updatedBoard.element[i];
                }
                
                return updatedBoardCopy;
              });
            } // Placeholder statement
          }, 1000);
      
          return () => {
            clearInterval(intervalId);
          };
        }
      }, [start, elapsedTime]);
      
    // Checks for certain key presses
    useEffect(() => {
        function handleKeyPress(event) {
            if (event.key === 'F2') {
                newBoard()
            } 
            // Check for victory when placing flags
            else if (
                event.button === 2 && 
                ((coords[0] >= 0 && 
                    coords[0] <= 8) && 
                (coords[1] >=0 && 
                    coords[1] <= 8))) 
                    {
                        checkForVictory()
                    }
            // Middle Click sequence
            else if (
                (event.shiftKey 
                    && (event.keyCode === 13 
                    || event.key === ' ')) 
                || (event.button === 1) &&
                divider[
                    (board.width * coords[0]) + 
                    (coords[0] * 2) + 
                    (board.width * 2) + 
                    (coords[1]) + 
                    14
                ].class !== 'square blank' &&
                divider[
                    (board.width * coords[0]) + 
                    (coords[0] * 2) + 
                    (board.width * 2) + 
                    (coords[1]) + 
                    14
                ].id !== 'face'
            ) {
                    revealNeighboringCells(coords)
            }
            else if (event.button === 0 && 
                event.clientX >= 380 && 
                event.clientX <= 410 && 
                event.clientY >= 70 && 
                event.clientY <= 90) 
            {
                setFace('facepressed')
                setDivider((prevBoard) => {
                    const updatedBoardCopy = [...prevBoard]

                    updatedBoardCopy[level !== 'custom' ? board.width + 6 : 6] = {
                        key: 'face',
                        class: 'face facepressed',
                        style: {
                            marginLeft: style.margin, 
                            marginRight: style.margin
                        },
                        id: 'face'
                    }
                    return updatedBoardCopy
                })
            
                newBoard();
              
                setTimeout(() => {
                    setFace('facesmile')
                    setDivider((prevBoard) => {
                        const updatedBoardCopy = [...prevBoard]
    
                        updatedBoardCopy[board.width + 6] = {
                            key: 'face',
                            class: 'face facepressed',
                            style: {
                                marginLeft: style.margin, 
                                marginRight: style.margin
                            },
                            id: 'face'
                        }
                        return updatedBoardCopy
                    })
                      
                }, 100);

            }
            else if (event.button === 0 && 
                ((coords[0] >= 0 && coords[0] <= 8) && 
                    (coords[1] >= 0 && coords[1] <= 8)) &&
                    !(event.clientX >= 380 && 
                        event.clientX <= 410 && 
                        event.clientY >= 70 && 
                        event.clientY <= 90)) {
                        setFace('faceooh')
                        setDivider((prevBoard) => {
                            const updatedBoardCopy = [...prevBoard]
        
                            updatedBoardCopy[board.width + 6] = {
                                key: 'face',
                                class: 'face faceooh',
                                style: {
                                    marginLeft: style.margin, 
                                    marginRight: style.margin
                                },
                                id: 'face'
                            }
                            return updatedBoardCopy
                        })

                    }            
        }

        startKeyListener(handleKeyPress)

        return () => {
            // Remove the event listener when the component unmounts
            stopKeyListener(handleKeyPress)
        }
    }, [coords])

    // Checks for certain key ups
    useEffect(() => {
        function handleKeyUp(event) {
            // Checks to see if left click is released
            if (event.button === 0 && 
                ((coords[0] >= 0 && coords[0] <= 8) && 
                    (coords[1] >= 0 && coords[1] <= 8)) &&
                    !(event.clientX >= 380 && 
                        event.clientX <= 410 && 
                        event.clientY >= 70 && 
                        event.clientY <= 90)) {
                setFace('facesmile')
                setDivider((prevBoard) => {
                    const updatedBoardCopy = [...prevBoard]

                    updatedBoardCopy[board.width + 6] = {
                        key: 'face',
                        class: 'face facesmile',
                        style: {
                            marginLeft: style.margin, 
                            marginRight: style.margin
                        },
                        id: 'face'
                    }
                    return updatedBoardCopy
                })

                return divider
            }
        }

        startKeyUpListener(handleKeyUp)

        return () => {
            // Remove the event listener when the component unmounts
            stopKeyUpListener(handleKeyUp)
        }
    }, [coords])

    // Checks for changes in face
    useEffect(() => {
        if (level !== 'custom') {
            const intervalId = setInterval(() => {
                if (face === 'facepressed') {
                  setFace('facesmile');
                }
                setDivider((prevBoard) => {
                  const updatedBoardCopy = [...prevBoard]
      
                  updatedBoardCopy[board.width + 6] = 
                      {
                          key: 'face', 
                          class: `face ${face}`, 
                          style: { 
                              marginLeft: style.margin, 
                              marginRight: style.margin
                          }, 
                          id: 'face'
                      }
      
                  return updatedBoardCopy
                })
              }, 500);
            
              return () => {
                clearInterval(intervalId);
              };
        }
      }, [face]);
    
    // Checks for victory
    useEffect(() => {
        if (start) {
            const victoryCheckInterval = setInterval(checkForVictory, 100);

            return () => {
                clearInterval(victoryCheckInterval)
            }
        }
    }, [start])

    // Generates random bomb positions for game  
    function generateRandomBombPositions(board) {
        const bombPositions = [];
      
        while (bombPositions.length < board.bombs) {
            const x = Math.floor(
                Math.random() * 
                board.width
            );
            const y = Math.floor(
                Math.random() * 
                board.height
            );
            const position = `${x}-${y}`;
          
            // Ensure there are no duplicates
            if (!bombPositions.includes(position)) {
                bombPositions.push(position);
            }
        }
          
        return bombPositions;
    }
     
    // Creates the entire game board
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

    function customBoard () {
        return <CustomBoard />
    }

    // Sets basic constraints for each difficulty
    async function createBoard() {
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
        } else if (level === 'hard') {
            board = {
                bombs: 99,
                width: 30,
                height: 16,
            }
        } else if (level === 'custom') {
            customBoard()
            try {
                const response = await axios.get('http://localhost:9000/api/customboard/board')
                console.log(response)
            } catch (error) {
                console.error(error)
            }
        }
        
        if (level !== 'custom') {
            setLevel(difficulty)
            currentBombs = board.bombs
            setInitialBombs(board.bombs)
            const bombPlacement = createGameBoard(board);
            return bombPlacement;
        }
    }

    // Function to start a new board
    async function newBoard() {
        start = false
        playing = true
        clicks = 0
        time = null
        setGame([]);
        setDivider([]);
        setFace('facesmile');
        const newGame = await createBoard();
        setGame(newGame);
        // Sets the game that the user will see. Updates with values that correspond to the game state
        let hiddenGame = []

        if (level !== 'custom') {
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
        }

        setElapsedTime(1)
    }

    // Generate dimensions of board
    function dimensionRender() {
        if (difficulty === 'easy') return (
            style = { 
                height: '206px',
                width: '164px', 
                margin: '14px' 
            }
        )
        else if (difficulty === 'medium') return (
            style ={ 
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
        else if (difficulty === 'custom') {
            axios.get(`localhost:9000/api/customboard/board`)
                .then(res => {
                    console.log(res.data)
                    return (
                       style = { 
                           height: `${String((res.data.height * 16) + 62)}px`, 
                           width: `${String((res.data.width * 16) + 20)}px`, 
                           margin: `${String(((res.data.width * 16) - 116) / 2)}`, 
                       })
                })
                .catch(err => {
                    console.error(err)
                })
        }
    }

    // Updates time every second
    function setTime() {
        // Tests to see if it is the first click. If it is, time starts
        if (clicks === 1 && 
            (time === undefined || 
                time === null)) 
            {
                time = 1
            }

        const element = []
        const boardLocation = []

        // Calculate starting position of time: board.width + 7
        if (time) {
            time = String(elapsedTime).padStart(3, '0')
            if (elapsedTime >= 1000) time = '999'
    
            element.push({
                key: 'seconds-hundreds', 
                class: `time time${time[0]}`, 
                id: 'seconds_hundreds'
            })
            element.push({
                key: 'seconds-tens', 
                class: `time time${time[1]}`, 
                id: 'seconds_tens'
            })
            element.push({
                key: 'seconds-ones', 
                class: `time time${time[2]}`, 
                id: 'seconds_ones'
            })

            boardLocation.push(
                board.width + 7, 
                board.width + 8, 
                board.width + 9
            )
        }

        return {element, boardLocation}
    }
    
    // Creates the numbers on the board that give the user clues to bomb placements
    function renderClues(game) {
        const newGame = [...game]
        let bombs = 0
        for (let i = 0; i < game.length; i++) {
            for (let j = 0; j < game[i].length; j++) {
                bombs = 0;
                  
                // Helper function to check if a cell is valid (within bounds)
                const isValidCell = (row, col) => {
                    return row >= 0 
                        && row < game.length 
                        && col >= 0 
                        && col < game[i].length;
                };
                  
                switch (true) {
                    case i === 0 && j === 0: // Top-left corner
                        if (game[i][j] !== 'X') {
                            if (
                                isValidCell(i, j + 1) 
                                && game[i][j + 1] === 'X'
                            ) bombs++;
                            if (
                                isValidCell(i + 1, j) 
                                && game[i + 1][j] === 'X'
                            ) bombs++;
                            if (
                                isValidCell(i + 1, j + 1) 
                                && game[i + 1][j + 1] === 'X'
                            ) bombs++;
                        } else if (
                            game[i][j] === 'X'
                        ) 
                            {
                                bombs = 9
                            }
                        break;
                    case i === 0 && j === game[i].length - 1: // Top-right corner
                        if (game[i][j] !== 'X') {
                            if (
                                isValidCell(i, j - 1) 
                                && game[i][j - 1] === 'X'
                            ) bombs++;
                            if (
                                isValidCell(i + 1, j) 
                                && game[i + 1][j] === 'X'
                            ) bombs++;
                            if (
                                isValidCell(i + 1, j - 1) 
                                && game[i + 1][j - 1] === 'X'
                            ) bombs++;
                        } else if (
                            game[i][j] === 'X'
                        ) 
                            {
                                bombs = 9
                            }
                        break;
                    case i === game.length - 1 && j === 0: // Bottom-left corner
                        if (game[i][j] !== 'X') {
                            if (
                                isValidCell(i, j + 1) 
                                && game[i][j + 1] === 'X'
                            ) bombs++;
                            if (
                                isValidCell(i - 1, j) 
                                && game[i - 1][j] === 'X'
                            ) bombs++;
                            if (
                                isValidCell(i - 1, j - 1) 
                                && game[i - 1][j - 1] === 'X'
                            ) bombs++;
                        } else if (
                            game[i][j] === 'X'
                        ) 
                            {
                                bombs = 9
                            }
                        break;
                    case i === game.length - 1 && j === game[i].length - 1: // Bottom-right corner
                        if (game[i][j] !== 'X') {
                            if (
                                isValidCell(i, j - 1) 
                                && game[i][j - 1] === 'X'
                            ) bombs++;
                            if (
                                isValidCell(i - 1, j) 
                                && game[i - 1][j] === 'X'
                            ) bombs++;
                            if (
                                isValidCell(i - 1, j - 1) 
                                && game[i - 1][j - 1] === 'X'
                            ) bombs++;
                        } else if (
                            game[i][j] === 'X'
                        ) 
                            {
                                bombs = 9
                            }
                        break;
                    case i === 0 && 
                        (
                            j > 0 
                            && j < game[i].length - 1
                        ): // Top edge
                        if (game[i][j] !== 'X') {
                            if (
                                isValidCell(i, j + 1) 
                                && game[i][j + 1] === 'X'
                            ) bombs++;
                            if (
                                isValidCell(i, j - 1) 
                                && game[i][j - 1] === 'X'
                            ) bombs++;
                            if (
                                isValidCell(i + 1, j) 
                                && game[i + 1][j] === 'X'
                            ) bombs++;
                            if (
                                isValidCell(i + 1, j + 1) 
                                && game[i + 1][j + 1] === 'X'
                            ) bombs++;
                            if (
                                isValidCell(i + 1, j - 1) 
                                && game[i + 1][j - 1] === 'X'
                            ) bombs++;
                        } else if (
                            game[i][j] === 'X'
                        ) 
                            {
                                bombs = 9
                            }
                        break;
                    case i === game.length - 1 && 
                        (
                            j > 0 
                            && j < game[i].length - 1
                        ): // Bottom edge
                        if (game[i][j] !== 'X') {
                            if (
                                isValidCell(i, j + 1) 
                                && game[i][j + 1] === 'X'
                            ) bombs++;
                            if (
                                isValidCell(i, j - 1) 
                                && game[i][j - 1] === 'X'
                            ) bombs++;
                            if (
                                isValidCell(i - 1, j) 
                                && game[i - 1][j] === 'X'
                            ) bombs++;
                            if (
                                isValidCell(i - 1, j + 1) 
                                && game[i - 1][j + 1] === 'X'
                            ) bombs++;
                            if (
                                isValidCell(i - 1, j - 1) 
                                && game[i - 1][j - 1] === 'X'
                            ) bombs++;
                        } else if (
                            game[i][j] === 'X'
                        ) 
                            {
                                bombs = 9
                            }
                        break;
                    case j === 0 && 
                        (
                            i > 0 
                            && i < game.length - 1
                        ): // Left edge
                        if (game[i][j] !== 'X') {
                            if (
                                isValidCell(i, j + 1) 
                                && game[i][j + 1] === 'X'
                            ) bombs++;
                            if (
                                isValidCell(i + 1, j) 
                                && game[i + 1][j] === 'X'
                            ) bombs++;
                            if (
                                isValidCell(i - 1, j) 
                                && game[i - 1][j] === 'X'
                            ) bombs++;
                            if (
                                isValidCell(i - 1, j + 1) 
                                && game[i - 1][j + 1] === 'X'
                            ) bombs++;
                            if (
                                isValidCell(i + 1, j + 1) 
                                && game[i + 1][j + 1] === 'X'
                            ) bombs++;
                        } else if (
                            game[i][j] === 'X'
                        ) 
                            {
                                bombs = 9
                            }
                        break;
                    case j === game[i].length - 1 && 
                        (
                            i > 0 
                            && i < game.length - 1
                        ): // Right edge
                        if (game[i][j] !== 'X') {
                            if (
                                isValidCell(i, j - 1) 
                                && game[i][j - 1] === 'X'
                            ) bombs++;
                            if (
                                isValidCell(i - 1, j) 
                                && game[i - 1][j] === 'X'
                            ) bombs++;
                            if (
                                isValidCell(i + 1, j) 
                                && game[i + 1][j] === 'X'
                            ) bombs++;
                            if (
                                isValidCell(i + 1, j - 1) 
                                && game[i + 1][j - 1] === 'X'
                            ) bombs++;
                            if (
                                isValidCell(i - 1, j - 1) 
                                && game[i - 1][j - 1] === 'X'
                            ) bombs++;
                        } else if (
                            game[i][j] === 'X'
                        ) 
                            {
                                bombs = 9
                            }
                        break;
                    default: // Middle of the board
                        if (game[i][j] !== 'X') {
                            if (
                                isValidCell(i, j + 1) 
                                && game[i][j + 1] === 'X'
                            ) bombs++;
                            if (
                                isValidCell(i, j - 1) 
                                && game[i][j - 1] === 'X'
                            ) bombs++;
                            if (
                                isValidCell(i - 1, j) 
                                && game[i - 1][j] === 'X'
                            ) bombs++;
                            if (
                                isValidCell(i + 1, j) 
                                && game[i + 1][j] === 'X'
                            ) bombs++;
                            if (
                                isValidCell(i - 1, j - 1) 
                                && game[i - 1][j - 1] === 'X'
                            ) bombs++;
                            if (
                                isValidCell(i - 1, j + 1) 
                                && game[i - 1][j + 1] === 'X'
                            ) bombs++;
                            if (
                                isValidCell(i + 1, j - 1) 
                                && game[i + 1][j - 1] === 'X'
                            ) bombs++;
                            if (
                                isValidCell(i + 1, j + 1) 
                                && game[i + 1][j + 1] === 'X'
                            ) bombs++;
                        } else if (
                            game[i][j] === 'X'
                        ) 
                            {
                                bombs = 9
                            }
                        break;
                }
                  
                // Update the cell with the bomb count
                bombs !== 9 
                    ? newGame[i][j] = bombs.toString() 
                    : newGame[i][j] = 'X'
            }
        }
        return newGame
    }

    // Creates an array with divs inside to render to the DOM
    function renderBoard() {
        dimensionRender()
        const element = []

        // Calculate the total width of the board
        console.log(style)
        let length = { ...style.width }
        length = `${length[0]}${length[1]}${length[2]}`
        length = Number((length) - 20) / 16

        // Rendering start of information top border
        element.push({
            key: 'tl-border', 
            class: 'border tl'
        })

        // Rendering information top border
        for (let i = 0; i < length; i++) {
            let borderNum = i + 1
            element.push({
                key: `top-border-${borderNum}`, 
                class: 'tb'
            })
        }

        // Rendering end of information top border
        element.push({
            key: 'end-info-border', 
            class: 'border tr'
        })

        // Rendering start of information container
        element.push({
            key: 'start-info-container', 
            class: 'lb'
        })

        // Creating a variable to hold how many bombs are left in an array with three digits
        let bombs = String(currentBombs).padStart(3, '0')

        if (currentBombs <= -99) bombs = '-99'

        // Creating a variable to hold how many seconds have passed in an array with three digits
        let time = String(elapsedTime).padStart(3, '0')

        if (elapsedTime >= 1000) time = '999'

        // Rendering information container

        // Rendering bomb attributes
        element.push({
            key: 'mines-hundreds', 
            class: `time time${bombs[0]}`, 
            id: 'mines_hundreds'
        })
        element.push({
            key: 'mines-tens', 
            class: `time time${bombs[1]}`, 
            id: 'mines_tens'
        })
        element.push({
            key: 'mines-ones', 
            class: `time time${bombs[2]}}`, 
            id: 'mines_ones'
        })

        // Rendering face attributes
        element.push({
            key: 'face', 
            class: `face ${face}`, 
            style: {
                marginLeft: style.margin, 
                marginRight: style.margin
            }, 
            id: 'face'
        })

        // Rendering time attributes
        element.push({
            key: 'seconds-hundreds', 
            class: `time time${time[0]}`, 
            id: 'seconds_hundreds'
        })
        element.push({
            key: 'seconds-tens', 
            class: `time time${time[1]}`, 
            id: 'seconds_tens'
        })
        // Hard coded so that it will display 0 until a cell is clicked
        element.push({
            key: 'seconds-ones', 
            class: `time time0`, 
            id: 'seconds_ones'
        })

        // Rendering end of information container
        element.push({
            key: 'lb-border', 
            class: 'lb'
        })

        // Rendering start of information bottom border
        element.push({
            key: 'jbl-border', 
            class: 'border jbl'
        })

        // Rendering information bottom border
        for (let i = 0; i < length; i++) {
            let borderNum = i + 1
            element.push({
                key: `info-bottom-border-${borderNum}`, 
                class: 'tb'
            })
        }

        // Rendering end of information bottom border
        element.push({
            key: 'jbr-border', 
            class: 'border jbr'
        })
      
        for (let i = 0; i < userGame.length; i++) {
          for (let j = 0; j < userGame[i].length; j++) {
            const cellValue = userGame[i][j];
      
            // Determine the class name based on the cell value
            let className;

            // Rendering start of playing board border
            if ( j === 0) 
                {
                    element.push({
                        key: `left-border-${i}-${j}`, 
                        class: 'sb'
                    })
                }
            if ( cellValue === 'O' ) 
                {
                    className = 'square blank'
                }

            // Add JSX elements to the array
            element.push({
                key: `cell-${i}-${j}`, 
                xpos: i, 
                ypos: j, 
                class: className
            })

            // Rendering end of playing board border
            if (j === userGame[i].length - 1) 
                {
                    element.push({
                        key: `right-border-${i}-${j}`, 
                        class: 'sb'
                    })
                }
          }
        }

        // Rendering bottom left of board
        element.push({
            key: 'bl-border', 
            class: 'border bl'
        })

        // Rendering bottom of board
        for (let i = 0; i < length; i++) {
            let borderNum = i + 1
            element.push({
                key: `bottom-border-${borderNum}`, 
                class: 'tb'
            })
        }

        // Rendering bottom right of board
        element.push({
            key: 'br-border', 
            class: 'border br'
        })

        setDivider(element)
      
        return divider;
    }

    // Updates bombs based upon flagging/unflagging
    function setBombs(name, xpos, ypos) {
        if (isFlagged) {
            currentBombs += 1

            isFlagged = false

            setUserGame((prevGame) => {
                const userCopy = [...prevGame]

                userCopy[xpos][ypos]= 'O'
                return userCopy
            })
            setDivider((prevBoard) => {
                const updatedBoardCopy = [...prevBoard]

                let bombs = String(currentBombs).padStart(3, '0');

                if (currentBombs < -99) {
                    bombs = '-99';
                } else if (currentBombs < 0 
                    && currentBombs > -10) 
                    {
                    bombs = `-0${String(Math.abs(currentBombs))}`;
                    } 
                else if (currentBombs <= -10 
                    && currentBombs > -100) 
                    {
                    bombs = `-${String(Math.abs(currentBombs))}`
                    }

                updatedBoardCopy[board.width + 3] = {
                    key: 'mines-hundreds', 
                    class: `time time${bombs[0]}`, 
                    id: 'mines_hundreds'
                }
                updatedBoardCopy[board.width + 4] = {
                    key: 'mines-tens', 
                    class: `time time${bombs[1]}`, 
                    id: 'mines_tens'
                }
                updatedBoardCopy[board.width + 5] = {
                    key: 'mines-ones', 
                    class: `time time${bombs[2]}`, 
                    id: 'mines_ones'}

                updatedBoardCopy[
                    (board.width * coords[0]) + 
                    (coords[0] * 2) + 
                    (board.width * 2) + 
                    coords[1] + 
                    14
                ] = {
                    key: `cell-${coords[0]}-${coords[1]}`, 
                    xpos: coords[0], 
                    ypos: coords[1], 
                    class: 'square blank'
                }

                return updatedBoardCopy
            })
        } else if (!isFlagged && 
            name === 'square blank') 
            {
                currentBombs -= 1

                setUserGame((prevGame) => {
                    const userCopy = [...prevGame]
    
                    userCopy[xpos][ypos]= 'F'
                    return userCopy
                })

                setDivider((prevBoard) => {
                    const updatedBoardCopy = [...prevBoard]

                    let bombs = String(currentBombs).padStart(3, '0');

                    if (currentBombs < -99) {
                        bombs = '-99';
                    } else if (currentBombs < 0 
                        && currentBombs > -10) 
                        {
                        bombs = `-0${String(Math.abs(currentBombs))}`;
                        } 
                    else if (currentBombs <= -10 
                        && currentBombs > -100) 
                        {
                        bombs = `-${String(Math.abs(currentBombs))}`
                        }

                    updatedBoardCopy[board.width + 3] = {
                        key: 'mines-hundreds', 
                        class: `time time${bombs[0]}`, 
                        id: 'mines_hundreds'
                    }
                    updatedBoardCopy[board.width + 4] = {
                        key: 'mines-tens', 
                        class: `time time${bombs[1]}`, 
                        id: 'mines_tens'
                    }
                    updatedBoardCopy[board.width + 5] = {
                        key: 'mines-ones', 
                        class: `time time${bombs[2]}`, 
                        id: 'mines_ones'
                    }

                    updatedBoardCopy[
                        (board.width * coords[0]) + 
                        (coords[0] * 2) + 
                        (board.width * 2) + 
                        coords[1] + 
                        14
                    ] = {
                        key: `cell-${coords[0]}-${coords[1]}`, 
                        xpos: coords[0], 
                        ypos: coords[1], 
                        class: 'square bombflagged', 
                        id: 'flagged'
                    }

                    return updatedBoardCopy
                })
            }
    }

    // Updates squares based upon clicks and what is inside of the game array
    function setSquares(xpos, ypos, id) {
        if (game[xpos][ypos] >= '1' && 
            game[xpos][ypos] <= '8' && 
            id !== 'flagged') 
            {
                setDivider((prevBoard) => {
                    const updatedBoardCopy = [...prevBoard]

                    updatedBoardCopy[
                        (board.width * xpos) + 
                        (xpos * 2) + 
                        (board.width * 2) + 
                        ypos + 
                        14
                    ] = {
                        key: `cell-${xpos}-${ypos}`, 
                        xpos: xpos, 
                        ypos: ypos, 
                        class: `square open${
                            game[xpos][ypos]
                        }`}

                    return updatedBoardCopy
                })

                setUserGame((prevGame) => {
                    const updatedGame = [...prevGame]

                    updatedGame[xpos][ypos] = String(game[xpos][ypos])
                    return updatedGame
                })
            }

        if (game[xpos][ypos] === 'X' && id !== 'flagged') {
            onDeath(xpos, ypos)
        }

        if (game[xpos][ypos] === '0' && 
            id !== 'flagged') {
            setDivider((prevBoard) => {
                const updatedBoardCopy = [...prevBoard]
                // Check if the cell is within the bounds of the game board
                if (xpos < 0 
                    || xpos >= game.length 
                    || ypos < 0 
                    || ypos >= game[0].length
                ) 
                    {
                        return;
                    }

                // Check if the cell has already been revealed or flagged
                if (game[xpos][ypos] !== '0' || 
                    divider[
                        (board.width * xpos) + 
                        (xpos * 2) + 
                        (board.width * 2) + 
                        ypos + 
                        14
                    ]
                    .id === 'flagged') 
                    {
                        return;
                    }

                setUserGame((prevGame) => {
                    const updatedGame = [...prevGame]

                    updatedGame[xpos][ypos] = '0'
                    return updatedGame
                })

                // Set the cell as revealed
                updatedBoardCopy[
                    (board.width * xpos) + 
                    (xpos * 2) + 
                    (board.width * 2) + 
                    ypos + 
                    14
                ] = {
                    key: `cell-${xpos}-${ypos}`, 
                    xpos: xpos, 
                    ypos: ypos, 
                    class: `square open0`
                };

                // Define the neighbors' positions (assuming 8 neighboring cells)
                const neighbors = [
                    [-1, -1], [-1, 0], [-1, 1],
                    [0, -1],           [0, 1],
                    [1, -1], [1, 0], [1, 1]
                ];

                // Recursively reveal neighboring cells
                for (const [dx, dy] of neighbors) {
                    revealEmptyCells(xpos + dx, ypos + dy);
                }

                return updatedBoardCopy
            })
        }
        checkForVictory()     
    }

    // Reveals all empty cells when an empty cell is pressed until encountering a number
    function revealEmptyCells(x, y) {
        const visited = new Set(); // To keep track of visited cells
      
        function dfs(x, y) {
            // Check if the cell is within the bounds of the game board
            if (x < 0 || 
                x >= game.length || 
                y < 0 || 
                y >= game[0].length) 
                {
                    return;
                }
        
            // Check if the cell has already been visited, flagged, or contains a bomb
            const cellKey = `cell-${x}-${y}`;
            if (
                visited.has(cellKey) || 
                divider[
                    (board.width * x) + 
                    (x * 2) + 
                    (board.width * 2) + 
                    y + 
                    14
                ]
                .id === 'flagged' 
                || game[x][y] === 'X'
            ) 
                {
                    return;
                }
        
            // Mark the cell as visited
            visited.add(cellKey);

            // Check the cell's value
            const cellValue = game[x][y]
        
            // Set the cell as revealed
            if (cellValue === '0') {
                setDivider((prevBoard) => {
                    const updatedBoardCopy = [...prevBoard]
                    updatedBoardCopy[
                        (board.width * x) + 
                        (x * 2) + 
                        (board.width * 2) + 
                        y + 
                        14
                    ] = {
                        key: cellKey, 
                        xpos: x, 
                        ypos: y, 
                        class: `square open${game[x][y]}`
                    }
    
                    return updatedBoardCopy
                })

                setUserGame((prevGame) => {
                    const updatedGame = [...prevGame]

                    updatedGame[x][y] = '0'
                    return updatedGame
                })
            
                // Define the neighboring positions
                const neighbors = [
                    [-1, -1], [-1, 0], [-1, 1],
                    [0, -1],           [0, 1],
                    [1, -1], [1, 0], [1, 1]
                ];
            
                // Recursively reveal neighboring cells
                for (const [dx, dy] of neighbors) {
                    dfs(x + dx, y + dy);userGame
                }
            } 
            // If the cell contains a number, just reveal it
            else if (cellValue !== 'X') {
                setDivider((prevBoard) => {
                    const updatedBoardCopy = [...prevBoard]
                    updatedBoardCopy[
                        (board.width * x) + 
                        (x * 2) + 
                        (board.width * 2) + 
                        y + 
                        14
                    ] = {
                        key: cellKey, 
                        xpos: x, 
                        ypos: y, 
                        class: `square open${game[x][y]}`
                    }
    
                    return updatedBoardCopy
                })

                setUserGame((prevGame) => {
                    const updatedGame = [...prevGame]

                    updatedGame[x][y] = String(game[x][y])
                    return updatedGame
                })
            }
        }
        
            // Start the DFS from the initial cell
            dfs(x, y);
    }
    
    // Reveals all squares around an opened cell with a middle click. If a bomb is revealed, instant death
    function revealNeighboringCells(coords) {
        const xpos = coords[0]
        const ypos = coords[1]  
                  
        switch (true) {

            // Top-left corner
            case xpos === 0 && ypos === 0:
                setDivider((prevBoard) => {
                    const updatedBoardCopy = [...prevBoard]

                    updatedBoardCopy[
                        (board.width * xpos) + 
                            (xpos * 2) + 
                            (board.width * 2) + 
                            (ypos + 1) + 
                            14
                        ].id !== 'flagged' ? {
                            key: `cell-${xpos}-${ypos + 1}`, 
                            xpos: xpos, 
                            ypos: ypos + 1, 
                            class: `square ${
                                game[xpos][ypos + 1] !== 'X' 
                                ? 'open' + game[xpos][ypos + 1] 
                                : onDeath(xpos, ypos + 1)}`
                        } : null

                    updatedBoardCopy[
                        (board.width * (xpos + 1)) + 
                            ((xpos + 1) * 2) + 
                            (board.width * 2) + 
                            (ypos) + 
                            14
                        ].id !== 'flagged' ? {
                            key: `cell-${xpos + 1}-${ypos}`, 
                            xpos: xpos + 1, 
                            ypos: ypos, 
                            class: `square ${
                                game[xpos + 1][ypos] !== 'X' 
                                ? 'open' + game[xpos + 1][ypos] 
                                : onDeath(xpos + 1, ypos)}`
                        } : null

                    updatedBoardCopy[
                        (board.width * (xpos + 1)) + 
                            ((xpos + 1) * 2) + 
                            (board.width * 2) + 
                            (ypos + 1) + 
                            14
                        ].id !== 'flagged' ? {
                            key: `cell-${xpos + 1}-${ypos + 1}`, 
                            xpos: xpos + 1, 
                            ypos: ypos + 1, 
                            class: `square ${
                                game[xpos + 1][ypos + 1] !== 'X' 
                                ? 'open' + game[xpos + 1][ypos + 1] 
                                : onDeath(xpos + 1, ypos + 1)}`
                        } : null

                    return updatedBoardCopy
                })

                break;

            // Top-right corner
            case xpos === 0 && ypos === game[xpos].length - 1:
                setDivider((prevBoard) => {
                    const updatedBoardCopy = [...prevBoard]

                    updatedBoardCopy[
                        (board.width * xpos) + 
                            (xpos * 2) + 
                            (board.width * 2) + 
                            (ypos - 1) + 
                            14
                        ].id !== 'flagged' ? {
                            key: `cell-${xpos}-${ypos - 1}`, 
                            xpos: xpos, 
                            ypos: ypos - 1, 
                            class: `square ${
                                game[xpos][ypos - 1] !== 'X' 
                                ? 'open' + game[xpos][ypos - 1] 
                                : onDeath(xpos, ypos - 1)}`
                        } : null

                    updatedBoardCopy[
                        (board.width * (xpos + 1)) + 
                            ((xpos + 1) * 2) + 
                            (board.width * 2) + 
                            (ypos) + 
                            14
                        ].id !== 'flagged' ? {
                            key: `cell-${xpos + 1}-${ypos}`, 
                            xpos: xpos + 1, 
                            ypos: ypos, 
                            class: `square ${
                                game[xpos + 1][ypos] !== 'X' 
                                ? 'open' + game[xpos + 1][ypos] 
                                : onDeath(xpos + 1, ypos)}`
                        } : null

                    updatedBoardCopy[
                        (board.width * (xpos + 1)) + 
                            ((xpos + 1) * 2) + 
                            (board.width * 2) + 
                            (ypos - 1) + 
                            14
                        ].id !== 'flagged' ? {
                            key: `cell-${xpos + 1}-${ypos - 1}`, 
                            xpos: xpos + 1, 
                            ypos: ypos - 1, 
                            class: `square ${
                                game[xpos + 1][ypos - 1] !== 'X' 
                                ? 'open' + game[xpos + 1][ypos - 1] 
                                : onDeath(xpos + 1, ypos - 1)}`
                        } : null

                    return updatedBoardCopy
                })

                break;

            // Bottom-left corner
            case xpos === game.length - 1 && ypos === 0:
                setDivider((prevBoard) => {
                    const updatedBoardCopy = [...prevBoard]

                    updatedBoardCopy[
                        (board.width * (xpos)) + 
                            ((xpos) * 2) + 
                            (board.width * 2) + 
                            (ypos + 1) + 
                            14
                        ].id !== 'flagged' ? {
                            key: `cell-${xpos}-${ypos + 1}`, 
                            xpos: xpos, 
                            ypos: ypos + 1, 
                            class: `square ${
                                game[xpos][ypos + 1] !== 'X' 
                                ? 'open' + game[xpos][ypos + 1] 
                                : onDeath(xpos, ypos + 1)}`
                        } : null

                    updatedBoardCopy[
                        (board.width * (xpos - 1)) + 
                            ((xpos - 1) * 2) + 
                            (board.width * 2) + 
                            (ypos) + 
                            14
                        ].id !== 'flagged' ? {
                            key: `cell-${xpos - 1}-${ypos}`, 
                            xpos: xpos - 1, 
                            ypos: ypos, 
                            class: `square ${
                                game[xpos - 1][ypos] !== 'X' 
                                ? 'open' + game[xpos - 1][ypos] 
                                : onDeath(xpos - 1, ypos)}`
                        } : null

                    updatedBoardCopy[
                        (board.width * (xpos - 1)) + 
                            ((xpos - 1) * 2) + 
                            (board.width * 2) + 
                            (ypos + 1) + 
                            14
                        ].id !== 'flagged' ? {
                            key: `cell-${xpos - 1}-${ypos + 1}`, 
                            xpos: xpos - 1, 
                            ypos: ypos + 1, 
                            class: `square ${
                                game[xpos - 1][ypos + 1] !== 'X' 
                                ? 'open' + game[xpos - 1][ypos + 1] 
                                : onDeath(xpos - 1, ypos + 1)}`
                        } : null

                    return updatedBoardCopy
                })

                break;

            // Bottom-right corner
            case xpos === game.length - 1 && ypos === game[xpos].length - 1:
                setDivider((prevBoard) => {
                    const updatedBoardCopy = [...prevBoard]

                    updatedBoardCopy[
                        (board.width * (xpos)) + 
                            ((xpos) * 2) + 
                            (board.width * 2) + 
                            (ypos - 1) + 
                            14
                        ].id !== 'flagged' ? {
                            key: `cell-${xpos}-${ypos - 1}`, 
                            xpos: xpos, 
                            ypos: ypos - 1, 
                            class: `square ${
                                game[xpos][ypos + 1] !== 'X' 
                                ? 'open' + game[xpos][ypos - 1] 
                                : onDeath(xpos, ypos)}`
                        } : null

                    updatedBoardCopy[
                        (board.width * (xpos - 1)) + 
                            ((xpos - 1) * 2) + 
                            (board.width * 2) + 
                            (ypos) + 
                            14
                        ].id !== 'flagged' ? {
                            key: `cell-${xpos - 1}-${ypos}`, 
                            xpos: xpos - 1, 
                            ypos: ypos, 
                            class: `square ${
                                game[xpos - 1][ypos] !== 'X' 
                                ? 'open' + game[xpos - 1][ypos] 
                                : onDeath(xpos, ypos)}`
                        } : null

                    updatedBoardCopy[
                        (board.width * (xpos - 1)) + 
                            ((xpos - 1) * 2) + 
                            (board.width * 2) + 
                            (ypos - 1) + 
                            14
                        ].id !== 'flagged' ? {
                            key: `cell-${xpos - 1}-${ypos - 1}`, 
                            xpos: xpos - 1, 
                            ypos: ypos - 1, 
                            class: `square ${
                                game[xpos - 1][ypos - 1] !== 'X' 
                                ? 'open' + game[xpos - 1][ypos - 1] 
                                : onDeath(xpos - 1, ypos - 1)}`
                        } : null

                    return updatedBoardCopy
                })
                        
                break;

            // Top edge
            case xpos === 0 && 
                (
                    ypos > 0 
                    && ypos < game[xpos].length - 1
                ):
                setDivider((prevBoard) => {
                    const updatedBoardCopy = [...prevBoard]
        
                    updatedBoardCopy[
                        (board.width * (xpos)) + 
                            ((xpos) * 2) + 
                            (board.width * 2) + 
                            (ypos + 1) + 
                            14
                        ].id !== 'flagged' ? {
                            key: `cell-${xpos}-${ypos + 1}`, 
                            xpos: xpos, 
                            ypos: ypos + 1, 
                            class: `square ${
                                game[xpos][ypos + 1] !== 'X' 
                                ? 'open' + game[xpos][ypos + 1] 
                                : onDeath(xpos, ypos + 1)}`
                        } : null

                    updatedBoardCopy[
                        (board.width * (xpos)) + 
                            ((xpos) * 2) + 
                            (board.width * 2) + 
                            (ypos - 1) + 
                            14
                        ].id !== 'flagged' ? {
                            key: `cell-${xpos}-${ypos - 1}`, 
                            xpos: xpos, 
                            ypos: ypos - 1, 
                            class: `square ${
                                game[xpos][ypos - 1] !== 'X' 
                                ? 'open' + game[xpos][ypos - 1] 
                                : onDeath(xpos, ypos - 1)}`
                        } : null
        
                    updatedBoardCopy[
                        (board.width * (xpos + 1)) + 
                            ((xpos + 1) * 2) + 
                            (board.width * 2) + 
                            (ypos) + 
                            14
                        ].id !== 'flagged' ? {
                            key: `cell-${xpos + 1}-${ypos}`, 
                            xpos: xpos + 1, 
                            ypos: ypos, 
                            class: `square ${
                                game[xpos + 1][ypos] !== 'X' 
                                ? 'open' + game[xpos + 1][ypos] 
                                : onDeath(xpos + 1, ypos)}`
                        } : null
        
                    updatedBoardCopy[
                        (board.width * (xpos + 1)) + 
                            ((xpos + 1) * 2) + 
                            (board.width * 2) + 
                            (ypos + 1) + 
                            14
                        ].id !== 'flagged' ? {
                            key: `cell-${xpos + 1}-${ypos + 1}`, 
                            xpos: xpos + 1, 
                            ypos: ypos + 1, 
                            class: `square ${
                                game[xpos + 1][ypos + 1] !== 'X' 
                                ? 'open' + game[xpos + 1][ypos + 1] 
                                : onDeath(xpos + 1, ypos + 1)}`
                        } : null

                    updatedBoardCopy[
                        (board.width * (xpos + 1)) + 
                            ((xpos + 1) * 2) + 
                            (board.width * 2) + 
                            (ypos - 1) + 
                            14
                        ].id !== 'flagged' ? {
                            key: `cell-${xpos + 1}-${ypos - 1}`, 
                            xpos: xpos + 1, 
                            ypos: ypos - 1, 
                            class: `square ${
                                game[xpos + 1][ypos - 1] !== 'X' 
                                ? 'open' + game[xpos + 1][ypos - 1] 
                                : onDeath(xpos + 1, ypos - 1)}`
                        } : null
        
                    return updatedBoardCopy
                })
                        
                break;

             // Bottom edge
            case xpos === game.length - 1 && 
                (
                    ypos > 0 
                    && ypos < game[xpos].length - 1
                ):
                setDivider((prevBoard) => {
                    const updatedBoardCopy = [...prevBoard]
            
                    updatedBoardCopy[
                        (board.width * (xpos)) + 
                            ((xpos) * 2) + 
                            (board.width * 2) + 
                            (ypos + 1) + 
                            14
                        ].id !== 'flagged' ? {
                            key: `cell-${xpos}-${ypos + 1}`, 
                            xpos: xpos, 
                            ypos: ypos + 1, 
                            class: `square ${
                                game[xpos][ypos + 1] !== 'X' 
                                ? 'open' + game[xpos][ypos + 1] 
                                : onDeath(xpos, ypos + 1)}`
                        } : null
    
                    updatedBoardCopy[
                        (board.width * (xpos)) + 
                            ((xpos) * 2) + 
                            (board.width * 2) + 
                            (ypos - 1) + 
                            14
                        ].id !== 'flagged' ? {
                            key: `cell-${xpos}-${ypos - 1}`, 
                            xpos: xpos, 
                            ypos: ypos - 1, 
                            class: `square ${
                                game[xpos][ypos - 1] !== 'X' 
                                ? 'open' + game[xpos][ypos - 1] 
                                : onDeath(xpos, ypos - 1)}`
                        } : null
            
                    updatedBoardCopy[
                        (board.width * (xpos - 1)) + 
                            ((xpos - 1) * 2) + 
                            (board.width * 2) + 
                            (ypos) + 
                            14
                        ].id !== 'flagged' ? {
                            key: `cell-${xpos - 1}-${ypos}`, 
                            xpos: xpos - 1, 
                            ypos: ypos, 
                            class: `square ${
                                game[xpos - 1][ypos] !== 'X' 
                                ? 'open' + game[xpos - 1][ypos] 
                                : onDeath(xpos - 1, ypos)}`
                        } : null
            
                    updatedBoardCopy[
                        (board.width * (xpos - 1)) + 
                            ((xpos - 1) * 2) + 
                            (board.width * 2) + 
                            (ypos + 1) + 
                            14
                        ].id !== 'flagged' ? {
                            key: `cell-${xpos - 1}-${ypos + 1}`, 
                            xpos: xpos - 1,
                            ypos: ypos + 1, 
                            class: `square ${
                                game[xpos - 1][ypos + 1] !== 'X' 
                                ? 'open' + game[xpos - 1][ypos + 1] 
                                : onDeath(xpos - 1, ypos + 1)}`
                            } : null
    
                    updatedBoardCopy[
                        (board.width * (xpos - 1)) + 
                            ((xpos - 1) * 2) + 
                            (board.width * 2) + 
                            (ypos - 1) + 
                            14
                        ].id !== 'flagged' ? {
                            key: `cell-${xpos - 1}-${ypos - 1}`, 
                            xpos: xpos - 1, 
                            ypos: ypos - 1, 
                            class: `square ${
                                game[xpos - 1][ypos - 1] !== 'X' 
                                ? 'open' + game[xpos - 1][ypos - 1] 
                                : onDeath(xpos - 1, ypos - 1)}`
                        } : null
            
                    return updatedBoardCopy
                })
                        
                break;

            // Left edge
            case ypos === 0 && 
                (
                    xpos > 0 
                    && xpos < game.length - 1
                ):
                setDivider((prevBoard) => {
                    const updatedBoardCopy = [...prevBoard]
            
                    updatedBoardCopy[
                        (board.width * (xpos)) + 
                            ((xpos) * 2) + 
                            (board.width * 2) + 
                            (ypos + 1) + 
                            14
                        ].id !== 'flagged' ? {
                            key: `cell-${xpos}-${ypos + 1}`, 
                            xpos: xpos, 
                            ypos: ypos + 1, 
                            class: `square ${
                                game[xpos][ypos + 1] !== 'X' 
                                ? 'open' + game[xpos][ypos + 1] 
                                : onDeath(xpos, ypos + 1)}`
                        } : null
    
                    updatedBoardCopy[
                        (board.width * (xpos + 1)) + 
                            ((xpos + 1) * 2) + 
                            (board.width * 2) + 
                            (ypos) + 
                            14
                        ].id !== 'flagged' ? {
                            key: `cell-${xpos + 1}-${ypos}`, 
                            xpos: xpos + 1, 
                            ypos: ypos, 
                            class: `square ${
                                game[xpos + 1][ypos] !== 'X' 
                                ? 'open' + game[xpos + 1][ypos] 
                                : onDeath(xpos + 1, ypos)}`
                        } : null
            
                    updatedBoardCopy[
                        (board.width * (xpos - 1)) + 
                            ((xpos - 1) * 2) + 
                            (board.width * 2) + 
                            (ypos) + 
                            14
                        ].id !== 'flagged' ? {
                            key: `cell-${xpos - 1}-${ypos}`, 
                            xpos: xpos - 1, 
                            ypos: ypos, 
                            class: `square ${
                                game[xpos - 1][ypos] !== 'X' 
                                ? 'open' + game[xpos - 1][ypos] 
                                : onDeath(xpos - 1, ypos)}`
                        } : null
            
                    updatedBoardCopy[
                        (board.width * (xpos - 1)) + 
                            ((xpos - 1) * 2) + 
                            (board.width * 2) + 
                            (ypos + 1) + 
                            14
                        ].id !== 'flagged' ? {
                            key: `cell-${xpos - 1}-${ypos + 1}`, 
                            xpos: xpos - 1, 
                            ypos: ypos + 1, 
                            class: `square ${
                                game[xpos - 1][ypos + 1] !== 'X' 
                                ? 'open' + game[xpos - 1][ypos + 1] 
                                : onDeath(xpos - 1, ypos + 1)}`
                        } : null
    
                    updatedBoardCopy[
                        (board.width * (xpos + 1)) + 
                            ((xpos + 1) * 2) + 
                            (board.width * 2) + 
                            (ypos + 1) + 
                            14
                        ].id !== 'flagged' ? {
                            key: `cell-${xpos + 1}-${ypos + 1}`, 
                            xpos: xpos + 1, 
                            ypos: ypos + 1, 
                            class: `square ${
                                game[xpos + 1][ypos + 1] !== 'X' 
                                ? 'open' + game[xpos + 1][ypos + 1] 
                                : onDeath(xpos + 1, ypos + 1)}`
                        } : null
            
                    return updatedBoardCopy
                })
                        
                break;

            // Right edge
            case ypos === game[xpos].length - 1 && 
                (
                    xpos > 0 
                    && xpos < game.length - 1
                ):
                setDivider((prevBoard) => {
                    const updatedBoardCopy = [...prevBoard]
            
                    updatedBoardCopy[
                        (board.width * (xpos)) + 
                            ((xpos) * 2) + 
                            (board.width * 2) + 
                            (ypos - 1) + 
                            14
                        ].id !== 'flagged' ? {
                            key: `cell-${xpos}-${ypos - 1}`, 
                            xpos: xpos, 
                            ypos: ypos - 1, 
                            class: `square ${
                                game[xpos][ypos - 1] !== 'X' 
                                ? 'open' + game[xpos][ypos - 1] 
                                : onDeath(xpos, ypos - 1)}`
                        } : null
    
                    updatedBoardCopy[
                        (board.width * (xpos - 1)) + 
                            ((xpos - 1) * 2) + 
                            (board.width * 2) + 
                            (ypos) + 
                            14
                        ].id !== 'flagged' ? {
                            key: `cell-${xpos - 1}-${ypos}`, 
                            xpos: xpos - 1, 
                            ypos: ypos, 
                            class: `square ${
                                game[xpos - 1][ypos] !== 'X' 
                                ? 'open' + game[xpos - 1][ypos] 
                                : onDeath(xpos - 1, ypos)}`
                        } : null

                    updatedBoardCopy[
                        (board.width * (xpos + 1)) + 
                            ((xpos + 1) * 2) + 
                            (board.width * 2) + 
                            (ypos) + 
                            14
                        ].id !== 'flagged' ? {
                            key: `cell-${xpos + 1}-${ypos}`, 
                            xpos: xpos, 
                            ypos: ypos, 
                            class: `square ${
                                game[xpos + 1][ypos] !== 'X' 
                                ? 'open' + game[xpos + 1][ypos] 
                                : onDeath(xpos + 1, ypos)}`
                        } : null
            
                    updatedBoardCopy[
                        (board.width * (xpos + 1)) + 
                            ((xpos + 1) * 2) + 
                            (board.width * 2) + 
                            (ypos - 1) + 
                            14
                        ].id !== 'flagged' ? {
                            key: `cell-${xpos + 1}-${ypos - 1}`, 
                            xpos: xpos + 1, 
                            ypos: ypos - 1, 
                            class: `square ${
                                game[xpos + 1][ypos - 1] !== 'X' 
                                ? 'open' + game[xpos + 1][ypos - 1] 
                                : onDeath(xpos + 1, ypos - 1)}`
                        } : null
    
                    updatedBoardCopy[
                        (board.width * (xpos - 1)) + 
                            ((xpos - 1) * 2) + 
                            (board.width * 2) + 
                            (ypos - 1) + 
                            14
                        ].id !== 'flagged' ? {
                            key: `cell-${xpos - 1}-${ypos - 1}`, 
                            xpos: xpos - 1, 
                            ypos: ypos - 1, 
                            class: `square ${
                                game[xpos - 1][ypos - 1] !== 'X' 
                                ? 'open' + game[xpos - 1][ypos - 1] 
                                : onDeath(xpos - 1, ypos - 1)}`
                        } : null
            
                    return updatedBoardCopy
                })
                        
                break;
            default: // Middle of the board
                setDivider((prevBoard) => {
                    const updatedBoardCopy = [...prevBoard]
            
                    updatedBoardCopy[
                        (board.width * (xpos)) + 
                            ((xpos) * 2) + 
                            (board.width * 2) + 
                            (ypos - 1) + 
                            14
                        ].id !== 'flagged' ? {
                            key: `cell-${xpos}-${ypos - 1}`, 
                            xpos: xpos, 
                            ypos: ypos - 1, 
                            class: `square ${
                                game[xpos][ypos - 1] !== 'X' 
                                ? 'open' + game[xpos][ypos - 1] 
                                : onDeath(xpos, ypos - 1)}`
                        } : null
                        
                    updatedBoardCopy[
                        (board.width * (xpos)) + 
                            ((xpos) * 2) + 
                            (board.width * 2) + 
                            (ypos + 1) + 
                            14
                        ].id !== 'flagged' ? {
                            key: `cell-${xpos}-${ypos + 1}`, 
                            xpos: xpos, 
                            ypos: ypos + 1, 
                            class: `square ${
                                game[xpos][ypos + 1] !== 'X' 
                                ? 'open' + game[xpos][ypos + 1] 
                                : onDeath(xpos, ypos + 1)}`
                        } : null

                    updatedBoardCopy[
                        (board.width * (xpos - 1)) + 
                            ((xpos - 1) * 2) + 
                            (board.width * 2) + 
                            (ypos) + 
                            14
                        ].id !== 'flagged' ? {
                            key: `cell-${xpos - 1}-${ypos}`, 
                            xpos: xpos - 1, 
                            ypos: ypos, 
                            class: `square ${
                                game[xpos - 1][ypos] !== 'X' 
                                ? 'open' + game[xpos - 1][ypos] 
                                : onDeath(xpos - 1, ypos)}`
                        } : null
            
                    updatedBoardCopy[
                        (board.width * (xpos + 1)) + 
                            ((xpos + 1) * 2) + 
                            (board.width * 2) + 
                            (ypos) + 
                            14
                        ].id !== 'flagged' ? {
                            key: `cell-${xpos + 1}-${ypos}`, 
                            xpos: xpos + 1, 
                            ypos: ypos, 
                            class: `square ${
                                game[xpos + 1][ypos] !== 'X' 
                                ? 'open' + game[xpos + 1][ypos] 
                                : onDeath(xpos + 1, ypos)}`
                        } : null
            
                    updatedBoardCopy[
                        (board.width * (xpos + 1)) + 
                            ((xpos + 1) * 2) + 
                            (board.width * 2) + 
                            (ypos - 1) + 
                            14
                        ].id !== 'flagged' ? {
                            key: `cell-${xpos + 1}-${ypos - 1}`, 
                            xpos: xpos + 1, 
                            ypos: ypos - 1, 
                            class: `square ${
                                game[xpos + 1][ypos - 1] !== 'X' 
                                ? 'open' + game[xpos + 1][ypos - 1] 
                                : onDeath(xpos + 1, ypos - 1)}`
                        } : null

                    updatedBoardCopy[
                        (board.width * (xpos - 1)) + 
                            ((xpos - 1) * 2) + 
                            (board.width * 2) + 
                            (ypos + 1) + 
                            14
                        ].id !== 'flagged' ? {
                            key: `cell-${xpos - 1}-${ypos + 1}`, 
                            xpos: xpos - 1, 
                            ypos: ypos + 1, 
                            class: `square ${
                                game[xpos - 1][ypos + 1] !== 'X' 
                                ? 'open' + game[xpos - 1][ypos + 1] 
                                : onDeath(xpos - 1, ypos + 1)}`
                        } : null

                    updatedBoardCopy[
                        (board.width * (xpos + 1)) + 
                            ((xpos + 1) * 2) + 
                            (board.width * 2) + 
                            (ypos + 1) + 
                            14
                        ].id !== 'flagged' ? {
                            key: `cell-${xpos + 1}-${ypos + 1}`, 
                            xpos: xpos + 1, 
                            ypos: ypos + 1, 
                            class: `square ${
                                game[xpos + 1][ypos + 1] !== 'X' 
                                ? 'open' + game[xpos + 1][ypos + 1] 
                                : onDeath(xpos + 1, ypos + 1)}`
                        } : null

                    updatedBoardCopy[
                        (board.width * (xpos - 1)) + 
                            ((xpos - 1) * 2) + 
                            (board.width * 2) + 
                            (ypos - 1) + 
                            14
                        ].id !== 'flagged' ? {
                            key: `cell-${xpos - 1}-${ypos - 1}`, 
                            xpos: xpos - 1, 
                            ypos: ypos - 1, 
                            class: `square ${
                                game[xpos - 1][ypos - 1] !== 'X' 
                                ? 'open' + game[xpos - 1][ypos - 1] 
                                : onDeath(xpos - 1, ypos - 1)}`
                        } : null
            
                    return updatedBoardCopy
                })
                        
                break;
        }
    }

    // Handles the death sequence
    function onDeath(x, y) {
        start = false
        playing = false

        setDivider((prevBoard) => {
            const updatedBoardCopy = [...prevBoard]
            setFace('facedead')
    
            updatedBoardCopy[board.width + 6] = {
                key: 'face',
                class: 'face facedead',
                style: { 
                    marginLeft: style.margin, 
                    marginRight: style.margin 
                }, 
                id: 'face'
            }

            for (let i = 0; i < game.length; i++) {
                for (let j = 0; j < game[i].length; j++) {
                    if (game[i][j] === 'X') {
                        updatedBoardCopy[
                            (board.width * i) + 
                            (i * 2) + 
                            (board.width * 2) + 
                            j + 
                            14
                        ] = {
                            key: `cell-${i}-${j}`, 
                            xpos: i, 
                            ypos: j, 
                            class: `square bombrevealed`
                        }
                        updatedBoardCopy[
                            (board.width * x) + 
                            (x * 2) + 
                            (board.width * 2) + 
                            y + 
                            14] = {
                                key: `cell-${x}-${y}`, 
                                xpos: x, 
                                ypos: y, 
                                class: `square bombdeath`
                            }
                    } else if (
                        updatedBoardCopy[
                            (board.width * i) + 
                            (i * 2) + 
                            (board.width * 2) + 
                            j + 
                            14
                        ]
                            .id === 'flagged'
                        ) 
                        {
                            updatedBoardCopy[
                                (board.width * i) + 
                                (i * 2) + 
                                (board.width * 2) + 
                                j + 
                                14
                            ] = {
                                key: `cell-${i}-${j}`, 
                                xpos: i, 
                                ypos: j, 
                                class: `square falsebomb`
                            }
                        }

                    if (
                        updatedBoardCopy[
                            (board.width * i) + 
                            (i * 2) + 
                            (board.width * 2) + 
                            j + 
                            14
                        ].class === 'square bombrevealed' &&
                        userGame[i][j] === 'F'
                        ) {
                            updatedBoardCopy[
                                (board.width * i) + 
                                (i * 2) + 
                                (board.width * 2) + 
                                j + 
                                14
                            ] = {
                                key: `cell-${i}-${j}`, 
                                xpos: i, 
                                ypos: j, 
                                class: `square bombflagged`
                            }
                        }
                }
            }

            return updatedBoardCopy
        })
    }

    // Runs a check on every click if victory has been achieved
    function checkForVictory() {
        let differenceCount = 0

        for (let x = 0; x < game.length; x++) {
            for (let y = 0; y < game[x].length; y++) {
                if (game[x][y] === 'X' && (userGame[x][y] === 'F')) {
                    differenceCount++;
                }
                    
                if (differenceCount > initialBombs) {
                    break;
                }
            }
        }
          
        if (differenceCount === initialBombs) {
            onVictory();
        }
    }

    // Handles the winning sequence
    function onVictory() {
        start = false
        playing = false
        console.log(`Won on ${difficulty} difficulty in ${time[0] == 0 ? time[1] == 0 ? time[2] : time[1]+time[2] : time} ${time == 1 ? 'second' : 'seconds'}.`)
        time = 0

        setFace('facewin')
        setDivider((prevBoard) => {
            const updatedBoardCopy = [...prevBoard]

            updatedBoardCopy[board.width + 6] = {
                key: 'face',
                class: 'face facewin',
                style: {
                    marginLeft: style.margin, 
                    marginRight: style.margin
                },
                id: 'face'
            }

            return updatedBoardCopy
        })
        return face
    }

    return (
        <div className='placeholder'>
            <br /><br /><br />
            { difficulty === 'custom' && 
                <div>
                    <CustomBoard />

                </div>
            }
            {level !== 'custom' 
                && dimensionRender()
                && (
                    <div id='game' 
                    style={{
                        height: style.height, 
                        width: style.width
                    }}>
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
                                onContextMenu={
                                    playing
                                    ? (e) => {
                                        e.preventDefault();
                                        item.id === 'flagged' ? isFlagged = true : null
                                        setBombs(item.class, item.xpos, item.ypos)
                                        checkForVictory()
                                        return false;
                                    }
                                    : null
                                }
                                onClick={
                                    ((item.xpos === 0 ||
                                        item.xpos) && 
                                        (item.ypos === 0 ||
                                            item.ypos)) || 
                                            item.id
                                    ? () => {
                                        start = true;
                                        item.id !== 'face' && 
                                            playing || 
                                            item.class.includes('square')
                                                ? clicks ++
                                                : start = false;
                                        item.id === 'face'
                                            ? setTime(item.xpos, item.ypos, item.id)
                                            : _
                                        item.class === 'square blank' && playing
                                            ? setSquares(item.xpos, item.ypos, item.id)
                                            : _
                                    }
                                    : undefined
                                }
                                onMouseOver={
                                    ((item.xpos === 0 ||
                                        item.xpos) && 
                                        (item.ypos === 0 ||
                                        item.ypos)) && 
                                        playing
                                            ? () => {
                                                setCoords([item.xpos, item.ypos])
                                            }
                                            : undefined
                                }
                                onMouseOut={
                                    () => {
                                        setCoords([])
                                        face === 'faceooh' ? setFace('facesmile') : null
                                    }
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
