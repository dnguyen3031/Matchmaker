import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Col, Container, Dropdown, DropdownButton, Row } from 'react-bootstrap'
import CustomNavbar from '../CustomNavbar'
import FriendBar from '../FriendBar'
import Queue from './Queue'

function Matchmaking (props) {
  const [viewUser, setViewUser] = useState({
    email: '',
    profile_info: { discord: '', profile_pic: '', bio: '' },
    games_table: {},
    friends: {},
    name: '',
    password: '',
    _id: '',
    lobby: null,
    in_queue: false
  })

  useEffect(() => {
    async function fetchUser (id) {
      try {
        // get character at index 's id number
        return await axios.get('http://matchmaker-backend01.herokuapp.com/users/' + id)
      } catch (error) {
        console.log(error)
        return false
      }
    }

    fetchUser(props.viewerId).then(result => {
      if (result) {
        setViewUser(result)
        console.log('got viewer')
      } else { console.log('failed to get user') }
    })
  }, [props.viewerId])

  async function makePatchCall (gameName) {
    try {
      return await axios.patch('http://matchmaker-backend01.herokuapp.com/matchmaking/add-to-queue?game_name=' + gameName + '&id=' + props.viewerId)
    } catch (error) {
      console.log(error)
      return false
    }
  }

  function addToQueue (gameName) {
    makePatchCall(gameName).then(result => {
      if (result.status === 201) {
        console.log('Added Successfully')
        window.location.reload(false)
      } else { console.log('failed to add to queue') }
    })
  }

  if (viewUser.data === undefined || viewUser.data.in_queue === false) {
    return <div>
         <CustomNavbar setToken={(id) => props.setToken(id)} viewerId={props.viewerId}/>
         <Container fluid>
            <Row>
               <Col className="side-col" />
               <Col xs={8} className="main-col pr-0">
                  <Row>
                     <Col>
                        <Dropdown>
                        </Dropdown>
                        <DropdownButton id="dropdown-basic-button" title="Select Game">
                           <Dropdown.Item onClick={() => addToQueue('Krunker - Hardpoint')}>Krunker - Hardpoint</Dropdown.Item>
                           <Dropdown.Item onClick={() => addToQueue('Skribbl.io')}>Skribbl.io</Dropdown.Item>
                        </DropdownButton>
                     </Col>
                     <Col md={3}>
                        <FriendBar _id={props.viewerId} />
                     </Col>
                  </Row>
               </Col>
               <Col className="side-col" />
            </Row>
         </Container>
      </div>
  }

  return <Queue viewerId={props.viewerId} setToken={props.setToken} matchId={viewUser.data.lobby}/>
}

export default Matchmaking
