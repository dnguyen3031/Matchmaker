import React, {useState, useEffect} from 'react';
import {Row, Col, Container, Table, Card, Button} from 'react-bootstrap';
import CustomNavbar from '../../CustomNavbar';
import axios from 'axios';

function ProfilePage(props) {
   const [user, setUser] = useState([]);

   useEffect(() => {
      fetchUser(props.id).then( result => {
         if (result)
            setUser(result);
      });
   }, []);

   async function fetchUser(id){
      try {
         // get character at index 's id number
         const response = await axios.get('http://127.0.0.1:5000/users/' + id);
         console.log(response.data);
         console.log("YOOOOOOO");
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
                  {/* <Card.Text>
                     Discord: {user.contact_info.discord}
                  </Card.Text>
                  <Card.Text>
                     Email: {user.contact_info.email}
                  </Card.Text> */}
                  <Button variant="primary">Edit Profile</Button>
               </Card.Body>
               </Card>
            </Col>
            <Col /> 
         </Row>
         <Row>
            <Col>
               <GamesTable user={user} />
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

function GamesTable() {
   return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Game Title</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Team Fortress 2</td>
            <td>1231</td>
          </tr>
          <tr>
            <td>Raid Shadow Legends</td>
            <td> > 9000</td>
          </tr>
        </tbody>
      </Table>
   );
}
export default ProfilePage;
