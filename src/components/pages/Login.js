import React, { useState } from 'react'
import { Button, Container, Row, Col, Form, Modal }
  from 'react-bootstrap'
import CustomNavbar from '../CustomNavbar'
import axios from 'axios'
import './PageTemplate.css'

function Login (props) {
  const bcrypt = require('bcryptjs')

  /* Error Model */
  const [showError, setErrorShow] = useState(false)
  const handleErrorClose = () => setErrorShow(false)
  const handleErrorShow = () => setErrorShow(true)

  /* Success Model */
  const [showSucess, setSuccessShow] = useState(false)
  const handleSuccessClose = () => setSuccessShow(false)

  const [name, setName] = useState('')
  const [password, setPassword] = useState('')

  async function fetchUser (name) {
    try {
      // get user matching inputted email
      const response = await axios.get('https://matchmaker-backend01.herokuapp.com/users?email=' + name)
      return response.data
    } catch (error) {
      console.log(error)
      return false
    }
  }

  function handleSuccess (id) {
    props.setToken(id)
    console.log('login sucessful of')
    console.log(id)
  }

  function handleFailure () {
    console.log('login failed')
    handleErrorShow()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    fetchUser(name).then(result => {
      if (result && result.users_list.length > 0) {
        if (bcrypt.compareSync(password, result.users_list[0].password)) { handleSuccess(result.users_list[0]._id) } else { handleFailure() }
      } else { handleFailure() }
    })
  }

  return <div>
      <CustomNavbar setToken={(id) => props.setToken(id)} viewerId={props.viewerId}/>
      <Container fluid >
         <Row>
            <Col className="side-col" />
            <Col xs={8} className="main-col">
               <Form className="text-white">
                  <Form.Group controlId="formBasicEmail">
                     <Form.Label>Email Address</Form.Label>
                     <Form.Control type="text"
                                   placeholder="Enter email"
                                   value={name}
                                   onChange={(e) => setName(e.target.value)}
                                   required
                     />
                     <Form.Text className="text-white">
                        We&apos;ll always share your information with everyone else.
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
            </Col>
            <Col className="side-col" />
         </Row>
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
   </div>
}

export default Login
