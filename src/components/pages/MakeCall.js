import axios from 'axios'
import React, {useState, useEffect} from 'react';
import Table from './Table';
import Form from './Form';

   async function makeDeleteCall(person){
      try {
         // get character at index 's id number
         const response = await axios.delete('http://localhost:5000/users/'+person.id);
         return response;
      }
      catch (error) {
         console.log(error);
         return false;
      }
   }

   async function makePostCall(person){
      try {
         const response = await axios.post('http://localhost:5000/users', person);
         return response;
      }
      catch (error) {
         console.log(error);
         return false;
      }
   }



export default MakeCall;
