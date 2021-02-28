import React from 'react';
import CustomNavbar from '../CustomNavbar';
import { useParams } from 'react-router-dom';
import FriendBar from "../FriendBar";
import { Row, Col, Container } from "react-bootstrap";
import axios from 'axios';

function TestPage() {
                                    
   return <div> 
      <CustomNavbar />
      <Container fluid>
         <Row>
            <Col>TEST PAGETEST PAGETEST PAGETEST PAGETEST PAGETEST PAGETEST PAGETEST PAGETEST PAGETEST PAGETEST PAGETEST PAGETEST PAGETEST 
            PAGETEST PAGETEST PAGETEST PAGETEST PAGETEST PAGETEST PAGETEST PAGE</Col>
            <Col md={{ span: 2}}>
               <FriendBar _id="6024098ac9b27e9f9995df97" />
            </Col>
         </Row>
      </Container>
   </div>;
 }
 
export default TestPage;