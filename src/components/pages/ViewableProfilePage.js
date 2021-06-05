import { Row, Card, Col, Container, Table, Button } from 'react-bootstrap'
import CustomNavbar from '../CustomNavbar'
import React from 'react'
import './ProfilePage.css'
import FriendBar from '../FriendBar'
import {
  useParams
} from 'react-router-dom'

function ViewableProfile (props) {
  const profileID = useParams().id

  function confirmFriends () {
    for (const key in props.data.user.friends) {
      if (key === profileID && props.data.user.friends[key].status !== 'Deleted') {
        console.log(props.data.id + ' has already added ' + key)
        return true
      }
    }
    return false
  }

  const areFriends = confirmFriends()

  function GameTable () {
    const rows = Object.keys(props.data.user2.games_table).map((game, index) => {
      return (
        <tr key={index}>
          <td>{game}</td>
          <td>{props.data.user2.games_table[game].Rank}</td>
        </tr>
      )
    })
    return (
      <tbody>
      {rows}
      </tbody>
    )
  }

  function removeFriendAction () {
    props.handleSubmit({
      friends: {
        [profileID]: {
          status: 'Deleted'
        }
      }
    })
    console.log('Removing!')
  }

  function addFriendAction () {
    props.handleSubmit({
      friends: {
        [profileID]: {
          status: 'Standard',
          name: props.data.user2.name
        }
      }
    })
    console.log('Adding this id :' + profileID)
  }

  function ImageF () {
    switch (props.data.user2.profile_info.profile_pic) {
      case '1':
        return <img src={require('../../images/profile_pic_1.jpg').default} width={200} height={200}/>
      case '2':
        return <img src={require('../../images/profile_pic_2.jpg').default} width={200} height={200}/>
      case '3':
        return <img src={require('../../images/profile_pic_3.jpg').default} width={200} height={200}/>
      case '4':
        return <img src={require('../../images/profile_pic_4.jpg').default} width={200} height={200}/>
      case '5':
        return <img src={require('../../images/profile_pic_5.jpg').default} width={200} height={200}/>
      case '6':
        return <img src={require('../../images/profile_pic_6.jpg').default} width={200} height={200}/>
      case '7':
        return <img src={require('../../images/profile_pic_7.jpg').default} width={200} height={200}/>
      case '8':
        return <img src={require('../../images/profile_pic_8.jpg').default} width={200} height={200}/>
      default:
        return <img src={require('../../images/DefaultProfilePic.jpg').default} width={200} height={200}/>
    }
  }

  return <div>
    <CustomNavbar setToken={(id) => props.setToken(id)} user={props.data.user}/>
    <Container fluid>
      <Row>
        <Col className="side-col" />
        <Col xs={8} className="main-col pr-0">
          <Row>
            <Col>
              <Row className="pt-3 pb-3">
                <Col>
                  <ImageF/>
                </Col>
                <Col>
                  <Card bg='dark' text='white'>
                    <Card.Body>
                      <Card.Title>{props.data.user2.name}</Card.Title>
                      <Card.Text class="text-white">{props.data.user2.profile_info.bio}</Card.Text>
                      {!areFriends && <Button variant="info" onClick={addFriendAction}>Add Friend</Button>}
                      {' '}
                      <Button variant="info" onClick={removeFriendAction}>Remove Friend</Button>
                    </Card.Body>
                  </Card>
                </Col>
                <Col/>
              </Row>
              <Row className="justify-content-md-center pb-3">
                <Card bg='dark' text='white'>
                  <Card.Body>
                    <Card.Title>Contact Information</Card.Title>
                    <Card.Text class="text-white">Email: {props.data.user2.email}</Card.Text>
                    <Card.Text class="text-white">Discord: {props.data.user2.profile_info.discord}</Card.Text>
                    <Card.Text class="text-white">Steam Name: {props.data.user2.profile_info.steam_name}</Card.Text>
                  </Card.Body>
                </Card>
              </Row>
              <Row className="justify-content-md-center">
                <Col xs={6}>
                  <Table variant="dark">
                    <thead>
                    <tr>
                      <th>Game</th>
                      <th>Rank</th>
                    </tr>
                    </thead>
                    <GameTable />
                  </Table>
                </Col>
              </Row>
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

export default ViewableProfile
