import {
  Row,
  Col,
  Container,
  Image,
  Table,
  Button,
  Modal
} from 'react-bootstrap'
import CustomNavbar from '../CustomNavbar'
import React, { useState } from 'react'
import './ProfilePage.css'
import FriendBar from '../FriendBar'
import { BsPencil } from 'react-icons/bs'

function EditableProfile (props) {
  const [modalShow, setModalShow] = React.useState(false)
  const [modalField, setModalField] = useState({ dName: '', fName: '' })
  const [data, setData] = useState({ input: this.props.user[modalField.fName] })

  function ActivateModal (fields) {
    setModalShow(true)
    setModalField({ dName: fields[0], fName: fields[1] })
    switch (fields.length) {
      case 2:
        setData({ input: this.props.user[fields[1]] })
        break
      case 3:
        setData({ input: this.props.user[fields[2]][fields[1]] })
        break
      case 4:
        setData({ input: this.props.user[fields[3]][fields[2]][fields[1]] })
        break
    }
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

  function handleChange (event) {
    const { value } = event.target
    setData({ input: value })
  }

  function switchCases (fName) {
    switch (fName) {
      case 'name':
        return { name: data.input }
      case 'bio':
        return { profile_info: { bio: data.input } }
      case 'discord':
        return { profile_info: { discord: data.input } }
      case 'email':
        return { email: data.input }
      case 'steam_name':
        return { profile_info: { steam_name: data.input } }
    }
  }

  const handleClose = () => setModalShow(false)

  function submitChange () {
    const change = switchCases(modalField.fName)
    this.props.handleSubmit(change)
    handleClose()
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
                  <Col>
                    <Image src={'DefaultProfilePic.jpg'} rounded fluid />
                  </Col>
                  <Col className="pt-2 text-white">
                    <div className="h3">
                      {this.props.user.name}{' '}
                      <BsPencil
                        className="h6"
                        onClick={() => ActivateModal(['Name', 'name'])}
                      />
                    </div>
                    <div className="h5">Bio: </div>
                    <div>
                      {this.props.user.profile_info.bio}{' '}
                      <BsPencil
                        onClick={() =>
                          ActivateModal(['Bio', 'bio', 'profile_info'])
                        }
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col xs={6}>
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
                  <Col xs={6} className="bg-dark text-white">
                    <div>Contact Info</div>
                    <div className="pt-4">
                      Email: {this.props.user.email}{' '}
                      <BsPencil
                        onClick={() => ActivateModal(['Email', 'email'])}
                      />
                    </div>
                    <div className="pt-4">
                      Discord: {this.props.user.profile_info.discord}{' '}
                      <BsPencil
                        onClick={() =>
                          ActivateModal(['Discord', 'discord', 'profile_info'])
                        }
                      />
                    </div>
                    <div className="pt-4 pb-4">
                      Steam Name: {this.props.user.profile_info.steam_name}
                      <BsPencil
                        onClick={() =>
                          ActivateModal([
                            'Steam Name',
                            'steam_name',
                            'profile_info'
                          ])
                        }
                      />
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col md={3}>
                <FriendBar _id={this.props.user._id} />
                {/* _id="603c339a5ef99cf0de73b4b8" */}
              </Col>
            </Row>
          </Col>
          <Col className="side-col" />
        </Row>
      </Container>
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
          <input type="text" value={data.input} onChange={handleChange} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={submitChange}>Change</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default EditableProfile
