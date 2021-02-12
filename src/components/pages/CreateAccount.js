import React, { useState } from 'react';
import {
   Button, Container, Row, Col, Form, FormControl, FormGroup, Nav, Navbar, NavItem, NavLink
 } from 'react-bootstrap';

function CreateAccount() {
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
                     <FormControl placeholder="cheeTOPUFF" />
                  </FormGroup>
               </Col>
               <Col>
                  <FormGroup controlId="email">
                     <Form.Label>Email</Form.Label>
                     <FormControl placeholder="cheeTOPUFF@zz.net" />
                  </FormGroup>
               </Col>
            </Row>
            <Row>
               <Col>
                  <FormGroup controlId="password">
                     <Form.Label>Password</Form.Label>
                     <FormControl placeholder="password" type="password" />
                     <Form.Text id="passwordHelpBlock" muted>
                        Your password must be 8-20 characters long, contain letters and numbers, and
                        must not contain spaces, special characters, or emoji.
                     </Form.Text>
                  </FormGroup>
               </Col>
               <Col>
                  <FormGroup controlId="confirmedPassword">
                     <Form.Label>Confirm Password</Form.Label>
                     <FormControl placeholder="password" type="password" />
                  </FormGroup>
               </Col>
            </Row>
            <Button block>Create Account</Button>
         </Form>
      </Container>;
      </>
 }
 

export default CreateAccount;