import React from 'react'
import {useLocation} from 'react-router-dom'

import TimeElapsed from './TimeElapsed';
import CustomBoard from './boards/CustomBoard';

import '../css/home.css';

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
            <CustomBoard />
            <br/>
            <h3>Sprite Testing:</h3>
            <br/>
            <div id='game'>
                <div>
                    <p className='square open0'>i</p>          
                    <p className='square open1'>i</p>
                    <p className='square open2'>i</p>
                    <p className='square open3'>i</p>
                    <p className='square open4'>i</p>
                    <p className='square open5'>i</p>
                    <p className='square open6'>i</p>
                    <p className='square open7'>i</p>
                    <p className='square open8'>i</p>
                    <p className='square blank'>i</p>
                    <p className='square bombflagged'>i</p>
                    <p className='square bombdeath'>i</p>
                    <p className='square fakebomb'>i</p>
                    <p className='square bombrevealed'>i</p>
                </div>
                <br/>
                <div>
                    <p className='face facesmile'>i</p>
                    <p className='face facepressed'>i</p>
                    <p className='face faceooh'>i</p>
                    <p className='face facedead'>i</p>
                    <p className='face facewin'>i</p>
                </div>
                <br/>
                <div>
                    <p className='time time0'>i</p>
                    <p className='time time1'>i</p>
                    <p className='time time2'>i</p>
                    <p className='time time3'>i</p>
                    <p className='time time4'>i</p>
                    <p className='time time5'>i</p>
                    <p className='time time6'>i</p>
                    <p className='time time7'>i</p>
                    <p className='time time8'>i</p>
                    <p className='time time9'>i</p>
                    <p className='time time-'>i</p>
                </div>
                <br/>
                <div>
                    <div id='mines_hundreds'><p className='time-'>i</p></div>
                    <div id='mines_tens'><p className='time1'>i</p></div>
                    <div id='mines_ones'><p className='time0'>i</p></div>
                </div>
                <br/>
                <div>
                    <div id='seconds_hundreds'><p className='time0'>i</p></div>
                    <div id='seconds_tens'><p className='time8'>i</p></div>
                    <div id='seconds_ones'><p className='time4'>i</p></div>
                </div>
            </div>
        </div>
    )
}

export default Home;