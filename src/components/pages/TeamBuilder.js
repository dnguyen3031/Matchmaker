import React, {useState, useEffect} from 'react';
import CustomNavbar from '../CustomNavbar';
import { Col, Row, Button, Container, Form } from 'react-bootstrap';
import axios from 'axios';
import './PageTemplate.css';

function TeamBuilder(props) {
    const id = props.viewer_id
    const [match_id, setMatch_id] = useState(null);
    const [teams, setTeams] = useState(props.teams);


   //  for (let key in teams[0]["players"]) {
   //     console.log(teams[0]["players"][key]);
   //  }

   // const rows = teams.map((team) => {
   //    team.map((dict) => {
   //       console.log("DICT"\)
   //      dict.map((key) => {
   //       console.log(key);
   //       <div>{key}</div>
   //       }
   //    )})
   // })

    console.dir(teams);

    const rows2 = teams.map((team, index) => (
       <div>
          <h2>Team {index}</h2>
          <div>
             {JSON.stringify(team)}
             {/* {team.map((group, i) => (
                  <div> 
                     GRoups : {JSON.stringify(group)}
                     APLyers : {group["players"]}


                     {group["players"].map((player, j) => (
                        <div>{j} {player} </div>
                     ))}
                  </div>
             ))} */}
             
          </div>
       </div>
    ))

    return <div> 
      {rows2}
   </div>;
}

export default TeamBuilder;