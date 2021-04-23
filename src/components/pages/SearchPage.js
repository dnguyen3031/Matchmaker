import React, {useEffect} from 'react';
import { Link } from "react-router-dom";
import CustomNavbar from '../CustomNavbar';
import FriendBar from "../FriendBar";
import { Row, Col, Container, Form, Button } from "react-bootstrap";
import axios from 'axios';
import "./PageTemplate.css";

function SearchPage(props) {
   const [searchResults, setSearchResults] = React.useState([]);
                                    
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
                     <FriendBar _id={props.viewer_id}/>
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
         if (searchTerm !== ""){
            makeGetByNameCall(searchTerm).then( result => {
               if (result.status === 200) {
                  console.log(result.data["users_list"])
                  console.log('sr detek: '+result.data["users_list"].length)
                  if (result.data["users_list"].length === 0){
                     console.log('setting noResults')
                     setSearchResults(["noResults"])
                  }
                  else{
                     setSearchResults(result.data["users_list"])
                  }
               }
               else{
                  console.log('failed to find users')
                  console.log(result)
               }
            });
         }
      }

      async function makeGetByNameCall(name){
         try{
            const response= await axios.get(
               'http://localhost:5000/users?secureName='+name)
            return response;
         }
         catch(error){
            console.log(error)
            return false
         }
      }
   }


   function ResultsTable(props){
      console.log('sr: '+searchResults)
      if (searchResults.length === 0){
         console.log('empty')
         return null
      }
      if (searchResults == 'noResults'){
         console.log('detected \'noresults\'')
         return (
            <div>
               <table>
               <tbody>
                  <tr>
                     <th style={{color: 'black'}}>No Results</th>
                  </tr>
               </tbody>
             </table>
            </div>
         );
      }
      const rows = searchResults.map((user, index) => {
         return (
            <tr key={index}>
               <td>
               <Link to={'/profile/'+user._id} >
                  {user.name}
               </Link>
               </td>
            </tr>
           );
         });
         return (
            <div>
               <table>
               <tbody>
                  <tr>
                     <th style={{color: 'black'}}>Results</th>
                  </tr>
                  {rows}
               </tbody>
             </table>
            </div>
         );
   }
}

export default SearchPage;