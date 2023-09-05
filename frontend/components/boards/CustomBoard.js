import React, { useState } from 'react'
// import axios from 'axios'

const initialBoard = {
    width: '',
    height: '',
    bombs: '',
}

const CustomBoard = () => {

    const [ board, setBoard ] = useState(initialBoard)

    const isDisabled = () => {
        return board.width >= 8 && 
               board.width <= 50 && 
               board.height >= 8 && 
               board.height <= 50 && 
               board.bombs > 0 && 
               board.bombs <= 999 ? false : true
    }

    const onChange = e => {
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
                <div>
                    <button disabled={isDisabled()} id='SubmitForm'>Submit</button>
                    <button id='ResetForm'>Reset</button>
                </div>
            </form>
        </div>
    )
}

export default CustomBoard