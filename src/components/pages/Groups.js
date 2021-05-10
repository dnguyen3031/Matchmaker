import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Form, FormControl, FormGroup, Row } from 'react-bootstrap'
import CustomNavbar from '../CustomNavbar'
import FriendBar from '../FriendBar'

import axios from 'axios'
import './PageTemplate.css'

function Groups (props) {
  const [groupcode, setgroupcode] = useState('')
  const [user, setUser] = useState({ group: '', _id: '', name: '' })

  async function makeLeaveCall () {
    try {
      // get character at index 's id number
      const currGroup = await axios.get('http://matchmaker-backend01.herokuapp.com/users/' + props.viewerId + '?group=true')
      console.log(currGroup)
      let response = await axios.patch('http://matchmaker-backend01.herokuapp.com/groups/leave-group?id=' + props.viewerId + '&group=' + currGroup.data)
      if (response === 0) {
        response = await axios.delete('http://matchmaker-backend01.herokuapp.com/groups/' + currGroup.data)
      }
      return response.data
    } catch (error) {
      console.log(error)
      return false
    }
  }

  const leaveSubmit = (e) => {
    e.preventDefault()
    makeLeaveCall().then(result => {
      if (result.status === 201) { console.log('Left Successfully') } else { console.log('failed to leave group') }
      window.location.reload(false)
    })
  }

  useEffect(() => {
    async function fetchUser (id) {
      try {
        // get character at index 's id number
        return await axios.get('http://matchmaker-backend01.herokuapp.com/users/' + props.viewerId)
      } catch (error) {
        console.log(error)
        return false
      }
    }

    fetchUser(props.viewerId).then(result => {
      if (result) {
        setUser(result.data)
        console.log('got user')
      } else { console.log('failed to get user') }
    })
  }, [props.viewerId])

  async function makePatchCall (groupcode) {
    try {
      // get character at index 's id number
      console.log(groupcode)
      const response = await axios.patch('http://matchmaker-backend01.herokuapp.com/groups/join-group?id=' + props.viewerId + '&group=' + groupcode)
      return response.data
    } catch (error) {
      console.log(error)
      return false
    }
  }

  const joinGroup = (e) => {
    e.preventDefault()
    makePatchCall(groupcode).then(result => {
      if (result.status === 201) { console.log('Added Successfully') } else { console.log('failed to add to group') }

      window.location.reload(false)
    })
  }

  async function postGroup (group) {
    try {
      // get character at index 's id number
      console.log(group)
      let response = await axios.post('http://matchmaker-backend01.herokuapp.com/groups?userID=' + props.viewerId, group)
      console.log(response.data)
      group = { group: response.data }
      response = await axios.patch('http://matchmaker-backend01.herokuapp.com/users/' + props.viewerId, group)
      return response.data
    } catch (error) {
      console.log(error)
      return false
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const playerdict = {}
    playerdict[props.viewerId] = user.name
    const jsonData = { players: playerdict, num_players: 1 }
    postGroup(jsonData).then(result => {
      if (result.status === 201) { console.log('Created Successfully') } else { console.log('failed to create group') }

      window.location.reload(false)
    })
  }

  if (!user.group) {
    return <div>
         <CustomNavbar setToken={(id) => props.setToken(id)} viewerId={props.viewerId}/>
         <Container fluid>
            <Row>
               <Col className="side-col" />
               <Col xs={8} className="pr-0">
                  <Row>
                     <Col>
                        <FormGroup controlId="username">
                           <Form.Label>Enter Group Code</Form.Label>
                           <FormControl type="text" placeholder="Friend's group code" value = {groupcode} onChange={(e) => setgroupcode(e.target.value)}/>
                        </FormGroup>
                        <Button variant="primary" onClick = {joinGroup}>Join Group</Button>{' '}
                     </Col>
                     <Col md={3}>
                        <FriendBar _id={props.viewerId}/>
                     </Col>
                  </Row>
                  <Row>
                     <Col>
                        OR
                     </Col>
                  </Row>
                  <Row>
                     <Col>
                        <Button variant="primary" onClick = {handleSubmit}>Create Group</Button>{' '}
                     </Col>
                  </Row>
               </Col>
               <Col className="side-col" />
            </Row>
         </Container>
      </div>
  }

  return <div>
      <CustomNavbar setToken={(id) => props.setToken(id)} viewerId={props.viewerId}/>
      <Container fluid>
         <Row>
            <Col className="side-col" />
            <Col xs={8} className="pr-0">
               <Row>
                  <Col>
                     <Form.Label>Group Code: {user.group}</Form.Label>
                  </Col>
               </Row>
               <Row>
                  <Col>
                     <Button variant="primary" onClick = {leaveSubmit}>Leave Group</Button>{' '}
                  </Col>
                  <Col md={3}>
                     <FriendBar _id={props.viewerId}/>
                  </Col>
               </Row>
            </Col>
            <Col className="side-col" />
         </Row>
      </Container>
   </div>
}

export default Groups
