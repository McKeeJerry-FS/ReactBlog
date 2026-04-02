import PropTypes from 'prop-types'
import { User } from './User.jsx'
import { Link } from 'react-router-dom'
import slug from 'slug'

export function Post({ title, content, author, _id, fullPost = false }) {
  return (
    <article>
      {!fullPost ? (
        <Link to={`/posts/${_id}/${slug(title)}`}>
          <h3>{title}</h3>
        </Link>
      ) : (
        <h3>{title}</h3>
      )}
      {fullPost && <div>{content}</div>}
      {author && (
        <em>
          {fullPost && <br />}
          Written by{' '}
          <strong>
            <User id={author} />
          </strong>
        </em>
      )}
    </article>
  )
}

Post.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string,
  author: PropTypes.string,
  _id: PropTypes.string.isRequired,
  fullPost: PropTypes.bool,
}
