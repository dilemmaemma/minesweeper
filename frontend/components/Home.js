import React from 'react'
import {useLocation} from 'react-router-dom'

import TimeElapsed from './TimeElapsed';

import '../css/home.css';
import GameList from './GameList';

function Home () {

    const location = useLocation();
    const error = location.state?.error || null;

    return (
        <div className='placeholder'>
            <br></br>
            <br></br>
            <br></br>

            {error && (
                <div className='error'>
                    <h3 style={{ textAlign: 'center' }}>
                        {error}
                    </h3>
                    <br />
                </div>
            )}

            <TimeElapsed />
            <GameList />
        </div>
    )
}

export default Home;