
import React, {useState} from 'react';
import { Route, Routes, Link } from 'react-router-dom';

import Home from './Home';
import Highscores from './Highscores';
import About from './About'
import Board from './boards/Board'

import '../css/header.css'

function App() {

  const [showLinks, setShowLinks] = useState(false)
  const [isMouseOver, setIsMouseOver] = useState(false)

  const toggleLinks = () => {
    setShowLinks(!showLinks)
  }

  const handleMouseOver = () => {
    setIsMouseOver(true)
  }

  const handleMouseOut = () => {
    setIsMouseOver(false)
  }

  return (
    <>
      <header>
        <nav className='navbar'>
          <div className="navbar-container">
            <input id="menu__toggle" type="checkbox" />
            <label className="menu__btn" htmlFor="menu__toggle">
              <span></span>
            </label>

            <ul className="menu__box">
              <nav>
                <li><Link to='/' className='menu__item'>Home</Link></li>
                <li><p className='menu__item' onClick={() => toggleLinks()} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} style={{ cursor: isMouseOver ? 'pointer' : 'default' }}>Gamemodes {!showLinks ? '▼' : '▲'}</p></li>
                <li><Link to='easy' className={`special menu__item ${!showLinks ? 'hidden' : ''}`}>Easy</Link></li>
                <li><Link to='medium' className={`special menu__item ${!showLinks ? 'hidden' : ''}`}>Intermediate</Link></li>
                <li><Link to='expert' className={`special menu__item ${!showLinks ? 'hidden' : ''}`}>Expert</Link></li>
                <li><Link to='custom' className={`special menu__item ${!showLinks ? 'hidden' : ''}`}>Custom</Link></li>
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
