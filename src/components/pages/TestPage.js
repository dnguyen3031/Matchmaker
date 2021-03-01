import React from 'react';
import CustomNavbar from '../CustomNavbar';
import { useParams } from 'react-router-dom';
import FriendBar from "../FriendBar";
import { Row, Col, Container } from "react-bootstrap";
import axios from 'axios';

function TestPage() {
                                    
   return <div> 
      <CustomNavbar />
      <Container fluid className="pr-0"> 
         <Row>
            <Col>TEST PAGETEST PAGETEST PAGETEST PAGETEST PAGETEST PAGETEST PAGETEST PAGETEST PAGETEST PAGETEST PAGETEST PAGETEST PAGETEST 
            PAGETEST PAGETEST PAGETEST PAGETEST PAGETEST PAGETEST PAGETEST PAGE</Col>
            <Col md={3}>
               <FriendBar _id="603aea0c5adbbd2ac5e5d9f1" />
            </Col>
         </Row>
      </Container>
   </div>;
 }
 
export default TestPage;