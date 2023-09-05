import React, { useState } from 'react'
// import axios from 'axios'

const initialBoard = {
    width: '',
    height: '',
    bombs: '',
    error: ''
}

const CustomBoard = () => {

    const [ board, setBoard ] = useState(initialBoard)

    const isDisabled = () => {
        return board.width >= 8 && 
               board.width <= 50 && 
               board.height >= 8 && 
               board.height <= 50 && 
               board.bombs > 0 && 
               board.bombs <= 999 ? true : false
    }

    const onChange = e => {
        if (board.width < 8 || board.width > 50) setBoard({...board, error: 'Board width must be between 8 and 50'})
        else if (board.height < 8 || board.height > 50) setBoard({...board, error: 'Board height must be between 8 and 50'})
        // (board.width*board.height)/2 <=999 ? Math.floor((board.width*board.height)/2) : 999) is a ternary to test for what the width and height are recorded as. If (width*height)/2 > 999, the max bombs that can be present is 999. Otherwise, the max bombs that can be present is (width*height)/2 rounded down to the nearest whole number
        else if (board.bombs < 1 || board.bombs > ((board.width*board.height)/2 <=999 ? Math.floor((board.width*board.height)/2) : 999)) setBoard({...board, error: 'Bombs must be 50% less than board size or a max of 999'})
        const { name, value } = e.target
        setBoard({ ...board, [name]: value })
    }

    const onReset = e => {
        e.preventDefault()
        setBoard(initialBoard)
    }

    const onSubmit = e => {
        e.preventDefault()
    }

    // Max size: 50x50
    // Min size: 8x8
    // Max mines: 50% of total board space || 999
    // Min mines: 1

    return (
        <div>
            <form id='custom-board' onSubmit={onSubmit} onReset={onReset}>
                <h2>Create Custom Board</h2>
                <div>
                    <label htmlFor='width'>Width/Rows:&nbsp;</label>
                    <input
                        type='number'
                        name='width'
                        id='width'
                        placeholder='Width'
                        step='1'
                        min='8'
                        max='50'
                        onChange={onChange}
                        value={board.width}
                    />
                    <p>Must be between 8 and 50, inclusive</p>
                </div>
                {/* Checks to see if proper form constraints were followed. If not, renders error. */}
                {(board.width < 8 || board.width > 50) && board.error && <p id='error'>{board.error}</p>}
                <div>
                    <label htmlFor='height'>Height/Columns:&nbsp;</label>
                    <input
                        type='number'
                        name='height'
                        id='height'
                        step='1'
                        min='8'
                        max='50'
                        placeholder='Height'
                        onChange={onChange}
                        value={board.height}
                    />
                    <p>Must be between 8 and 50, inclusive</p>
                </div>
                {/* Checks to see if proper form constraints were followed. If not, renders error. */}
                {(board.height < 8 || board.height > 50) && board.error && <p id='error'>{board.error}</p>}
                <div>
                    <label htmlFor='bombs'>Bombs:&nbsp;</label>
                    <input
                        type='number'
                        name='bombs'
                        id='bombs'
                        step='1'
                        min='1'
                        max={(board.width*board.height)/2 <=999 ? (board.width*board.height)/2 : 999}
                        placeholder='Bombs'
                        onChange={onChange}
                        value={board.bombs}
                    />
                    <p>Must be between 1 and {(board.width*board.height)/2 <=999 ? Math.floor((board.width*board.height)/2) : 999}, inclusive</p>
                </div>
                {/* Checks to see if proper form constraints were followed. If not, renders error. */}
                {board.bombs < 1 || board.bombs > ((board.width*board.height)/2 <=999 ? Math.floor((board.width*board.height)/2) : 999) && board.error && <p id='error'>{board.error}</p>}
                <div>
                    <button disabled={isDisabled()} id='SubmitForm'>Submit</button>
                    <button id='ResetForm'>Reset</button>
                </div>
            </form>
        </div>
    )
}

export default CustomBoard