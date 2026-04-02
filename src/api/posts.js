const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080/api/v1'

export const getPosts = async (queryParams) => {
  const res = await fetch(
    `${API_BASE_URL}/posts?` + new URLSearchParams(queryParams),
  )
  return await res.json()
}

export const getPostById = async (postId) => {
  const res = await fetch(`${API_BASE_URL}/posts/${postId}`)
  return await res.json()
}

export const createPost = async (token, post) => {
  const res = await fetch(`${API_BASE_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(post),
  })
  return await res.json()
}
