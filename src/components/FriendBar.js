import React from 'react';
import { Button, Card, Row, Accordion } from "react-bootstrap";
import Collapse from 'react-bootstrap/Collapse';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function FriendsList(props) {
   const rows = Object.keys(props.list).map((friend, i) => {
      return (
           <Button key={i}>{friend}</Button>
      )
   })

   return (
      <div>
         {rows}
      </div>
   );
   
   }

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
      fetchUser().then( result => {
         if (result) {
            setUser(result);
         }
      });
   }, []);
   
   async function fetchUser(){
      try {
         // get character at index 's id number
         const response = await axios.get('http://127.0.0.1:5000/users/' + props._id);
         console.log("here is the response data: ", response.data);
         return response.data;
      }
      catch (error) {
         console.log(error);
         console.log("NOPE!!!!");
         return false;
      }
   }

   return <div> 
     {/* <Row>
               <Button block
                  onClick={() => setOpenFriends(!openFriends)}
                  aria-expanded={openFriends}
                  >
                  Friends
                  </Button>
                  <Collapse in={openFriends}>
                     <Button>TEST</Button>
                     <div>TDD</div>
                  </Collapse>
   </Row> */}
      <Accordion defaultActiveKey="0">
         <Card>
            <Accordion.Toggle as={Button} eventKey="0">
               Friends
            </Accordion.Toggle>
         <Accordion.Collapse eventKey="0">
            <FriendsList list={user.friends}></FriendsList>
         </Accordion.Collapse>
         </Card>
      </Accordion>
             
   </div>;
 }

export default FriendBar;