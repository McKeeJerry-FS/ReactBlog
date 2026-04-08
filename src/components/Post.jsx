import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import slug from 'slug'
import { User } from './User.jsx'

export function Post({ title, contents, author, id, fullPost = false }) {
  return (
    <article>
      {fullPost ? (
        <h2 className='card-title mb-3'>{title}</h2>
      ) : (
        <Link
          to={`/posts/${id}/${slug(title)}`}
          className='text-decoration-none'
        >
          <h5 className='card-title text-primary mb-2'>{title}</h5>
        </Link>
      )}
      {fullPost && <p className='card-text text-body mb-3'>{contents}</p>}
      {author && (
        <p className='card-text'>
          <small className='text-body-secondary'>
            Written by{' '}
            <strong>
              {typeof author === 'object' ? (
                author.username
              ) : (
                <User id={author} />
              )}
            </strong>
          </small>
        </p>
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
