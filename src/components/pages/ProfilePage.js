import React, {useState, useEffect} from 'react';
import {Row, Col, Container, Table, Card, Button, Modal} from 'react-bootstrap';
import CustomNavbar from '../../CustomNavbar';
import axios from 'axios';

function ProfilePage(props) {
   const viewer_id = props.viewer_id;
   const id = props.id;
   const [user, setUser] = useState({bio: "", 
                                 contact_info: {discord: "", email: ""},
                                 games_table: {},
                                 name: "",
                                 password: "",
                                 _id: ""});
   
   useEffect(() => {
      fetchUser(props.id).then( result => {
         if (result) {
            setUser(result);
            console.log("got user")
         } else {
            console.log("failed to get user")
         }
      });
   }, []);

   async function fetchUser(id){
      try {
         // get character at index 's id number
         const response = await axios.get('http://127.0.0.1:5000/users/' + id);
         return response.data;
      }
      catch (error) {
         console.log(error);
         return false;
      }
   }

   if (viewer_id === id && user._id) {
      return <EditableProfile user={user}/>;
   }
   return <ViewableProfile user={user}/>;
}

function EditableProfile(props) {
   const [modalShow, setModalShow] = React.useState(false);
   const [modalField, setModalField] = useState({fName:"",dName:""});
   const [field, setField] = useState({input: props.user[modalField.fName]});

   function ActivateModal(fields) {
      setModalShow(true)
      setModalField({fName: fields[1], dName: fields[0]})
      setField({input: props.user[fields[1]]});
   }

   function handleChange(event) {
      const { value } = event.target;
      setField({input: value});
   }  

   const handleClose = () => setModalShow(false);

   return <div>
      <div>
         <title>Profile Page</title>
      </div>
      <div>
         <CustomNavbar />
         <h2>EditableProfile</h2>
         <img src={props.user.profile_pic}/>
         <p onClick={() => ActivateModal(["Name", "name"])}>{props.user.name}</p>
         <p onClick={() => ActivateModal(["Bio", "bio"])}>{props.user.bio}</p>
         
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
               value={field.input}
               onChange={handleChange} />
            </Modal.Body>
            <Modal.Footer>
            {/* <Button onClick={submitChange}>Change</Button>  */}
            <Button onClick={handleClose}>Cancel</Button>
            </Modal.Footer>
         </Modal>

      </div>
   </div>;
}

function ViewableProfile(props) {
   console.log("ViewableProfile")
    return <div> 
      <CustomNavbar />
      <h2>ViewableProfile</h2>
   </div>;
}

export default ProfilePage;