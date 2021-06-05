import './PageTemplate.css'

function Home (props) {
  if (props.data.id !== null) {
    window.location.href = '/matchmaking'
  } else {
    window.location.href = '/login'
  }
}

export default Home
