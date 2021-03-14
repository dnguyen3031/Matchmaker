import CustomNavbar from '../CustomNavbar';
import React, {useState, useEffect} from 'react';
import './ProfilePage.css';

function ViewableProfile(props) {
    // console.log("ViewableProfile")
    const [modalShow, setModalShow] = React.useState(false);
    const [modalField, setModalField] = useState({dName:"",fName:""});
    const [data, setData] = useState({input: props.user[modalField.fName]});
 
    const handleClose = () => setModalShow(false);
 
    return <div>
       <div>
          <title>Profile Page</title>
       </div>
       <div>
          <div class="page-wrapper">
             <CustomNavbar setToken={(id) => props.setToken(id)} viewer_id={props.viewer_id}/>
             <div class="page">
                <div class="body">
                   <div class="Top_Card">
                      <img class="profile-picture" src={props.user.profile_info.profile_pic}/>
                      <div>
                         <h2>{props.user.name}</h2>
                         <h4>Bio:</h4>
                         <p>{props.user.profile_info.bio}</p>
                      </div>
                   </div>
                   <div class="section-container">
                      <div class="section">
                         <h4>Contact info:</h4>
                         <div class="section-content">
                            <h6>Email:</h6>
                            <p>{props.user.email}</p>
                            <h6>Discord:</h6>
                            <p>{props.user.profile_info.discord}</p>
                            <h6>Steam Name:</h6>
                            <p>{props.user.profile_info.steam_name}</p>
                         </div>
                      </div>
                   </div>
                   <h4>Games:</h4>
                   <GameTable />
                </div>
             </div>
          </div>
       </div>
    </div>;
 
 
    function ActivateModal(fields) {
       setModalShow(true)
       setModalField({dName: fields[0], fName: fields[1]})
       switch(fields.length) {
          case 2:{
             setData({input: props.user[fields[1]]});
             break
          }
          case 3:{
             setData({input: props.user[fields[2]][fields[1]]});
             break
          }
          case 4:{
             setData({input: props.user[fields[3]][fields[2]][fields[1]]});
             break
          }
       }
    }
 
    function handleChange(event) {
       const { value } = event.target;
       setData({input: value});
    }  
 
    function submitChange() {
       const change = switchCases(modalField.fName)
       props.handleSubmit(change);
       handleClose()
    }
 
    function switchCases(fName) {
       switch(fName) {
          case "name":
             return {"name": data.input}
          case "bio":
             return {"profile_info": {"bio": data.input}}
          case "discord":
             return {"profile_info": {"discord": data.input}}
          case "email":
             return {"email": data.input}
          case "password":
             return {"password": data.input}
       }
    }
 
    function GameTable()
    {
       const rows = Object.keys(props.user.games_table).map((game, index) => {
          return (
             <tr key={index}>
                <td>
                   <div class="game-section">
                      <h4>{game}</h4>
                      <p>{props.user.games_table[game].Rank}</p>
                   </div>
                </td>
             </tr>
          );
       })
       return (
          <tbody>
             {rows}
          </tbody>
       );
    }
 }

 export default ViewableProfile;