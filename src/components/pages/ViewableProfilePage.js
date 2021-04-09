import { Row, Col, Container, Image, Table, Card, Button, Modal} from 'react-bootstrap';
import CustomNavbar from '../CustomNavbar';
import React, {useState, useEffect} from 'react';
import './ProfilePage.css';
import FriendBar from "../FriendBar";
import { BsPencil } from "react-icons/bs";

function ViewableProfile(props) {
 
    return <div>
         <CustomNavbar setToken={(id) => props.setToken(id)} viewer_id={props.viewer_id}/>
         <Container fluid> 
            <Row>
               <Col className="side-col" />
               <Col xs={8} className="main-col pr-0">
                  <Row>
                     <Col>
                        <Row className="pt-3 pb-3">
                           <Col xs={3}>
                              <Image src="test_profile_pic.jpg" rounded fluid/>
                           </Col>
                           <Col xs={4} className="pt-2 text-white">
                              <div className="h3">{props.user.name}</div>
                              <div className="h5">Bio: </div>
                              <div>
                                {props.user.profile_info.bio} 
                              </div>
                           </Col>
                           <Col xs={4} className="pt-2 bg-dark text-white">
                              <div className="text-center">Contact Info</div>
                              <div className="pt-4">Email: {props.user.email} </div>
                              <div className="pt-4">Discord: {props.user.profile_info.discord}</div>
                              <div className="pt-4 pb-4">Steam Name: {props.user.profile_info.steam_name} </div>
                           </Col>
                        </Row>
                        <Row>
                           <Col xs={8}>
                              <Table variant="dark">
                                 <thead>
                                    <tr>
                                       <th>Game</th>
                                       <th>Rank</th>
                                    </tr>
                                 </thead>
                                <GameTable />
                              </Table>
                           </Col>
                           <Col></Col>
                        </Row>
                        
                     </Col>
                     <Col md={3}>
                        <FriendBar _id={props.viewer_id} />  
                        {/* changed from user_id to viewer_id because we want to keep freinds bar of the person that is logged in */}
                     </Col>
                  </Row>
               </Col>
               <Col className="side-col" />
            </Row>
         </Container>
    </div>;

    function GameTable()
    {
       const rows = Object.keys(props.user.games_table).map((game, index) => {
          return (
             <tr key={index}>
                <td>{game}</td>
                <td>{props.user.games_table[game].Rank}</td>
             </tr>
          );
       })
       return (
          <tbody>
             {rows}
          </tbody>
       );
    }
 }

 export default ViewableProfile;