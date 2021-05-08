import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Dropdown, DropdownButton, Nav, Navbar } from 'react-bootstrap'

function LoggedInNavbar (props) {
  const [user, setUser] = useState({
    email: '',
    profile_info: { discord: '', profile_pic: '', bio: '' },
    games_table: {},
    name: '',
    password: '',
    _id: ''
  })

  async function fetchUser (id) {
    try {
      return await axios.get(`http://127.0.0.1:5000/users/${id}`)
    } catch (error) {
      console.log(error)
      return false
    }
  }

  useEffect(() => {
    fetchUser(this.props.viewer_id).then((result) => {
      if (result) {
        setUser(result.data)
        console.log('got user')
      } else {
        console.log('failed to get user')
      }
    })
  }, [this.props.viewer_id])

  const profileUrl = '/profile/' + this.props.viewer_id

  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand href="/">Matchmaker</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/matchmaking" style={{ color: 'white' }}>
              Find Match
            </Nav.Link>
            <Nav.Link href={profileUrl} style={{ color: 'white' }}>
              Profile
            </Nav.Link>
            <Nav.Link href="/groups" style={{ color: 'white' }}>
              Groups
            </Nav.Link>
            <Nav.Link href="/searchpage" style={{ color: 'white' }}>
              Search
            </Nav.Link>
          </Nav>
          <DropdownButton
            variant="secondary"
            menuAlign="right"
            title={user.name}
            id="dropdown-menu-align-right"
          >
            <Dropdown.Item eventKey="3" onClick={() => this.props.setToken(null)}>
              Logout
            </Dropdown.Item>
          </DropdownButton>
        </Navbar.Collapse>
      </Navbar>
    </div>
  )
}

function DefaultNavbar () {
  return (
    <div>
      <Navbar className="color-nav" expand="lg" bg="dark" variant="dark">
        <Navbar.Brand href="/">Matchmaker</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/login" style={{ color: 'white' }}>
              Login
            </Nav.Link>
            <Nav.Link href="/searchpage" style={{ color: 'white' }}>
              Search
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  )
}

function CustomNavbar (props) {
  if (props.viewer_id) {
    return LoggedInNavbar(props)
  }

  return DefaultNavbar()
}

export default CustomNavbar
