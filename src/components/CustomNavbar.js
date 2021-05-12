import React from 'react'
import { Dropdown, DropdownButton, Nav, Navbar } from 'react-bootstrap'

function LoggedInNavbar (props) {
  const profileUrl = '/profile/' + props.user._id

  return <div>
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand href="/">Matchmaker</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/matchmaking" style={{ color: 'white' }}>Find Match</Nav.Link>
          <Nav.Link href={profileUrl} style={{ color: 'white' }}>Profile</Nav.Link>
          <Nav.Link href="/groups" style={{ color: 'white' }}>Groups</Nav.Link>
          <Nav.Link href="/searchpage" style={{ color: 'white' }}>Search</Nav.Link>
        </Nav>
        <DropdownButton variant="secondary" menuAlign="right" title={props.user.name} id="dropdown-menu-align-right">
          <Dropdown.Item eventKey="3" onClick={() => props.setToken(null)}>Logout</Dropdown.Item>
        </DropdownButton>
      </Navbar.Collapse>
    </Navbar>
  </div>
}

function DefaultNavbar () {
  return <div>
    <Navbar className="color-nav" expand="lg" bg="dark" variant="dark">
      <Navbar.Brand href="/">Matchmaker</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/login" style={{ color: 'white' }}>Login</Nav.Link>
          <Nav.Link href="/searchpage" style={{ color: 'white' }}>Search</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  </div>
}

function CustomNavbar (props) {
  if (props.user) {
    return LoggedInNavbar(props)
  }
  return DefaultNavbar()
}

export default CustomNavbar
