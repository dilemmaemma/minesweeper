import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router

function Header() {
  return (
    <header>
      <h1>MineSweeper</h1>
      <nav>
        <ul>
          <li>
            <Link to="/easy">Easy</Link>
          </li>
          <li>
            <Link to="/normal">Normal</Link>
          </li>
          <li>
            <Link to="/hard">Hard</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
