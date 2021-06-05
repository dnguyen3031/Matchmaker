import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Form, FormControl, FormGroup, Row } from 'react-bootstrap'
import CustomNavbar from '../CustomNavbar'
import FriendBar from '../FriendBar'
import axios from 'axios'
import './PageTemplate.css'

function Groups (props) {
  const [groupcode, setgroupcode] = useState('')

  useEffect(() => {
    props.fetchData({ id: props.data.id, get_group: true, currentPage: 'Groups' }).then(result => {
      console.log('fetched data')
      props.setData(result)
    })
  }, [])

  console.log(props.data.currentPage)
  if (props.data.currentPage !== 'Groups') {
    return props.data.LoadingPage(props)
  }

  async function makeLeaveCall () {
    try {
      const currGroup = props.data.user.group
      let response = await axios.patch('https://matchmaker-backend01.herokuapp.com/groups/leave-group?id=' + props.data.id + '&group=' + currGroup)
      if (response === 0) {
        response = await axios.delete('https://matchmaker-backend01.herokuapp.com/groups/' + currGroup.data)
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
      if (result.status === 201) {
        console.log('Left Successfully')
      } else {
        console.log('failed to leave group')
      }
      window.location.reload(false)
    })
  }

  async function postGroup (group) {
    try {
      // get character at index 's id number
      console.log(group)
      let response = await axios.post('https://matchmaker-backend01.herokuapp.com/groups', group)
      console.log(response.data)
      group = { group: response.data }
      response = await axios.patch('https://matchmaker-backend01.herokuapp.com/users/' + props.data.id, group)
      return response.data
    } catch (error) {
      console.log(error)
      return false
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const jsonData = {
      players: {
        [props.data.id]: props.data.user.name
      },
      num_players: 1
    }
    postGroup(jsonData).then(result => {
      if (result.status === 201) {
        console.log('Created Successfully')
      } else {
        console.log('failed to create group')
      }
      window.location.reload(false)
    })
  }

  async function makePatchCall () {
    try {
      // get character at index 's id number
      console.log(groupcode)
      const response = await axios.patch('https://matchmaker-backend01.herokuapp.com/groups/join-group?id=' + props.data.id + '&group=' + groupcode)
      return response.data
    } catch (error) {
      console.log(error)
      return false
    }
  }

  const joinGroup = (e) => {
    e.preventDefault()
    makePatchCall().then(result => {
      if (result.status === 201) {
        console.log('Added Successfully')
      } else {
        console.log('failed to add to group')
      }
      window.location.reload(false)
    })
  }

  if (!(props.data.user)) {
    return <h1>Loading</h1>
  }

  if (!props.data.user.group) {
    return <div>
      <CustomNavbar setToken={(id) => props.setToken(id)} user={props.data.user}/>
      <Container fluid>
        <Row>
          <Col className="side-col" />
          <Col xs={8} className="main-col pr-0">
            <Row>
              <Col>
                <FormGroup controlId="username">
                  <Form.Label>Enter Group Code</Form.Label>
                  <FormControl type="text" placeholder="Friend's group code" value = {groupcode} onChange={(e) => setgroupcode(e.target.value)}/>
                </FormGroup>
                <Button variant="primary" onClick = {joinGroup}>Join Group</Button>{' '}
                OR
                <Button variant="primary" onClick = {handleSubmit}>Create Group</Button>{' '}
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

  return <div>
    <CustomNavbar setToken={(id) => props.setToken(id)} user={props.data.user}/>
    <Container fluid>
      <Row>
        <Col className="side-col" />
        <Col xs={8} className="main-col pr-0">
          <Row>
            <Col>
              <Form.Label>Group Code: {props.data.user.group}</Form.Label>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button variant="primary" onClick = {leaveSubmit}>Leave Group</Button>{' '}
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

export default Groups
