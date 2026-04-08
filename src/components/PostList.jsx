import PropTypes from 'prop-types'
import { Post } from './Post'

export function PostList({ posts = [] }) {
  return (
    <div>
      <h2>Blog Posts</h2>
      <div className='row row-cols-1 row-cols-md-2 g-4'>
        {posts.map((post) => (
          <div key={post.id} className='col'>
            <div className='card h-100'>
              <div className='card-body'>
                <Post {...post} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

PostList.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.shape(Post.propTypes)).isRequired,
}
