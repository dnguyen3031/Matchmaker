import React, { useState } from 'react'
import { Alert, Card, Container, Button, Col, Row } from 'react-bootstrap'
import ListGroup from 'react-bootstrap/ListGroup'
import axios from 'axios'
import './PageTemplate.css'

function Players (props) {
  const players = Object.keys(props.group.players).map((player, index) => {
    return (
      <div key={index}>
        <ListGroup.Item variant="dark">{props.group.players[player]}</ListGroup.Item>
      </div>
    )
  })
  return (
    <div>
      {players}
    </div>
  )
}

function TeamTable (props) {
  const rows = props.team.map((group, index) => {
    return (
      <div key={index}>
        <ListGroup>
          <Players group={group}/>
        </ListGroup>
      </div>
    )
  })

  return (
    <div>
      <select className="mb-3 bg-white" disabled={props.disabled} onChange={(e) => props.scoreATeam(props.index, e.target.value)}>
        {props.options}
      </select>
      <Card bg="dark" text="white">
        <Card.Header>Team {props.index + 1}</Card.Header>
        {rows}
      </Card>
    </div>
  )
}

function TeamBuilder (props) {
  const [teams] = useState(props.data.lobby.teams)
  const [scores] = useState([1, 1])
  const [disabled, setDisabled] = useState(false)
  const [timer, setTimer] = useState(props.data.lobby.time_left)

  React.useEffect(() => {
    timer > 0 && setTimeout(() => setTimer(timer - 1), 1000)
  }, [timer])

  const options = props.data.lobby.teams.map((team, index) => {
    return (
      <option value={index + 1} key={index}>{index + 1}</option>
    )
  })

  async function makeSubmitResultsPatchCall (change) {
    try {
      const result = await axios.patch('https://matchmaker-backend01.herokuapp.com/lobbies/submit-results?lobby_id=' + props.data.lobby._id + '&id=' + props.data.id, change)
      setTimeout(() => { window.location.reload(false) }, 5000)
      return result
    } catch (error) {
      console.log(error)
      return false
    }
  }

  function scoreATeam (index, place) { // Helper function that is passed down to each select menu
    scores[index] = place
  }

  const allTeams = teams.map((team, index) => {
    return (
      <div key={index}>
        <Col>
          <TeamTable team={team} options={options} index={index} scoreATeam={scoreATeam} scores={scores} disabled={disabled}/>
        </Col>
      </div>
    )
  })

  function pressedSubmit () {
    setDisabled(true)
    const rankObj = {
      ranking: scores.map((i) => Number(i)) // Convert the scores to an array of Numbers
    }
    // console.dir(obj)
    console.log(props.data)
    makeSubmitResultsPatchCall(rankObj)
  }

  function secondsToHms (d) { // This function from Stack Overflow provides a convientent way to make time left more readable.
    d = Number(d)
    const h = Math.floor(d / 3600)
    const m = Math.floor(d % 3600 / 60)
    const s = Math.floor(d % 3600 % 60)

    const hDisplay = h > 0 ? h + (h === 1 ? ' hour, ' : ' hours, ') : ''
    const mDisplay = m > 0 ? m + (m === 1 ? ' minute, ' : ' minutes, ') : ''
    const sDisplay = s > 0 ? s + (s === 1 ? ' second' : ' seconds') : ''
    return hDisplay + mDisplay + sDisplay
  }

  return <div>
    <Container>
      <Alert className="mt-3" variant="success">Please join Discord {props.discord}</Alert>
      <Row className="justify-content-md-center mb-3">
        <Card className="text-center" bg="dark" text="white" style={{ width: '18rem' }}>
          <Card.Body>
            <Card.Text className="text-white">{props.data.game.game_name}</Card.Text>
            <Card.Text className="text-white">Discord {props.data.lobby.discord}</Card.Text>
            <Card.Text className="text-white">Time Left: {secondsToHms(timer)}</Card.Text>
          </Card.Body>
        </Card>
      </Row>
      <Row className="justify-content-md-center">
        {allTeams}
      </Row>
      <Row className="justify-content-md-center mt-3">
        {!props.data.user.has_voted && <Button variant="secondary" onClick={pressedSubmit}>Submit</Button>}
      </Row>
    </Container>
  </div>
}

export default TeamBuilder
