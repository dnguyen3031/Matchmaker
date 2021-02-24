import React, { useState } from 'react';
import {
   Button, Container, Row, Col, Form, FormControl, FormGroup, Nav, Navbar, NavItem, NavLink, Alert
 } from 'react-bootstrap';
 import axios from 'axios';

function CreateAccount() {
   const [email, setEmail] = useState('');
   const [username, setusername] = useState('');
   const [password, setpassword] = useState('');
   const [confirmPassword, setconfirmPassword] = useState('');

   const handleSubmit = (e) => {
      e.preventDefault();
      var jsonData = { "name": username, "contact_info": { "email": email }, "password": password };
      console.log(jsonData);
      // postUser(jsonData);
   }

   async function postUser(account) {
      try {
         // get character at index 's id number
         const response = await axios.post('http://127.0.0.1:5000/users/', account);
         return response.data;
      }
      catch (error) {
         console.log(error);
         return false;
      }
   }

   return <>
     <Navbar bg="light" expand="lg">
         <Navbar.Brand href="/">Matchmaker</Navbar.Brand>
      </Navbar>

      <Container className="justify-content-md-center">
         <Form>
            <Row>
            <Form.Label>Create an Account</Form.Label>
            </Row>
            <Row>
               <Col>
                  <FormGroup controlId="username">
                     <Form.Label>Username</Form.Label>
                     <FormControl type="text" placeholder="cheeTOPUFF" value = {username} onChange={(e) => setusername(e.target.value)}/>
                  </FormGroup>
               </Col>
               <Col>
                  <FormGroup controlId="email">
                     <Form.Label>Email</Form.Label>
                     <FormControl type="text" placeholder="cheeTOPUFF@zz.net" value = {email} onChange={(e) => setEmail(e.target.value)}/>
                  </FormGroup>
               </Col>
            </Row>
            <Row>
               <Col>
                  <FormGroup controlId="password">
                     <Form.Label>Password</Form.Label>
                     <FormControl placeholder="password" type="password" value = {password} onChange={(e) => setpassword(e.target.value)}/>
                     <Form.Text id="passwordHelpBlock" muted>
                        Your password must be 8-20 characters long, contain letters and numbers, and
                        must not contain spaces, special characters, or emoji.
                     </Form.Text>
                  </FormGroup>
               </Col>
               <Col>
                  <FormGroup controlId="confirmedPassword">
                     <Form.Label>Confirm Password</Form.Label>
                     <FormControl placeholder="password" type="password" value = {confirmPassword} onChange={(e) => setconfirmPassword(e.target.value)}/>
                  </FormGroup>
               </Col>
            </Row>
            <Button block type="submit" onClick = {handleSubmit}>Create Account</Button>
         </Form>
      </Container>;
      </>
 }
 

export default CreateAccount;