import { useState } from 'react';
import { useQuery as useGraphQLQuery } from '@apollo/client/react/index.js';
import { PostList } from '../components/PostList';
import { CreatePost } from '../components/CreatePost';
import { PostFilter } from '../components/PostFilter';
import { PostSorting } from '../components/PostSorting';
import { GET_POSTS, GET_POSTS_BY_AUTHOR } from '../api/graphql/posts';
import { Header } from '../components/Header';
import { Helmet } from 'react-helmet-async';


export function Blog() {
  const [ author, setAuthor ] = useState('');
  const [ sortBy, setSortBy ] = useState('createdAt');
  const [ sortOrder, setSortOrder ] = useState('descending');

  const postsQuery = useGraphQLQuery(author ? GET_POSTS_BY_AUTHOR : GET_POSTS, {
    variables: { author, options: { sortBy, sortOrder } },
  });
  const posts = postsQuery.data?.postsByAuthor ??  postsQuery.data?.posts ?? []

  return (
    <div style={{ padding: 8 }}>
      <Helmet>
        <title>Home - Full Stack React Blog</title>
        <meta 
          name="description"
          content="A blog full of articles about React, Node.js, and full stack development."
        />
      </Helmet>
      <Header />
      <br />
      <hr />
      <br />
      <CreatePost />
      <br />
      <hr />
      Filter By:
      <PostFilter 
        field='author'
        value={author}
        onChange={(value) => setAuthor(value)} 
      />
      <br />
      <PostSorting 
        fields={['createdAt', 'updatedAt']}
        value={sortBy}
        onChange={(value) => setSortBy(value)}
        orderValue={sortOrder}
        onOrderChange={(orderValue) => setSortOrder(orderValue)} 
      />
      <hr />
      <PostList posts={posts} />
    </div>
  )
  
}