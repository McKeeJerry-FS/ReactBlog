import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Header } from '../components/Header'
import { Post } from '../components/Post'
import { PostStats } from '../components/PostStats'
import { getPostById } from '../api/posts'
import { getUserInfo } from '../api/users'
import { postTrackEvent } from '../api/events'
import { Helmet } from 'react-helmet-async'

export function ViewPost({ postId }) {
  const [session, setSession] = useState()
  const trackEventMutation = useMutation({
    mutationFn: (action) => postTrackEvent({ postId, action, session }),
    onSuccess: (data) => setSession(data?.session),
  })
  useEffect(() => {
    let timeout = setTimeout(() => {
      trackEventMutation.mutate('startView')
      timeout = null
    }, 1000)
    return () => {
      if (timeout) clearTimeout(timeout)
      else trackEventMutation.mutate('endView')
    }
  }, [])
  const postQuery = useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPostById(postId),
  })
  const post = postQuery.data

  const userInfoQuery = useQuery({
    queryKey: ['users', post?.author],
    queryFn: () => getUserInfo(post?.author),
    enabled: Boolean(post?.author),
  })
  const userInfo = userInfoQuery.data ?? {}

  return (
    <div>
      {post && (
        <Helmet>
          <title>{post.title} - Full Stack React Blog</title>
          <meta name='description' content={truncate(post.content)} />
          <meta property='og:type' content='article' />
          <meta property='og:title' content={post.title} />
          <meta property='og:article:published_time' content={post.createdAt} />
          <meta property='og:article:modified_time' content={post.updatedAt} />
          <meta property='og:article:author' content={userInfo.name} />
          {(post.tags ?? []).map((tag) => (
            <meta key={tag} property='og:article:tag' content={tag} />
          ))}
        </Helmet>
      )}
      <Header />
      <div className='container py-4'>
        <Link to='/' className='btn btn-outline-secondary btn-sm mb-4'>
          &larr; Back to home
        </Link>
        {post ? (
          <div className='card shadow-sm'>
            <div className='card-body p-4'>
              <Post {...post} id={post.id} fullPost />
              <hr />
              <PostStats postId={postId} />
            </div>
          </div>
        ) : (
          <div className='alert alert-warning' role='alert'>
            Post with id: {postId} not found.
          </div>
        )}
      </div>
    </div>
  )
}

function truncate(str, max = 160) {
  if (!str) return str
  if (str.length > max) {
    return str.slice(0, max) + '...'
  } else {
    return str
  }
}

ViewPost.propTypes = {
  postId: PropTypes.string.isRequired,
}
