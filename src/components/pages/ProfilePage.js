import React, {useState, useEffect} from 'react';
import {Row, Col, Container, Table, Card, Button} from 'react-bootstrap';
import CustomNavbar from '../../CustomNavbar';
import axios from 'axios';

function ProfilePage(props) {
   const [user, setUser] = useState([]);
   const [gamesList, setGamesList] = useState([]);
   const [contactInfo, setContactInfo] = useState([]);

   useEffect(() => {
      fetchUser(props.id).then( result => {
         if (result)
            setUser(result);
            setContactInfo(result.contact_info);
      });
   }, []);

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

   for (var key in user.games_table){
      gamesList.push([key, user.games_table[key]]); // This for loop takes the JSON response data and loads it into an useState array ([game title, game information])
   }

   const rows = gamesList.map(game => {  // Go through gamesList to format and to add it into rows. (game[0] is the title, and games[1] is the other information about game)
      return (
         <tr>
            <td>{game[0]}</td>
            <td>{game[1].game_score}</td>
            <td>{game[1].time_played}</td>
         </tr>
      )
   });

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
                     Discord: {contactInfo["discord"]}
                  </Card.Text>
                  <Card.Text>
                     Email: {contactInfo["email"]}
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
                  <tbody>
                     {rows}
                  </tbody>
                  </Table>
            </Col>
         </Row>
      </Container>
   </div>;
}

function ProfileCard(props) {
   return (
   <Card style={{ width: '18rem' }}>
     <Card.Img variant="top" src="holder.js/100px180" />
     <Card.Body>
       <Card.Title>{props.name}</Card.Title>
       <Card.Text>
         {props.bio}
       </Card.Text>
       <Button variant="primary">Go somewhere</Button>
     </Card.Body>
   </Card>
   );
}

function TableBody(props) {
   const rows = props.games.map((key) => {
      return (
         <tr key={key.id}>
            <td>{key.name}</td>
         </tr>
      )
   })

   return (
      <tbody>
         {rows}
      </tbody>
   );
 }

function GamesTable(props) {

   return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Game Title</th>
            <th>Game Score</th>
            <th>Time Played</th>
          </tr>
        </thead>
        <tbody>
           <tr>
              <td>Krunker</td>
              <td>{props.games_table["Krunker"].game_score}</td>
              <td>{props.games_table["Krunker"].time_played}</td>
           </tr>
           <tr>
              <td>Minecraft</td>
              <td>{props.games_table["Minecraft"].game_score}</td>
              <td>{props.games_table["Minecraft"].time_played}</td>
           </tr>
        </tbody>
      </Table>
   );
}
export default ProfilePage;
