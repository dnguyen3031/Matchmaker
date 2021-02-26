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
         // console.log("got user")
         return response.data;
      }
      catch (error) {
         console.log(error);
         return false;
      }
   }

   if (viewer_id === id && user._id) {
      // console.log("called editable")
      // console.log(user)
      return <EditableProfile user={user}/>;
   }
   return <ViewableProfile user={user}/>;
}

function EditableProfile(props) {
   // console.log("EditableProfile")
   const [modalShow, setModalShow] = React.useState(false);
   const [modalReset, setModalReset] = useState(["false"]);
   const [modalField, setModalField] = useState({fName:"",dName:""});
   
   if (modalReset === "true") {
      setModalReset(["false"])
   }

   function ActivateModal(fields) {
      // console.log(fields)
      setModalShow(true)
      setModalField({fName: fields[1], dName: fields[0]})
      setModalReset(["true"])
   }
   
   console.log("editable returning")
   console.log(modalReset)
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
            <FieldModal
               show={modalShow}
               field={modalField}
               user={props.user}
               // reset={modalReset}
               onHide={() => setModalShow(false)}
            />
         </div>
      </div>;
}

function FieldModal(props) {
   // console.log("user in Modal")
   // console.log(props.user)
   // console.log("field.fName in editable")
   // console.log(props.field.fName)
   // console.log(props.user[props.field.fName])
   const [field, setField] = useState({input: props.user[props.field.fName]});

   // if (props.reset === ["true"]) {
   //    setField(props.user[props.field.fName])
   // }

   function handleChange(event) {
      const { value } = event.target;
      setField({input: value});
   }  
   console.log(field.input)
   return (
      <Modal
         {...props}
         size="lg"
         aria-labelledby="contained-modal-title-vcenter"
         centered
      >
         <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
               {props.field.dName}
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
         <Button onClick={props.onHide}>Cancel</Button>
         </Modal.Footer>
      </Modal>
   );
}

function ViewableProfile(props) {
   console.log("ViewableProfile")
    return <div> 
      <CustomNavbar />
      <h2>ViewableProfile</h2>
   </div>;
}

export default ProfilePage;