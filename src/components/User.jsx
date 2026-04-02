import { useQuery } from '@tanstack/react-query'
import PropTypes from 'prop-types'
import { getUserInfo } from '../api/users'

export function User({ id }) {
  const userInfoQuery = useQuery({
    queryKey: ['user', id],
    queryFn: () => getUserInfo(id),
  })
  const userInfo = userInfoQuery.data ?? {}
  return (
    <div>
      <h2>User Info</h2>
      <p>Username: {userInfo.username}</p>
    </div>
  )
}

User.propTypes = {
  id: PropTypes.string.isRequired,
}
