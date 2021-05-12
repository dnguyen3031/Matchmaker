import React from 'react'
import CustomNavbar from '../CustomNavbar'
import { Col, Row, Container } from 'react-bootstrap'
import './PageTemplate.css'
import FriendBar from '../FriendBar'

function LoadingPage (props) {
  return <div>
    <CustomNavbar setToken={(id) => props.setToken(id)} viewerId={props.viewerId} user={props.user}/>
    <Container fluid>
      <Row>
        <Col className="side-col" />
        <Col xs={8} className="pr-0 main-col">
          <Row>
            <Col>
              <h1>
                Loading, Please Wait...
              </h1>
            </Col>
            <Col md={3}>
              <FriendBar _id={props.viewerId} user={props.user}/>
            </Col>
          </Row>
        </Col>
        <Col className="side-col" />
      </Row>
    </Container>
  </div>
}

export default LoadingPage
