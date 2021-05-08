import React from 'react'
import CustomNavbar from '../CustomNavbar'
import { Row, Col, Container } from 'react-bootstrap'
import FriendBar from '../FriendBar'

function LeaderboardPage (props) {
  return (
    <div>
      <CustomNavbar
        setToken={(id) => this.props.setToken(id)}
        viewer_id={this.props.viewer_id}
      />
      <Container fluid>
        <Row>
          <Col className="side-col" />
          <Col xs={8} className="main-col pr-0">
            <Row>
              <Col>Leaderboard</Col>
              <Col md={3}>
                <FriendBar _id={this.props.viewer_id} />
              </Col>
            </Row>
          </Col>
          <Col className="side-col" />
        </Row>
      </Container>
    </div>
  )
}

export default LeaderboardPage
