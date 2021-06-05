import React, { useState } from 'react'
import {
  Button, Container, Row, Col, Form, FormControl, FormGroup, Modal
} from 'react-bootstrap'
import axios from 'axios'
import './PageTemplate.css'
import CustomNavbar from '../CustomNavbar'

function CreateAccount (props) {
  const bcrypt = require('bcryptjs')
  const saltRounds = 9

  /* Error Model */
  const [showError, setErrorShow] = useState(false)
  const handleErrorClose = () => setErrorShow(false)

  async function fetchUser (email) {
    try {
      // get character at index 's id number
      const response = await axios.get('https://matchmaker-backend01.herokuapp.com/users?email=' + email)
      console.log(response.data)
      return response.data
    } catch (error) {
      console.log(error)
      return false
    }
  }

  function hashPassword (jsonData) {
    jsonData.password = bcrypt.hashSync(jsonData.password, saltRounds)
    return jsonData
  }

  function CreateAccountForm (props) {
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setconfirmPassword] = useState('')

    async function login (email) {
      fetchUser(email).then(result => {
        if (result && result.users_list.length > 0) {
          props.setToken(result.users_list[0]._id)
          console.log('login sucessful of' + result.users_list[0]._id)
          window.location.href = '/profile'
        }
      })
    }

    async function postUser (account) {
      try {
        // get character at index 's id number
        console.log(account)
        const response = await axios.post('https://matchmaker-backend01.herokuapp.com/users', account)
        await login(email)
        return response.data
      } catch (error) {
        console.log(error)
        return false
      }
    }

    function makeJson () {
      return {
        name: username,
        email: email,
        password: password,
        friends: {},
        games_table: {
          'Krunker - Hardpoint': {
            game_score: 1000,
            time_played: 0
          }
        },
        group: null,
        in_queue: false,
        has_voted: false,
        lobby: null,
        profile_info: {
          bio: 'This user has no bio',
          discord: '',
          profile_pic: '../../images/DefaultProfilePic.jpg',
          steam_friend_code: '',
          steam_name: ''
        }
      }
    }

    const handleSubmit = (e) => {
      e.preventDefault()
      const jsonData = makeJson()
      fetchUser(email).then(result => {
        console.log(result)
        if (result.users_list.length === 0) {
          if (password.localeCompare(confirmPassword) === 0) {
            postUser(hashPassword(jsonData))
          } else {
            console.log('Invalid Password Matching')
            setErrorShow('Invalid Password Matching')
          }
        } else {
          console.log('Email is already in use')
          setErrorShow('Email is already in use')
        }
      })
    }

    return <Form className="text-white">
      <Row>
        <Form.Label>Create an Account</Form.Label>
      </Row>
      <Row>
        <Col>
          <Form.Group controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="username"
                          value = {username}
                          onChange={e => setUsername(e.target.value)}/>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control type="text" placeholder="email@address.com"
                          value = {email}
                          onChange={(e) => setEmail(e.target.value)}/>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <FormGroup controlId="password">
            <Form.Label>Password</Form.Label>
            <FormControl placeholder="password" type="password" value = {password}
                         onChange={(e) => setPassword(e.target.value)}/>
            <Form.Text id="passwordHelpBlock">
              {/* Your password must be 8-20 characters long, contain letters and numbers, and */}
              {/* must not contain spaces, special characters, or emoji. */}
            </Form.Text>
          </FormGroup>
        </Col>
        <Col>
          <FormGroup controlId="confirmedPassword">
            <Form.Label>Confirm Password</Form.Label>
            <FormControl placeholder="password" type="password"
                         value = {confirmPassword}
                         onChange={(e) => setconfirmPassword(e.target.value)}/>
          </FormGroup>
        </Col>
      </Row>
      <Button block type="submit" onClick = {handleSubmit}>Create Account</Button>
    </Form>
  }

  return <div>
    <CustomNavbar setToken={(id) => props.setToken(id)} user={null}/>
    <Container fluid>
      <Row>
        <Col className="side-col" />
        <Col xs={8} className="main-col">
          <Row>
            <Col>
              <CreateAccountForm setToken={props.setToken}/>
            </Col>
          </Row>
        </Col>
        <Col className="side-col" />
      </Row>

      <Modal show={showError} onHide={handleErrorClose}>
        <Modal.Header closeButton>
          <Modal.Title>Error!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showError}
        </Modal.Body>
      </Modal>
    </Container>
  </div>
}

export default CreateAccount
