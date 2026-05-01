import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import slug from 'slug'
import { User } from './User.jsx'

export function Post({
  title,
  contents,
  author,
  id,
  imageUrl,
  fullPost = false,
}) {
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
      {imageUrl && (
        <img
          src={imageUrl}
          alt={title}
          className={`img-fluid rounded mb-3${fullPost ? '' : ' w-100'}`}
          style={fullPost ? undefined : { maxHeight: 240, objectFit: 'cover' }}
          loading='lazy'
        />
      )}
      {fullPost && (
        <div
          className='card-text text-body mb-3'
          dangerouslySetInnerHTML={{ __html: contents || '' }}
        />
      )}
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
  contents: PropTypes.string,
  author: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      username: PropTypes.string,
    }),
  ]),
  id: PropTypes.string.isRequired,
  imageUrl: PropTypes.string,
  fullPost: PropTypes.bool,
}
