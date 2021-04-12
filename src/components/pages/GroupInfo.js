import React from 'react';
import CustomNavbar from '../CustomNavbar';
import { useParams } from 'react-router-dom';
import FriendBar from "../FriendBar";
import { Row, Col, Container } from "react-bootstrap";
import axios from 'axios';
import "./PageTemplate.css";

function TestPage(props) {
                                    
   return <div> 
      <CustomNavbar setToken={(id) => props.setToken(id)} viewer_id={props.viewer_id}/>
      <Container fluid> 
         <Row>
            <Col className="side-col" />
            <Col xs={8} className="pr-0">
               <Row>
                  <Col>GROUP INFO</Col>
                  <Col md={3}>
                     <FriendBar _id="603c339a5ef99cf0de73b4b8" />
                  </Col>
               </Row>
            </Col>
            <Col className="side-col" />
         </Row>
      </Container>
   </div>;
 }
 
export default TestPage;