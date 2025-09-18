# Usage Examples

## Basic Video Player

Access any YouTube video with a custom player interface:

```
https://your-worker.workers.dev/dQw4w9WgXcQ
```

This displays the Rick Astley video with:
- Full-screen responsive design
- Custom controls with auto-hide functionality
- Keyboard shortcuts (Space, arrows, F, M)
- Touch gestures for mobile

## Audio-Only Mode

Add `/audio` to any video URL for audio-only experience:

```
https://your-worker.workers.dev/dQw4w9WgXcQ/audio
```

Features:
- Immersive blurred background
- Square video thumbnail display
- Clean audio controls
- Video title and channel information

## Popular Video Examples

### Music Videos
```
https://your-worker.workers.dev/9bZkp7q19f0/audio    # Gangnam Style (audio)
https://your-worker.workers.dev/kJQP7kiw5Fk          # Despacito
https://your-worker.workers.dev/YQHsXMglC9A/audio    # Hello - Adele (audio)
```

### Educational Content
```
https://your-worker.workers.dev/rHiSIyS2mAk          # How to Adult
https://your-worker.workers.dev/dQw4w9WgXcQ          # Never Gonna Give You Up
```

## Integration Examples

### HTML Embed
```html
<iframe 
  src="https://your-worker.workers.dev/dQw4w9WgXcQ" 
  width="100%" 
  height="500"
  allowfullscreen>
</iframe>
```

### JavaScript Integration
```javascript
// Redirect to custom player
function openCustomPlayer(videoId, audioMode = false) {
  const url = `https://your-worker.workers.dev/${videoId}${audioMode ? '/audio' : ''}`;
  window.open(url, '_blank');
}

// Usage
openCustomPlayer('dQw4w9WgXcQ', false); // Video mode
openCustomPlayer('dQw4w9WgXcQ', true);  // Audio mode
```

## Mobile Usage

The player automatically adapts to mobile devices:

- Touch gestures for seeking and volume control
- Responsive design for all screen sizes
- iOS-optimized playback
- Portrait/landscape support

## Keyboard Shortcuts

- **Space**: Play/Pause
- **Left Arrow**: Seek backward 10s
- **Right Arrow**: Seek forward 10s
- **Up Arrow**: Volume up
- **Down Arrow**: Volume down
- **F**: Toggle fullscreen
- **M**: Toggle mute

## Error Handling

Invalid video IDs return a user-friendly error:
```
https://your-worker.workers.dev/invalid123
```
Returns: "Invalid URL format. Use /{video_id} or /{video_id}/audio"