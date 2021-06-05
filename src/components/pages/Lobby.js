import React from 'react'
import CustomNavbar from '../CustomNavbar'
import { Col, Row, Container } from 'react-bootstrap'
import './PageTemplate.css'
import FriendBar from '../FriendBar'
import TeamBuilder from './TeamBuilder'
import LoadingPage from './LoadingPage'

function Lobby (props) {
  async function checkForUpdates () {
    if (props) {
      props.fetchData({
        id: props.data.id,
        get_group: true,
        get_lobby: true,
        get_game: true,
        currentPage: 'Matchmaking'
      }).then(result => {
        console.log('fetched data')
        props.setData(result)
      })
    }
  }

  setTimeout(() => { checkForUpdates() }, 1000)

  if (props.data.lobby) {
    return <div>
      <CustomNavbar setToken={(id) => props.setToken(id)} user={props.data.user}/>
      <Container fluid>
        <Row>
          <Col className="side-col" />
          <Col xs={8} className="pr-0 main-col">
            <Row>
              <Col>
                <TeamBuilder data={props.data} setToken={props.setToken} fetchData={props.fetchData} setData={props.setData}/>
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

  return <LoadingPage/>
}

export default Lobby
