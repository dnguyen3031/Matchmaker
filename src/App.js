import './App.css';
import React, {useState, useEffect} from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";
import Home from './components/pages/Home';
import ProfilePage from './components/pages/ProfilePage';
import Login from './components/pages/Login';
import TestPage from './components/pages/TestPage';
import Groups from './components/pages/Groups';
import GroupInfo from './components/pages/GroupInfo';
import Matchmaking from './components/pages/Matchmaking';
import LeaderboardPage from './components/pages/LeaderboardPage';
import CreateAccount from './components/pages/CreateAccount';
import Lobby from './components/pages/Lobby';
import Queue from './components/pages/Queue';
import SearchPage from './components/pages/SearchPage';

import 'bootstrap/dist/css/bootstrap.min.css';  //Need this import for React Bootstrap styling

function setToken(userToken) {
  sessionStorage.setItem('token', JSON.stringify(userToken));
  window.location.reload()
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
            <Matchmaking viewer_id={token} setToken={(id) => setToken(id)}/>
            </Route>
          <Route path="/leaderboard">
            <LeaderboardPage viewer_id={token} setToken={(id) => setToken(id)}/>
          </Route>
          <Route path="/profile/:id">
            <ProfilePage viewer_id={token} setToken={(id) => setToken(id)}/>
          </Route>
          <Route path="/create-account">
            <CreateAccount viewer_id={token} setToken={(id) => setToken(id)}/>
         </Route>
         <Route path="/testpage">
            <TestPage viewer_id={token} setToken={(id) => setToken(id)}/>
         </Route>
         <Route path="/lobby">
            <Lobby match_id="6073da450ca8c96d47143b03" viewer_id={token} setToken={(id) => setToken(id)}/>
         </Route>
         <Route path="/queue">
            <Queue viewer_id={token} setToken={(id) => setToken(id)}/>
          </Route>
          <Route path="/groups">
            <Groups viewer_id={token} setToken={(id) => setToken(id)}/>
         </Route>
         <Route path="/groupinfo">
            <GroupInfo viewer_id={token} setToken={(id) => setToken(id)}/>
         </Route>
         <Route path="/searchpage">
            <SearchPage viewer_id={token} setToken={(id) => setToken(id)}/>
          </Route>
          <Route path="/">
            <Home viewer_id={token} setToken={(id) => setToken(id)}/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
