import React, { useEffect, useState } from 'react'
import { Col, Container, Dropdown, Button, DropdownButton, Row, Modal } from 'react-bootstrap'
import CustomNavbar from '../CustomNavbar'
import FriendBar from '../FriendBar'
import Queue from './Queue'
import axios from 'axios'

function Matchmaking (props) {
  // console.log('getting into matchmakingdisplay')
  if (props.data.id === null) {
    window.location.href = '/'
  }

  const [newGame, setNewGame] = useState('')
  /* Error Model */
  const [showError, setErrorShow] = useState(false)
  const handleErrorClose = () => setErrorShow(false)

  /* Success Model */
  const [showSucess, setSucessShow] = useState(false)
  const handleSuccessClose = () => setSucessShow(false)

  useEffect(() => {
    props.fetchData({ id: props.data.id, get_group: true, get_lobby: true, get_game: true, currentPage: 'Matchmaking' }).then(result => {
      console.log('fetched data')
      props.setData(result)
    })
  }, [])

  console.log(props.data.currentPage)
  if (props.data.currentPage !== 'Matchmaking') {
    return props.data.LoadingPage(props)
  }
  async function makePatchCall (gameName) {
    try {
      return await axios.patch('https://matchmaker-backend01.herokuapp.com/matchmaking/add-to-queue?game_name=' + gameName + '&id=' + props.data.id)
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
      } else {
        console.log('failed to add to queue')
      }
    })
  }

  async function newGamePatch () {
    try {
      return await axios.patch('https://matchmaker-backend01.herokuapp.com/matchmaking/add-new-game?game_name=' + newGame + '&id=' + props.data.id)
    } catch (error) {
      console.log(error)
      return error
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(newGame)
    newGamePatch().then(result => {
      if (result.status === 201) {
        setSucessShow('Game sucessfully added')
        console.log('Added to games table Successfully')
        window.location.reload(false)
      } else {
        console.log(result.error)
        setErrorShow('Failed to add game')
      } // error check for bad game name vs inable to insert
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
                <Row>
                  <Col></Col>
                  <Col>
                    <select className="mb-3 bg-white" onChange={(e) => setNewGame(e.target.value)}>
                    <option value="none" selected disabled hidden>
                      Select Game to Add
                      </option>
                      <option value="Krunker - Hardpoint">Krunker - Hardpoint</option>
                      <option value="Skribbl.io">Skribbl.io</option>
                    </select>
                  </Col>
                </Row>
                <Row>
                  <Col></Col>
                  <Col>
                  <Button block type="submit" onClick = {handleSubmit}>Add New Game</Button>
                  </Col>
                </Row>
              </Col>
              <Col md={3}>
                <FriendBar data={props.data}/>
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

         <Modal show={showSucess} onHide={handleSuccessClose}>
         <Modal.Header closeButton>
            <Modal.Title>Success!</Modal.Title>
         </Modal.Header>
         <Modal.Body>
            {showSucess}
         </Modal.Body>
         </Modal>
      </Container>
    </div>
  }

  return <Queue data={props.data} setToken={props.setToken} fetchData={props.fetchData} setData={props.setData} pageName={'Matchmaking'}/>
}

export default Matchmaking
