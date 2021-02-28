import React from 'react';
import CustomNavbar from '../../CustomNavbar';
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'

function Home() {
   return <div> 
      <CustomNavbar />
      <h2>Last Game results</h2>
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
                  id="formHorizontalRadios1"
               />
               <Form.Check
                  inline
                  type="radio"
                  label="Loss"
                  name="formHorizontalRadios"
                  id="formHorizontalRadios2"
               />
               </Col>
            </Form.Group>
         </fieldset>
         <Form.Group as={Row} controlId="OpponentELO">
            <Form.Label column sm={2}>
               Opponenent ELO
            </Form.Label>
            <Col sm={10}>
               <Form.Control type="ELO" placeholder="1300" />
            </Col>
         </Form.Group>
         

         <Form.Group as={Row}>
            <Col sm={{ span: 10, offset: 2 }}>
               <Button type="submit">Submit</Button>
            </Col>
         </Form.Group>
      </Form>
   </div>;
 }
 
export default Home;