import React, {useState} from 'react';
import CustomNavbar from '../CustomNavbar';
import { Col, Row, Button, Container, Form } from 'react-bootstrap';
import axios from 'axios';
import './PageTemplate.css';
import FriendBar from "../FriendBar";

function Home(props) {
   const[ELO, setELO] = useState({input:''});
   const[name, setName] = useState({input:'Krunker'});
   const[win, setWin] = useState({input:.5});
   const id = props.viewer_id
   return <div> 
      <CustomNavbar setToken={(id) => props.setToken(id)} viewer_id={props.viewer_id}/>
      <Container fluid> 
         <Row>
            <Col className="side-col" />
            <Col xs={8} className="pr-0 main-col">
               <Row>
                  <Col>
                  <h2 style={{color: 'white'}}> Last Game Results</h2>
                  <Form className="text-white">
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
                  </Col>

                  <Col md={3}>
                     <FriendBar _id={props.viewer_id}/>
                  </Col>
               </Row>
            </Col>
            <Col className="side-col" />
         </Row>
      </Container>
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
         const response= await axios.patch('https://matchmaker-backend01.herokuapp.com/users/submit-results', packet)
         return response;
      }
      catch(error){
         console.log(error)
         return false
      }
   }

   
}

export default Home;