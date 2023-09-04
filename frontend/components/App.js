
import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';

// import Header from './Header';
import Home from './Home';
import Highscores from './Highscores';
import About from './About'

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

                <li><Link to='highscores' className='menu__item'>High Scores</Link></li>
                <li><Link to='about' className='menu__item'>About</Link></li>
              </nav>
            </ul>
            {/* <span><a href='http://github.com/dilemmaemma' className='redirect child1'>Easy</a></span>
            <span><a href='http://linkedin.com/in/emmahtml' className='redirect child2'>Medium</a></span>
            <span><a href='https://app.codesignal.com/profile/emmahtml' className='redirect child3'>Hard</a></span>
            <span><a href='https://app.codesignal.com/profile/emmahtml' className='redirect child3'>Custom</a></span> */}
            {/* Another possible approaching is the one above with obv a different href location. Either way, I think this promotes a cleaner look. */}
          </div>
        </nav>
      </header>
      <Routes>
        <Route path='*' element={<Home />}/>
        <Route path='highscores' element={<Highscores />} />
        <Route path='about' element={<About />} />
    </Routes>
  </>
  );
}

export default App;
