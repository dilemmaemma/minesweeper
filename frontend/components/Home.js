import React from 'react'

import TimeElapsed from './TimeElapsed';
import CustomBoard from './boards/CustomBoard';

import '../css/home.css';

function Home () {
    return (
        <div>
            <br></br>
            <br></br>
            <br></br>
            <TimeElapsed />
            <CustomBoard />
        </div>
    )
}

export default Home;