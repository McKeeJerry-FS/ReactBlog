import slug from 'slug'
import dotenv from 'dotenv'

dotenv.config()

const BASE_URL = process.env.FRONTEND_URL || 'http://localhost:5173'
const API_BASE_URL =
  process.env.VITE_BACKEND_URL || 'http://localhost:8080/api/v1'

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function toIsoDate(value) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

async function fetchPosts() {
  const response = await fetch(`${API_BASE_URL}/posts`)
  if (!response.ok) {
    throw new Error(`Failed to fetch posts for sitemap: ${response.status}`)
  }
  const data = await response.json()
  return Array.isArray(data) ? data : []
}

export async function generateSitemap(posts = null) {
  const postsData = Array.isArray(posts) ? posts : await fetchPosts()
  const staticRoutes = ['', '/signup', '/login']

  const staticUrlEntries = staticRoutes
    .map((route) => {
      const loc = `${BASE_URL}${route}`
      return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n  </url>`
    })
    .join('\n')

  const postUrlEntries = postsData
    .map((post) => {
      const postId = post.id ?? post._id
      if (!postId || !post.title) return ''

      const loc = `${BASE_URL}/posts/${postId}/${slug(post.title)}`
      const lastmod = toIsoDate(post.updatedAt ?? post.createdAt)
      const lastmodLine = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''

      return `  <url>\n    <loc>${escapeXml(loc)}</loc>${lastmodLine}\n  </url>`
    })
    .filter(Boolean)
    .join('\n')

  const urlEntries = [staticUrlEntries, postUrlEntries]
    .filter(Boolean)
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>`
}
