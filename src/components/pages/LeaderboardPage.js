import React from 'react';
import CustomNavbar from '../CustomNavbar';

function LeaderboardPage(props) {
   return <div> 
      <CustomNavbar setToken={(id) => props.setToken(id)} viewer_id={props.viewer_id}/>
      <h2>leaderboardpage</h2>
   </div>;
 }
 
export default LeaderboardPage;