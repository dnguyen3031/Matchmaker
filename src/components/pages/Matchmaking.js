import React from 'react';
import CustomNavbar from '../CustomNavbar';

function Matchmaking(props) {
   return <div> 
      <CustomNavbar setToken={(id) => props.setToken(id)} viewer_id={props.viewer_id}/>
      <h2>matchmaking</h2>
   </div>;
 }
 
export default Matchmaking;