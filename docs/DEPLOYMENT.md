# Deployment Guide

This guide covers various deployment options for Asset Fetcher.

## 🚀 Vercel (Recommended)

### Prerequisites
- Vercel account
- GitHub repository

### Steps

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Link project
   vercel link
   ```

2. **Configure Environment Variables**
   - Go to Vercel dashboard
   - Navigate to Project Settings → Environment Variables
   - Add any required environment variables

3. **Deploy**
   ```bash
   # Deploy to Vercel
   vercel --prod
   ```

### Automatic Deployment
Set up GitHub integration for automatic deployments on push to main branch.

## 🐳 Docker

### Building Docker Image

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03ba546313e094831e7c6c3a4/debian
# for a more educated reference.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN \
  if [ -f package-lock.json ]; then npm ci --only=production; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Environment variables
ENV NEXT_TELEMETRY_DISABLED 1

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]
```

### Running with Docker

```bash
# Build image
docker build -t asset-fetcher .

# Run container
docker run -p 3000:3000 asset-fetcher
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  asset-fetcher:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

## 🌐 Netlify

### Prerequisites
- Netlify account
- Build tool configured

### Steps

1. **Build Project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop the `out` folder to Netlify
   - Or connect Git repository for automatic deployments

3. **Configure Redirects**
   Create `_redirects` file:
   ```
   /*    /index.html   200
   ```

## 🔧 Traditional Hosting

### Build for Production

```bash
# Build the application
npm run build

# The output will be in the .next directory
```

### Using Node.js

```bash
# Install production dependencies
npm ci --only=production

# Start production server
npm start
```

### Using Static Files

1. Build with static export:
   ```json
   // next.config.ts
   module.exports = {
     output: 'export',
     trailingSlash: true,
     images: {
       unoptimized: true
     }
   }
   ```

2. Export static files:
   ```bash
   npm run build
   ```

3. Upload `out` folder to your hosting provider

## 🔒 Environment Variables

### Required Variables
- `NODE_ENV` - Set to 'production' for production builds

### Optional Variables
- Custom API keys for different sources
- Custom configuration options

### Security Notes
- Never commit `.env` files to version control
- Use hosting provider's environment variable management
- Rotate API keys regularly

## 📊 Performance Optimization

### Build Optimization
```json
// next.config.ts
module.exports = {
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizeCss: true,
  },
}
```

### CDN Configuration
- Configure CDN for static assets
- Enable gzip compression
- Set appropriate cache headers
- Use image optimization

## 🔍 Monitoring and Analytics

### Error Tracking
- Integrate error tracking services
- Monitor API response times
- Track user experience metrics

### Performance Monitoring
- Set up Core Web Vitals monitoring
- Monitor bundle sizes
- Track loading performance

## 🛠️ Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (requires 18+)
   - Clear node_modules and reinstall
   - Verify all dependencies are installed

2. **Runtime Errors**
   - Check environment variables
   - Verify API keys are correctly set
   - Check network connectivity

3. **Performance Issues**
   - Enable production optimizations
   - Check bundle size
   - Monitor API response times

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
# .github/workflows/deploy.yml
name: Deploy Asset Fetcher

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build
      run: npm run build
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📱 Mobile Optimization

### PWA Configuration
```json
// public/manifest.json
{
  "name": "Asset Fetcher",
  "short_name": "AssetFetcher",
  "description": "Search and download assets from multiple sources",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "orientation": "portrait"
}
```

### Service Worker
- Implement offline caching
- Cache search results
- Store favorite assets locally

For additional deployment options, see the [API Documentation](API.md).
