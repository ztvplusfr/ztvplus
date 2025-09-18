// Cloudflare Worker for Custom YouTube Player
// Handles routes: /{video_id} and /{video_id}/audio

const YOUTUBE_API_KEY = 'YOUR_YOUTUBE_API_KEY'; // Should be set as environment variable

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // Handle root path with usage instructions
    if (path === '/') {
      return new Response(generateUsagePage(), {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=3600'
        }
      });
    }
    
    // Handle favicon requests
    if (path === '/favicon.ico') {
      return new Response('Not found', { status: 404 });
    }
    
    // Extract video ID from path - allow 10-11 character YouTube IDs
    const videoIdMatch = path.match(/^\/([a-zA-Z0-9_-]{10,11})(?:\/(audio))?$/);
    
    if (!videoIdMatch) {
      return new Response(generateErrorPage('Invalid URL format. Use /{video_id} or /{video_id}/audio'), { 
        status: 400,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }
    
    const videoId = videoIdMatch[1];
    const audioMode = videoIdMatch[2] === 'audio';
    
    try {
      // Validate video ID format more strictly
      if (!isValidYouTubeId(videoId)) {
        return new Response(generateErrorPage('Invalid YouTube video ID format'), { 
          status: 400,
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      }
      
      // Get video metadata from YouTube API
      const videoData = await getVideoMetadata(videoId, env.YOUTUBE_API_KEY || YOUTUBE_API_KEY);
      
      // Generate HTML response
      const html = generatePlayerHTML(videoId, videoData, audioMode);
      
      return new Response(html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
          'X-Frame-Options': 'SAMEORIGIN',
          'X-Content-Type-Options': 'nosniff',
          'Referrer-Policy': 'strict-origin-when-cross-origin'
        }
      });
    } catch (error) {
      console.error('Error loading video:', error);
      return new Response(generateErrorPage('Error loading video. Please check the video ID and try again.'), { 
        status: 500,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }
  }
};

// Validate YouTube video ID format
function isValidYouTubeId(videoId) {
  // YouTube video IDs are typically 11 characters but can be 10-11
  // Contains letters, numbers, hyphens, and underscores
  return /^[a-zA-Z0-9_-]{10,11}$/.test(videoId);
}

// Generate usage page for root route
function generateUsagePage() {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ZTV+ Custom YouTube Player</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
<body class="bg-gray-900 text-white">
    <div class="container mx-auto px-4 py-8 max-w-4xl">
        <div class="text-center mb-8">
            <h1 class="text-4xl font-bold mb-4">🎬 ZTV+ Custom YouTube Player</h1>
            <p class="text-xl text-gray-300">Lecteur YouTube personnalisé avec fonctionnalités avancées</p>
        </div>
        
        <div class="grid md:grid-cols-2 gap-8 mb-8">
            <div class="bg-gray-800 p-6 rounded-lg">
                <h2 class="text-2xl font-semibold mb-4 text-red-400">Mode Vidéo</h2>
                <p class="text-gray-300 mb-4">Lecteur plein écran avec contrôles personnalisés</p>
                <div class="text-sm text-gray-400 mb-4">
                    <strong>URL:</strong> /{video_id}
                </div>
                <div class="text-sm text-gray-400">
                    <strong>Exemple:</strong><br>
                    <code class="bg-gray-700 px-2 py-1 rounded">/dQw4w9WgXcQ</code>
                </div>
            </div>
            
            <div class="bg-gray-800 p-6 rounded-lg">
                <h2 class="text-2xl font-semibold mb-4 text-blue-400">Mode Audio</h2>
                <p class="text-gray-300 mb-4">Interface audio avec fond flou et contrôles simplifiés</p>
                <div class="text-sm text-gray-400 mb-4">
                    <strong>URL:</strong> /{video_id}/audio
                </div>
                <div class="text-sm text-gray-400">
                    <strong>Exemple:</strong><br>
                    <code class="bg-gray-700 px-2 py-1 rounded">/dQw4w9WgXcQ/audio</code>
                </div>
            </div>
        </div>
        
        <div class="bg-gray-800 p-6 rounded-lg mb-8">
            <h2 class="text-2xl font-semibold mb-4">✨ Fonctionnalités</h2>
            <div class="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                    <h3 class="font-semibold text-green-400 mb-2">Contrôles</h3>
                    <ul class="text-gray-300 space-y-1">
                        <li>• Play/Pause</li>
                        <li>• Volume & Mute</li>
                        <li>• Barre progression</li>
                        <li>• Plein écran</li>
                        <li>• Picture-in-Picture</li>
                    </ul>
                </div>
                <div>
                    <h3 class="font-semibold text-blue-400 mb-2">Raccourcis</h3>
                    <ul class="text-gray-300 space-y-1">
                        <li>• Espace: Play/Pause</li>
                        <li>• ←/→: Recherche</li>
                        <li>• ↑/↓: Volume</li>
                        <li>• F: Plein écran</li>
                        <li>• M: Muet</li>
                    </ul>
                </div>
                <div>
                    <h3 class="font-semibold text-purple-400 mb-2">Mobile</h3>
                    <ul class="text-gray-300 space-y-1">
                        <li>• Design responsive</li>
                        <li>• Gestes tactiles</li>
                        <li>• Support iOS</li>
                        <li>• Auto-rotation</li>
                        <li>• Touch optimisé</li>
                    </ul>
                </div>
            </div>
        </div>
        
        <div class="text-center">
            <p class="text-gray-400 mb-4">Essayez avec un ID vidéo YouTube :</p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/dQw4w9WgXcQ" class="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold transition-colors">
                    Mode Vidéo
                </a>
                <a href="/dQw4w9WgXcQ/audio" class="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors">
                    Mode Audio
                </a>
            </div>
        </div>
    </div>
</body>
</html>`;
}

// Generate error page
function generateErrorPage(message) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Erreur - ZTV+ Player</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-900 text-white flex items-center justify-center min-h-screen">
    <div class="text-center max-w-md mx-auto px-4">
        <div class="text-6xl mb-4">⚠️</div>
        <h1 class="text-2xl font-bold mb-4">Erreur</h1>
        <p class="text-gray-300 mb-6">${message}</p>
        <div class="space-y-2 text-sm text-gray-400 mb-6">
            <p>Format valide: <code class="bg-gray-700 px-2 py-1 rounded">/{video_id}</code></p>
            <p>Mode audio: <code class="bg-gray-700 px-2 py-1 rounded">/{video_id}/audio</code></p>
        </div>
        <a href="/" class="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors inline-block">
            Retour à l'accueil
        </a>
    </div>
</body>
</html>`;
}

// Fetch video metadata from YouTube API
async function getVideoMetadata(videoId, apiKey) {
  if (!apiKey || apiKey === 'YOUR_YOUTUBE_API_KEY') {
    // Fallback data when API key not available
    return {
      title: 'Video',
      channelTitle: 'Unknown Channel',
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    };
  }
  
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`
    );
    
    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      const snippet = data.items[0].snippet;
      return {
        title: snippet.title,
        channelTitle: snippet.channelTitle,
        thumbnail: snippet.thumbnails.maxres?.url || snippet.thumbnails.high?.url || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      };
    }
  } catch (error) {
    console.error('YouTube API error:', error);
  }
  
  // Fallback
  return {
    title: 'Video',
    channelTitle: 'Unknown Channel',
    thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  };
}

// Generate HTML for the custom YouTube player
function generatePlayerHTML(videoId, videoData, audioMode = false) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${videoData.title} - ${videoData.channelTitle}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <style>
        body { 
            margin: 0; 
            padding: 0; 
            background: #000; 
            overflow: hidden;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .player-container { 
            position: relative; 
            width: 100vw; 
            height: 100vh; 
        }
        .youtube-iframe { 
            width: 100%; 
            height: 100%; 
            border: none; 
        }
        .controls-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(transparent 70%, rgba(0,0,0,0.8) 100%);
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
        }
        .controls-overlay.show {
            opacity: 1;
            pointer-events: all;
        }
        .controls {
            position: absolute;
            bottom: 20px;
            left: 20px;
            right: 20px;
            display: flex;
            align-items: center;
            gap: 15px;
            color: white;
        }
        .control-btn {
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            padding: 8px;
            border-radius: 50%;
            cursor: pointer;
            transition: background-color 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .control-btn:hover {
            background: rgba(255,255,255,0.3);
        }
        .progress-container {
            flex: 1;
            height: 4px;
            background: rgba(255,255,255,0.3);
            border-radius: 2px;
            cursor: pointer;
            position: relative;
        }
        .progress-bar {
            height: 100%;
            background: #ff0000;
            border-radius: 2px;
            width: 0%;
            transition: width 0.1s;
        }
        .volume-container {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .volume-slider {
            width: 80px;
            height: 4px;
            background: rgba(255,255,255,0.3);
            border-radius: 2px;
            cursor: pointer;
            position: relative;
        }
        .volume-bar {
            height: 100%;
            background: white;
            border-radius: 2px;
            width: 100%;
        }
        .time-display {
            font-size: 14px;
            min-width: 100px;
            text-align: center;
        }
        
        /* Audio Mode Styles */
        .audio-mode {
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 40px;
            box-sizing: border-box;
        }
        .audio-background {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: url('${videoData.thumbnail}');
            background-size: cover;
            background-position: center;
            filter: blur(20px) brightness(0.3);
            z-index: -1;
        }
        .audio-thumbnail {
            width: 300px;
            height: 300px;
            border-radius: 20px;
            object-fit: cover;
            box-shadow: 0 20px 40px rgba(0,0,0,0.5);
            margin-bottom: 30px;
        }
        .audio-info h1 {
            color: white;
            font-size: 2rem;
            font-weight: 600;
            margin: 0 0 10px 0;
            max-width: 600px;
        }
        .audio-info p {
            color: #ccc;
            font-size: 1.2rem;
            margin: 0 0 40px 0;
        }
        .audio-controls {
            display: flex;
            align-items: center;
            gap: 20px;
            background: rgba(0,0,0,0.3);
            padding: 20px 30px;
            border-radius: 50px;
            backdrop-filter: blur(10px);
        }
        .audio-control-btn {
            background: rgba(255,255,255,0.1);
            border: none;
            color: white;
            padding: 15px;
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .audio-control-btn:hover {
            background: rgba(255,255,255,0.2);
            transform: scale(1.1);
        }
        .play-btn {
            background: #ff0000 !important;
            padding: 20px !important;
        }
        .play-btn:hover {
            background: #cc0000 !important;
        }
        
        @media (max-width: 768px) {
            .controls {
                bottom: 10px;
                left: 10px;
                right: 10px;
                gap: 10px;
            }
            .audio-thumbnail {
                width: 250px;
                height: 250px;
            }
            .audio-info h1 {
                font-size: 1.5rem;
            }
            .audio-controls {
                padding: 15px 20px;
                gap: 15px;
            }
        }
        
        .hidden-iframe {
            position: absolute;
            left: -9999px;
            width: 1px;
            height: 1px;
        }
    </style>
</head>
<body>
    <div class="player-container">
        ${audioMode ? generateAudioModeHTML(videoId, videoData) : generateVideoModeHTML(videoId, videoData)}
    </div>

    <script>
        class CustomYouTubePlayer {
            constructor(videoId, audioMode = false) {
                this.videoId = videoId;
                this.audioMode = audioMode;
                this.isPlaying = false;
                this.currentTime = 0;
                this.duration = 0;
                this.volume = 1;
                this.controlsVisible = true;
                this.hideControlsTimeout = null;
                
                this.initializePlayer();
                this.setupEventListeners();
                this.setupControlsAutoHide();
            }
            
            initializePlayer() {
                // Initialize YouTube iframe
                const iframe = document.querySelector('.youtube-iframe, .hidden-iframe');
                if (iframe) {
                    iframe.src = \`https://www.youtube-nocookie.com/embed/\${this.videoId}?enablejsapi=1&autoplay=0&controls=0&showinfo=0&rel=0&modestbranding=1\${this.audioMode ? '&iv_load_policy=3' : ''}\`;
                }
                
                // Setup play button
                const playBtn = document.querySelector('.play-toggle, .play-btn');
                if (playBtn) {
                    playBtn.addEventListener('click', () => this.togglePlay());
                }
                
                // Setup volume controls
                this.setupVolumeControls();
                
                // Setup progress bar
                this.setupProgressBar();
                
                // Setup quality button
                const qualityBtn = document.querySelector('.quality-btn');
                if (qualityBtn) {
                    qualityBtn.addEventListener('click', () => this.showQualityMenu());
                }
                
                // Setup PiP button
                const pipBtn = document.querySelector('.pip-btn');
                if (pipBtn) {
                    pipBtn.addEventListener('click', () => this.togglePictureInPicture());
                }
                
                // Setup audio mode toggle
                const audioBtn = document.querySelector('.audio-toggle');
                if (audioBtn) {
                    audioBtn.addEventListener('click', () => this.toggleAudioMode());
                }
            }
            
            setupEventListeners() {
                // Keyboard controls
                document.addEventListener('keydown', (e) => {
                    switch(e.code) {
                        case 'Space':
                            e.preventDefault();
                            this.togglePlay();
                            break;
                        case 'ArrowLeft':
                            e.preventDefault();
                            this.seek(-10);
                            break;
                        case 'ArrowRight':
                            e.preventDefault();
                            this.seek(10);
                            break;
                        case 'ArrowUp':
                            e.preventDefault();
                            this.adjustVolume(0.1);
                            break;
                        case 'ArrowDown':
                            e.preventDefault();
                            this.adjustVolume(-0.1);
                            break;
                        case 'KeyF':
                            e.preventDefault();
                            this.toggleFullscreen();
                            break;
                        case 'KeyM':
                            e.preventDefault();
                            this.toggleMute();
                            break;
                    }
                });
                
                // Touch controls for mobile
                let touchStartX = 0;
                let touchStartY = 0;
                
                document.addEventListener('touchstart', (e) => {
                    touchStartX = e.touches[0].clientX;
                    touchStartY = e.touches[0].clientY;
                    this.showControls();
                });
                
                document.addEventListener('touchmove', (e) => {
                    const touchX = e.touches[0].clientX;
                    const touchY = e.touches[0].clientY;
                    const deltaX = touchX - touchStartX;
                    const deltaY = touchY - touchStartY;
                    
                    // Horizontal swipe for seek
                    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                        const seekAmount = deltaX > 0 ? 10 : -10;
                        this.seek(seekAmount);
                        touchStartX = touchX;
                    }
                    
                    // Vertical swipe for volume
                    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50) {
                        const volumeChange = deltaY > 0 ? -0.1 : 0.1;
                        this.adjustVolume(volumeChange);
                        touchStartY = touchY;
                    }
                });
            }
            
            setupControlsAutoHide() {
                const container = document.querySelector('.player-container');
                const overlay = document.querySelector('.controls-overlay');
                
                if (!overlay) return;
                
                // Show controls on mouse move
                container.addEventListener('mousemove', () => {
                    this.showControls();
                });
                
                // Hide controls when mouse leaves or stops moving
                container.addEventListener('mouseleave', () => {
                    this.hideControls();
                });
                
                // Initial show
                this.showControls();
            }
            
            showControls() {
                const overlay = document.querySelector('.controls-overlay');
                if (overlay) {
                    overlay.classList.add('show');
                    document.body.style.cursor = 'default';
                }
                
                clearTimeout(this.hideControlsTimeout);
                this.hideControlsTimeout = setTimeout(() => {
                    this.hideControls();
                }, 3000);
            }
            
            hideControls() {
                const overlay = document.querySelector('.controls-overlay');
                if (overlay && this.isPlaying) {
                    overlay.classList.remove('show');
                    document.body.style.cursor = 'none';
                }
                clearTimeout(this.hideControlsTimeout);
            }
            
            togglePlay() {
                this.isPlaying = !this.isPlaying;
                const playBtn = document.querySelector('.play-toggle, .play-btn');
                const icon = playBtn?.querySelector('.material-icons');
                
                if (icon) {
                    icon.textContent = this.isPlaying ? 'pause' : 'play_arrow';
                }
                
                // In a real implementation, you would control the YouTube iframe here
                // For now, we'll simulate the play/pause state
                if (this.isPlaying) {
                    this.startProgressSimulation();
                } else {
                    this.stopProgressSimulation();
                }
                
                this.showControls();
            }
            
            startProgressSimulation() {
                this.progressInterval = setInterval(() => {
                    if (this.isPlaying && this.currentTime < this.duration) {
                        this.currentTime += 1;
                        this.updateProgressBar();
                        this.updateTimeDisplay();
                    }
                }, 1000);
            }
            
            stopProgressSimulation() {
                clearInterval(this.progressInterval);
            }
            
            setupProgressBar() {
                const progressContainer = document.querySelector('.progress-container');
                if (!progressContainer) return;
                
                let isDragging = false;
                
                // Click to seek
                progressContainer.addEventListener('click', (e) => {
                    if (!isDragging) {
                        const rect = progressContainer.getBoundingClientRect();
                        const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                        this.currentTime = percentage * this.duration;
                        this.updateProgressBar();
                        this.updateTimeDisplay();
                        this.showControls();
                    }
                });
                
                // Mouse drag support
                progressContainer.addEventListener('mousedown', (e) => {
                    isDragging = true;
                    document.addEventListener('mousemove', mouseMoveHandler);
                    document.addEventListener('mouseup', mouseUpHandler);
                    e.preventDefault();
                });
                
                const mouseMoveHandler = (e) => {
                    if (isDragging) {
                        const rect = progressContainer.getBoundingClientRect();
                        const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                        this.currentTime = percentage * this.duration;
                        this.updateProgressBar();
                        this.updateTimeDisplay();
                    }
                };
                
                const mouseUpHandler = () => {
                    isDragging = false;
                    document.removeEventListener('mousemove', mouseMoveHandler);
                    document.removeEventListener('mouseup', mouseUpHandler);
                };
                
                // Touch support for mobile
                progressContainer.addEventListener('touchstart', (e) => {
                    isDragging = true;
                    e.preventDefault();
                });
                
                progressContainer.addEventListener('touchmove', (e) => {
                    if (isDragging) {
                        const rect = progressContainer.getBoundingClientRect();
                        const touch = e.touches[0];
                        const percentage = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width));
                        this.currentTime = percentage * this.duration;
                        this.updateProgressBar();
                        this.updateTimeDisplay();
                        e.preventDefault();
                    }
                });
                
                progressContainer.addEventListener('touchend', () => {
                    isDragging = false;
                });
            }
            
            updateProgressBar() {
                const progressBar = document.querySelector('.progress-bar');
                if (progressBar && this.duration > 0) {
                    const percentage = (this.currentTime / this.duration) * 100;
                    progressBar.style.width = percentage + '%';
                }
            }
            
            updateTimeDisplay() {
                const timeDisplay = document.querySelector('.time-display');
                if (timeDisplay) {
                    const current = this.formatTime(this.currentTime);
                    const total = this.formatTime(this.duration);
                    timeDisplay.textContent = \`\${current} / \${total}\`;
                }
            }
            
            formatTime(seconds) {
                const minutes = Math.floor(seconds / 60);
                const remainingSeconds = Math.floor(seconds % 60);
                return \`\${minutes}:\${remainingSeconds.toString().padStart(2, '0')}\`;
            }
            
            setupVolumeControls() {
                const volumeSlider = document.querySelector('.volume-slider');
                const muteBtn = document.querySelector('.mute-toggle');
                
                if (volumeSlider) {
                    volumeSlider.addEventListener('click', (e) => {
                        const rect = volumeSlider.getBoundingClientRect();
                        const percentage = (e.clientX - rect.left) / rect.width;
                        this.volume = Math.max(0, Math.min(1, percentage));
                        this.updateVolumeDisplay();
                    });
                }
                
                if (muteBtn) {
                    muteBtn.addEventListener('click', () => this.toggleMute());
                }
            }
            
            updateVolumeDisplay() {
                const volumeBar = document.querySelector('.volume-bar');
                const muteBtn = document.querySelector('.mute-toggle');
                const icon = muteBtn?.querySelector('.material-icons');
                
                if (volumeBar) {
                    volumeBar.style.width = (this.volume * 100) + '%';
                }
                
                if (icon) {
                    if (this.volume === 0) {
                        icon.textContent = 'volume_off';
                    } else if (this.volume < 0.5) {
                        icon.textContent = 'volume_down';
                    } else {
                        icon.textContent = 'volume_up';
                    }
                }
            }
            
            toggleMute() {
                if (this.volume > 0) {
                    this.previousVolume = this.volume;
                    this.volume = 0;
                } else {
                    this.volume = this.previousVolume || 0.5;
                }
                this.updateVolumeDisplay();
            }
            
            adjustVolume(delta) {
                this.volume = Math.max(0, Math.min(1, this.volume + delta));
                this.updateVolumeDisplay();
            }
            
            seek(seconds) {
                this.currentTime = Math.max(0, Math.min(this.duration, this.currentTime + seconds));
                this.updateProgressBar();
                this.updateTimeDisplay();
            }
            
            showQualityMenu() {
                // In a real implementation, this would show a quality selection menu
                alert('Qualité vidéo: Auto (720p)\\nFonctionnalité en développement');
            }
            
            togglePictureInPicture() {
                if ('pictureInPictureEnabled' in document) {
                    const video = document.querySelector('video');
                    if (video) {
                        if (document.pictureInPictureElement) {
                            document.exitPictureInPicture();
                        } else {
                            video.requestPictureInPicture();
                        }
                    }
                } else {
                    alert('Picture-in-Picture non supporté par ce navigateur');
                }
            }
            
            toggleAudioMode() {
                const currentUrl = window.location.href;
                if (this.audioMode) {
                    // Switch to video mode
                    window.location.href = currentUrl.replace('/audio', '');
                } else {
                    // Switch to audio mode
                    window.location.href = currentUrl + '/audio';
                }
            }
            
            toggleFullscreen() {
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen();
                } else {
                    document.exitFullscreen();
                }
            }
        }
        
        // Initialize player when page loads
        window.addEventListener('DOMContentLoaded', () => {
            const audioMode = ${audioMode};
            const player = new CustomYouTubePlayer('${videoId}', audioMode);
            
            // Simulate video duration (in a real app, this would come from YouTube API)
            player.duration = 300; // 5 minutes
            player.updateTimeDisplay();
        });
    </script>
</body>
</html>`;
}

function generateVideoModeHTML(videoId, videoData) {
  return `
    <iframe class="youtube-iframe" 
            src="https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1&autoplay=0&controls=0&showinfo=0&rel=0&modestbranding=1"
            allowfullscreen>
    </iframe>
    
    <div class="controls-overlay">
        <div class="controls">
            <button class="control-btn play-toggle">
                <span class="material-icons">play_arrow</span>
            </button>
            
            <button class="control-btn mute-toggle">
                <span class="material-icons">volume_up</span>
            </button>
            
            <div class="volume-container">
                <div class="volume-slider">
                    <div class="volume-bar"></div>
                </div>
            </div>
            
            <div class="time-display">0:00 / 0:00</div>
            
            <div class="progress-container">
                <div class="progress-bar"></div>
            </div>
            
            <button class="control-btn audio-toggle" title="Mode audio">
                <span class="material-icons">headphones</span>
            </button>
            
            <button class="control-btn quality-btn" title="Qualité">
                <span class="material-icons">settings</span>
            </button>
            
            <button class="control-btn pip-btn" title="Picture-in-Picture">
                <span class="material-icons">picture_in_picture_alt</span>
            </button>
            
            <button class="control-btn fullscreen-btn" title="Plein écran">
                <span class="material-icons">fullscreen</span>
            </button>
        </div>
    </div>`;
}

function generateAudioModeHTML(videoId, videoData) {
  return `
    <div class="audio-mode">
        <div class="audio-background"></div>
        
        <iframe class="hidden-iframe" 
                src="https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1&autoplay=0&controls=0&showinfo=0&rel=0&modestbranding=1"
                allowfullscreen>
        </iframe>
        
        <img src="${videoData.thumbnail}" 
             alt="Video thumbnail" 
             class="audio-thumbnail"
             onerror="this.src='https://img.youtube.com/vi/${videoId}/hqdefault.jpg'">
        
        <div class="audio-info">
            <h1>${videoData.title}</h1>
            <p>${videoData.channelTitle}</p>
        </div>
        
        <div class="audio-controls">
            <button class="audio-control-btn">
                <span class="material-icons">skip_previous</span>
            </button>
            
            <button class="audio-control-btn play-btn play-toggle">
                <span class="material-icons">play_arrow</span>
            </button>
            
            <button class="audio-control-btn">
                <span class="material-icons">skip_next</span>
            </button>
            
            <button class="audio-control-btn mute-toggle">
                <span class="material-icons">volume_up</span>
            </button>
            
            <div class="volume-container">
                <div class="volume-slider">
                    <div class="volume-bar"></div>
                </div>
            </div>
            
            <button class="audio-control-btn audio-toggle" title="Mode vidéo">
                <span class="material-icons">videocam</span>
            </button>
        </div>
        
        <div class="time-display text-white mt-4">0:00 / 0:00</div>
        
        <div class="progress-container mt-4 max-w-md">
            <div class="progress-bar"></div>
        </div>
    </div>`;
}