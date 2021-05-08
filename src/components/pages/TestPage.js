import React from 'react'
import CustomNavbar from '../CustomNavbar'
import { Row, Col, Container, Form, Button } from 'react-bootstrap'
import './PageTemplate.css'

function TestPage (props) {
  return (
    <div>
      <CustomNavbar
        setToken={(id) => this.props.setToken(id)}
        viewer_id={this.props.viewer_id}
      />
      <Container fluid>
        <Row>
          <Col className="side-col" />
          <Col xs={8} className="pr-0">
            <Row>
              <Col>
                <Form>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" />
                    <Form.Text className="text-muted">
                      We&apos;ll always share your email with everyone else.
                    </Form.Text>
                  </Form.Group>

                  <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" />
                  </Form.Group>
                  <Form.Group controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Check me out" />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                </Form>
              </Col>
              <Col md={3}></Col>
            </Row>
          </Col>
          <Col className="side-col" />
        </Row>
      </Container>
    </div>
  )
}

export default TestPage
