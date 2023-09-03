
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './Header';
import Board from './Board';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Switch>
          <Route path="/easy">
            <Board difficulty="easy" />
          </Route>
          <Route path="/normal">
            <Board difficulty="normal" />
          </Route>
          <Route path="/hard">
            <Board difficulty="hard" />
          </Route>
          {/* Add a default route or 404 page */}
          <Route path="/">
            <p>Page not found!</p>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
