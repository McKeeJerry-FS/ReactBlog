import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../contexts/AuthContect';
import { User } from './User.jsx'

export function Header() {
  const [ token, setToken ] = useAuth();
  if (token) {
    const { sub } = jwtDecode(token);
    return (
      <div>
        <span>Welcome, <User id={sub} />!</span>
        <button onClick={() => setToken(null)}>Log Out</button>
      </div>
    )
  }

  return (
    <div>
      <Link to='/signup'>Sign Up</Link>
      <Link to='/login'>Log In</Link>
    </div>
  )
}
