export const signup = async ({ username, password }) => {
  const normalizedUsername = String(username || '').trim()

  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: normalizedUsername, password }),
  })
  if (!res.ok) throw new Error('Signup failed')
  return await res.json()
}

export const login = async ({ username, password }) => {
  const normalizedUsername = String(username || '').trim()

  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: normalizedUsername, password }),
  })
  if (!res.ok) throw new Error('Login failed')
  return await res.json()
}

export const getUserInfo = async (id) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return await res.json()
}
