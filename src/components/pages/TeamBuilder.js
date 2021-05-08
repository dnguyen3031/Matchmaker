import React, {useState} from 'react';
import { Alert, Card, Container, Button, Col, Row} from 'react-bootstrap';
import ListGroup from 'react-bootstrap/ListGroup';
import axios from 'axios';
import './PageTemplate.css';

function Players(props)
{
   const players = Object.keys(props.group.players).map((player, index) => {
      return (
            <div>
               <ListGroup.Item variant="dark">{props.group.players[player]}</ListGroup.Item>
            </div>
      );
   })
   return (
         <div>
            {players}
         </div>
   );
}

function TeamTable(props)
{
   const rows = props.team.map((group) => {
      return (
            <div>
               <ListGroup>
                  <Players group={group}/>
               </ListGroup>
            </div>
      );
   })

   return (
         <div>
            <select class="mb-3 bg-white" disabled={props.disabled} onChange={(e) => props.scoreATeam(props.index, e.target.value)}>
               {props.options}
            </select>
            <Card bg="dark" text="white">
               <Card.Header>Team {props.index + 1}</Card.Header>
               {rows}
            </Card>
         </div>
   );
}

function TeamBuilder(props) {
   const [teams] = useState(props.teams);
   const [scores] = useState([1, 1]);
   const [disabled, setDisabled] = useState(false);
    
   const options = props.teams.map((team, index) => {
      return (
            <option value={index + 1}>{index + 1}</option>
      )
   })


   function scoreATeam(index, place) {  // Helper function that is passed down to each select menu
      scores[index] = place;
   }

   const allTeams = teams.map((team, index) => {
      return (
            <div>
               <Col>
                  <TeamTable team={team} options={options} index={index} scoreATeam={scoreATeam} scores={scores} disabled={disabled}/>
               </Col>
            </div>
      )
   })


   async function makePatchCall(change){
      try {
         return await axios.patch('http://localhost:5000/lobbies/submit-results/' + props.match_id, change);
      }
      catch (error) {
         console.log(error);
         return false;
      }
   }

   function pressedSubmit() {
      setDisabled(true);
      const obj = {
         "ranking": scores.map((i) => Number(i)) // Convert the scores to an array of Numbers
      };
      console.dir(obj);

      makePatchCall(obj);
   }


   return <div>
      <Container>
      <Alert className="mt-3" variant="success">Please join Discord {props.discord}</Alert>
      <Row className="justify-content-md-center mb-3">
         <Card className="text-center" bg="dark" text="white" style={{width: '18rem'}}>
                  <Card.Body>
                     <Card.Text className="text-white">Discord {props.discord}</Card.Text>
                     <Card.Text className="text-white">Krunker Hardpoint</Card.Text>
                  </Card.Body>
               </Card>
      </Row>
         <Row className="justify-content-md-center">
            {allTeams}
         </Row>
         <Row className="justify-content-md-center mt-3">
            <Button variant="secondary" onClick={pressedSubmit}>Submit</Button>
         </Row>
      </Container>
   </div>;
}

export default TeamBuilder;