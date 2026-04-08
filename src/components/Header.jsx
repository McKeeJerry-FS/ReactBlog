import { Link, useLocation } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { useQuery } from '@tanstack/react-query'
import { getUserInfo } from '../api/users.js'
import { useAuth } from '../contexts/AuthContext.jsx'

export function Header() {
  const { token, setToken } = useAuth()
  const location = useLocation()

  const { sub } = token ? jwtDecode(token) : {}
  const userInfoQuery = useQuery({
    queryKey: ['users', sub],
    queryFn: () => getUserInfo(sub),
    enabled: Boolean(sub),
  })
  const userInfo = userInfoQuery.data

  return (
    <nav className='navbar navbar-expand-md bg-body-tertiary shadow-sm sticky-top'>
      <div className='container'>
        <Link className='navbar-brand fw-bold fs-4' to='/'>
          ✏️ ReactBlog
        </Link>
        <button
          className='navbar-toggler'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#main-nav'
          aria-controls='main-nav'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon' />
        </button>
        <div className='collapse navbar-collapse' id='main-nav'>
          <ul className='navbar-nav ms-auto align-items-md-center gap-2'>
            {token && userInfo ? (
              <>
                <li className='nav-item'>
                  <span className='navbar-text'>
                    Logged in as <strong>{userInfo.username}</strong>
                  </span>
                </li>
                <li className='nav-item'>
                  <button
                    className='btn btn-outline-secondary btn-sm'
                    onClick={() => setToken(null)}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className='nav-item'>
                  <Link
                    className={`btn btn-outline-primary btn-sm${location.pathname === '/login' ? ' active' : ''}`}
                    to='/login'
                  >
                    Log In
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link
                    className={`btn btn-primary btn-sm${location.pathname === '/signup' ? ' active' : ''}`}
                    to='/signup'
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}
