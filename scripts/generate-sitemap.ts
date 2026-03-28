import { blogPosts } from '../src/data/blogPosts'
import * as fs from 'fs'
import * as path from 'path'

const BASE_URL = 'https://factuurstudio.nl'

const staticPages = [
  { url: '/', priority: '1.0', changefreq: 'weekly' },
  { url: '/blog', priority: '0.9', changefreq: 'daily' },
  { url: '/pricing', priority: '0.8', changefreq: 'monthly' },
  { url: '/login', priority: '0.5', changefreq: 'yearly' },
  { url: '/register', priority: '0.6', changefreq: 'yearly' },
]

const generateSitemap = () => {
  const today = new Date().toISOString().split('T')[0]
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`
  // Static pages
  staticPages.forEach(page => {
    sitemap += `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`
  })
  
  // Blog posts
  blogPosts.forEach(post => {
    const postDate = post.publishDate
    sitemap += `  <url>
    <loc>${BASE_URL}/blog/${post.slug}</loc>
    <lastmod>${postDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`
  })
  
  sitemap += '</urlset>'
  
  return sitemap
}

const sitemap = generateSitemap()
const outputPath = path.join(__dirname, '../public/sitemap.xml')

fs.writeFileSync(outputPath, sitemap)
console.log(`Sitemap generated with ${staticPages.length + blogPosts.length} URLs`)
console.log(`Saved to: ${outputPath}`)
