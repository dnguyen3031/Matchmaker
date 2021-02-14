import React from 'react';
import {Row, Col, Container, Table, Card, Button} from 'react-bootstrap';
import CustomNavbar from '../../CustomNavbar';

function ProfilePage() {
   return <div> 
      <CustomNavbar />
      <Container fluid>
         <Row>
            <Col /> // there are 2 empty columns so that
            <Col>  // profile is in the middle col
               <ProfileCard />
            </Col>
            <Col /> // ^
         </Row>
         <Row>
            <Col>
               <GamesTable />
            </Col>
         </Row>
      </Container>
   </div>;
}

function ProfileCard() {
   return (
   <Card style={{ width: '18rem' }}>
     <Card.Img variant="top" src="holder.js/100px180" />
     <Card.Body>
       <Card.Title>Card Title</Card.Title>
       <Card.Text>
         Some quick example text to build on the card title and make up the bulk of
         the card's content.
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
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
          </tr>
          <tr>
            <td>3</td>
            <td colSpan="2">Larry the Bird</td>
            <td>@twitter</td>
          </tr>
        </tbody>
      </Table>
   );
}
export default ProfilePage;
