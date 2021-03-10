import './App.css';
import React, {useState, useEffect} from "react";
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

function setToken(userToken) {
  sessionStorage.setItem('token', JSON.stringify(userToken));
}

function getToken() {
  const tokenString = sessionStorage.getItem('token');
  const userToken = JSON.parse(tokenString);
  return userToken
}

function App() {
  const token = getToken();

  return (
    <Router>
      <div>
        <Switch>
          <Route path="/login">
            <Login setToken={(id) => setToken(id)} viewer_id={token}/>
          </Route>
          <Route path="/matchmaking">
            <Matchmaking viewer_id={token}/>
            </Route>
          <Route path="/leaderboard">
            <LeaderboardPage viewer_id={token}/>
          </Route>
          <Route path="/profile">
            <ProfilePage id="6024098ac9b27e9f9995df97" viewer_id={token}/>
          </Route>
          <Route path="/create-account">
            <CreateAccount viewer_id={token}/>
         </Route>
         <Route path="/testpage">
            <TestPage viewer_id={token}/>
         </Route>
          <Route path="/">
            <Home viewer_id={token}/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
