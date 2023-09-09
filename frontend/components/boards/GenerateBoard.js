import React, {useState, useEffect} from 'react'

import '../../css/board.css'

export default function GenerateBoard(node_env, clicked, style, game, bombsLeft) {

    const [boardGame, setBoardGame] = useState(game)
    const [currentBombsLeft, setCurrentBombsLeft] = useState(bombsLeft)
    const [userGame, setUserGame] = useState(game)
    const [face, setFace] = useState('facesmile')
    const [currentTime, setCurrentTime] = useState(0)

    useEffect(() => {
        console.log(node_env, clicked, style, game, bombsLeft)
        console.log(boardGame, currentBombsLeft, userGame, face, currentTime)
    }, [])


    function renderBoard() { // Change game to user game so that positions are not revealed
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
        let bombs = currentBombsLeft
        bombs = bombs.toString().split('')
        if (bombs.length < 2) bombs.unshift('0', '0')
        else if (bombs.length < 3) bombs.unshift('0')
    
        if (currentBombsLeft < -99) bombs = ['-', '9', '9']
        
        if (currentBombsLeft < 0) {
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
      
        for (let i = 0; i < boardGame.length; i++) {
          for (let j = 0; j < boardGame[i].length; j++) {
            const cellValue = boardGame[i][j];
      
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
                setCurrentBombsLeft(bombsLeft - 1)
            } else if (cellValue === 'FF' && clicked === 'end') { // Upon game ending, if array value has OF, convert it to a falsebomb
                className = 'square falsebomb'
            } else if ((cellValue === 'R' && clicked === 'end') || node_env === 'development' && (cellValue === 'X' && !clicked)) { // Upon game ending, shift all squares with 'X' to 'R' to show where bombs were
                className = 'square bombrevealed'
            }
            // Add JSX elements to the array
            boardElements.push(<div key={`cell-${i}-${j}`} className={className} />);
            // Rendering end of playing board border
            if (j === boardGame[i].length - 1) boardElements.push(<div key={`right-border-${i}-${j}`} className='sb' />)
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
    const boardStructure = renderBoard()
    return boardStructure
}