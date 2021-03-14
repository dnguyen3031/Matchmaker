import React from 'react';
import CustomNavbar from '../CustomNavbar';

function Matchmaking(props) {
   return <div> 
      <CustomNavbar setToken={(id) => props.setToken(id)}/>
      <h2>matchmaking</h2>
   </div>;
 }
 
export default Matchmaking;