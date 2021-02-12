import './App.css';
import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Home from './components/pages/Home';
import Signup from './components/pages/Signup';
import ProfilePage from './components/pages/ProfilePage';
import Login from './components/pages/Login';
import Matchmaking from './components/pages/Matchmaking';
import LeaderboardPage from './components/pages/LeaderboardPage';
import CreateAccount from './components/pages/CreateAccount';

import 'bootstrap/dist/css/bootstrap.min.css';  //Need this import for React Bootstrap styling

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/matchmaking">
            <Matchmaking />
            </Route>
          <Route path="/leaderboard">
            <LeaderboardPage />
          </Route>
          <Route path="/profile">
            <ProfilePage />
          </Route>
          <Route path="/create-account">
            <CreateAccount />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
