import React from 'react'
import { Card, Col, Accordion, ListGroup } from 'react-bootstrap'
import axios from 'axios'

function FriendBar (props) {
  const [user, setUser] = React.useState({
    _id: '',
    email: '',
    group: '',
    friends: {},
    games_table: {},
    name: '',
    password: '',
    profile_info: {
      bio: '',
      discord: '',
      profile_pic: '',
      steam_friend_code: '',
      steam_name: ''
    }
  })

  const [usergroup, setGroup] = React.useState({
    _id: '',
    num_players: '',
    players: {}
  })

  async function fetchUser (_id) {
    try {
      const response = await axios.get('http://127.0.0.1:5000/users/' + _id)
      return response.data
    } catch (error) {
      console.log(error)
      return false
    }
  }

  React.useEffect(() => {
    async function fetchGroup (_id) {
      try {
        const response = await axios.get('http://127.0.0.1:5000/groups/' + _id)
        return response.data
      } catch (error) {
        console.log(error)
        return false
      }
    }

    fetchUser(props._id).then((result) => {
      if (result) {
        setUser(result)
        fetchGroup(result.group).then((result) => {
          if (result) {
            setGroup(result)
          }
        })
      }
    })
  }, [props._id])

  function FriendsList (props) {
    const [, setFriendList] = React.useState([])
    const [responseList, setResponseList] = React.useState([])

    React.useEffect(() => {
      async function getAllFriends () {
        for (const key in props.list) {
          if (props.list[key] !== 'Deleted') {
            const response = await fetchUser(key)
            setFriendList((friendList) => [...friendList, response.name])
            setResponseList((responseList) => [...responseList, response])
          } else {
            console.log(key + ' is a deleted friend.')
          }
        }
      }

      getAllFriends()
    }, [props.list])

    const rows = responseList.map((friend, i) => {
      return (
        <Col key={i}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <p
                onClick={() => {
                  window.location.href = '/profile/' + friend._id
                }}
              >
                {friend.name}
              </p>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      )
    })

    return <div>{rows}</div>
  }

  return (
    <div style={{ fontSize: 14 }}>
      <Accordion defaultActiveKey="0">
        <Card>
          <Accordion.Toggle
            as={Card.Header}
            eventKey="0"
            className="text-center"
          >
            Your Friends
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="0">
            <Card.Body className="pl-0">
              <FriendsList list={user.friends} />
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
      <Accordion defaultActiveKey="0">
        <Card>
          <Accordion.Toggle
            as={Card.Header}
            eventKey="0"
            className="text-center"
          >
            Your Group
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="0">
            <Card.Body className="pl-0">
              Group Code: {'\n'}
              {user.group} {'\n'}
              Group members
              <FriendsList list={usergroup.players} />
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </div>
  )
}

export default FriendBar
