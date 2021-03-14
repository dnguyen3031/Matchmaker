import React from 'react';
import axios from 'axios';
import {
   Button, Container, Row, Col, Form, FormControl, FormGroup, Nav, Navbar, NavItem, NavLink, Alert, Modal, Dropdown, DropdownButton
 } from 'react-bootstrap';
import CustomNavbar from '../CustomNavbar';

function getNumGames() {
   return 3;
}

function Matchmaking(props) {
   return <> 
      <CustomNavbar setToken={(id) => props.setToken(id)} viewer_id={props.viewer_id}/>
      <h2>matchmaking</h2>
      <Container className="justify-content-md-center">
         <Dropdown>
         </Dropdown>
         <DropdownButton id="dropdown-basic-button" title="Dropdown button">
            <Dropdown.Item onClick={addToQueue}>Krunker</Dropdown.Item>
            <Dropdown.Item href="#/action-2">Minecraft</Dropdown.Item>
            <Dropdown.Item href="#/action-3">idk</Dropdown.Item>
         </DropdownButton>

         <Button variant="outline-primary">Add New Game</Button>{' '}
      </Container>
   </>;


   function addToQueue() { 
      makePatchCall().then( result => {
         if (result.status === 201) {
            console.log('Added Successfully')
         }
         else{
            console.log('failed to add to queue')
         }
      });
   }

   async function makePatchCall(){
      try{
         const response= await axios.patch('/matchmaking/add-to-queue?game_name=Krunker&id='+props.viewer_id)
         return response;
      }
      catch(error){
         console.log(error)
         return false
      }
   }
}
 
export default Matchmaking;