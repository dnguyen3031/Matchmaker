import axios from 'axios'

function MakeCall () {
}

export async function MakeGetCall (person) {
  try {
    // get character at index 's id number
    const response = await axios.get('http://matchmaker-backend01.herokuapp.com/users')
    return response.data
  } catch (error) {
    console.log(error)
    return false
  }
}

export default MakeCall
