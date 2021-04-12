import React, {useState, useEffect} from 'react';
import CustomNavbar from '../CustomNavbar';
import { useParams } from 'react-router-dom';
import FriendBar from "../FriendBar";
import { Row, Col, Container, Form, Button } from "react-bootstrap";
import axios from 'axios';
import "./PageTemplate.css";

function SearchPage(props) {
   const [searchResults, setSearchResults] = React.useState("");
                                    
   return <div> 
      <CustomNavbar setToken={(id) => props.setToken(id)} viewer_id={props.viewer_id}/>
      <Container fluid> 
         <Row>
            <Col className="side-col" />
            <Col xs={8} className="pr-0">
               <Row>
                  <Col>
                    <SearchBar/>
                    <ResultsTable />
                  </Col>
                  <Col md={3}>
                     <FriendBar _id="603c339a5ef99cf0de73b4b8" />
                  </Col>
               </Row>
            </Col>
            <Col className="side-col" />
         </Row>
      </Container>
   </div>;

   function SearchBar(props){
      const [searchTerm, setSearchTerm] = React.useState("");

      return <Form>
      <Form.Group controlId="searchForm">
         <Form.Label>Search term</Form.Label>
         <Form.Control type="username" placeholder="Enter username"
         value={searchTerm} 
         onChange={e => setSearchTerm(e.target.value)} />
      </Form.Group>
      <Button variant="primary" type="button" onClick ={submitSearch}>
         {/* TODO: change to Submit type button*/}
         Submit
      </Button>
      </Form>

      function submitSearch(){
         console.log("logged:")
         console.log(searchTerm)
         makeGetByNameCall(searchTerm).then( result => {
            if (result.status === 200) {
               console.log(result.data["users_list"])
               setSearchResults(result.data["users_list"])
            }
            else{
               console.log('failed to find users')
               console.log(result)
            }
         });
      }

      async function makeGetByNameCall(name){
         try{
            const response= await axios.get(
               'http://localhost:5000/users?name='+name)
            return response;
         }
         catch(error){
            console.log(error)
            return false
         }
      }
   }


   function ResultsTable(props){
      {/*depends on searchResults state 
      

      useEffect(() => {
         document.title = `You clicked ${count} times`;
       }); */}
      
      
      {/* function TableBody (props) {
         const rows = props.searchResults.map((row, index) => {
          return (
             <tr key={index}>
               <td>{row.name}</td>
             </tr>
           );
         });
         return (
             <tbody>
                {rows}
             </tbody>
         );
         
      }
      return <table>
         <TableBody searchResults={searchResults}/>
      </table>
   */}
   return <h2> test </h2>
   }  
}
export default SearchPage;