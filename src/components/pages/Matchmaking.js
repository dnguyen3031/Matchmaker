import React from 'react';
import {
   Button, Container, Row, Col, Form, FormControl, FormGroup, Nav, Navbar, NavItem, NavLink, Alert, Modal, Dropdown, DropdownButton
 } from 'react-bootstrap';
import CustomNavbar from '../CustomNavbar';

function getNumGames() {
   return 3;
}

function Matchmaking() {
   return <> 
      <CustomNavbar setToken={(id) => props.setToken(id)} viewer_id={props.viewer_id}/>
      <h2>matchmaking</h2>
      <Container className="justify-content-md-center">
         <Dropdown>
         </Dropdown>
         <DropdownButton id="dropdown-basic-button" title="Dropdown button">
            <Dropdown.Item href="#/action-1">Krunker</Dropdown.Item>
            <Dropdown.Item href="#/action-2">Minecraft</Dropdown.Item>
            <Dropdown.Item href="#/action-3">idk</Dropdown.Item>
         </DropdownButton>

         <Button variant="outline-primary">Add New Game</Button>{' '}
      </Container>
   </>;
 }
 
export default Matchmaking;