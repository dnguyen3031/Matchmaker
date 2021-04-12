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

    const [refreshInterval, setRefreshInterval] = useState(1);

    async function getMatch(match_id) {
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
            const interval = setInterval(fetchMatch, refreshInterval);
            return () => clearInterval(interval);
        }
    }, [refreshInterval]);

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
                        {/* <TeamTable/> */}
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

// function TeamTable()
// {
//     // const rows = Object.keys(props.user.games_table).map((game, index) => {
//     //     return (
//     //         <tr key={index}>
//     //         <td>{game}</td>
//     //         <td>{props.user.games_table[game].Rank}</td>
//     //         </tr>
//     //     );
//     // })
//     // return (
//     //     <tbody>
//     //         {rows}
//     //     </tbody>
//     // );
// }

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