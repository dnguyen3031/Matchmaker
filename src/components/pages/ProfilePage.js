import React, {useState, useEffect} from 'react';
import {Row, Col, Container, Table, Card, Button, Modal} from 'react-bootstrap';
import CustomNavbar from '../../CustomNavbar';
import axios from 'axios';

function ProfilePage(props) {
   const viewer_id = props.viewer_id;
   const id = props.id;
   const [user, setUser] = useState({email: "", 
                                 profile_info: {discord: "", profile_pic: "", bio: ""},
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

   // set_game_ranks()

   // console.log(user)

   if (viewer_id === id && user._id) {
      return <EditableProfile user={user} handleSubmit={updateUser}/>;
   }
   return <ViewableProfile user={user}/>;

   async function fetchUser(id){
      try {
         // get character at index 's id number
         const response = await axios.get('http://127.0.0.1:5000/users/' + id);
         const updated_response = await set_game_ranks(response.data)
         return updated_response;
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
      try {
         const response = await axios.patch('http://localhost:5000/users/' + user._id, change);
         return response;
      }
      catch (error) {
         console.log(error);
         return false;
      }
   }

   async function set_game_ranks(props) {
      if (props === null) {
         return null
      }
      const updated_user = props
      for (const key of Object.keys(updated_user.games_table)) {
         let games = await get_game(key)
         let game = games.games_list[0]
         updated_user.games_table[key]["_id"] = game._id
         if(updated_user.games_table[key].time_played < game.time_to_learn) {
            updated_user.games_table[key]["Rank"] = "Noob"
         } else if (updated_user.games_table[key].game_score < game.ranking_levels[0]) {
            updated_user.games_table[key]["Rank"] = "Iron"
         } else if (updated_user.games_table[key].game_score < game.ranking_levels[1]) {
            updated_user.games_table[key]["Rank"] = "Bronze"
         } else if (updated_user.games_table[key].game_score < game.ranking_levels[2]) {
            updated_user.games_table[key]["Rank"] = "Silver"
         } else if (updated_user.games_table[key].game_score < game.ranking_levels[3]) {
            updated_user.games_table[key]["Rank"] = "Gold"
         } else if (updated_user.games_table[key].game_score < game.ranking_levels[4]) {
            updated_user.games_table[key]["Rank"] = "Diamond"
         } else if (updated_user.games_table[key].game_score < game.ranking_levels[5]) {
            updated_user.games_table[key]["Rank"] = "Platinum"
         } else if (updated_user.games_table[key].game_score < game.ranking_levels[6]) {
            updated_user.games_table[key]["Rank"] = "Pro"
         } else {
            updated_user.games_table[key]["Rank"] = "Undefined"
         }
      }
      return updated_user
   }

   async function get_game(game_name){
      try {
         // get character at index 's id number
         const response = await axios.get('http://127.0.0.1:5000/games?game_name=' + game_name);
         return response.data;
      }
      catch (error) {
         console.log(error);
         return false;
      }
   }
}



function EditableProfile(props) {
   const [modalShow, setModalShow] = React.useState(false);
   const [modalField, setModalField] = useState({dName:"",fName:""});
   const [data, setData] = useState({input: props.user[modalField.fName]});

   const handleClose = () => setModalShow(false);

   console.log(props.user)

   return <div>
      <div>
         <title>Profile Page</title>
      </div>
      <div>
         <CustomNavbar />
         <h2>EditableProfile</h2>
         <img src={props.user.profile_info.profile_pic}/>
         <h3 onClick={() => ActivateModal(["Name", "name"])}>{props.user.name}</h3>
         <h4>Bio</h4>
         <p onClick={() => ActivateModal(["Bio", "bio", "profile_info"])}>{props.user.profile_info.bio}</p>
         <h4>Contact info:</h4>
         <h5>Email:</h5>
         <p onClick={() => ActivateModal(["Email", "email"])}>{props.user.email}</p>
         <h5>Discord:</h5>
         <p onClick={() => ActivateModal(["Discord", "discord", "profile_info"])}>{props.user.profile_info.discord}</p>
         <h5>Steam Name:</h5>
         <p onClick={() => ActivateModal(["Steam Name", "steam_name", "profile_info"])}>{props.user.profile_info.steam_name}</p>
         <h5>Steam Friend Code:</h5>
         <p onClick={() => ActivateModal(["Steam Friend Code", "steam_friend_code", "profile_info"])}>{props.user.profile_info.steam_friend_code}</p>
         <h4>Password:</h4>
         <p onClick={() => ActivateModal(["Password", "password"])}>{props.user.password}</p>
         <h4>Games:</h4>
         <GameTable />
         

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
                  <h5>{game}</h5>
                  <p>{props.user.games_table[game].Rank}</p>
               </td>
            </tr>
         );
      })
      console.log(rows)
      return (
         <tbody>
            {rows}
         </tbody>
      );
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