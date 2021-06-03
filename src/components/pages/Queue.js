import React from 'react'
import CustomNavbar from '../CustomNavbar'
import { Button, Col, Row, Container } from 'react-bootstrap'
import './PageTemplate.css'
import FriendBar from '../FriendBar'
import axios from 'axios'
import Lobby from './Lobby'

/* eslint-disable */

function Queue (props) {
  if (props.data.user.lobby) {
    return <Lobby data={props.data} setToken={props.setToken}
   fetchData={props.fetchData} setData={props.setData} MatchmakingDisplay={props.MatchmakingDisplay}/>
  }

  async function checkForUpdates () {
    props.fetchData({
      id: props.data.id,
      get_group: true,
      get_lobby: true,
      get_game: true,
      current_page: props.pageName
    }).then(result => {
      console.log('fetched data')
      props.setData(result)
    })
  }
  async function makePatchCallGames () {
    try {
      return await axios.patch('http://localhost:5000/games/' + props.data.lobby._id, change)
    } catch (error) {
      console.log(error)
      return false
    }
  }

  async function makePatchCallUsers (change) {
    try {
      return await axios.patch('http://localhost:5000/users/' + props.data.id, change)
    } catch (error) {
      console.log(error)
      return false
    }
  }

  function submitLeave () {
    const inQueueObj = {
      in_queue: false
    }
    makePatchCallUsers(inQueueObj)
    /*
    find group id
    for each lobby in queue
      for each group in lobby
        remove group with that id
    patch new lobby
    */
  }
  setTimeout(() => { checkForUpdates() }, 1000)

  return <div>
    <CustomNavbar setToken={(id) => props.setToken(id)} user={props.data.user}/>
    <Container fluid>
      <Row>
        <Col className="side-col" />
        <Col xs={8} className="pr-0 main-col">
          <Row>
            <Col>
              <h2 style={{ color: 'white' }}> finding match...</h2>
              <h3 style={{ color: 'white' }}> please wait</h3>
              <Button variant="primary" type="button" onClick ={submitLeave}>
                Leave Queue
              </Button>
            </Col>
            <Col md={3}>
              <FriendBar data={props.data}/>
            </Col>
          </Row>
        </Col>
        <Col className="side-col" />
      </Row>
    </Container>
  </div>
}

export default Queue
