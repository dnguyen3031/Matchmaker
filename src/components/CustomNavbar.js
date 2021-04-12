import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import { Col, Row, Navbar, Nav, Dropdown, DropdownButton, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';

function CustomNavbar(props) {
   if (props.viewer_id) {
      return LoggedInNavbar(props)
   }
   return DefaultNavbar()
 }

function LoggedInNavbar(props){
   const [user, setUser] = useState({email: "", 
                                 profile_info: {discord: "", profile_pic: "", bio: ""},
                                 games_table: {},
                                 name: "",
                                 password: "",
                                 _id: ""});
   // console.log(user)
   async function fetchUser(id){
      try {
         // get character at index 's id number
         const response = await axios.get('http://127.0.0.1:5000/users/' + id);
         return response;
      }
      catch (error) {
         console.log(error);
         return false;
      }
   }

   useEffect(() => {
      fetchUser(props.viewer_id).then( result => {
         if (result) {
            setUser(result.data);
            console.log("got user")
         } else {
            console.log("failed to get user")
         }
      });
   }, []);

   const profile_url = "/profile/" + props.viewer_id

   return <div>
       <Navbar bg="dark" variant="dark" expand="lg">
         <Navbar.Brand href="/">Matchmaker</Navbar.Brand>
         <Navbar.Toggle aria-controls="basic-navbar-nav" />
         <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
               <Nav.Link href="/matchmaking" style={{color: 'white'}}>Find Match</Nav.Link>
               <Nav.Link href="/leaderboard" style={{color: 'white'}}>Leaderboard</Nav.Link>
               <Nav.Link href={profile_url} style={{color: 'white'}}>Profile</Nav.Link>
               <Nav.Link href="/groups" style={{color: 'white'}}>Groups</Nav.Link>
            </Nav>
   
            <DropdownButton variant="secondary" menuAlign="right" title={user.name} id="dropdown-menu-align-right"> 
            {/* className="pt-2" */}
               <Dropdown.Item eventKey="1">Account Settings</Dropdown.Item>
               {/* <Dropdown.Item eventKey="2"><Link style={{ color: 'black', textDecoration: 'none' }} to="/testpage">Test Page for FriendBar</Link></Dropdown.Item> */}
               <Dropdown.Divider />
               <Dropdown.Item eventKey="3" onClick={() => props.setToken("")}>Logout</Dropdown.Item>
            </DropdownButton>

         </Navbar.Collapse>
      </Navbar>
   </div>;
}

function DefaultNavbar() {
   return <div>
       <Navbar className="color-nav" expand="lg" bg="dark" variant="dark">
         <Navbar.Brand href="/">Matchmaker</Navbar.Brand>
         <Navbar.Toggle aria-controls="basic-navbar-nav" />
         <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
               {/* <Nav.Link href="/matchmaking">Find Match</Nav.Link> */}
               <Nav.Link href="/leaderboard" style={{color: 'white'}}>Leaderboard</Nav.Link>
               <Nav.Link href="/searchpage" style={{color: 'white'}}>Search</Nav.Link>
               <Nav.Link href="/login" style={{color: 'white'}}>Login</Nav.Link>
            </Nav>
         </Navbar.Collapse>
      </Navbar>
   </div>;
}
 
export default CustomNavbar;