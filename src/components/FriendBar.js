import React from 'react';
import { Button, Card, Col, Row, Accordion, ListGroup } from "react-bootstrap";
import Collapse from 'react-bootstrap/Collapse';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';


function FriendBar(props) {
   const [openFriends, setOpenFriends] = React.useState(true);
   const [user, setUser] = React.useState({ 
                                 email: "",
                                 friends: {},
                                 games_table: {}, 
                                 name: "",
                                 password: "",
                                 profile_info: {bio: "", discord: "", profile_pic: "", steam_friend_code: "", steam_name: ""}});

   React.useEffect(() => {
      fetchUser(props._id).then( result => {
         if (result) {
            setUser(result);
         }
      });
   }, []);
   
   async function fetchUser(_id){
      try {
         // get character at index 's id number
         const response = await axios.get('http://127.0.0.1:5000/users/' + _id);
         console.log("GETTING THIS INFO FOR THIS ID ", _id);
         return response.data;
      }
      catch (error) {
         console.log(error);
         console.log("NOPE!!!!");
         return false;
      }
   }

   return <div> 
      <Accordion defaultActiveKey="0">
      {console.log(user.friends)}
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
             
   </div>;

function FriendsList(props) {
   
   const [friendList, setFriendList] = React.useState([]);
   const [responseList, setResponseList] = React.useState([]);

   async function getAllFriends() {
      for (var key in props.list) {
         const response = await fetchUser(key);
         console.log("RESPONSE: ", response);
         setFriendList(friendList => [... friendList, response.name]);
         setResponseList(responseList => [... responseList, response]);
      }
   }

   React.useEffect(() => {
      getAllFriends();
   }, []);

   console.log("friendsList: ", friendList);
   console.log("responseList: ", responseList);
   const rows = responseList.map((friend, i) => {

      return (
         <Col>
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

// function FriendsList(props) {
   
//    const [friendList, setFriendList] = React.useState([]);

//    async function getAllFriends() {
//       for (var key in props.list) {
//          const response = await props.fetchUser(key);
//          console.log("RESPONSE: ", response);
//          setFriendList(friendList => [... friendList, response.name]);
//       }
//    }

//    React.useEffect(() => {
//       getAllFriends();
//    }, []);

//    const rows = friendList.map((friend, i) => {

//       return (
//          <Col>
//             <ListGroup variant="flush">
//                <ListGroup.Item>
//                   <Row>
//                      {friend}
//                   </Row>
//                </ListGroup.Item>
//             </ListGroup>
//          </Col>
//       )
//    })

//    return (
//       <div>
//          {rows}
//       </div>
//    );
   
//    }

export default FriendBar;