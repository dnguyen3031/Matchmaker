import React from 'react';
import { Link } from "react-router-dom";
import { Col, Row, Navbar, Nav, Dropdown, DropdownButton, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';

function CustomNavbar() {
   return <div>
       <Navbar bg="dark" variant="dark" expand="lg">
         <Navbar.Brand href="/">Matchmaker</Navbar.Brand>
         <Navbar.Toggle aria-controls="basic-navbar-nav" />
         <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
               <Nav.Link href="/matchmaking">Find Match</Nav.Link>
               <Nav.Link href="/leaderboard">Leaderboard</Nav.Link>
               <Nav.Link href="/profile">Profile</Nav.Link>
            </Nav>
            <Nav>
               <Nav.Link variant="dark" href="/login">Login</Nav.Link>
               <Nav.Link variant="dark" href="/testpage">Test Page</Nav.Link>
            </Nav>
         </Navbar.Collapse>
      </Navbar>
   </div>;
 }
 
export default CustomNavbar;