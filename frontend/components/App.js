
import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';

import Home from './Home';
import Highscores from './Highscores';
import About from './About'
import Board from './boards/Board'

import '../css/header.css'

function App() {
  return (
    <>
      <header>
        <nav className='navbar'>
          <div className="hamburger-menu navbar-container">
            <input id="menu__toggle" type="checkbox" />
            <label className="menu__btn" htmlFor="menu__toggle">
              <span></span>
            </label>

            <ul className="menu__box">
              <nav>
                <li><Link to='/' className='menu__item'>Home</Link></li>
                <li><Link to='gamemode' className='menu__item'>Gamemodes</Link></li>
                <li><Link to='easy' className='menu__item'>Easy</Link></li>
                <li><Link to='medium' className='menu__item'>Intermediate</Link></li>
                <li><Link to='expert' className='menu__item'>Expert</Link></li>
                <li><Link to='custom' className='menu__item'>Custom</Link></li>
                <li><Link to='highscores' className='menu__item'>High Scores</Link></li>
                <li><Link to='about' className='menu__item'>About</Link></li>
              </nav>
            </ul>
          </div>
        </nav>
      </header>
      <Routes>
        <Route path='*' element={<Home />}/>
        <Route path='highscores' element={<Highscores />} />
        <Route path='about' element={<About />} />
        <Route path='easy' element = {<Board difficulty='easy' />} />
        <Route path='medium' element = {<Board difficulty='medium' />} />
        <Route path='hard' element = {<Board difficulty='hard' />} />
        <Route path='custom' element = {<Board difficulty='custom' />} />
    </Routes>
  </>
  );
}

export default App;
