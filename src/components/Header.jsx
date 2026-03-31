import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { useAuth } from '../contexts/AuthContect'
import { User } from './User.jsx'

export function Header() {
  const { token, setToken } = useAuth()
  const navigate = useNavigate()
  if (token) {
    const { userId } = jwtDecode(token)
    return (
      <div>
        <span>
          Welcome, <User id={userId} />!
        </span>
        <br />
        <button onClick={() => setToken(null)}>Log Out</button>
      </div>
    )
  }

  return (
    <div>
      <button onClick={() => navigate('/signup')}>Sign Up</button>
      <button onClick={() => navigate('/login')}>Log In</button>  
    </div>
  )
}
