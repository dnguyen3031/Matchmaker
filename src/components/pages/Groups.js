import React, {useState, useEffect} from 'react';
import { Button, Container, Row, Col, Form, FormControl, FormGroup, Modal}
from 'react-bootstrap';
import CustomNavbar from '../CustomNavbar';
import { useParams } from 'react-router-dom';
import FriendBar from "../FriendBar";

import axios from 'axios';
import "./PageTemplate.css";

function Groups(props) {
                        
   const [groupcode, setgroupcode] = useState('');

   const [user, setUser] = useState({group: "", _id: "", name: ""});

   /*Error Model*/
   const [showError, setErrorShow] = useState(false);
   const handleErrorClose = () => setErrorShow(false);
   const handleErrorShow = () => setErrorShow(true);

   /*Success Model*/
   const [showSucess, setSuccessShow] = useState(false);
   const handleSuccessClose = () => setSuccessShow(false);
   const handleSuccessShow = () => setSuccessShow(true);

   async function fetchUser(id){
      try {
         // get character at index 's id number
         const response = await axios.get('https://matchmaker-backend01.herokuapp.com/users/' + props.viewer_id);
         // console.log(response)
         return response;
      }
      catch (error) {
         console.log(error);
         return false;
      }
   }

   useEffect(() => {
      fetchUser(props.viewer_id).then( result => {
         if (result) {
            setUser(result.data);
            console.log("got user")
         } else {
            console.log("failed to get user")
         }
      });
   }, []);

   const handleSubmit = (e) => {
      e.preventDefault();
      var playerdict = {};
      playerdict[props.viewer_id] = user.name;
      var jsonData = {"players": playerdict, "num_players": 1 };
      postGroup(jsonData).then( result => {
         if (result.status == 201) {
            console.log('Created Successfully')
         }
         else{
            console.log('failed to create group')
         }
         window.location.reload(false);
      });
   }

   const joinGroup = (e) => { 
      e.preventDefault();
      makePatchCall(groupcode).then( result => {
         if (result.status == 201) {
            console.log('Added Successfully')
         }
         else{
            console.log('failed to add to group')
         }
         window.location.reload(false);
      });
   }


   async function postGroup(group) {
      try {
         // get character at index 's id number
         console.log(group);
         const response = await axios.post('https://matchmaker-backend01.herokuapp.com/groups?userID='+props.viewer_id, group);
         console.log(response.data);
         var group = { group: response.data };
         response = await axios.patch('https://matchmaker-backend01.herokuapp.com/users/' + props.viewer_id, group)
         return response.data;
      }
      catch (error) {
         console.log(error);
         return false;
      }
   }

   async function makePatchCall(groupcode) {
      try {
         // get character at index 's id number
         console.log(groupcode);
         const response = await axios.patch('https://matchmaker-backend01.herokuapp.com/groups/join-group?id='+props.viewer_id+"&group="+groupcode);
         return response.data;
      }
      catch (error) {
         console.log(error);
         return false;
      }
   }

   const leaveSubmit = (e) => { 
      e.preventDefault();
      makeLeaveCall().then( result => {
         if (result.status == 201) {
            console.log('Left Successfully')
         }
         else{
            console.log('failed to leave group')
         }
         window.location.reload(false);
      });
   }

   async function makeLeaveCall() {
      try {
         // get character at index 's id number
         const currGroup = await axios.get('https://matchmaker-backend01.herokuapp.com/users/' + props.viewer_id + '?group=true');
         console.log(currGroup);
         const response = await axios.patch('https://matchmaker-backend01.herokuapp.com/groups/leave-group?id='+props.viewer_id+"&group="+currGroup.data);
         if (response == 0) {
            response = await axios.delete('https://matchmaker-backend01.herokuapp.com/groups/'+currGroup.data);
         }
         return response.data;
      }
      catch (error) {
         console.log(error);
         return false;
      }
   }
   if (!user.group) {
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
                        <FriendBar _id={props.viewer_id}/>
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
      </div>;
   }
   else
   {
      return <div> 
      <CustomNavbar setToken={(id) => props.setToken(id)} viewer_id={props.viewer_id}/>
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
                        <FriendBar _id={props.viewer_id}/>
                  </Col>
               </Row>
            </Col>
            <Col className="side-col" />
         </Row>
      </Container>
      </div>;
   }
 }

export default Groups;



