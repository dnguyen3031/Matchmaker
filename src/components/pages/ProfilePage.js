import React, { useEffect } from 'react'
import axios from 'axios'
import './ProfilePage.css'
import EditableProfile from './EditableProfilePage'
import ViewableProfile from './ViewableProfilePage'
import { useParams } from 'react-router-dom'

function ProfilePage (props) {
  const profileId = useParams().id

  useEffect(() => {
    props.fetchData({ id: props.data.id, get_group: true, id2: profileId, gameRanks2: true, current_page: ProfilePageDisplay }).then(result => {
      console.log('fetched data')
      props.setData(result)
    })
  }, [])

  return props.data.current_page(props)
}

function ProfilePageDisplay (props) {
  async function makePatchCallFriends (change) {
    try {
      return await axios.patch('http://localhost:5000/users/' + props.data.id, change)
    } catch (error) {
      console.log(error)
      return false
    }
  }

  function updateFriends (change) {
    makePatchCallFriends(change).then(result => {
      if (result.status === 201) {
        console.log("updated user's friends")
        window.location.reload(false)
      }
    })
  }

  async function makePatchCall (change) {
    try {
      return await axios.patch('http://localhost:5000/users/' + props.data.id2, change)
    } catch (error) {
      console.log(error)
      return false
    }
  }

  function updateUser (change) {
    makePatchCall(change).then(result => {
      if (result.status === 201) {
        props.fetchData({ id: props.data.id, get_group: true, id2: props.data.id2, gameRanks2: true }).then(result => {
          props.setData(result)
          console.log(props.data)
        })
      }
    })
  }

  if (props.data.id === props.data.id2 && props.data.user2) {
    return <EditableProfile data={props.data} handleSubmit={updateUser} setToken={props.setToken} fetchData={props.fetchData} setData={props.setData}/>
  } else if (props.data.user2) {
    return <ViewableProfile data={props.data} handleSubmit={updateFriends} setToken={props.setToken} fetchData={props.fetchData} setData={props.setData}/>
  }

  return <h1>404: Failed to load user</h1>
}

export default ProfilePage
