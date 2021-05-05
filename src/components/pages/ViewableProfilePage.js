import { Row, Card, Col, Container, Image, Table, Button} from 'react-bootstrap';
import CustomNavbar from '../CustomNavbar';
import React from 'react';
import './ProfilePage.css';
import FriendBar from "../FriendBar";
import {
   useParams
 } from "react-router-dom";

function ViewableProfile(props) {
   const [profileID] = React.useState(useParams().id);
   const [areFriends, setAreFriends] = React.useState(false);
   

   React.useEffect(() => {
      function confirmFriends() {
         for (const key in props.friendsList) {
            if (key === profileID && props.friendsList[key] !== "Deleted") {
               console.log(props.viewer_id  + " has already added " + key);
               setAreFriends(true);
            }
         }
      }
      
      confirmFriends();
   }, [profileID, props.friendsList, props.viewer_id]);


   function addFriendAction() {
      props.handleSubmit({"friends": {
            [profileID] : "Standard"
         }})
      console.log("Adding this id :" + profileID);
   }


   function removeFriendAction() {
      props.handleSubmit({"friends": {
            [profileID] : "Deleted"
         }})
      console.log("Removing!");
   }


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


   return <div>
   <CustomNavbar setToken={(id) => props.setToken(id)} viewer_id={props.viewer_id}/>
   <Container fluid> 
      <Row>
         <Col className="side-col" />
         <Col xs={8} className="main-col pr-0">
            <Row>
               <Col>
                  <Row className="pt-3 pb-3">
                     {/* TODO: Fix pictures */}
                     {/* <Col>
                        <Image src="../DefaultProfilePic.jpg" rounded/>
                     </Col> */}
                     <Col>
                        <Card bg='dark' text='white'>
                           <Card.Body>
                              <Card.Title>{props.user.name}</Card.Title>
                              <Card.Text class="text-white">{props.user.profile_info.bio}</Card.Text>
                           </Card.Body>
                        </Card>
                     </Col>
                     <Col></Col>
                  </Row>
                  <Row className="justify-content-md-center pb-3">
                     <Card bg='dark' text='white'>
                        <Card.Body>
                           <Card.Title>Contact Information</Card.Title>
                           <Card.Text class="text-white">Email: {props.user.email}</Card.Text>
                           <Card.Text class="text-white">Discord: {props.user.profile_info.discord}</Card.Text>
                           <Card.Text class="text-white">Steam Name: {props.user.profile_info.steam_name}</Card.Text>
                        </Card.Body>
                     </Card>
                  </Row>
                  <Row className="justify-content-md-center">
                     <Col xs={6}>
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
                  </Row>
               </Col>
               <Col md={3}>
                  <FriendBar _id={props.user._id} /> 
                  {/* _id="603c339a5ef99cf0de73b4b8" */}
               </Col>
            </Row>
         </Col>
         <Col className="side-col" />
      </Row>
   </Container>
</div>;
 }

 export default ViewableProfile;