import { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Post } from './Post'

export function PostList({ posts = [] }) {
  return (
    <div>
      <h2>Blog Posts</h2>
      {posts.map((post) => (
        <Fragment key={post.id}>
          <Post {...post} />
          <hr />
        </Fragment>
      ))}
    </div>
  )
}

PostList.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.shape(Post.propTypes)).isRequired,
}
