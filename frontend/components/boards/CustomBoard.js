import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import axios from 'axios'

import '../../css/board.css'

const initialBoard = {
    width: 0,
    height: 0,
    bombs: 0,
    error: ''
}

const CustomBoard = () => {

    const [ customBoard, setCustomBoard ] = useState(initialBoard)

    const randomize = (e) => {
        e.preventDefault()
        const {name} = e.target

        if (name === 'bombs' && 
            (!customBoard.width || 
                !customBoard.height)) {
                    setCustomBoard({
                        ...customBoard, 
                        [name]: Math.floor(Math.random() * (32)) + 1
                    })
        }

        if (name === 'bombs' && 
            (customBoard.width && 
                customBoard.height)) {
                    return setCustomBoard({
                        ...customBoard, 
                        [name]: Math.floor(Math.random() * 
                        ((customBoard.width*customBoard.height)/2 <=999 ? 
                        (customBoard.width*customBoard.height)/2 : 999))
                    })
                }

        if (name === 'width' || name === 'height') {
            return setCustomBoard({
                ...customBoard, 
                [name]: Math.floor(Math.random() * (50 - 8 + 1)) + 8
            })
        }
    }

    const isDisabled = () => {
        // If all tests pass, enables the button
        return customBoard.width >= 8 && 
               customBoard.width <= 50 && 
               customBoard.height >= 8 && 
               customBoard.height <= 50 && 
               customBoard.bombs > 0 && 
               customBoard.bombs <= 999 ? false : true
    }

    const onChange = e => {
        const { name, value } = e.target
        setCustomBoard({ ...customBoard, [name]: value })
    }

    const onReset = () => {
        setCustomBoard(initialBoard)
    }

    const onSubmit = e => {
        e.preventDefault()
        console.log([customBoard.width,
            customBoard.height,
            customBoard.bombs ])
        axios.post('http://localhost:9000/api/customboard', {
            width: customBoard.width,
            height: customBoard.height,
            bombs: customBoard.bombs            
    })
            .then(res => {
                console.log(res)
            })
            .catch(err => {
                setCustomBoard({ ...customBoard, error: err })
            })
        onReset()
        return <Navigate to=''/>
    }

    // useEffect(() => {
    //     // Checks for possible errors in form. If present, generates an error message. If all tests pass, deletes the error message
    //     if (customBoard.width < 8 || 
    //         customBoard.width > 50) {
    //             setCustomBoard({ 
    //                 ...customBoard, 
    //                 error: 'Board width must be between 8 and 50' 
    //             })
    //     } else if (customBoard.height < 8 || 
    //         customBoard.height > 50) {
    //             setCustomBoard({ 
    //                 ...customBoard, 
    //                 error: 'Board height must be between 8 and 50' 
    //             })
    //     } else if (customBoard.bombs < 1 || 
    //         customBoard.bombs > 
    //         ((customBoard.width*customBoard.height)/2 <=999 ? 
    //         (customBoard.width*customBoard.height)/2 : 999)) {
    //             setCustomBoard({ 
    //                 ...customBoard, 
    //                 error: 
    //                     `Total number of bombs must be between 1 and 
    //                     ${(customBoard.width*customBoard.height)/2 <=999 ? 
    //                     Math.floor((customBoard.width*customBoard.height)/2) : 999}` 
    //             })
    //     }

    //     if (customBoard.error && 
    //         customBoard.width >= 8 && 
    //         customBoard.width <= 50 && 
    //         customBoard.height >= 8 && 
    //         customBoard.height <= 50 && 
    //         customBoard.bombs >= 1 && 
    //         customBoard.bombs <= 
    //         ((customBoard.width*customBoard.height)/2 <=999 ? 
    //         (customBoard.width*customBoard.height)/2 : 999)) {
    //             setCustomBoard({ 
    //                 ...customBoard, 
    //                 error: '' 
    //             })
    //         }

    // }, [
    //     customBoard.width, 
    //     customBoard.height, 
    //     customBoard.bombs
    // ])

    // Max size: 50x50
    // Min size: 8x8
    // Max mines: 50% of total board space || 999
    // Min mines: 1

    return (
        <div>
            <form id='custom-board' onSubmit={onSubmit} onReset={onReset}>
                <h2 className='custom-heading'>Create Custom Board</h2>
                <div>
                    <label htmlFor='width' style={{color: 'white'}}>Width/Rows:&nbsp;</label>
                    <input
                        type='number'
                        name='width'
                        id='width'
                        placeholder='Width'
                        step='1'
                        min='8'
                        max='50'
                        onChange={onChange}
                        value={ 
                            customBoard.width !== 0 ? 
                            customBoard.width : '' 
                        }
                    /> 
                    &nbsp; <button name='width' onClick={randomize}>Randomize</button>
                    <p style={{fontSize: '10px', color: 'white'}}>Must be between 8 and 50, inclusive</p>
                </div>
                <div>
                    <label htmlFor='height' style={{color: 'white'}}>Height/Columns:&nbsp;</label>
                    <input
                        type='number'
                        name='height'
                        id='height'
                        step='1'
                        min='8'
                        max='50'
                        placeholder='Height'
                        onChange={onChange}
                        value={ 
                            customBoard.height !== 0 ? 
                            customBoard.height : '' 
                        }
                    />
                    &nbsp; <button name='height' onClick={randomize}>Randomize</button>
                    <p style={{fontSize: '10px', color: 'white'}}>Must be between 8 and 50, inclusive</p>
                </div>
                <div>
                    <label htmlFor='bombs' style={{color: 'white'}}>Bombs:&nbsp;</label>
                    <input
                        type='number'
                        name='bombs'
                        id='bombs'
                        step='1'
                        min='1'
                        max={
                            customBoard.width && 
                            customBoard.height ? 
                            (customBoard.width*customBoard.height)/2 <=999 ? 
                            (customBoard.width*customBoard.height)/2 : 999 : 32
                        }
                        placeholder='Bombs'
                        onChange={onChange}
                        value={ 
                            customBoard.bombs !== 0 ? 
                            customBoard.bombs : '' 
                        } 
                    />

                    {/* Nested ternaries. For the max clause in bomb input, it is basically saying that if board width and board height don't exist, that the max should default to 32. Otherwise, the max defaults to (board.width * board.height) / 2. Reads as:

                    if (board.width && board.height) {
                        if (((board.width * board.height) / 2) <= 999) max = (board.width * board.height) / 2
                        else max = 999
                    }
                    else max = 32

                    For the ternaries below, it is basically saying that, if board.bombs exists, along with board.width and board.height, that the message should be, "Must be between 1 and ((board.width * board.height) / 2), inclusive". If board.bombs exists but board.width and board.height don't, the message should be, "Must be between 1 and 32". If board.bombs does not exist, the message should read, "Must be at least 1". Reads as:

                    if (board.bombs) {
                        if (board.width && board.height) {
                            if (((board.width * board.height) / 2) <= 999) message = `Must be between 1 and ${(board.width * board.height) / 2}`
                            else message = 'Must be between 1 and 999'
                        }
                        else message = 'Must be between 1 and 32'
                    }
                    else message = 'Must be at least 1' */}
                    &nbsp; <button name='bombs' onClick={randomize}>Randomize</button>
                    {<p style={{fontSize: '10px', color: 'white'}}>
                        Must be between 1 and 
                        {customBoard.width !== 0 && customBoard.height !== 0 ? 
                        ((customBoard.width*customBoard.height)/2 <=999 ? 
                        Math.floor((customBoard.width*customBoard.height)/2) : 999) : 32}
                        , inclusive
                    </p>}
                </div>
                {customBoard.error && <p id='error'>{customBoard.error}</p>}
                <div>
                    <button disabled={isDisabled()} id='SubmitForm'>Submit</button>
                    <button id='ResetForm'>Reset</button>
                </div>
            </form>
        </div>
    )
}

export default CustomBoard