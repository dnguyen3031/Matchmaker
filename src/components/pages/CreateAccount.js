import React, { useState } from 'react';
import {
   Button, Container, Row, Col, Form, FormControl, FormGroup, Modal
} from 'react-bootstrap';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import "./PageTemplate.css";
import CustomNavbar from '../CustomNavbar';


function CreateAccount(props) {
   const history = useHistory();

   const bcrypt = require('bcryptjs');
   const saltRounds = 9;
   
   const [email, setEmail] = useState('');
   const [username, setusername] = useState('');
   const [password, setpassword] = useState('');
   const [confirmPassword, setconfirmPassword] = useState('');

   /*Error Model*/
   const [showError, setErrorShow] = useState(false);
   const handleErrorClose = () => setErrorShow(false);
   const handleErrorShow = () => setErrorShow(true);

   /*Success Model*/
   const [showSucess, setSuccessShow] = useState(false);
   const handleSuccessClose = () => setSuccessShow(false);
   const handleSuccessShow = () => setSuccessShow(true);

   async function fetchUser(email){
      try {
         // get character at index 's id number
         const response = await axios.get('http://127.0.0.1:5000/users?email=' + email);
         console.log(response.data.users_list.length);
         return response.data.users_list.length;
      }
      catch (error) {
         console.log(error);
         return false;
      }
   }

   function hashPassword(jsonData) {
      jsonData.password = bcrypt.hashSync(jsonData.password, saltRounds)
      return jsonData
   }

   async function postUser(account) {
      try {
         // get character at index 's id number
         console.log(account);
         const response = await axios.post('http://127.0.0.1:5000/users', account);
         return response.data;
      }
      catch (error) {
         console.log(error);
         return false;
      }
   }

   const handleSubmit = (e) => {
      e.preventDefault();
      var jsonData = { "name": username, "email": email, "password": password, "friends": {}, "games_table": {}, "profile_info": {
          "bio": "This user has no bio",
          "discord": "",
          "profile_pic": "DefaultProfilePic.jpg",
          "steam_friend_code": "",
          "steam_name": ""
      }};
      fetchUser(email).then( result => {
         console.log(result);
         if (password.localeCompare(confirmPassword) === 0 && result === 0)
         {
            postUser(hashPassword(jsonData));
            history.push("/home");
            handleSuccessShow();
         } else {
            console.log("Invalid Password Matching\n");
            handleErrorShow();
         }
      });
   }

   function createAccountForm(props){
      return <Form className="text-white">
      <Row>
         <Form.Label>Create an Account</Form.Label>
      </Row>
      <Row>
         <Col>
            <FormGroup controlId="username">
               <Form.Label>Username</Form.Label>
               <FormControl type="text" placeholder="username" value = {username} onChange={(e) => setusername(e.target.value)}/>
            </FormGroup>
         </Col>
         <Col>
            <FormGroup controlId="email">
               <Form.Label>Email</Form.Label>
               <FormControl type="text" placeholder="email@address.com" value = {email} onChange={(e) => setEmail(e.target.value)}/>
            </FormGroup>
         </Col>
      </Row>
      <Row>
         <Col>
            <FormGroup controlId="password">
               <Form.Label>Password</Form.Label>
               <FormControl placeholder="password" type="password" value = {password} onChange={(e) => setpassword(e.target.value)}/>
               <Form.Text id="passwordHelpBlock">
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
   }

   return <div> 
      <CustomNavbar setToken={(id) => props.setToken(id)} viewer_id={props.viewer_id}/>
      <Container fluid> 
         <Row>
            <Col className="side-col" />
            <Col xs={8} className="main-col">
               <Row>
                  <Col>
                     <createAccountForm />
                  </Col>
               </Row>
            </Col>
            <Col className="side-col" />
         </Row>

         <Modal show={showError} onHide={handleErrorClose}>
            <Modal.Header closeButton>
               <Modal.Title>Error!</Modal.Title>
            </Modal.Header>
            <Modal.Body>Your password and confirm password fields do not match or your email has already been used!</Modal.Body>
         </Modal>

         <Modal show={showSucess} onHide={handleSuccessClose}>
            <Modal.Header closeButton>
               <Modal.Title>Success!</Modal.Title>
            </Modal.Header>
            <Modal.Body>You have sucessfully created your account!</Modal.Body>
         </Modal>
      </Container>
   </div>;
 }
 

export default CreateAccount;