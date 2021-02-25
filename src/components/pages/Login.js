import React from 'react';
import {
  Button, Container, Row, Col, Form, FormControl, FormGroup, Nav, Navbar, NavItem, NavLink
} from 'react-bootstrap';
import CustomNavbar from '../CustomNavbar';

function Login() {
  return <div> 
    <CustomNavbar />
    <Container className="justify-content-md-center">
      <Form>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" />
          <Form.Text className="text-muted">
              We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>
        <Form.Group controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Check me out" />
        </Form.Group>
        
        <Container>
          <Row>
            <Col>
              <Button block variant="primary" type="submit">
                Login
              </Button>
            </Col>
            <Col>
              <Button block variant="primary" type="submit" href="/create-account">
                Create Account
              </Button>
            </Col>
          </Row>
        </Container>

      </Form>
    </Container>
  </div>;
 }
 

export default Login;