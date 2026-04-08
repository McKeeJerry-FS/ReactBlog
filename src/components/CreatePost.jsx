import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { createPost } from '../api/posts'

export function CreatePost() {
  const { token } = useAuth()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const queryClient = useQueryClient()
  const createPostMutation = useMutation({
    mutationFn: ({ token, post }) => createPost(token, post),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      setTitle('')
      setContent('')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    createPostMutation.mutate({ token, post: { title, content } })
  }
  if (!token) return <div>Please log in to create a post.</div>
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <h2>Create a New Post</h2>
      </div>
      <div>
        <label htmlFor='create-title'>Title</label>
        <input
          id='create-title'
          type='text'
          name='create-title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <br />
      <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      <br />
      <br />
      <input
        type='submit'
        value={createPostMutation.isPending ? 'Creating...' : 'Create'}
        disabled={!title || createPostMutation.isPending}
      />
      {createPostMutation.isError && (
        <div style={{ color: 'red' }}>Error creating post</div>
      )}
      {createPostMutation.isSuccess && (
        <div style={{ color: 'green' }}>Post created successfully</div>
      )}
    </form>
  )
}
