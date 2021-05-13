import React from 'react'
import { Card, Col, Row, Accordion } from 'react-bootstrap'

function FriendBar (props) {
  function GroupPlayersList () {
    if (!(props.data.group.players)) {
      return <div/>
    }
    const rows = Object.keys(props.data.group.players).map((playerId, i) => {
      return (
        <Col key={i}>
          <Row className="justify-content-md-center pb-3">
            <div onClick={() => { window.location.href = '/profile/' + playerId }}>
              {props.data.group.players[playerId]}
            </div>
          </Row>
        </Col>
      )
    })

    return (
      <div>
        {rows}
      </div>
    )
  }

  function FriendsList () {
    const friends = {}
    for (const friend in props.data.user.friends) {
      if (props.data.user.friends[friend].status !== 'Deleted') {
        friends[friend] = props.data.user.friends[friend].name
      }
    }

    const rows = Object.keys(friends).map((friendId, i) => {
      return (
        <Col key={i}>
          <Row className="justify-content-md-center pb-3">
            <div onClick={() => { window.location.href = '/profile/' + friendId }}>
              {friends[friendId]}
            </div>
          </Row>
        </Col>
      )
    })

    return (
      <div>
        {rows}
      </div>
    )
  }

  if (props.data.user === null) {
    return <div style={{ fontSize: 14 }}>
      <Accordion defaultActiveKey="0">
        <Card bg='dark' text='white'>
          <Accordion.Toggle as={Card.Header} eventKey="0" className="text-center">
            Your Friends
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="0">
            <Card.Body className="pl-0">
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
      <Accordion defaultActiveKey="0">
        <Card bg='dark' text='white'>
          <Accordion.Toggle as={Card.Header} eventKey="0" className="text-center" onClick={() => { window.location.href = '/groups' }}>
            Your Group
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="0">
            <Card.Body className="pl-0">
              Group Code: {'\n'}
              {} {'\n'}
              Group members
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </div>
  }

  return <div style={{ fontSize: 14 }}>
    <Accordion defaultActiveKey="0">
      <Card bg='dark' text='white'>
        <Accordion.Toggle as={Card.Header} eventKey="0" className="text-center">
          Your Friends
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="0">
          <Card.Body className="pl-0">
            <FriendsList/>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
    <Accordion defaultActiveKey="0">
      <Card bg='dark' text='white'>
        <Accordion.Toggle as={Card.Header} eventKey="0" className="text-center" onClick={() => { window.location.href = '/groups' }}>
          Your Group
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="0">
          <Card.Body className="pl-0">
            Group Code: {'\n'}
            {props.data.user.group} {'\n'}
            Group members
             <GroupPlayersList/>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  </div>
}

export default FriendBar
