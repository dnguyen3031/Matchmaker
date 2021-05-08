import React, { useState } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import axios from 'axios'
import './PageTemplate.css'

function Players (props) {
  const players = Object.keys(this.props.group.players).map((player, index) => {
    return (
      <div key={index}>
        <div>{this.props.group.players[player]}</div>
      </div>
    )
  })
  return <div>{players}</div>
}

function TeamTable (props) {
  const rows = this.props.team.map((group, index) => {
    return (
      <div key={index}>
        <Players group={group} />
      </div>
    )
  })

  return (
    <div>
      <select
        disabled={this.props.disabled}
        onChange={(e) => this.props.scoreATeam(this.props.index, e.target.value)}
      >
        {this.props.options}
        {/* <option value={1}>1st</option>
              <option value={2}>2nd</option> */}
      </select>
      <h3>Team {this.props.index}</h3>
      {rows}
    </div>
  )
}

function TeamBuilder (props) {
  const [teams] = useState(this.props.teams)
  const [scores] = useState([1, 1])
  const [disabled, setDisabled] = useState(false)

  const options = this.props.teams.map((team, index) => {
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
        'http://localhost:5000/lobbies/submit-results/' + this.props.match_id,
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
