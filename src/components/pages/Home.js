import React from 'react';
import CustomNavbar from '../CustomNavbar';
import FriendBar from "../FriendBar";
import { Button, Row, Col, Container, Accordion, Card, Nav } from "react-bootstrap";
import Collapse from 'react-bootstrap/Collapse';

function Home() {
   const [openFriends, setOpenFriends] = React.useState(true);
   const [openGroups, setOpenGroups] = React.useState(true);
   return <div> 
      <CustomNavbar />
      <Container fluid>
         <Row>
            <Col>Home is here!HomeHome is here!Home is here!Home is here!Home is here!Home isHome is here!Home is here!Home is here!Home is here!Home is here!Home is here! here!Home is here!Home is here!Home is here!Home is here!Home is here!Home is here!Home is here!Home is here!Home is here!Home is here!Home is here!Home is here!Home is here!Home isHome is here!Home is here!Home is here!Home is here!Home is here!Home is here! here!Home is here!Home is here!Home is here!Home is here!Home is here!Home is here!Home is here!Home is here!Home is here!
            Home is here!Home is here!Home is here!Home is here!Home isHome is here!Home is here!Home is here!Home is here!Home is here!Home is here! here!Home is here!Home is here!Home is here!Home is here!Home is here!Home is here!Home is here!Home is here!Home is here!
            Home is here!Home is here!Home is here!Home is here!Home isHome is here!Home is here!Home is here!Home is here!Home is here!Home is here! here!Home is here!Home is here!Home is here!Home is here!Home is here!Home is here!Home is here!Home is here!Home is here!
            Home is here!Home is here!Home is here!Home is here!Home isHome is here!Home is here!Home is here!Home is here!Home is here!Home is here! here!Home is here!Home is here!Home is here!Home is here!Home is here!Home is here!Home is here!Home is here!Home is here! is here!Home is here!Home is here!Home isHome is here!Home is here!Home is here!Home is here!Home is here!Home is here! here!Home is here!Home is here!Home is here!Home is here!Home is here!Home is here!Home is here!Home is here!Home is here!</Col>
            <Col md={{ span: 2}}>
               <FriendBar />
            </Col>
         </Row>
      </Container>
   </div>;
 }
 
export default Home;