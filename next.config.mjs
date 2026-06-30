/** @type {import('next').NextConfig} */

// Repo name → GitHub Pages serves the site under https://<user>.github.io/<repo>/
const repo = 'blazity-hackaton'
const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
  output: 'export', // fully static — no server, deployable to GitHub Pages
  trailingSlash: true, // Pages serves /path/ as /path/index.html
  images: { unoptimized: true }, // no image optimization server on Pages
  basePath: isProd ? `/${repo}` : '',
  assetPrefix: isProd ? `/${repo}/` : '',
}

export default nextConfig
