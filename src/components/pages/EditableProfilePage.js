import {Row, Col, Container, Table, Card, Button, Modal} from 'react-bootstrap';
import CustomNavbar from '../CustomNavbar';
import React, {useState, useEffect} from 'react';
import './ProfilePage.css';

function EditableProfile(props) {
    // console.log("EditableProfile")
    const [modalShow, setModalShow] = React.useState(false);
    const [modalField, setModalField] = useState({dName:"",fName:""});
    const [data, setData] = useState({input: props.user[modalField.fName]});
 
    const handleClose = () => setModalShow(false);
 
    return <div>
        <div>
            <title>Profile Page</title>
        </div>
        <div class="background">
            <div class="page-wrapper">
                <CustomNavbar />
                <div class="page">
                    <div class="top-card">
                        <img class="profile-picture" src={props.user.profile_info.profile_pic}/>
                        <div>
                            <h2 onClick={() => ActivateModal(["Name", "name"])}>{props.user.name}</h2>
                            <h4>Bio:</h4>
                            <p onClick={() => ActivateModal(["Bio", "bio", "profile_info"])}>{props.user.profile_info.bio}</p>
                        </div>
                    </div>
                    <div class="section-wrapper">
                        <div class="contact-section">
                            <h4>Contact info:</h4>
                            <div class="contact-section-content">
                                <h6>Email:</h6>
                                <p onClick={() => ActivateModal(["Email", "email"])}>{props.user.email}</p>
                                <h6>Discord:</h6>
                                <p onClick={() => ActivateModal(["Discord", "discord", "profile_info"])}>{props.user.profile_info.discord}</p>
                                <h6>Steam Name:</h6>
                                <p onClick={() => ActivateModal(["Steam Name", "steam_name", "profile_info"])}>{props.user.profile_info.steam_name}</p>
                            </div>
                        </div>
                    </div>
                    <div class="games-table">
                        <div class="game-box">
                            <h4>Games:</h4>
                        </div>
                        <GameTable />
                    </div>
                    <div class="section-wrapper">
                        <div class="friends-list"/> 
                    </div>
                </div>
            </div>
            <Modal 
                show={modalShow}
                onHide={() => setModalShow(false)}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                    {modalField.dName}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input
                    type="text"
                    value={data.input}
                    onChange={handleChange} />
                </Modal.Body>
                <Modal.Footer>
                <Button onClick={submitChange}>Change</Button> 
                <Button onClick={handleClose}>Cancel</Button>
                </Modal.Footer>
            </Modal>
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
          case "steam_name":
             return {"profile_info": {"steam_name": data.input}}
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

 export default EditableProfile;