# Deployment Guide - ZTV+ Custom YouTube Player

## Quick Start

### 1. Prerequisites
```bash
# Install Wrangler CLI
npm install -g wrangler

# Clone repository
git clone https://github.com/ztvplusfr/ztvplus.git
cd ztvplus

# Install dependencies
npm install
```

### 2. Configuration

#### Wrangler Setup
```bash
# Login to Cloudflare
wrangler login

# Update wrangler.toml with your details
```

Edit `wrangler.toml`:
```toml
name = "your-youtube-player"  # Change this
main = "src/worker.js"
compatibility_date = "2023-12-01"

[env.production]
vars = { ENVIRONMENT = "production" }
```

#### YouTube API Key (Optional)
```bash
# Set YouTube API key for video metadata
wrangler secret put YOUTUBE_API_KEY
# Enter your YouTube Data API v3 key when prompted
```

To get a YouTube API key:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable YouTube Data API v3
4. Create credentials (API Key)
5. Restrict the key to YouTube Data API v3

### 3. Deployment

#### Development
```bash
# Start local development server
npm run dev
# Visit http://localhost:8787/
```

#### Production
```bash
# Deploy to Cloudflare Workers
npm run deploy
```

## Usage Examples

After deployment, your worker will be available at:
`https://your-worker.your-subdomain.workers.dev/`

### Video Player
```
https://your-worker.your-subdomain.workers.dev/dQw4w9WgXcQ
```

### Audio Player
```
https://your-worker.your-subdomain.workers.dev/dQw4w9WgXcQ/audio
```

## Custom Domain Setup

### 1. Add Custom Domain in Cloudflare Dashboard
1. Go to Workers → your-worker → Triggers
2. Click "Add Custom Domain"
3. Add your domain (e.g., player.yourdomain.com)

### 2. Update DNS
Add a CNAME record pointing to your worker:
```
CNAME player your-worker.your-subdomain.workers.dev
```

## Features Overview

### Core Functionality
- ✅ Full-screen video player
- ✅ Audio-only mode with blurred background
- ✅ Custom controls (play/pause, volume, progress, quality, PiP)
- ✅ Auto-hide controls after 3 seconds
- ✅ YouTube no-cookie embedding for privacy
- ✅ Responsive design for all devices

### Keyboard Shortcuts
- **Space**: Play/Pause
- **←/→**: Seek backward/forward 10s
- **↑/↓**: Volume up/down
- **F**: Toggle fullscreen
- **M**: Toggle mute

### Mobile Features
- Touch gestures for seeking and volume
- Responsive design for all screen sizes
- iOS Safari optimization
- Touch-optimized controls

## Troubleshooting

### Common Issues

#### "Error loading video"
- Check if video ID is valid (11 characters, alphanumeric with - and _)
- Verify video is publicly available on YouTube
- Check if YouTube embedding is allowed for the video

#### Blank controls or missing icons
- Material Icons CDN might be blocked
- TailwindCSS CDN might be blocked
- Check browser console for network errors

#### No video metadata
- YouTube API key not set or invalid
- API quota exceeded
- Worker will fallback to basic info without API

### Debug Mode
Add this to your worker for debugging:
```javascript
console.log('Video ID:', videoId);
console.log('Audio mode:', audioMode);
console.log('Video data:', videoData);
```

## Performance Optimization

### Caching
The worker sets appropriate cache headers:
- Static assets: 1 hour cache
- Video pages: 1 hour cache
- API responses: Cached automatically

### CDN Integration
Resources loaded from CDN:
- TailwindCSS: `cdn.tailwindcss.com`
- Material Icons: `fonts.googleapis.com`
- YouTube thumbnails: `img.youtube.com`

## Security Considerations

### Headers Set
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`

### Privacy Features
- Uses YouTube no-cookie embedding
- No tracking or analytics by default
- Minimal data collection

## Monitoring

### Cloudflare Analytics
Monitor your worker performance:
1. Go to Cloudflare Dashboard
2. Workers → your-worker → Metrics
3. View requests, errors, and performance

### Error Logging
Errors are logged to Cloudflare Workers logs:
```bash
wrangler tail
```

## Support

For issues or questions:
1. Check browser console for errors
2. Verify video ID format
3. Test with known working video IDs
4. Check Cloudflare Workers logs