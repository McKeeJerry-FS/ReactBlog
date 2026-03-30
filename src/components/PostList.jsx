import { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Post } from './Post';

export function PostList({ posts = [] }) {
    return (
        <div>
            <h2>Posts</h2>
            {posts.map((post) => (
                <Fragment key={post._id}>
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