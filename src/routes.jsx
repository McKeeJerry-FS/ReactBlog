import { useLoaderData, useParams } from 'react-router-dom'
import { Blog } from './pages/Blog'
import { Signup } from './pages/Signup'
import { Login } from './pages/Login'
import { ViewPost } from './pages/ViewPost'
import { getPostById } from './api/posts'
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query'
import { getUserInfo } from './api/users'

export const routes = [
  {
    path: '/',
    Component() {
      return <Blog />
    },
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/posts/:postId/:slug?',
    loader: async ({ params }) => {
      const postId = params.postId
      const queryClient = new QueryClient()
      const post = await getPostById(postId)
      await queryClient.prefetchQuery({
        queryKey: ['post', postId],
        queryFn: () => post,
      })
      if (post?.author) {
        await queryClient.prefetchQuery({
          queryKey: ['user', post.author],
          queryFn: () => getUserInfo(post.author),
        })
      }
      return {
        dehydratedState: dehydrate(queryClient),
        postId,
      }
    },
    Component() {
      const loaderData = useLoaderData() ?? {}
      const { postId } = useParams()
      return (
        <HydrationBoundary state={loaderData.dehydratedState}>
          <ViewPost postId={postId} />
        </HydrationBoundary>
      )
    },
  },
]
