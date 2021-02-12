import React from 'react';
import { Navbar, Nav, Dropdown, DropdownButton, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';

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
               <Nav.Link href="/create-account">Create Account (TEMPORARY PLACEMENT)</Nav.Link>
            </Nav>
   
            <DropdownButton variant="secondary" menuAlign="right" title="D0ughB0y25" id="dropdown-menu-align-right"> 
            {/* className="pt-2" */}
               <Dropdown.Item eventKey="1">Account Settings</Dropdown.Item>
               <Dropdown.Item eventKey="2">Reload Vbucks</Dropdown.Item>
               <Dropdown.Item eventKey="3">OMEGALUL</Dropdown.Item>
               <Dropdown.Divider />
               <Dropdown.Item eventKey="4">Logout</Dropdown.Item>
            </DropdownButton>

         </Navbar.Collapse>
      </Navbar>
   </div>;
 }
 
export default CustomNavbar;