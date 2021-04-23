import React from 'react';
import { Button, Card, Col, Row, Accordion, ListGroup} from "react-bootstrap";
import Collapse from 'react-bootstrap/Collapse';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function FriendBar(props) {
   const [user, setUser] = React.useState({
                                 _id: "", 
                                 email: "",
                                 group: "",
                                 friends: {},
                                 games_table: {}, 
                                 name: "",
                                 password: "",
                                 profile_info: {bio: "", discord: "", profile_pic: "", steam_friend_code: "", steam_name: ""}});

   const [usergroup, setGroup] = React.useState({_id: "", num_players: "", players: {}});

   React.useEffect(() => {
      fetchUser(props._id).then( result => {
         if (result) {
            setUser(result);
         }
      });
      console.log(user._id)
      fetchGroup(user.group).then( result => {
         if (result) {
            setGroup(result);
         }
      });
   }, []);
   
   async function fetchUser(_id){
      try {
         const response = await axios.get('http://127.0.0.1:5000/users/' + _id);
         return response.data;
      }
      catch (error) {
         console.log(error);
         return false;
      }
   }

   async function fetchGroup(_id){
      try {
         const response = await axios.get('http://127.0.0.1:5000/groups/' + _id);
         return response.data;
      }
      catch (error) {
         console.log(error);
         return false;
      }
   }

   return <div style={{ fontSize: 14 }}> 
      <Accordion defaultActiveKey="0">
         <Card>
            <Accordion.Toggle as={Card.Header} eventKey="0" className="text-center">
               Your Friends
            </Accordion.Toggle>
         <Accordion.Collapse eventKey="0">
            <Card.Body className="pl-0">
               <FriendsList list={user.friends}></FriendsList>
            </Card.Body>
         </Accordion.Collapse>
         </Card>
      </Accordion>
      <Accordion defaultActiveKey="0">
         <Card>
            <Accordion.Toggle as={Card.Header} eventKey="0" className="text-center">
               Your Group
            </Accordion.Toggle>
         <Accordion.Collapse eventKey="0">
            <Card.Body className="pl-0">
               Group Code: {"\n"}
               {user.group} {"\n"}
               Group members
               <FriendsList array={usergroup.players}></FriendsList>
            </Card.Body>
         </Accordion.Collapse>
         </Card>
      </Accordion>
             
   </div>;

function FriendsList(props) {
   
   const [friendList, setFriendList] = React.useState([]);
   const [responseList, setResponseList] = React.useState([]);

   async function getAllFriends() {
      for (var key in props.list) {
         if (props.list[key] !== "Deleted") {
            const response = await fetchUser(key);
            setFriendList(friendList => [... friendList, response.name]);
            setResponseList(responseList => [... responseList, response]);
         } else {
            console.log(key + " is a deleted friend.");
         }
         
      }
   }

   React.useEffect(() => {
      getAllFriends();
   }, []);

   const rows = responseList.map((friend, i) => {
      return (
         <Col key={i}>
            <ListGroup variant="flush">
               <ListGroup.Item>
                  <Link to={'/profile/' + friend._id} >
                     {friend.name}
                  </Link>
               </ListGroup.Item>
            </ListGroup>
         </Col>
      )
   })

   return (
      <div>
         {rows}
      </div>
   );
   
   }
 }

export default FriendBar;