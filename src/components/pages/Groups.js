import React, { useState } from 'react';
import { Button, Container, Row, Col, Form, FormControl, FormGroup, Modal}
from 'react-bootstrap';
import CustomNavbar from '../CustomNavbar';
import { useParams } from 'react-router-dom';
import FriendBar from "../FriendBar";

import axios from 'axios';
import "./PageTemplate.css";

function Groups(props) {
                        
   const [groupcode, setgroupcode] = useState('');

   /*Error Model*/
   const [showError, setErrorShow] = useState(false);
   const handleErrorClose = () => setErrorShow(false);
   const handleErrorShow = () => setErrorShow(true);

   /*Success Model*/
   const [showSucess, setSuccessShow] = useState(false);
   const handleSuccessClose = () => setSuccessShow(false);
   const handleSuccessShow = () => setSuccessShow(true);

   const joinGroup = (e) => { 
      e.preventDefault();
      makePatchCall(groupcode).then( result => {
         if (result.status === 201) {
            console.log('Added Successfully')
         }
         else{
            console.log('failed to add to group')
         }
      });
   }

   async function makePatchCall(groupcode) {
      try {
         // get character at index 's id number
         console.log(groupcode);
         const response = await axios.patch('http://localhost:5000/groups/join-group?id='+props.viewer_id+"&group="+groupcode);
         return response.data;
      }
      catch (error) {
         console.log(error);
         return false;
      }
   }


   return <div> 
      <CustomNavbar setToken={(id) => props.setToken(id)} viewer_id={props.viewer_id}/>
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
                     <FriendBar _id="603c339a5ef99cf0de73b4b8" />
                  </Col>
               </Row>
               <Row>
                  <Col>
                     OR
                  </Col>
               </Row>
               <Row>
                  <Col>
                     <Button variant="primary" onclick='console.log(groupcode)'>Create Group</Button>{' '}
                  </Col>
               </Row>
            </Col>
            <Col className="side-col" />
         </Row>
      </Container>
   </div>;
 }
 
export default Groups;