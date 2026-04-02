const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080/api/v1'

export const signup = async ({ username, password }) => {
  const normalizedUsername = String(username || '').trim()

  const res = await fetch(`${API_BASE_URL}/user/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: normalizedUsername, password }),
  })

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null)
    const errorMessage = errorBody?.error || 'Signup failed'
    throw new Error(`${errorMessage} (HTTP ${res.status})`)
  }

  return await res.json()
}

export const login = async ({ username, password }) => {
  const normalizedUsername = String(username || '').trim()

  const res = await fetch(`${API_BASE_URL}/user/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: normalizedUsername, password }),
  })

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null)
    const errorMessage = errorBody?.error || 'Login failed'
    throw new Error(`${errorMessage} (HTTP ${res.status})`)
  }

  return await res.json()
}

export const getUserInfo = async (id) => {
  const res = await fetch(`${API_BASE_URL}/user/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return await res.json()
}
