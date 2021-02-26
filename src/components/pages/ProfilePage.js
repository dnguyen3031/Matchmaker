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

   if (viewer_id === id && user._id) {
      return <EditableProfile user={user} handleSubmit={updateUser}/>;
   }
   return <ViewableProfile user={user}/>;


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

   function updateUser(change) { 
      makePatchCall(change).then( result => {
         if (result.status === 201) {
            fetchUser(props.id).then( result => {
               if (result) {
                  setUser(result);
                  console.log("updated user")
               } else {
                  console.log("failed to update user")
               }
            });
         }
      });
   }

   async function makePatchCall(change){
      console.log(user._id)
      console.log(change)
      try {
         const response = await axios.patch('http://localhost:5000/users/' + user._id, change);
         return response;
      }
      catch (error) {
         console.log(error);
         return false;
      }
   }
}



function EditableProfile(props) {
   const [modalShow, setModalShow] = React.useState(false);
   const [modalField, setModalField] = useState({dName:"",fName:"",fPath:"",endBraces:""});
   const [data, setData] = useState({input: props.user[modalField.fName]});

   const handleClose = () => setModalShow(false);

   return <div>
      <div>
         <title>Profile Page</title>
      </div>
      <div>
         <CustomNavbar />
         <h2>EditableProfile</h2>
         <img src={props.user.profile_pic}/>
         <p onClick={() => ActivateModal(["Name", "name", "name:", ""])}>{props.user.name}</p>
         <p onClick={() => ActivateModal(["Bio", "bio", "bio:", ""])}>{props.user.bio}</p>
         
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
      setModalField({dName: fields[0], fName: fields[1], fPath: fields[2], endBraces: fields[3]})
      setData({input: props.user[fields[1]]});
   }

   function handleChange(event) {
      const { value } = event.target;
      setData({input: value});
   }  

   function submitChange() {
      const change = "{" + modalField.fPath + data.input + modalField.endBraces + "}"
      props.handleSubmit(change);
      handleClose()
   }
}



function ViewableProfile(props) {
   console.log("ViewableProfile")
    return <div> 
      <CustomNavbar />
      <h2>ViewableProfile</h2>
   </div>;
}

export default ProfilePage;