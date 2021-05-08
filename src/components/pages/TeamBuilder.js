import React, { useState } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import axios from 'axios'
import './PageTemplate.css'

function Players (props) {
  const players = Object.keys(props.group.players).map((player, index) => {
    return (
      <div key={index}>
        <div>{props.group.players[player]}</div>
      </div>
    )
  })
  return <div>{players}</div>
}

function TeamTable (props) {
  const rows = props.team.map((group, index) => {
    return (
      <div key={index}>
        <Players group={group} />
      </div>
    )
  })

  return (
    <div>
      <select
        disabled={props.disabled}
        onChange={(e) => props.scoreATeam(props.index, e.target.value)}
      >
        {props.options}
        {/* <option value={1}>1st</option>
              <option value={2}>2nd</option> */}
      </select>
      <h3>Team {props.index}</h3>
      {rows}
    </div>
  )
}

function TeamBuilder (props) {
  const [teams] = useState(props.teams)
  const [scores] = useState([1, 1])
  const [disabled, setDisabled] = useState(false)

  const options = props.teams.map((team, index) => {
    return <option value={index + 1} key={index}>{index + 1}</option>
  })

  function scoreATeam (index, place) {
    // Helper function that is passed down to each select menu
    scores[index] = place
  }

  const rows = teams.map((team, index) => {
    return (
      <div key={index}>
        <Col>
          <TeamTable
            team={team}
            options={options}
            index={index}
            scoreATeam={scoreATeam}
            scores={scores}
            disabled={disabled}
          />
        </Col>
      </div>
    )
  })

  async function makePatchCall (change) {
    try {
      return await axios.patch(
        'http://localhost:5000/lobbies/submit-results/' + props.match_id,
        change
      )
    } catch (error) {
      console.log(error)
      return false
    }
  }

  function pressedSubmit () {
    setDisabled(true)
    const obj = {
      ranking: scores.map((i) => Number(i)) // Convert the scores to an array of Numbers
    }
    console.dir(obj)

    makePatchCall(obj)
  }

  return (
    <div>
      <Row>{rows}</Row>
      <Button variant="secondary" onClick={pressedSubmit}>
        Submit
      </Button>
    </div>
  )
}

export default TeamBuilder
