# ZTV+ Custom YouTube Player

A Cloudflare Worker that provides a custom YouTube player with advanced features and audio-only mode.

## Features

### Video Mode
- **Full-screen responsive design** - 100% viewport coverage
- **Custom controls** - Play/pause, volume, progress bar, quality selection, Picture-in-Picture
- **Auto-hide controls** - Controls appear on mouse movement and auto-hide after 3 seconds
- **Keyboard shortcuts** - Space (play/pause), arrows (seek/volume), F (fullscreen), M (mute)
- **Touch controls** - Swipe gestures for mobile devices
- **YouTube no-cookie embed** - Privacy-focused embedding

### Audio Mode
- **Immersive interface** - Blurred background with square video thumbnail
- **Clean audio controls** - Simplified controls optimized for audio listening
- **Metadata display** - Video title and channel name
- **Mode switching** - Easy toggle between video and audio modes

### Technical Features
- **Responsive design** - Works on desktop, tablet, and mobile
- **iOS compatibility** - Optimized for iOS devices
- **Material Design icons** - Clean, modern interface
- **TailwindCSS styling** - Fast, utility-first CSS framework
- **Error handling** - Graceful handling of API failures and video errors

## Usage

### Routes
- `/{video_id}` - Video player mode
- `/{video_id}/audio` - Audio-only mode

### Examples
- `https://your-worker.workers.dev/dQw4w9WgXcQ` - Rick Roll in video mode
- `https://your-worker.workers.dev/dQw4w9WgXcQ/audio` - Rick Roll in audio mode

## Setup

1. Install Wrangler CLI:
   ```bash
   npm install -g wrangler
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure your YouTube API key (optional):
   ```bash
   wrangler secret put YOUTUBE_API_KEY
   ```

4. Deploy to Cloudflare Workers:
   ```bash
   npm run deploy
   ```

## Development

1. Start development server:
   ```bash
   npm run dev
   ```

2. Test locally:
   ```bash
   curl http://localhost:8787/dQw4w9WgXcQ
   ```

## Configuration

### Environment Variables
- `YOUTUBE_API_KEY` - YouTube Data API v3 key for fetching video metadata
- `ENVIRONMENT` - Set to "production" for production deployment

### Wrangler Configuration
The `wrangler.toml` file contains the worker configuration. Update the name and routes as needed for your deployment.

## Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- iOS Safari 14+
- Android Chrome 90+

## License

This project is open source. Please check individual file headers for specific license information.