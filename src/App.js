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

function App() {
  const [token, setToken] = useState({});

  // function temp(id) {
  //   console.log("something interesting")
  //   console.log(id)
  //   setToken({token:id})
  //   console.log(token)
  // }
  console.log("rerender")
  console.log(token)
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/login">
            <Login setToken={(id) => setToken(id)}/>
          </Route>
          <Route path="/matchmaking">
            <Matchmaking />
            </Route>
          <Route path="/leaderboard">
            <LeaderboardPage />
          </Route>
          <Route path="/profile">
            <ProfilePage id="6024098ac9b27e9f9995df97" viewer_id={token}/>
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
