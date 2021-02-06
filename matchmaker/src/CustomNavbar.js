import React from 'react';
import { Navbar, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';

function CustomNavbar() {
   return <div>
       <Navbar bg="light" expand="lg">
         <Navbar.Brand href="/">Matchmaker</Navbar.Brand>
         <Navbar.Toggle aria-controls="basic-navbar-nav" />
         <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
               <Nav.Link href="/matchmaking">Find Match</Nav.Link>
               <Nav.Link href="/leaderboard">Leaderboard</Nav.Link>
               <Nav.Link href="/profile">Profile</Nav.Link>
            </Nav>
            <Nav className="justify-content-end">
            <NavDropdown menuAlign="right" title="Dropdown" id="basic-nav-dropdown">
               <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
               <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
               <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
               <NavDropdown.Divider />
               <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
            </NavDropdown>
            </Nav>
         </Navbar.Collapse>
      </Navbar>
   </div>;
 }
 
export default CustomNavbar;