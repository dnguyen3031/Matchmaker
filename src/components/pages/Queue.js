import React from 'react'
import CustomNavbar from '../CustomNavbar'
import { Col, Row, Container } from 'react-bootstrap'
import './PageTemplate.css'
import FriendBar from '../FriendBar'
import Lobby from './Lobby'

function Queue (props) {
  if (props.data.user.lobby) { return <Lobby data={props.data} setToken={props.setToken} fetchData={props.fetchData} setData={props.setData}/> }

  async function checkForUpdates () {
    props.fetchData({ id: props.data.id, get_group: true, get_lobby: true, get_game: true, current_page: props.MatchmakingDisplay }).then(result => {
      console.log('fetched data')
      props.setData(result)
    })
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
