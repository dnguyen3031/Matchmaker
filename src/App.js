import './App.css';
import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Home from './components/pages/Home';
import ProfilePage from './components/pages/ProfilePage';
import Login from './components/pages/Login';
import TestPage from './components/pages/TestPage';
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
            <ProfilePage id="6024098ac9b27e9f9995df97" viewer_id="6024098ac9b27e9f9995df97"/>
          </Route>
          <Route path="/create-account">
            <CreateAccount />
         </Route>
         <Route path="/testpage">
            <TestPage />
         </Route>
          <Route path="/">
            <Home id="6024098ac9b27e9f9995df97"/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
