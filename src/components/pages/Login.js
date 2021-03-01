import React, {useState, useEffect} from 'react';
import { Button, Container, Row, Col, Form, FormControl, FormGroup, Nav, Navbar, NavItem, NavLink, Modal}
from 'react-bootstrap';
import CustomNavbar from '../../CustomNavbar';
import axios from 'axios';

function Login(props) {

  /*Error Model*/
  const [showError, setErrorShow] = useState(false);
  const handleErrorClose = () => setErrorShow(false);
  const handleErrorShow = () => setErrorShow(true);

  /*Success Model*/
  const [showSucess, setSuccessShow] = useState(false);
  const handleSuccessClose = () => setSuccessShow(false);
  const handleSuccessShow = () => setSuccessShow(true);

  const [user, setUser] = useState([]);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(name);
    console.log(password);
    
    fetchUser(name).then( result => {
      if (result)
      {
          if(result.users_list[0].password == password)
          {
            handleSuccessShow();
            
          }
          else
          {
            handleErrorShow();
          }
      }
      else
      {
        handleErrorShow();
      }
    });
 }


  async function fetchUser(name){
    try {
       // get user matching inputted email
       const response = await axios.get('http://127.0.0.1:5000/users?name=' + name);
       return response.data;
    }
    catch (error) {
       console.log(error);
       return false;
    }
  }

  return <div> 
    <CustomNavbar />
    <Container className="justify-content-md-center">
      <Form>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="text"
          placeholder="Enter username"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          />
          <Form.Text className="text-muted">
              We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          />
        </Form.Group>
        <Form.Group controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Check me out" />
        </Form.Group>
        
        <Container>
          <Row>
            <Col>
              <Button block variant="primary" type="submit" onClick = {handleSubmit}>
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

      <Modal show={showError} onHide={handleErrorClose}>
      <Modal.Header closeButton>
        <Modal.Title>Error!</Modal.Title>
      </Modal.Header>
      <Modal.Body>Login Failed! Either your password or username is incorrect!</Modal.Body>
      </Modal>

      <Modal show={showSucess} onHide={handleSuccessClose}>
      <Modal.Header closeButton>
        <Modal.Title>Success!</Modal.Title>
      </Modal.Header>
      <Modal.Body>Login Successful!</Modal.Body>
      </Modal>

    </Container>
  </div>;
 }

export default Login;