import { useState, useEffect } from 'react';
import { Camera, ArrowLeft, Download } from 'lucide-react';

type PhotoBoothProps = {
  navigateTo: (route: string) => void;
  appState: any;
  setAppState: React.Dispatch<React.SetStateAction<any>>;
  refs: {
    videoRef: React.RefObject<HTMLVideoElement | null>;
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
  };
};

type PhotoStripType = {
  id: number;
  photos: string[];
  timestamp: string;
  date: string;
};

export const PhotoBoothPage = ({ navigateTo, appState, setAppState, refs }: PhotoBoothProps) => {
  const [stage, setStage] = useState<'loading' | 'countdown' | 'capturing' | 'complete'>('loading');
  const [countdown, setCountdown] = useState(0);
  const [photoStrip, setPhotoStrip] = useState<PhotoStripType | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [cameraReady, setCameraReady] = useState(false);
  const [showFlash, setShowFlash] = useState(false);

  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
          audio: false
        });
        setAppState((prev: typeof appState) => ({ ...prev, myStream: stream }));
      } catch (err) {
        console.error('Error accessing camera:', err);
        alert('Unable to access camera. Please allow camera permissions.');
      }
    };

    initCamera();

    return () => {
      if (appState.myStream) {
        appState.myStream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (appState.myStream && refs.videoRef.current) {
      const video = refs.videoRef.current;

      console.log('Setting video stream', appState.myStream);
      video.srcObject = appState.myStream;

      // Force video to play
      video.play().catch(err => console.error('Error playing video:', err));

      // Wait for video to be ready before starting
      const handleCanPlay = () => {
        console.log('Video can play, dimensions:', video.videoWidth, video.videoHeight);
        setCameraReady(true);
      };

      const handleLoadedMetadata = () => {
        console.log('Video metadata loaded');
      };

      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('loadedmetadata', handleLoadedMetadata);

      return () => {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, [appState.myStream, refs.videoRef, stage]);

  // Auto-start countdown when camera is ready
  useEffect(() => {
    if (cameraReady && stage === 'loading') {
      setTimeout(() => {
        setStage('countdown');
        setCountdown(3);
      }, 1000);
    }
  }, [cameraReady, stage]);

  const stopCamera = () => {
    if (appState.myStream) {
      appState.myStream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      setAppState((prev: typeof appState) => ({ ...prev, myStream: null }));
    }
  };

  const playShutterSound = () => {
    // Create a more realistic camera shutter sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    // Create noise buffer for the mechanical sound
    const bufferSize = audioContext.sampleRate * 0.05; // 50ms
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    // Generate white noise
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = audioContext.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = audioContext.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 2000;
    noiseFilter.Q.value = 1;

    const noiseGain = audioContext.createGain();
    noiseGain.gain.setValueAtTime(0.3, audioContext.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(audioContext.destination);

    // Add a click at the beginning
    const oscillator = audioContext.createOscillator();
    const clickGain = audioContext.createGain();

    oscillator.frequency.value = 1000;
    oscillator.type = 'sine';

    clickGain.gain.setValueAtTime(0.5, audioContext.currentTime);
    clickGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.02);

    oscillator.connect(clickGain);
    clickGain.connect(audioContext.destination);

    noise.start(audioContext.currentTime);
    noise.stop(audioContext.currentTime + 0.05);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.02);
  };

  const takePhoto = () => {
    if (!refs.videoRef.current || !refs.canvasRef.current) {
      console.error('Video or canvas ref not available');
      return null;
    }

    const video = refs.videoRef.current;
    const canvas = refs.canvasRef.current;

    // Check if video is actually playing
    if (video.readyState !== video.HAVE_ENOUGH_DATA) {
      console.error('Video not ready');
      return null;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Canvas context not available');
      return null;
    }

    // Calculate square crop dimensions (center crop)
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    const size = Math.min(videoWidth, videoHeight);

    // Calculate crop position (center)
    const sx = (videoWidth - size) / 2;
    const sy = (videoHeight - size) / 2;

    // Set canvas to square
    canvas.width = size;
    canvas.height = size;

    // Flash effect
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 150);

    // Shutter sound
    playShutterSound();

    // Draw cropped square image
    ctx.drawImage(video, sx, sy, size, size, 0, 0, size, size);
    return canvas.toDataURL('image/jpeg', 0.9);
  };


  useEffect(() => {
    if (stage === 'countdown' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (stage === 'countdown' && countdown === 0) {
      setStage('capturing');
      capturePhotoSequence();
    }
  }, [stage, countdown]);

  const capturePhotoSequence = async () => {
    const photos: string[] = [];

    for (let i = 0; i < 4; i++) {
      setCurrentPhotoIndex(i + 1);
      await new Promise(resolve => setTimeout(resolve, 500));

      const photoData = takePhoto();
      if (photoData) {
        photos.push(photoData);
      }

      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    const strip: PhotoStripType = {
      id: Date.now(),
      photos: photos,
      timestamp: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString()
    };

    setPhotoStrip(strip);
    setAppState((prev: typeof appState) => ({
      ...prev,
      photoStrips: [...prev.photoStrips, strip]
    }));

    setStage('complete');
  };

  const downloadStrip = () => {
    if (!photoStrip || !refs.canvasRef.current) return;

    const canvas = refs.canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const stripWidth = 400;
    const stripHeight = 1600;
    const photoHeight = stripHeight / 4;

    canvas.width = stripWidth;
    canvas.height = stripHeight;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, stripWidth, stripHeight);

    photoStrip.photos.forEach((photoUrl, index) => {
      const img = new window.Image();
      img.src = photoUrl;
      img.onload = () => {
        ctx.drawImage(img, 0, index * photoHeight, stripWidth, photoHeight);

        if (index === photoStrip.photos.length - 1) {
          const link = document.createElement('a');
          link.download = `photo-strip-${photoStrip.id}.jpg`;
          link.href = canvas.toDataURL('image/jpeg', 0.95);
          link.click();
        }
      };
    });
  };

  const reset = () => {
    setStage('countdown');
    setPhotoStrip(null);
    setCurrentPhotoIndex(0);
    setCountdown(3);
  };

  return (
    <div className="h-full w-full p-4 bg-white overflow-y-auto">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => {
              stopCamera();
              navigateTo('home');
            }}
            className="text-black hover:text-gray-600 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-6 h-6" />
            <span>Back</span>
          </button>

          <h1 className="text-2xl font-bold text-black" style={{ fontFamily: 'monospace' }}>
            PHOTO BOOTH
          </h1>

          <button
            onClick={() => navigateTo('gallery')}
            className="bg-black text-white hover:bg-gray-800 px-4 py-2 rounded-lg transition-colors text-sm"
          >
            Gallery ({appState.photoStrips?.length || 0})
          </button>
        </div>

        {stage === 'loading' && (
          <div className="space-y-6">
            {/* Camera Loading */}
            <div className="bg-white border-8 border-gray-800 rounded-3xl p-6">
              <div className="bg-black rounded-2xl p-4 relative">
                <div className="aspect-square relative overflow-hidden rounded-lg">
                  <video
                    ref={refs.videoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      minWidth: '100%',
                      minHeight: '100%',
                      width: 'auto',
                      height: 'auto',
                      objectFit: 'cover'
                    }}
                    className="bg-black"
                  />
                  {/* Flash overlay for camera only */}
                  {showFlash && (
                    <div className="absolute inset-0 bg-white z-10 pointer-events-none" style={{ animation: 'flash 0.15s ease-out' }} />
                  )}
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-gray-800 text-2xl font-bold animate-pulse" style={{ fontFamily: 'monospace' }}>
                  LOADING CAMERA...
                </p>
                {appState.myStream && (
                  <p className="text-gray-600 text-sm mt-2">Stream active: {appState.myStream.active ? 'Yes' : 'No'}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {stage === 'countdown' && (
          <div className="bg-white border-8 border-gray-800 rounded-3xl p-6">
            <div className="bg-black rounded-2xl p-4 relative">
              <div className="aspect-square relative overflow-hidden rounded-lg">
                <video
                  ref={refs.videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    minWidth: '100%',
                    minHeight: '100%',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'cover'
                  }}
                  className="bg-black"
                />
                {/* Flash overlay for camera only */}
                {showFlash && (
                  <div className="absolute inset-0 bg-white z-10 pointer-events-none" style={{ animation: 'flash 0.15s ease-out' }} />
                )}

                <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-5">
                  <div className="text-white text-9xl font-bold animate-pulse" style={{ fontFamily: 'monospace' }}>
                    {countdown}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-gray-800 text-xl font-bold" style={{ fontFamily: 'monospace' }}>
                GET READY!
              </p>
            </div>
          </div>
        )}

        {stage === 'capturing' && (
          <div className="bg-white border-8 border-gray-800 rounded-3xl p-6">
            <div className="bg-black rounded-2xl p-4 relative">
              <div className="aspect-square relative overflow-hidden rounded-lg">
                <video
                  ref={refs.videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    minWidth: '100%',
                    minHeight: '100%',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'cover'
                  }}
                  className="bg-black"
                />
                {/* Flash overlay for camera only */}
                {showFlash && (
                  <div className="absolute inset-0 bg-white z-10 pointer-events-none" style={{ animation: 'flash 0.15s ease-out' }} />
                )}

                <div className="absolute top-8 left-0 right-0 flex justify-center z-5">
                  <div className="bg-black text-white px-6 py-3 rounded-full font-bold text-xl border-4 border-white" style={{ fontFamily: 'monospace' }}>
                    PHOTO {currentPhotoIndex} OF 4
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((num) => (
                <div
                  key={num}
                  className={`h-3 rounded-full ${
                    num < currentPhotoIndex
                      ? 'bg-gray-800'
                      : num === currentPhotoIndex
                      ? 'bg-gray-600 animate-pulse'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {stage === 'complete' && photoStrip && (
          <div className="space-y-6">
            <div className="bg-white border-8 border-gray-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-black mb-4 text-center" style={{ fontFamily: 'monospace' }}>
                YOUR PHOTO STRIP!
              </h2>

              <div className="max-w-md mx-auto bg-white rounded-lg p-4 shadow-2xl border-4 border-gray-800 max-h-[600px] overflow-y-auto">
                <div className="space-y-2">
                  {photoStrip.photos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      className="w-full rounded border-2 border-gray-300"
                    />
                  ))}
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={downloadStrip}
                  className="bg-black hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-lg transition-colors flex items-center justify-center gap-2 text-lg border-2 border-gray-800"
                >
                  <Download className="w-5 h-5" />
                  Download Strip
                </button>

                <button
                  onClick={reset}
                  className="bg-white hover:bg-gray-200 text-black font-bold py-3 px-8 rounded-lg transition-colors flex items-center justify-center gap-2 text-lg border-2 border-gray-800"
                >
                  <Camera className="w-5 h-5" />
                  Take Another
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
