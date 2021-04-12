import React, {useState, useEffect} from 'react';
import CustomNavbar from '../CustomNavbar';
import { Col, Row, Button, Container, Form } from 'react-bootstrap';
import axios from 'axios';
import './PageTemplate.css';
import FriendBar from "../FriendBar";
import Lobby from './Lobby'

function Queue(props) {
    const id = props.viewer_id
    const [match_id, setMatch_id] = useState(null);

    const [refreshInterval, setRefreshInterval] = useState(2);

    async function getMatch_id(viewer_id) {
        // console.log(match_id)
        try {
           // get character at index 's id number
           const response = await axios.get('http://127.0.0.1:5000/users/' + viewer_id);
           return response.data.lobby;
        }
        catch (error) {
           console.log(error);
           return false;
        }
     }
  
    const fetchMatch_id = (id) => { 
        // console.log(match_id)
        getMatch_id(id).then( result => {
            setMatch_id(result);
        });
    }

    useEffect(() => {
        if (refreshInterval && refreshInterval > 0) {
            const interval = setInterval(fetchMatch_id(id), refreshInterval);
            return () => clearInterval(interval);
        }
    }, [refreshInterval]);
    // console.log(match)
    // console.log(match_id)
    if (match_id) {
        return <Lobby match_id={match_id} viewer_id={props.viewer_id} setToken={props.setToken}/>
    //     return <div> 
    //     <CustomNavbar setToken={(id) => props.setToken(id)} viewer_id={props.viewer_id}/>
    //     <Container fluid> 
    //        <Row>
    //           <Col className="side-col" />
    //           <Col xs={8} className="pr-0 main-col">
    //              <Row>
    //                 <Col>
    //                       <h2 style={{color: 'white'}}> in lobby</h2>
    //                 </Col>
  
    //                 <Col md={3}>
    //                    <FriendBar _id={props.viewer_id}/>
    //                 </Col>
    //              </Row>
    //           </Col>
    //           <Col className="side-col" />
    //        </Row>
    //     </Container>
    //  </div>;
    }
    return <div> 
      <CustomNavbar setToken={(id) => props.setToken(id)} viewer_id={props.viewer_id}/>
      <Container fluid> 
         <Row>
            <Col className="side-col" />
            <Col xs={8} className="pr-0 main-col">
               <Row>
                  <Col>
                        <h2 style={{color: 'white'}}> finding match...</h2>
                        <h3 style={{color: 'white'}}> please wait</h3>
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

export default Queue;