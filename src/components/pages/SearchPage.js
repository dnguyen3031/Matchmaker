import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import CustomNavbar from '../CustomNavbar'
import FriendBar from '../FriendBar'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import axios from 'axios'
import './PageTemplate.css'

function SearchPage (props) {
  console.log(props)

  const [searchResults, setSearchResults] = React.useState([])

  useEffect(() => {
    props.fetchData({ id: props.data.id, get_group: true, currentPage: 'SearchPage' }).then(result => {
      console.log('fetched data')
      props.setData(result)
    })
  }, [])

  console.log(props.data.currentPage)
  if (props.data.currentPage !== 'SearchPage') {
    return props.data.LoadingPage(props)
  }

  function ResultsTable () {
    console.log('sr: ' + searchResults)
    if (!(searchResults) || searchResults.length === 0) {
      console.log('empty')
      return null
    }

    if (searchResults === 'noResults') {
      console.log('detected \'noresults\'')
      return (
        <div>
          <table>
            <tbody>
            <tr>
              <th style={{ color: 'black' }}>No Results</th>
            </tr>
            </tbody>
          </table>
        </div>
      )
    }

    const rows = searchResults.map((user, index) => {
      return (
        <tr key={index}>
          <td>
            <Link to={'/profile/' + user._id} >
              {user.name}
            </Link>
          </td>
        </tr>
      )
    })
    return (
      <div>
        <table>
          <tbody>
          <tr>
            <th style={{ color: 'black' }}>Results</th>
          </tr>
          {rows}
          </tbody>
        </table>
      </div>
    )
  }

  function SearchBar () {
    const [searchTerm, setSearchTerm] = React.useState('')

    async function makeGetByNameCall (name) {
      try {
        return await axios.get(
          'http://localhost:5000/users?secureName=' + name)
      } catch (error) {
        console.log(error)
        return false
      }
    }

    function submitSearch () {
      if (searchTerm !== '') {
        makeGetByNameCall(searchTerm).then(result => {
          if (result.status === 200) {
            console.log(result.data.users_list)
            console.log('sr detek: ' + result.data.users_list.length)
            if (result.data.users_list.length === 0) {
              console.log('setting noResults')
              setSearchResults('noResults')
            } else {
              setSearchResults(result.data.users_list)
            }
          } else {
            console.log('failed to find users')
            console.log(result)
          }
        })
      }
    }

    return <Form>
      <Form.Group controlId="searchForm">
        <Form.Label>Search term</Form.Label>
        <Form.Control type="username" placeholder="Enter username"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)} />
      </Form.Group>
      <Button variant="primary" type="button" onClick ={submitSearch}>
        {/* TODO: change to Submit type button */}
        Submit
      </Button>
    </Form>
  }

  return <div>
    <CustomNavbar setToken={(id) => props.setToken(id)} user={props.data.user}/>
    <Container fluid>
      <Row>
        <Col className="side-col" />
        <Col xs={8} className="pr-0">
          <Row>
            <Col>
              <SearchBar/>
              <ResultsTable />
            </Col>
            <Col md={3}>
              <FriendBar data={props.data}/>
            </Col>
          </Row>
        </Col>
        <Col className="side-col" />
      </Row>
    </Container>
  </div>
}

export default SearchPage
