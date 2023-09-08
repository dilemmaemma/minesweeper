import React from 'react'
import {useLocation} from 'react-router-dom'

import TimeElapsed from './TimeElapsed';

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
            
            <br/>
            <h3 style={{color: 'white'}}>Sprite Testing:</h3>
            <br/>
            <div id='game'>
                <div>
                    <div className='square open0'/>         
                    <div className='square open1'/>
                    <div className='square open2'/>
                    <div className='square open3'/>
                    <div className='square open4'/>
                    <div className='square open5'/>
                    <div className='square open6'/>
                    <div className='square open7'/>
                    <div className='square open8'/>
                    <div className='square blank'/>
                    <div className='square bombflagged'/>
                    <div className='square bombdeath'/>
                    <div className='square falsebomb'/>
                    <div className='square bombrevealed'/>
                </div>
                <br/>
                <div>
                    <div className='face facesmile'/>
                    <div className='face facepressed'/>
                    <div className='face faceooh'/>
                    <div className='face facedead'/>
                    <div className='face facewin'/>
                </div>
                <br/><br/>
                <div>
                    <div className='time time0'/>
                    <div className='time time1'/>
                    <div className='time time2'/>
                    <div className='time time3'/>
                    <div className='time time4'/>
                    <div className='time time5'/>
                    <div className='time time6'/>
                    <div className='time time7'/>
                    <div className='time time8'/>
                    <div className='time time9'/>
                    <div className='time time-'/>
                </div>
                <br/>
                <div>
                    <div id='mines_hundreds' className='time-'/>
                    <div id='mines_tens' className='time1'/>
                    <div id='mines_ones' className='time0'/>
                </div>
                <br/>
                <div>
                    <div id='seconds_hundreds' className='time0'/>
                    <div id='seconds_tens' className='time8'/>
                    <div id='seconds_ones' className='time4'/>
                </div>
            </div>
        </div>
    )
}

export default Home;