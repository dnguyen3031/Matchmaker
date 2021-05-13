import './App.css'
import React, { useState } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Home from './components/pages/Home'
import ProfilePage from './components/pages/ProfilePage'
import Login from './components/pages/Login'
import Groups from './components/pages/Groups'
import Matchmaking from './components/pages/Matchmaking'
import CreateAccount from './components/pages/CreateAccount'
import SearchPage from './components/pages/SearchPage'
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios'
import LoadingPage from './components/pages/LoadingPage'

async function fetchGame (game) {
  try {
    const response = await axios.get('http://localhost:5000/games/' + game)
    return response.data
  } catch (error) {
    console.log(error)
    return false
  }
}

async function getMatch (matchId) {
  try {
    const response = await axios.get('http://localhost:5000/lobbies/' + matchId)
    return response.data
  } catch (error) {
    console.log(error)
    return false
  }
}

async function fetchGroup (id) {
  try {
    const response = await axios.get('http://localhost:5000/groups/' + id)
    return response.data
  } catch (error) {
    console.log(error)
    return false
  }
}

async function getGameByName (gameName) {
  try {
    const response = await axios.get('http://localhost:5000/games?game_name=' + gameName)
    return response.data
  } catch (error) {
    console.log(error)
    return false
  }
}

async function setGameRanks (props) {
  if (props === null) { return null }

  const updatedUser = props
  for (const key of Object.keys(updatedUser.games_table)) {
    const games = await getGameByName(key)
    const game = games.games_list[0]
    updatedUser.games_table[key]._id = game._id
    if (updatedUser.games_table[key].game_score < game.ranking_levels[0]) { updatedUser.games_table[key].Rank = 'Iron' } else if (updatedUser.games_table[key].game_score < game.ranking_levels[1]) { updatedUser.games_table[key].Rank = 'Bronze' } else if (updatedUser.games_table[key].game_score < game.ranking_levels[2]) { updatedUser.games_table[key].Rank = 'Silver' } else if (updatedUser.games_table[key].game_score < game.ranking_levels[3]) { updatedUser.games_table[key].Rank = 'Gold' } else if (updatedUser.games_table[key].game_score < game.ranking_levels[4]) { updatedUser.games_table[key].Rank = 'Diamond' } else if (updatedUser.games_table[key].game_score < game.ranking_levels[5]) { updatedUser.games_table[key].Rank = 'Platinum' } else if (updatedUser.games_table[key].game_score < game.ranking_levels[6]) { updatedUser.games_table[key].Rank = 'Pro' } else { updatedUser.games_table[key].Rank = 'God' }
  }
  return updatedUser
}

async function fetchUser (id, gameRanks) {
  try {
    const response = await axios.get(`http://localhost:5000/users/${id}`)
    if (gameRanks) {
      return await setGameRanks(response.data)
    }
    return response.data
  } catch (error) {
    console.log(error)
    return false
  }
}

async function fetchData (fields) {
  if ('id' in fields) {
    if ('gameRanks' in fields) {
      fields.user = await fetchUser(fields.id, fields.gameRanks)
    } else {
      fields.user = await fetchUser(fields.id, false)
    }
  }
  if ('id2' in fields) {
    if ('gameRanks2' in fields) {
      fields.user2 = await fetchUser(fields.id2, fields.gameRanks2)
    } else {
      fields.user2 = await fetchUser(fields.id2, false)
    }
  }
  if (fields.get_group) {
    fields.group = await fetchGroup(fields.user.group)
  } else if ('group' in fields) {
    fields.group = await fetchGroup(fields.group)
  }
  if (fields.get_lobby) {
    fields.lobby = await getMatch(fields.user.lobby)
  } else if ('lobby' in fields) {
    fields.lobby = await getMatch(fields.lobby)
  }
  if (fields.get_game) {
    fields.game = await fetchGame(fields.lobby.game_id)
  } else if ('lobby' in fields) {
    fields.game = await fetchGame(fields.game)
  }
  return fields
}

function getToken () {
  const tokenString = sessionStorage.getItem('token')
  return JSON.parse(tokenString)
}

function App () {
  const initialData = {
    id: getToken(),
    user: null,
    user2: null,
    current_page: LoadingPage
  }
  const [data, setData] = useState(initialData)

  function setToken (userToken) {
    sessionStorage.setItem('token', JSON.stringify(userToken))
    setData(initialData)
    window.location.reload()
  }

  return (
    <Router>
      <div>
        <Switch>
          <Route path="/login">
            <Login setToken={(id) => setToken(id)} fetchData={(fields) => fetchData(fields)} data={data} setData={(fields) => setData(fields)}/>
          </Route>
          <Route path="/matchmaking">
            <Matchmaking setToken={(id) => setToken(id)} fetchData={(fields) => fetchData(fields)} data={data} setData={(fields) => setData(fields)}/>
          </Route>
          <Route path="/profile/:id">
            <ProfilePage setToken={(id) => setToken(id)} fetchData={(fields) => fetchData(fields)} data={data} setData={(fields) => setData(fields)}/>
          </Route>
          <Route path="/create-account">
            <CreateAccount setToken={(id) => setToken(id)} fetchData={(fields) => fetchData(fields)} data={data} setData={(fields) => setData(fields)}/>
          </Route>
          <Route path="/groups">
            <Groups setToken={(id) => setToken(id)} fetchData={(fields) => fetchData(fields)} data={data} setData={(fields) => setData(fields)}/>
          </Route>
          <Route path="/searchpage">
            <SearchPage setToken={(id) => setToken(id)} fetchData={(fields) => fetchData(fields)} data={data} setData={(fields) => setData(fields)}/>
          </Route>
          <Route path="/">
            <Home setToken={(id) => setToken(id)} fetchData={(fields) => fetchData(fields)} data={data} setData={(fields) => setData(fields)}/>
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App
