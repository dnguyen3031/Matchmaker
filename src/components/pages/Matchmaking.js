import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {
   Button, Container, Row, Col, Form, FormControl, FormGroup, Nav, Navbar, NavItem, NavLink, Alert, Modal, Dropdown, DropdownButton
 } from 'react-bootstrap';
import CustomNavbar from '../CustomNavbar';
import FriendBar from "../FriendBar";
import Queue from './Queue';

function getNumGames() {
   return 3;
}

function Matchmaking(props) {
   const [viewUser, setViewUser] = useState({email: "", 
                              profile_info: {discord: "", profile_pic: "", bio: ""},
                              games_table: {},
                              friends: {},
                              name: "",
                              password: "",
                              _id: "",
                              lobby: null,
                              in_queue: false});

   useEffect(() => {
      fetchUser(props.viewer_id).then( result => {
         if (result) {
            setViewUser(result);
            console.log("got viewer");
         } else {
            console.log("failed to get user")
         }
      });
   }, []);
   // console.log(viewUser.data)
   // console.log(viewUser.data.lobby)
   // console.log(viewUser.data.in_queue)
   if (viewUser.data === undefined || viewUser.data.in_queue === false) {
      return <div> 
         <CustomNavbar setToken={(id) => props.setToken(id)} viewer_id={props.viewer_id}/>
         <Container fluid> 
            <Row>
               <Col className="side-col" />
               <Col xs={8} className="main-col pr-0">
                  <Row>
                     <Col>
                        <Dropdown>
                        </Dropdown>
                        <DropdownButton id="dropdown-basic-button" title="Dropdown button">
                           <Dropdown.Item onClick={addToQueue}>Krunker</Dropdown.Item>
                           <Dropdown.Item href="#/action-2">Minecraft</Dropdown.Item>
                           <Dropdown.Item href="#/action-3">idk</Dropdown.Item>
                        </DropdownButton>
                        <Button variant="outline-primary">Add New Game</Button>{' '}
                     </Col>
                     <Col md={3}>
                        <FriendBar _id={props.viewer_id} />
                     </Col>
                  </Row>
               </Col>
               <Col className="side-col" />
            </Row>
         </Container>
      </div>;
   }
   return <Queue viewer_id={props.viewer_id} setToken={props.setToken} match_id={viewUser.data.lobby}/>

   async function fetchUser(id){
      try {
         // get character at index 's id number
         const response = await axios.get('http://127.0.0.1:5000/users/' + id);
         // console.log(response)
         return response;
      }
      catch (error) {
         console.log(error);
         return false;
      }
   }

   function addToQueue() { 
      makePatchCall().then( result => {
         if (result.status === 201) {
            console.log('Added Successfully')
            window.location.reload(false);
         }
         else{
            console.log('failed to add to queue')
         }
      });
   }

   async function makePatchCall(){
      try{
         const response= await axios.patch(
            'http://localhost:5000/matchmaking/add-to-queue?game_name=Krunker - Hardpoint&id='
            +props.viewer_id)
         return response;
      }
      catch(error){
         console.log(error)
         return false
      }
   }
}
 
export default Matchmaking;