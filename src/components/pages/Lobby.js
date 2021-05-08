import React, { useState, useEffect } from 'react'
import CustomNavbar from '../CustomNavbar'
import { Col, Row, Button, Container, Form } from 'react-bootstrap'
import axios from 'axios'
import './PageTemplate.css'
import FriendBar from '../FriendBar'
import TeamBuilder from './TeamBuilder'

function Lobby (props) {
  const match_id = props.match_id
  const [match, setMatch] = useState(props.match)

  const [refreshInterval] = useState(2)

  const [winningTeam, setWinningTeam] = useState('Draw')
  const [disabled, setDisabled] = useState(false)

  async function getMatch (match_id) {
    try {
      // get character at index 's id number
      const response = await axios.get('http://127.0.0.1:5000/lobbies/' + match_id)
      return response.data
    } catch (error) {
      console.log(error)
      return false
    }
  }

  useEffect(() => {
    const fetchMatch = (match_id) => {
      console.log(match_id)
      getMatch(match_id).then(result => {
        if (result) {
          setMatch(result)
          console.log('got match')
        } else { console.log('failed to get match') }
      })
    }

    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(fetchMatch(match_id), refreshInterval)
      return () => clearInterval(interval)
    }
  }, [match_id, refreshInterval])

  function sendWinningTeam () {
    console.log(winningTeam) // send to backend which team was selected
    setDisabled(true) // Disable the radio buttons
  }

  if (match) {
    return <div>
         <CustomNavbar setToken={(id) => props.setToken(id)} viewer_id={props.viewer_id}/>
         <Container fluid>
            <Row>
               <Col className="side-col" />
               <Col xs={8} className="pr-0 main-col">
                  <Row>
                     <Col>
                        <h6 style={{ color: 'black' }}> Discord: {match.discord}</h6>
                        {console.dir(match)}
                        <TeamBuilder match_id={match_id} teams={match.teams}></TeamBuilder>
                     </Col>
                     <Col md={3}>
                        <FriendBar _id={props.viewer_id}/>
                     </Col>
                  </Row>
               </Col>
               <Col className="side-col" />
            </Row>
         </Container>
      </div>
  }

  return <div>
      <CustomNavbar setToken={(id) => props.setToken(id)} viewer_id={props.viewer_id}/>
      <Container fluid>
         <Row>
            <Col className="side-col" />
            <Col xs={8} className="pr-0 main-col">
               <Row>
                  <Col>
                     <Row>
                        <Col>
                           <h4 style={{ color: 'red' }}> Team 1</h4>
                        </Col>
                        <Col>
                           <h2 style={{ color: 'white' }}> Lobby</h2>
                           <h4 style={{ color: 'white' }}> Match info</h4>
                           <h6 style={{ color: 'black' }}> Discord:</h6>
                        </Col>
                        <Col>
                           <h4 style={{ color: 'blue' }}> Team 2</h4>
                        </Col>
                     </Row>
                     <Row>
                        <Col />
                        <Col md={5}>
                           <Row>
                              Which team won?
                           </Row>
                           <Row>
                              <div className="form-check">
                                 <input className="form-check-input" type="radio" onChange={() => setWinningTeam('Team A')} name="choseWinningTeam" disabled={disabled}/>
                                 <label className="form-check-label" htmlFor="teamA">Team A</label>
                              </div>
                              <div className="form-check">
                                 <input className="form-check-input" type="radio" onChange={() => setWinningTeam('Team B')} name="choseWinningTeam" disabled={disabled}/>
                                 <label className="form-check-label" htmlFor="teamB">Team B</label>
                              </div>
                           </Row>
                           <Row>
                              <Button variant="secondary" onClick={sendWinningTeam}>Submit</Button>
                           </Row>
                        </Col>
                        <Col />
                     </Row>
                  </Col>
                  <Col md={3}>
                     <FriendBar _id={props.viewer_id}/>
                  </Col>
               </Row>
            </Col>
            <Col className="side-col" />
         </Row>
      </Container>
   </div>
}

export default Lobby
