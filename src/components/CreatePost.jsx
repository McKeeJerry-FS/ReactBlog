import { useMutation as useGraphQLMutation } from '@apollo/client/react/index.js'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import slug from 'slug'
import {
  CREATE_POST,
  GET_POSTS,
  GET_POSTS_BY_AUTHOR,
} from '../api/graphql/posts.js'
import { useAuth } from '../contexts/AuthContext.jsx'

export function CreatePost() {
  const { token } = useAuth()

  const [title, setTitle] = useState('')
  const [contents, setContents] = useState('')

  const [createPost, { loading, data }] = useGraphQLMutation(CREATE_POST, {
    variables: { title, contents },
    context: { headers: { Authorization: `Bearer ${token}` } },
    refetchQueries: [GET_POSTS, GET_POSTS_BY_AUTHOR],
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    createPost()
  }

  if (!token)
    return (
      <div className='alert alert-warning' role='alert'>
        Please log in to create new posts.
      </div>
    )

  return (
    <form onSubmit={handleSubmit}>
      <div className='mb-3'>
        <label htmlFor='create-title' className='form-label fw-semibold'>
          Title
        </label>
        <input
          type='text'
          name='create-title'
          id='create-title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className='form-control'
          placeholder='Enter post title...'
        />
      </div>
      <div className='mb-3'>
        <label htmlFor='create-contents' className='form-label fw-semibold'>
          Contents
        </label>
        <textarea
          id='create-contents'
          value={contents}
          onChange={(e) => setContents(e.target.value)}
          className='form-control'
          rows={6}
          placeholder='Write your post...'
        />
      </div>
      <button
        type='submit'
        className='btn btn-primary'
        disabled={!title || loading}
      >
        {loading ? (
          <>
            <span
              className='spinner-border spinner-border-sm me-2'
              role='status'
              aria-hidden='true'
            />
            Creating...
          </>
        ) : (
          'Create Post'
        )}
      </button>
      {data?.createPost && (
        <div className='alert alert-success mt-3' role='alert'>
          Post{' '}
          <Link
            to={`/posts/${data.createPost.id}/${slug(data.createPost.title)}`}
          >
            <strong>{data.createPost.title}</strong>
          </Link>{' '}
          created successfully!
        </div>
      )}
    </form>
  )
}
