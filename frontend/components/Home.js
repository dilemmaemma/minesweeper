import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'

import Board from './boards/Board';
import TimeElapsed from './TimeElapsed';
import CustomBoard from './boards/CustomBoard';

import '../css/home.css';

function Home () {
    return (
        // Trying to get these to display on the header to take to different gamemodes. Would appear prettier I think
        <div>
            <Link to='easy' className='redirect child1'>Easy</Link>
            <Link to='medium' className='redirect child2'>Medium</Link>
            <Link to='hard' className='redirect child3'>Hard</Link>
            <Link to='custom' className='redirect child4'>Custom</Link>

            <Routes>
                <Route path='easy' element = {<Board difficulty='easy' />} />
                <Route path='medium' element = {<Board difficulty='medium' />} />
                <Route path='hard' element = {<Board difficulty='hard' />} />
                <Route path='custom' element = {<Board difficulty='custom' />} />
            </Routes>

            <TimeElapsed />
            <CustomBoard />
        </div>
    )
}

export default Home;