
import React, {useState} from 'react';
import { Route, Routes, Link } from 'react-router-dom';

import Home from './Home';
import Highscores from './Highscores';
import Controls from './Controls'
import Board from './boards/Board'

import '../css/header.css'

function App() {

  const [showLinks, setShowLinks] = useState(false)
  const [difficulty, setDifficulty] = useState()

  const toggleLinks = () => {
    setShowLinks(!showLinks)
  }

  const difficultyNav = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty)
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
                <li><p className='menu__item' onClick={() => toggleLinks()} style={{ cursor: 'pointer' }}>Gamemodes {!showLinks ? '▼' : '▲'}</p></li>
                <li><Link to='board' className={`special menu__item ${!showLinks ? 'hidden' : ''}`} onClick={() => difficultyNav('easy')}>Easy</Link></li>
                <li><Link to='board' className={`special menu__item ${!showLinks ? 'hidden' : ''}`} onClick={() => difficultyNav('medium')}>Intermediate</Link></li>
                <li><Link to='board' className={`special menu__item ${!showLinks ? 'hidden' : ''}`} onClick={() => difficultyNav('hard')}>Expert</Link></li>
                <li><Link to='board' className={`special menu__item ${!showLinks ? 'hidden' : ''}`} onClick={() => difficultyNav('custom')}>Custom</Link></li>
                <li><Link to='highscores' className='menu__item'>High Scores</Link></li>
                <li><Link to='controls' className='menu__item'>Controls</Link></li>
              </nav>
            </ul>
          </div>
        </nav>
      </header>
      <Routes>
        <Route path='*' element={<Home />}/>
        <Route path='highscores' element={<Highscores />} />
        <Route path='controls' element={<Controls />} />
        <Route path='board' element = {<Board difficulty={difficulty} />} />
    </Routes>
  </>
  );
}

export default App;
