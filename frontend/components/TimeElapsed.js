import React, { useState, useEffect } from 'react'

function TimeElapsed (playing) {
    const [ time, setTime ] = useState(0)

    useEffect(() => {
        // Function to update the elapsed seconds
        const updateElapsedSeconds = () => {
          setTime((prevElapsedSeconds) => prevElapsedSeconds + 1);
        };
    
        // Set up an interval to update the elapsed seconds every 1000 milliseconds (1 second)
        const intervalId = setInterval(updateElapsedSeconds, 1000);

        if (time === 10) {
            playing = false
            console.log('here')
        }
    
        // Clean up the interval when the component unmounts
        return () => {
          clearInterval(intervalId);
        };
      }, [playing !== false]);

    return (
        <body>
        <h1>Time elapsed: {time}</h1>
        </body>
    )
}

export default TimeElapsed;