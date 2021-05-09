import React from 'react'
import CustomNavbar from '../CustomNavbar'
import { Col, Row, Container } from 'react-bootstrap'
import './PageTemplate.css'
import FriendBar from '../FriendBar'

function Home (props) {
  if (props.viewerId != null) { window.location.href = '/matchmaking' }

  return <div>
      <CustomNavbar setToken={(id) => props.setToken(id)} viewerId={props.viewerId}/>
      <Container fluid>
         <Row>
            <Col className="side-col" />
            <Col xs={8} className="pr-0 main-col">
               <Row>
                  <Col>
                     <h2 style={{ color: 'white' }} onClick={() => { window.location.href = '/login' }}>
                        Please Login to Start Matchmaking
                     </h2>
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

export default Home
