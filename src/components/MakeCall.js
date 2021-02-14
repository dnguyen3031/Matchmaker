import axios from 'axios'
import React, {useState, useEffect} from 'react';

export async function MakeGetCall(person){
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

export async function MakeDeleteCall(person){
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

export async function MakePostCall(person){
   try {
      const response = await axios.post('http://localhost:5000/users', person);
      return response;
   }
   catch (error) {
      console.log(error);
      return false;
   }
}


export default MakeGetCall;
