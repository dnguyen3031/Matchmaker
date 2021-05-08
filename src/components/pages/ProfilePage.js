import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './ProfilePage.css'
import EditableProfile from './EditableProfilePage'
import ViewableProfile from './ViewableProfilePage'
import { useParams } from 'react-router-dom'

function ProfilePage (props) {
  const viewerId = props.viewer_id
  const id = useParams().id
  const [user, setUser] = useState({
    email: '',
    profile_info: { discord: '', profile_pic: '', bio: '' },
    games_table: {},
    friends: {},
    name: '',
    password: '',
    _id: ''
  })
  const [viewUser, setViewUser] = useState({
    email: '',
    profile_info: { discord: '', profile_pic: '', bio: '' },
    games_table: {},
    friends: {},
    name: '',
    password: '',
    _id: ''
  })

  async function getGame (gameName) {
    try {
      // get character at index 's id number
      const response = await axios.get(
        'http://127.0.0.1:5000/games?game_name=' + gameName
      )
      // console.log(response)
      return response.data
    } catch (error) {
      console.log(error)
      return false
    }
  }

  async function setGameRanks (props) {
    if (props === null) {
      return null
    }

    const updatedUser = props
    for (const key of Object.keys(updatedUser.games_table)) {
      const games = await getGame(key)
      const game = games.games_list[0]
      updatedUser.games_table[key]._id = game._id
      if (updatedUser.games_table[key].game_score < game.ranking_levels[0]) {
        updatedUser.games_table[key].Rank = 'Iron'
      } else if (
        updatedUser.games_table[key].game_score < game.ranking_levels[1]
      ) {
        updatedUser.games_table[key].Rank = 'Bronze'
      } else if (
        updatedUser.games_table[key].game_score < game.ranking_levels[2]
      ) {
        updatedUser.games_table[key].Rank = 'Silver'
      } else if (
        updatedUser.games_table[key].game_score < game.ranking_levels[3]
      ) {
        updatedUser.games_table[key].Rank = 'Gold'
      } else if (
        updatedUser.games_table[key].game_score < game.ranking_levels[4]
      ) {
        updatedUser.games_table[key].Rank = 'Diamond'
      } else if (
        updatedUser.games_table[key].game_score < game.ranking_levels[5]
      ) {
        updatedUser.games_table[key].Rank = 'Platinum'
      } else if (
        updatedUser.games_table[key].game_score < game.ranking_levels[6]
      ) {
        updatedUser.games_table[key].Rank = 'Pro'
      } else {
        updatedUser.games_table[key].Rank = 'God'
      }
    }
    return updatedUser
  }

  async function fetchUser (id) {
    try {
      // get character at index 's id number
      const response = await axios.get('http://127.0.0.1:5000/users/' + id)
      return await setGameRanks(response.data)
    } catch (error) {
      console.log(error)
      return false
    }
  }

  useEffect(() => {
    fetchUser(id).then((result) => {
      if (result) {
        setUser(result)
        console.log('got user')
      } else {
        console.log('failed to get user')
      }
    })

    fetchUser(viewerId).then((result) => {
      if (result) {
        setViewUser(result)
        console.log('got viewer')
      } else {
        console.log('failed to get user')
      }
    })
  }, [])

  async function makePatchCall (change) {
    try {
      return await axios.patch(
        'http://localhost:5000/users/' + user._id,
        change
      )
    } catch (error) {
      console.log(error)
      return false
    }
  }

  function updateUser (change) {
    makePatchCall(change).then((result) => {
      if (result.status === 201) {
        fetchUser(id).then((result) => {
          if (result) {
            setUser(result)
            console.log('updated user')
          } else {
            console.log('failed to update user')
          }
        })
      }
    })
  }

  async function makePatchCallFriends (change) {
    try {
      return await axios.patch(
        'http://localhost:5000/users/' + viewerId,
        change
      )
    } catch (error) {
      console.log(error)
      return false
    }
  }

  function updateFriends (change) {
    makePatchCallFriends(change).then((result) => {
      if (result.status === 201) {
        fetchUser(viewerId).then((result) => {
          if (result) {
            setUser(result)
            console.log("updated user's friends")
          } else {
            console.log('failed to update user')
          }
        })
      }
    })
  }

  if (viewerId === id && user._id) {
    return (
      <EditableProfile
        user={user}
        handleSubmit={updateUser}
        setToken={(id) => props.setToken(id)}
        viewerId={props.viewerId}
      />
    )
  } else if (user._id) {
    return (
      <ViewableProfile
        user={user}
        friendsList={viewUser.friends}
        handleSubmit={updateFriends}
        setToken={(id) => props.setToken(id)}
        viewerId={props.viewerId}
      />
    )
  }

  return <h1>404: Failed to load user</h1>
}

export default ProfilePage
