import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import slug from 'slug'
import { User } from './User.jsx'

export function Post({ title, contents, author, id, fullPost = false }) {
  return (
    <article>
      {fullPost ? (
        <h3>{title}</h3>
      ) : (
        <Link to={`/posts/${id}/${slug(title)}`}>
          <h3>{title}</h3>
        </Link>
      )}
      {fullPost && <div>{contents}</div>}
      {author && (
        <em>
          {fullPost && <br />}
          Written by{' '}
          <strong>
            {typeof author === 'object' ? (
              author.username
            ) : (
              <User id={author} />
            )}
          </strong>
        </em>
      )}
    </article>
  )
}

Post.propTypes = {
  title: PropTypes.string.isRequired,
  contents: PropTypes.shape(User.propTypes),
  author: PropTypes.string,
  id: PropTypes.string.isRequired,
  fullPost: PropTypes.bool,
}
