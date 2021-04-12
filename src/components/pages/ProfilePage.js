import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './ProfilePage.css';
import EditableProfile from './EditableProfilePage'
import ViewableProfile from './ViewableProfilePage'
import {
   useParams
 } from "react-router-dom";

function ProfilePage(props) {
   const viewer_id = props.viewer_id;
   const id = useParams().id;

   const [user, setUser] = useState({email: "", 
                                 profile_info: {discord: "", profile_pic: "", bio: ""},
                                 games_table: {},
                                 friends: {},
                                 name: "",
                                 password: "",
                                 _id: ""});

   const [viewUser, setViewUser] = useState({email: "", 
                              profile_info: {discord: "", profile_pic: "", bio: ""},
                              games_table: {},
                              friends: {},
                              name: "",
                              password: "",
                              _id: ""});
   
   useEffect(() => {
      fetchUser(id).then( result => {
         if (result) {
            setUser(result);
            console.log("got user");
         } else {
            console.log("failed to get user")
         }
      });
      fetchUser(viewer_id).then( result => {
         if (result) {
            setViewUser(result);
            console.log("got viewer");
         } else {
            console.log("failed to get user")
         }
      });
   }, []);


   if (viewer_id === id && user._id) {
      return <EditableProfile user={user} handleSubmit={updateUser} setToken={(id) => props.setToken(id)} viewer_id={props.viewer_id}/>;
   } else if (user._id) {
      return <ViewableProfile user={user} friendsList={viewUser.friends} handleSubmit={updateFriends} setToken={(id) => props.setToken(id)} viewer_id={props.viewer_id}/>;
   }
   return <h1>404: Failed to load user</h1>

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
            fetchUser(id).then( result => {
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

   function updateFriends(change) { 
      makePatchCallFriends(change).then( result => {
         if (result.status === 201) {
            fetchUser(viewer_id).then( result => {
               if (result) {
                  setUser(result);
                  console.log("updated user's friends");
               } else {
                  console.log("failed to update user");
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

   async function makePatchCallFriends(change){
      try {
         const response = await axios.patch('http://localhost:5000/users/' + viewer_id, change);
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
         // if(updated_user.games_table[key].time_played < game.time_to_learn && updated_user.games_table[key].game_score < game.ranking_levels[0]) {
         //    updated_user.games_table[key]["Rank"] = "Noob"
         // } else 
         if (updated_user.games_table[key].game_score < game.ranking_levels[0]) {
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
            updated_user.games_table[key]["Rank"] = "God"
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

export default ProfilePage;
