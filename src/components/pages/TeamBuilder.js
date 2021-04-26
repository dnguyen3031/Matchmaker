import React, {useState, useEffect} from 'react';
import CustomNavbar from '../CustomNavbar';
import { Col, Row, Button, Container, Form, TabContainer, Dropdown } from 'react-bootstrap';
import axios from 'axios';
import './PageTemplate.css';
import DropdownButton from 'react-bootstrap/DropdownButton';

function TeamBuilder(props) {
    const id = props.viewer_id
    const [teams, setTeams] = useState(props.teams);
    const [scores, setScores] = useState([1, 1]);
    const [disabled, setDisabled] = useState(false);
   //  console.dir(teams);
    
    const options = props.teams.map((team, index) => {
       return (
          <option value={index + 1}>{index + 1}</option>
       )
    })

    function scoreATeam(index, place) {  // Helper function that is passed down to each select menu
      scores[index] = place;
    }

    function pressedSubmit() {
       setDisabled(true);
       var obj = {
         "ranking": scores.map((i) => Number(i)) // Convert the scores to an array of Numbers
      }
      console.dir(obj);

      makePatchCall(obj);
    }

   async function makePatchCall(change){
      try {
         const response = await axios.patch('http://localhost:5000/lobbies/submit-results/' + props.match_id, change);
         return response;
      }
      catch (error) {
         console.log(error);
         return false;
      }
   }

    const rows = teams.map((team, index) => {
       return (
          <div>
         <Col>
            <TeamTable team={team} options={options} index={index} scoreATeam={scoreATeam} scores={scores} disabled={disabled}/>
         </Col>
       </div>
       )

    })

    return <div> 
       <Row>{rows}</Row>
       <Button variant="secondary" onClick={pressedSubmit}>Submit</Button>
   </div>;
}

function TeamTable(props)
{
    const rows = props.team.map((group) => {
        return (
            <div>
                <Players group={group}/>
            </div>
        );
    })
    return (
        <div>
           <select disabled={props.disabled} onChange={(e) => props.scoreATeam(props.index, e.target.value)}>
              {props.options}
              {/* <option value={1}>1st</option>
              <option value={2}>2nd</option> */}
           </select>

        <h3>Team {props.index}</h3>
            {rows}
        </div>
    );
}

function Players(props)
{
    const players = Object.keys(props.group.players).map((player, index) => {
        return (
            <div>
                <div>{props.group.players[player]}</div>
            </div>
        );
    })
    return (
        <div>
            {players}
        </div>
    );
}

export default TeamBuilder;