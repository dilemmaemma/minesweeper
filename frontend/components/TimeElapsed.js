import React, { useState, useEffect } from 'react'

function TimeElapsed (playing) {
    playing = true
    const [ time, setTime ] = useState(0)
    const elapsedTime = () => {
        const secondMarker = 1000
        while (playing) {
            if (time === 60) playing = false

        }
    }
    return (
        <h1>Time elapsed: {time}</h1>
    )
}

export default function TimeElapsed;