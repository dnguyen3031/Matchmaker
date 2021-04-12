import React, {useState, useEffect} from 'react';
import CustomNavbar from '../CustomNavbar';
import { Col, Row, Button, Container, Form } from 'react-bootstrap';
import axios from 'axios';
import './PageTemplate.css';
import FriendBar from "../FriendBar";

function Lobby(props) {
    const id = props.viewer_id
    const match_id = props.match_id
    const [match, setMatch] = useState(props.match);

    const [refreshInterval, setRefreshInterval] = useState(2);

    async function getMatch(match_id) {
        // console.log(match_id)
        try {
           // get character at index 's id number
           const response = await axios.get('http://127.0.0.1:5000/lobbies/' + match_id);
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
                console.log("updated user")
            } else {
                console.log("failed to update user")    
            }
        });
    }

    useEffect(() => {
        if (refreshInterval && refreshInterval > 0) {
            const interval = setInterval(fetchMatch(match_id), refreshInterval);
            return () => clearInterval(interval);
        }
    }, [refreshInterval]);
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
                            <h2 style={{color: 'white'}}> Lobby</h2>
                            <h4 style={{color: 'red'}}> Team 1</h4>
                            <TeamTable team={match.teams[0]}/>
                            <h4 style={{color: 'white'}}> Match info</h4>
                            <h4 style={{color: 'blue'}}> Team 2</h4>
                            <TeamTable team={match.teams[1]}/>
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
                        <h2 style={{color: 'white'}}> Lobby</h2>
                        <h4 style={{color: 'red'}}> Team 1</h4>
                        <h4 style={{color: 'whte'}}> Match info</h4>
                        <h4 style={{color: 'blue'}}> Team 2</h4>
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
    // console.log(props)
    // console.log(props.teams)
    // console.log(props.teams[0])
    // console.log(props.team)
    // console.log(Object.props)
    // console.log(Object.props.team)
    const rows = props.team.map((group) => {
        // console.log(group)
        return (
            <tr>
                <Players group={group}/>
            </tr>
        );
    })
    // console.log(rows)
    return (
        <tbody>
            {rows}
        </tbody>
    );
}

function Players(props)
{
    // console.log(props)
    const players = props.group.players.map((player) => {
        // console.log(player)
        return (
            <tr>
                <td>{player}</td>
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