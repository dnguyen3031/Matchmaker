import React, {useState, useEffect} from 'react';
import {Row, Col, Container, Table, Card, Button} from 'react-bootstrap';
import CustomNavbar from '../../CustomNavbar';
import axios from 'axios';

function ProfilePage(props) {
   const [user, setUser] = useState({bio: "", 
                                 contact_info: {discord: "", email: ""},
                                 games_table: {},
                                 name: "",
                                 password: "",
                                 _id: ""});

   useEffect(() => {
      fetchUser(props.id).then( result => {
         if (result) {
            setUser(result);

         }
      });
   }, []);

   console.log("THIS IS USER: ", user);

   async function fetchUser(id){
      try {
         // get character at index 's id number
         const response = await axios.get('http://127.0.0.1:5000/users/' + id);
         return response.data;
      }
      catch (error) {
         console.log(error);
         return false;
      }
   }


   return <div> 
      <CustomNavbar />
      <Container fluid>
         <Row>
            <Col /> 
            {/*2 empty cols ensure middle col is centered */}
            <Col> 
            <Card style={{ width: '18rem' }}>
               <Card.Img variant="top" src="testProfilePic.JPG" />
               <Card.Body>
                  <Card.Title>{user.name}</Card.Title>
                  <Card.Text>
                     {user.bio}
                  </Card.Text>
                  <Card.Text>
                     Discord: {user.contact_info.discord}
                  </Card.Text>
                  <Card.Text>
                     Email: {user.contact_info.email}
                  </Card.Text>
                  <Button variant="primary">Edit Profile</Button>
               </Card.Body>
               </Card>
            </Col>
            <Col /> 
         </Row>
         <Row>
            <Col>
               <Table striped bordered hover className="mt-2">
                  <thead>
                     <tr>
                        <th>Game Title</th>
                        <th>Game Score</th>
                        <th>Time Played</th>
                     </tr>
                  </thead>
                  {/* {usersgamesList.map((game) => (
                     <tr>
                        <td>{game[0]}</td>
                        <td>{game[1].game_score}</td>
                        <td>{game[1].time_played}</td>
                     </tr>
                  ))} */}
                  {Object.keys(user.games_table).map((game, i) => (  // Note we are mapping through a list of user.games_table keys, because of the Object.keys function
                     <tr key={i}>
                        <td>{game}</td>
                        <td>{(user.games_table[game]).game_score}</td>
                        <td>{(user.games_table[game]).time_played}</td>
                     </tr>
                  ))
                  }
      
                  {/* <TableBody /> */}
                  </Table>
            </Col>
         </Row>
      </Container>
   </div>;
}
export default ProfilePage;
