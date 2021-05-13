import React, { useEffect, useState } from 'react'
import { Button, Container, Row, Col, Form, Modal }
  from 'react-bootstrap'
import CustomNavbar from '../CustomNavbar'
import axios from 'axios'
import './PageTemplate.css'

function reassignProps (props) {
  const newProps = {}
  for (const key in props) {
    newProps[key] = props[key]
  }
  return newProps
}

function Login (props) {
  const [showError, setErrorShow] = useState(false)
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    props.fetchData({ id: props.data.id, current_page: LoginDisplay }).then(result => {
      console.log('fetched data')
      props.setData(result)
    })
  }, [])

  const newProps = reassignProps(props)
  newProps.showError = showError
  newProps.setErrorShow = setErrorShow
  newProps.name = name
  newProps.setName = setName
  newProps.password = password
  newProps.setPassword = setPassword

  return props.data.current_page(newProps)
}

function LoginDisplay (props) {
  const bcrypt = require('bcryptjs')

  /* Error Model */
  const handleErrorClose = () => props.setErrorShow(false)
  const handleErrorShow = () => props.setErrorShow(true)

  function handleFailure () {
    console.log('login failed')
    handleErrorShow()
  }

  function handleSuccess (id) {
    props.setToken(id)
    console.log('login sucessful of' + id)
    window.location.href = '/'
  }

  async function fetchUser (name) {
    try {
      // get user matching inputted email
      const response = await axios.get('http://localhost:5000/users?email=' + name)
      return response.data
    } catch (error) {
      console.log(error)
      return false
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    fetchUser(name).then(result => {
      if (result && result.users_list.length > 0) {
        if (bcrypt.compareSync(props.password, result.users_list[0].password)) {
          handleSuccess(result.users_list[0]._id)
        } else {
          handleFailure()
        }
      } else {
        handleFailure()
      }
    })
  }

  return <div>
    <CustomNavbar setToken={(id) => props.setToken(id)} user={props.data.user}/>
    <Container fluid >
      <Row>
        <Col className="side-col" />
        <Col xs={8} className="main-col">
          <Form className="text-white">
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email Address</Form.Label>
              <Form.Control type="text"
                            placeholder="Enter email"
                            value={props.name}
                            onChange={(e) => props.setName(e.target.value)}
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
                            value={props.password}
                            onChange={(e) => props.setPassword(e.target.value)}
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
      <Modal show={props.showError} onHide={handleErrorClose}>
        <Modal.Header closeButton>
          <Modal.Title>Error!</Modal.Title>
        </Modal.Header>
        <Modal.Body>Login Failed! Either your password or username is incorrect!</Modal.Body>
      </Modal>
    </Container>
  </div>
}

export default Login
