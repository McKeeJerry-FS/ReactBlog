import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useQuery } from '@tanstack/react-query';
import { Header } from '../components/Header';
import { Post } from '../components/Post';
import { getPostById } from '../api/posts';
import { Helmet } from 'react-helmet-async';

export function ViewPost({ postId }) {
    const postQuery = useQuery({
        queryKey: ['post', postId],
        queryFn: () => getPostById(postId),
    });
    const post = postQuery.data;

    return(
        <div style={{ padding: 8 }}>
            {post && (
                <Helmet>
                    <title>{post.title} - Full Stack React Blog</title>
                    <meta
                        name="description"
                        content={truncate(post.content)}
                    />
                </Helmet>
            )}
            <Header />
            <br />
            <hr />
            <Link to="/">Back to home</Link>
            <br />
            <hr />
            {post ? <Post {...post} fullPost /> : `Post with id: ${postId} not found.`}
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
};