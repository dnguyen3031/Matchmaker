import { Row, Col, Container, Image, Table, Button } from 'react-bootstrap'
import CustomNavbar from '../CustomNavbar'
import React from 'react'
import './ProfilePage.css'
import FriendBar from '../FriendBar'
import { useParams } from 'react-router-dom'

function ViewableProfile (props) {
  const [profileID] = React.useState(useParams().id)
  const [areFriends, setAreFriends] = React.useState(false)

  React.useEffect(() => {
    function confirmFriends () {
      for (const key in this.props.friendsList) {
        if (key === profileID && this.props.friendsList[key] !== 'Deleted') {
          console.log(this.props.viewer_id + ' has already added ' + key)
          setAreFriends(true)
        }
      }
    }

    confirmFriends()
  }, [profileID, this.props.friendsList, this.props.viewer_id])

  function addFriendAction () {
    this.props.handleSubmit({
      friends: {
        [profileID]: 'Standard'
      }
    })
    console.log('Adding this id :' + profileID)
  }

  function removeFriendAction () {
    this.props.handleSubmit({
      friends: {
        [profileID]: 'Deleted'
      }
    })
    console.log('Removing!')
  }

  function GameTable () {
    const rows = Object.keys(this.props.user.games_table).map((game, index) => {
      return (
        <tr key={index}>
          <td>{game}</td>
          <td>{this.props.user.games_table[game].Rank}</td>
        </tr>
      )
    })
    return <tbody>{rows}</tbody>
  }

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
              <Col>
                <Row className="pt-3 pb-3">
                  <Col xs={3}>
                    <Image src="test_profile_pic.jpg" rounded fluid />
                  </Col>
                  <Col xs={4} className="pt-2 text-white">
                    <div className="h3">{this.props.user.name}</div>
                    <div className="h5">Bio: </div>
                    <div>{this.props.user.profile_info.bio}</div>
                    {/* <div>Viewer's id: {this.props.viewer_id}</div>
                              <div>Token (This profile id): {profileID}</div> */}
                    <div>
                      {!areFriends && (
                        <Button variant="info" onClick={addFriendAction}>
                          Add Friend
                        </Button>
                      )}
                    </div>{' '}
                    <Button variant="info" onClick={removeFriendAction}>
                      Remove Friend
                    </Button>
                  </Col>
                  <Col xs={4} className="pt-2 bg-dark text-white">
                    <div className="text-center">Contact Info</div>
                    <div className="pt-4">Email: {this.props.user.email} </div>
                    <div className="pt-4">
                      Discord: {this.props.user.profile_info.discord}
                    </div>
                    <div className="pt-4 pb-4">
                      Steam Name: {this.props.user.profile_info.steam_name}{' '}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col xs={8}>
                    <Table variant="dark">
                      <thead>
                        <tr>
                          <th>Game</th>
                          <th>Rank</th>
                        </tr>
                      </thead>
                      <GameTable />
                    </Table>
                  </Col>
                  <Col />
                </Row>
              </Col>
              <Col md={3}>
                <FriendBar _id={this.props.viewer_id} />
                {/* changed from user_id to viewer_id because we want to keep freinds bar of the person that is logged in */}
              </Col>
            </Row>
          </Col>
          <Col className="side-col" />
        </Row>
      </Container>
    </div>
  )
}

export default ViewableProfile
