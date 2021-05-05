import React, {useState, useEffect} from 'react';
import CustomNavbar from '../CustomNavbar';
import { Col, Row, Button, Container, Form } from 'react-bootstrap';
import axios from 'axios';
import './PageTemplate.css';
import FriendBar from "../FriendBar";
import TeamBuilder from "./TeamBuilder";

function Lobby(props) {
    const id = props.viewer_id
    //const match_id = props.match_id
    const match_id = props.match_id;
    const [match, setMatch] = useState(props.match);

    const [refreshInterval, setRefreshInterval] = useState(2);

    const [winningTeam, setWinningTeam] = useState('Draw');
    const [disabled, setDisabled] = useState(false);

    async function getMatch(match_id) {
        // console.log(match_id)
        try {
           // get character at index 's id number
           const response = await axios.get('https://matchmaker-backend01.herokuapp.com/lobbies/' + match_id);
           return response.data;
        }
        catch (error) {
           console.log(error);
           return false;
        }
     }
  
    const fetchMatch = (match_id) => { 
        console.log(match_id)
        getMatch(match_id).then( result => {
            if (result) {
                setMatch(result);
                console.log("got match")
            } else {
                console.log("failed to get match")    
            }
        });
    }

    useEffect(() => {
        if (refreshInterval && refreshInterval > 0) {
            const interval = setInterval(fetchMatch(match_id), refreshInterval);
            return () => clearInterval(interval);
        }
    }, [refreshInterval]);

    function sendWinningTeam() {
       console.log(winningTeam);                  // send to backend which team was selected
       setDisabled(true); // Disable the radio buttons 
    }
    // console.log(match)
    // console.log(match_id)

    if (match) {
        return <div> 
            <CustomNavbar setToken={(id) => props.setToken(id)} viewer_id={props.viewer_id}/>
            <Container fluid> 
                <Row>
                    <Col className="side-col" />
                    <Col xs={8} className="pr-0 main-col">
                    <Row>
                        <Col>
                           <h6 style={{color: 'black'}}> Discord: {match.discord}</h6>
                           {console.dir(match)}
                           <TeamBuilder match_id={match_id} teams={match["teams"]}></TeamBuilder>
                           {/* <Row>
                              <Col>
                                 <h4 style={{color: 'red'}}> Team 1</h4>
                                 <TeamTable team={match.teams[0]}/>
                              </Col>
                              <Col>
                                 <h2 style={{color: 'white'}}> Lobby</h2>
                                 <h4 style={{color: 'white'}}> Match info</h4>
                                 <h6 style={{color: 'black'}}> Discord: {match.discord}</h6>
                              </Col>
                              <Col>
                                 <h4 style={{color: 'blue'}}> Team 2</h4>
                                 <TeamTable team={match.teams[1]}/>
                              </Col>
                           </Row> */}
                        </Col>
                        <Col md={3}>
                            <FriendBar _id={props.viewer_id}/>
                        </Col>
                    </Row>
                    </Col>
                    <Col className="side-col" />
                </Row>
            </Container>
        </div>;
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
                           <h4 style={{color: 'red'}}> Team 1</h4>
                        </Col>
                        <Col>
                           <h2 style={{color: 'white'}}> Lobby</h2>
                           <h4 style={{color: 'white'}}> Match info</h4>
                           <h6 style={{color: 'black'}}> Discord:</h6>
                        </Col>
                        <Col>
                           <h4 style={{color: 'blue'}}> Team 2</h4>
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
                                 <input className="form-check-input" type="radio" onChange={() => setWinningTeam("Team A")} name="choseWinningTeam" disabled={disabled}/>
                                 <label className="form-check-label" for="teamA">Team A</label>
                              </div>
                              <div className="form-check">
                                 <input className="form-check-input" type="radio" onChange={() => setWinningTeam("Team B")} name="choseWinningTeam" disabled={disabled}/>
                                 <label className="form-check-label" for="teamB">Team B</label>
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
   </div>;
}

function TeamTable(props)
{
    const rows = props.team.map((group) => {
        return (
            <tr>
                <Players group={group}/>
            </tr>
        );
    })
    return (
        <tbody>
            {rows}
        </tbody>
    );
}

function Players(props)
{
    const players = Object.keys(props.group.players).map((player, index) => {
        return (
            <tr>
                <td>{props.group.players[player]}</td>
            </tr>
        );
    })
    // console.log(players)
    return (
        <tbody>
            {players}
        </tbody>
    );
}

// const Dashboard = () => {
//     const [data, setData] = useState();
//     const [refreshInterval, setRefreshInterval] = useState(refreshInUrl || 0);
//     const fetchMetrics = () => {
//       // retrieve and then setData()
//     }
//     useEffect(() => {
//       if (refreshInterval && refreshInterval > 0) {
//         const interval = setInterval(fetchMetrics, refreshInterval);
//         return () => clearInterval(interval);
//       }
//     }, [refreshInterval]);
    
//     return (
//       <div>
//         // dashboard content, including a dropdown for the
//         // refresh interval, which calls setRefreshInterval()
//       </div>
//     );
// }

export default Lobby;