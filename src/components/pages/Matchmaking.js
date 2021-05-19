import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Col, Container, Dropdown, Form, FormControl, FormGroup, Button, DropdownButton, Row } from 'react-bootstrap'
import CustomNavbar from '../CustomNavbar'
import FriendBar from '../FriendBar'
import Queue from './Queue'

function reassignProps (props) {
  const newProps = {}
  for (const key in props) {
    newProps[key] = props[key]
  }
  return newProps
}

function Matchmaking (props) {
  // console.log('getting into matchmakingdisplay')
  if (props.data.id === null) {
    window.location.href = '/'
  }

  const [newGame, setNewGame] = useState('')

  useEffect(() => {
    props.fetchData({ id: props.data.id, get_group: true, get_lobby: true, get_game: true, currentPage: 'Matchmaking' }).then(result => {
      console.log('fetched data')
      props.setData(result)
    })
  }, [])

<<<<<<< HEAD
  const newProps = reassignProps(props)
  newProps.newGame = newGame
  newProps.setNewGame = setNewGame
  console.log(newProps)
  return props.data.current_page(newProps)
}
=======
  console.log(props.data.currentPage)
  if (props.data.currentPage !== 'Matchmaking') {
    return props.data.LoadingPage(props)
  }
>>>>>>> Sprint7-Development

  async function makePatchCall (gameName) {
    try {
      return await axios.patch('http://localhost:5000/matchmaking/add-to-queue?game_name=' + gameName + '&id=' + props.data.id)
    } catch (error) {
      console.log(error)
      return false
    }
  }

  function addToQueue (gameName) {
    makePatchCall(gameName).then(result => {
      if (result.status === 201) {
        console.log('Added Successfully')
        window.location.reload(false)
      } else { console.log('failed to add to queue') }
    })
  }

  async function newGamePatch () {
    console.log(props.newGame)
    try {
      return await axios.patch('http://localhost:5000/matchmaking/add-new-game?game_name=' + props.newGame + '&id=' + props.data.id)
    } catch (error) {
      console.log(error)
      return false
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(props.newGame)
    newGamePatch().then(result => {
      if (result.status === 201) {
        console.log('Added to games table Successfully')
        window.location.reload(false)
      } else { console.log('failed to add to games table') } // error check for bad game name vs inable to insert
    })
  }

  if (props.data.user === null || props.data.user.in_queue === false) {
    return <div>
      <CustomNavbar setToken={(id) => props.setToken(id)} user={props.data.user}/>
      <Container fluid>
        <Row>
          <Col className="side-col" />
          <Col xs={8} className="main-col pr-0">
            <Row>
              <Col>
                <Dropdown>
                </Dropdown>
                <DropdownButton id="dropdown-basic-button" title="Select Game">
                  <Dropdown.Item onClick={() => addToQueue('Krunker - Hardpoint')}>Krunker - Hardpoint</Dropdown.Item>
                  <Dropdown.Item onClick={() => addToQueue('Skribbl.io')}>Skribbl.io</Dropdown.Item>
                </DropdownButton>
              </Col>
              <Col>
                <FormGroup controlId="newGame">
                <Form.Label>New Game</Form.Label>
                <FormControl placeholder="newGame" type="text"
                         value = {props.newGame}
                         onChange={(e) => props.setNewGame(e.target.value)}/>
                </FormGroup>
                <Button block type="submit" onClick = {handleSubmit}>AddNewGame</Button>
              </Col>
              <Col md={3}>
                <FriendBar data={props.data}/>
              </Col>
            </Row>
          </Col>
          <Col className="side-col" />
        </Row>
      </Container>
    </div>
  }

  return <Queue data={props.data} setToken={props.setToken} fetchData={props.fetchData} setData={props.setData} pageName={'Matchmaking'}/>
}

export default Matchmaking
