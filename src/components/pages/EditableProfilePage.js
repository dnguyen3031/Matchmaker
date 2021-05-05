import { Row, Col, Container, Image, Table, Card, Button, Modal} from 'react-bootstrap';
import CustomNavbar from '../CustomNavbar';
import React, {useState, useEffect} from 'react';
import './ProfilePage.css';
import FriendBar from "../FriendBar";
import { BsPencil } from "react-icons/bs";
// import img from "./../../../public/"

function EditableProfile(props) {
    // console.log("EditableProfile")
    const [modalShow, setModalShow] = React.useState(false);
    const [modalField, setModalField] = useState({dName:"",fName:""});
    const [data, setData] = useState({input: props.user[modalField.fName]});
 
    const handleClose = () => setModalShow(false);
 
    return <div>
         <CustomNavbar setToken={(id) => props.setToken(id)} viewer_id={props.viewer_id}/>
         <Container fluid> 
            <Row>
               <Col className="side-col" />
               <Col xs={8} className="main-col pr-0">
                  <Row>
                     <Col>
                        <Row className="pt-3 pb-3">
                           {/* TODO: Fix pictures */}
                           {/* <Col>
                              <Image src="../DefaultProfilePic.jpg" rounded/>
                           </Col> */}
                           <Col>
                              <Card bg='dark' text='white'>
                                 <Card.Body>
                                    <Card.Title>{props.user.name} <BsPencil className="h6" onClick={() => ActivateModal(["Name", "name"])}/></Card.Title>
                                    <Card.Text class="text-white">
                                       {props.user.profile_info.bio} <BsPencil onClick={() => ActivateModal(["Bio", "bio", "profile_info"])}/>
                                    </Card.Text>
                                 </Card.Body>
                              </Card>
                           </Col>
                           <Col></Col>
                        </Row>
                        <Row className="justify-content-md-center pb-3">
                           {/* OLD Contact info box */}
                           {/* <Col xs={6} className="bg-dark text-white">
                              <div className="h4">Contact Info</div>
                              <div className="pt-">Email: {props.user.email} <BsPencil onClick={() => ActivateModal(["Email", "email"])} /></div>
                              <div className="pt-4">Discord: {props.user.profile_info.discord} <BsPencil onClick={() => ActivateModal(["Discord", "discord", "profile_info"])} /></div>
                              <div className="pt-4 pb-4">Steam Name: {props.user.profile_info.steam_name} 
                                 <BsPencil onClick={() => ActivateModal(["Steam Name", "steam_name", "profile_info"])} /></div>
                           </Col> */}
                           <Card bg='dark' text='white'>
                                 <Card.Body>
                                    <Card.Title>Contact Information</Card.Title>
                                    <Card.Text class="text-white">
                                       Email: {props.user.email} <BsPencil onClick={() => ActivateModal(["Email", "email"])} />
                                    </Card.Text>
                                    <Card.Text class="text-white" >
                                       Discord: {props.user.profile_info.discord} <BsPencil onClick={() => ActivateModal(["Discord", "discord", "profile_info"])} />
                                    </Card.Text>
                                    <Card.Text class="text-white">
                                       Steam Name: {props.user.profile_info.steam_name} 
                                       <BsPencil onClick={() => ActivateModal(["Steam Name", "steam_name", "profile_info"])} />
                                    </Card.Text>
                                 </Card.Body>
                              </Card>
                        </Row>
                        <Row className="justify-content-md-center">
                           <Col xs={6}>
                              <Table variant="dark">
                                 <thead>
                                    <tr>
                                       <th>Game</th>
                                       <th>Rank</th>
                                    </tr>
                                 </thead>
                                <GameTable />
                              </Table>
                           </Col>
                        </Row>
                     </Col>
                     <Col md={3}>
                        <FriendBar _id={props.user._id} /> 
                        {/* _id="603c339a5ef99cf0de73b4b8" */}
                     </Col>
                  </Row>
               </Col>
               <Col className="side-col" />
            </Row>
         </Container>
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
                <td>{game}</td>
                <td>{props.user.games_table[game].Rank}</td>
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