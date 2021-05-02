import React from 'react';
import CustomNavbar from '../CustomNavbar';
import { Col, Row, Container} from 'react-bootstrap';
import './PageTemplate.css';
import FriendBar from "../FriendBar";
import Lobby from './Lobby'

function Queue(props) {
   if (props.match_id)
      return <Lobby match_id={props.match_id} viewer_id={props.viewer_id} setToken={props.setToken}/>

   return <div>
      <CustomNavbar setToken={(id) => props.setToken(id)} viewer_id={props.viewer_id}/>
      <Container fluid>
         <Row>
            <Col className="side-col" />
            <Col xs={8} className="pr-0 main-col">
               <Row>
                  <Col>
                     <h2 style={{color: 'white'}}> finding match...</h2>
                     <h3 style={{color: 'white'}}> please wait</h3>
                  </Col>
                  <Col md={3}>
                     <FriendBar _id={props.viewer_id}/>
                  </Col>
               </Row>
            </Col>
            <Col className="side-col" />
         </Row>
      </Container>
   </div>;
}

export default Queue;