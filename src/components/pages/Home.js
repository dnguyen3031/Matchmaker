import React, {useState} from 'react';
import CustomNavbar from '../CustomNavbar';
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import axios from 'axios';

function Home(props) {
   const[ELO, setELO] = useState({input:''});
   const[name, setName] = useState({input:'Krunker'});
   const[win, setWin] = useState({input:.5});
   const id = props.viewer_id
   return <div> 
      <CustomNavbar setToken={(id) => props.setToken(id)} viewer_id={props.viewer_id}/>
      <h2 style={{color: 'black'}}>Last Game results</h2>
      <Form>

      <fieldset>
            <Form.Group as={Row}>
               <Form.Label as="score" column sm={2}>
               Previous Result
               </Form.Label>
               <Col sm={10}>
               <Form.Check
                  inline
                  type="radio"
                  label="Win"
                  name="formHorizontalRadios"
                  id="winRadio"
                  onChange={winRadioClicked}
               />
               <Form.Check
                  inline
                  type="radio"
                  label="Loss"
                  name="formHorizontalRadios"
                  id="lossRadio"
                  onChange = {lossRadioClicked}
               />
               </Col>
            </Form.Group>
         </fieldset>

         <Form.Group as={Row} controlId="OpponentELO">
            <Form.Label column sm={2}>
               Opponenent ELO
            </Form.Label>
            <Col sm={10}>
               <Form.Control type="ELO" placeholder="1300"
                  value={ELO.input} onChange={handleELO}/>
            </Col>
         </Form.Group>

         <Form.Group as={Row} controlId="GameName">
            <Form.Label column sm={2}>
               Game Name
            </Form.Label>
            <Col sm={10}>
               <Form.Control type="GameName" placeholder="Krunker"
                  value={name.input} onChange={handleGame}/>
            </Col>
         </Form.Group>
         
         <Form.Group as={Row}>
            <Col sm={{ span: 10, offset: 2 }}>
               <Button onClick={submitChange}
               type="button">Submit</Button>
            </Col>
         </Form.Group>
      </Form>
   </div>;

   function winRadioClicked(){
      setWin({input:1})
   }
   function lossRadioClicked(){
      setWin({input:0})
   }

   function handleELO(event) {
      const { value } = event.target;
      setELO({input: value});
   }  
   function handleGame(event) {
      const { value } = event.target;
      setName({input: value});
   }  

   function submitChange() {
      const packet = createJSON()
      console.log(packet)
      updateELO(packet);
   }
   function createJSON(){
      return {'user_id':id, 'win':win.input, 'opp_elo':ELO.input, 'game_name':name.input}
   }

   function updateELO(packet) { 
      makePatchCall(packet).then( result => {
         if (result.status === 201) {
            console.log('Elo updated')
         }
         else{
            console.log('failed to update elo')
         }
      });
   }

   async function makePatchCall(packet){
      try{
         const response= await axios.patch('http://localhost:5000/users/submit-results', packet)
         return response;
      }
      catch(error){
         console.log(error)
         return false
      }
   }

   
}

export default Home;