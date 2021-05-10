import './App.css'
import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Home from './components/pages/Home'
import ProfilePage from './components/pages/ProfilePage'
import Login from './components/pages/Login'
import TestPage from './components/pages/TestPage'
import Groups from './components/pages/Groups'
import GroupInfo from './components/pages/GroupInfo'
import Matchmaking from './components/pages/Matchmaking'
import CreateAccount from './components/pages/CreateAccount'
import SearchPage from './components/pages/SearchPage'

import 'bootstrap/dist/css/bootstrap.min.css' // Need this import for React Bootstrap styling

function getToken () {
  const tokenString = sessionStorage.getItem('token')
  return JSON.parse(tokenString)
}

function setToken (userToken) {
  sessionStorage.setItem('token', JSON.stringify(userToken))
  window.location.reload()
}

function App () {
  const token = getToken()

  return (
         <Router>
            <div>
               <Switch>
                  <Route path="/login">
                     <Login setToken={(id) => setToken(id)} viewerId={token}/>
                  </Route>
                  <Route path="/matchmaking">
                     <Matchmaking viewerId={token} setToken={(id) => setToken(id)}/>
                  </Route>
                  <Route path="/profile/:id">
                     <ProfilePage viewerId={token} setToken={(id) => setToken(id)}/>
                  </Route>
                  <Route path="/create-account">
                     <CreateAccount viewerId={token} setToken={(id) => setToken(id)}/>
                  </Route>
                  <Route path="/testpage">
                     <TestPage viewerId={token} setToken={(id) => setToken(id)}/>
                  </Route>
                  <Route path="/groups">
                     <Groups viewerId={token} setToken={(id) => setToken(id)}/>
                  </Route>
                  <Route path="/groupinfo">
                     <GroupInfo viewerId={token} setToken={(id) => setToken(id)}/>
                  </Route>
                  <Route path="/searchpage">
                     <SearchPage viewerId={token} setToken={(id) => setToken(id)}/>
                  </Route>
                  <Route path="/">
                     <Home viewerId={token} setToken={(id) => setToken(id)}/>
                  </Route>
               </Switch>
            </div>
         </Router>
  )
}

export default App
