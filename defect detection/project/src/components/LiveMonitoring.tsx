import { useState, useEffect, useRef } from 'react';
import { Camera, Play, Pause, Download, Bell, BellOff, AlertTriangle, CheckCircle, Settings, RotateCcw } from 'lucide-react';

interface Detection {
  id: number;
  time: string;
  type: string;
  status: 'defect' | 'normal';
  confidence: number;
  severity?: 'low' | 'medium' | 'high';
}

export default function LiveMonitoring() {
  const [isActive, setIsActive] = useState(false);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [liveDetections, setLiveDetections] = useState<Detection[]>([]);
  const [stats, setStats] = useState({
    itemsScanned: 0,
    defectsFound: 0,
    passRate: 100
  });
  const [fps, setFps] = useState(30);
  const [processingTime, setProcessingTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Defect types from the model
  const defectTypes = ['crazing', 'inclusion', 'patches', 'pitted_surface', 'rolled-in_scale', 'scratches'];

  // Simulate real-time detection
  useEffect(() => {
    if (isActive && cameraStream) {
      intervalRef.current = setInterval(() => {
        // Simulate detection every 2-5 seconds
        const shouldDetect = Math.random() < 0.3; // 30% chance of detection
        
        if (shouldDetect) {
          const isDefect = Math.random() < 0.2; // 20% chance of defect
          const detection: Detection = {
            id: Date.now(),
            time: new Date().toLocaleTimeString(),
            type: isDefect ? defectTypes[Math.floor(Math.random() * defectTypes.length)] : 'Normal',
            status: isDefect ? 'defect' : 'normal',
            confidence: isDefect ? Math.random() * 30 + 70 : Math.random() * 10 + 90, // 70-100% for defects, 90-100% for normal
            severity: isDefect ? (Math.random() < 0.3 ? 'high' : Math.random() < 0.6 ? 'medium' : 'low') : undefined
          };

          setLiveDetections(prev => [detection, ...prev.slice(0, 19)]); // Keep last 20 detections
          
          // Update stats
          setStats(prev => {
            const newItemsScanned = prev.itemsScanned + 1;
            const newDefectsFound = isDefect ? prev.defectsFound + 1 : prev.defectsFound;
            const newPassRate = ((newItemsScanned - newDefectsFound) / newItemsScanned) * 100;
            
            return {
              itemsScanned: newItemsScanned,
              defectsFound: newDefectsFound,
              passRate: Math.round(newPassRate * 10) / 10
            };
          });

          // Simulate processing time
          setProcessingTime(Math.random() * 5 + 1); // 1-6ms
        }
      }, Math.random() * 3000 + 2000); // Random interval between 2-5 seconds
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, cameraStream]);

  // Start camera stream
  const startCamera = async () => {
    try {
      console.log('Requesting camera access...');
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported in this browser');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 }, 
          height: { ideal: 720 },
          facingMode: 'environment' // Use back camera if available
        } 
      });
      
      console.log('Camera stream obtained:', stream);
      setCameraStream(stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        console.log('Video element updated with stream');
        
        // Wait for video to load
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded');
          if (videoRef.current) {
            videoRef.current.play().catch(console.error);
          }
        };
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert(`Camera access failed: ${error.message}. Please ensure you're using HTTPS and have granted camera permissions.`);
      // Fallback to demo mode
      setCameraStream(null);
    }
  };

  // Stop camera stream
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  // Handle start/stop
  const handleToggle = async () => {
    if (!isActive) {
      await startCamera();
      setIsActive(true);
    } else {
      stopCamera();
      setIsActive(false);
    }
  };

  // Take snapshot
  const takeSnapshot = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx && videoRef.current) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        ctx.drawImage(videoRef.current, 0, 0);
        
        // Download the image
        const link = document.createElement('a');
        link.download = `snapshot-${new Date().toISOString()}.png`;
        link.href = canvas.toDataURL();
        link.click();
      }
    }
  };

  // Reset stats
  const resetStats = () => {
    setStats({ itemsScanned: 0, defectsFound: 0, passRate: 100 });
    setLiveDetections([]);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [cameraStream]);

  return (
    <div className="min-h-screen gradient-bg pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 animate-slide-up">
          <h1 className="text-4xl font-bold text-white mb-2 font-poppins neon-text">
            Live Monitoring
          </h1>
          <p className="text-steel-grey">Real-time defect detection from camera feed</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-effect rounded-xl p-6 border-2 border-neon-blue/30 animate-slide-up">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Camera className="h-6 w-6 text-neon-blue" />
                  <h2 className="text-2xl font-semibold text-white font-poppins">
                    Camera Feed
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 ${
                      isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isActive ? 'bg-green-400 animate-pulse' : 'bg-red-400'
                      }`}
                    ></span>
                    {isActive ? 'LIVE' : 'STOPPED'}
                  </span>
                </div>
              </div>

              <div className="relative aspect-video bg-almost-black rounded-xl overflow-hidden border-2 border-neon-blue/50 neon-glow">
                {cameraStream ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                    style={{ transform: 'scaleX(-1)' }} // Mirror the video for better UX
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="h-24 w-24 text-neon-blue/30 mx-auto mb-4" />
                      <p className="text-steel-grey">
                        {isActive ? 'Starting camera...' : 'Click Start to begin monitoring'}
                      </p>
                      {!isActive && (
                        <div className="text-steel-grey text-sm mt-2 space-y-1">
                          <p>Camera access required for live monitoring</p>
                          <p className="text-xs opacity-75">Note: HTTPS required for camera access</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {isActive && cameraStream && (
                  <>
                    {/* Detection overlays */}
                    {liveDetections.slice(0, 2).map((detection, index) => (
                      detection.status === 'defect' && (
                        <svg key={detection.id} className="absolute inset-0 w-full h-full pointer-events-none">
                          <rect
                            x={`${15 + index * 20}%`}
                            y={`${20 + index * 15}%`}
                            width="25%"
                            height="30%"
                            fill="none"
                            stroke="#ef4444"
                            strokeWidth="2"
                          >
                            <animate
                              attributeName="stroke-opacity"
                              values="1;0.5;1"
                              dur="1.5s"
                              repeatCount="indefinite"
                            />
                          </rect>
                          <text 
                            x={`${16 + index * 20}%`} 
                            y={`${22 + index * 15}%`} 
                            fill="#ef4444" 
                            fontSize="12" 
                            fontWeight="bold"
                            className="bg-black/60 px-1 rounded"
                          >
                            {detection.type.toUpperCase()} {detection.confidence.toFixed(1)}%
                          </text>
                        </svg>
                      )
                    ))}

                    <div className="absolute top-4 left-4 space-y-2">
                      <div className="px-3 py-2 bg-black/60 rounded-lg text-neon-blue text-sm font-mono">
                        FPS: {fps} | Resolution: {videoRef.current?.videoWidth || 1280}x{videoRef.current?.videoHeight || 720}
                      </div>
                      <div className="px-3 py-2 bg-black/60 rounded-lg text-neon-blue text-sm font-mono">
                        Processing: {processingTime.toFixed(1)}ms | Items: {stats.itemsScanned}
                      </div>
                    </div>
                  </>
                )}

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-2">
                  <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-neon-blue animate-pulse-glow" 
                      style={{ width: isActive ? '100%' : '0%' }}
                    ></div>
                  </div>
                  <span className="text-neon-blue text-xs font-semibold">
                    {isActive ? 'Recording' : 'Stopped'}
                  </span>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleToggle}
                  className="flex-1 px-6 py-3 bg-neon-blue text-navy-dark rounded-lg font-semibold hover:bg-neon-blue/90 transition-all duration-300 neon-glow flex items-center justify-center gap-2"
                >
                  {isActive ? (
                    <>
                      <Pause className="h-5 w-5" />
                      Stop Monitoring
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5" />
                      Start Monitoring
                    </>
                  )}
                </button>
                <button 
                  onClick={takeSnapshot}
                  disabled={!isActive || !cameraStream}
                  className="px-6 py-3 glass-effect text-neon-blue rounded-lg font-semibold hover:bg-white/10 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="h-5 w-5" />
                  Snapshot
                </button>
                <button
                  onClick={() => setAlertsEnabled(!alertsEnabled)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                    alertsEnabled
                      ? 'bg-green-500/20 text-green-400 border-2 border-green-500/50'
                      : 'glass-effect text-steel-grey border-2 border-white/10'
                  }`}
                >
                  {alertsEnabled ? <Bell className="h-5 w-5" /> : <BellOff className="h-5 w-5" />}
                </button>
                <button
                  onClick={resetStats}
                  className="px-6 py-3 glass-effect text-steel-grey rounded-lg font-semibold hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
                >
                  <RotateCcw className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="glass-effect rounded-xl p-6 border-2 border-neon-blue/30 animate-slide-up">
              <h3 className="text-xl font-semibold text-white mb-4 font-poppins">
                Live Statistics
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="glass-effect rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-neon-blue neon-text">{stats.itemsScanned}</div>
                  <div className="text-steel-grey text-sm mt-1">Items Scanned</div>
                </div>
                <div className="glass-effect rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-red-400">{stats.defectsFound}</div>
                  <div className="text-steel-grey text-sm mt-1">Defects Found</div>
                </div>
                <div className="glass-effect rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-green-400">{stats.passRate}%</div>
                  <div className="text-steel-grey text-sm mt-1">Pass Rate</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex justify-between text-sm text-steel-grey">
                  <span>Detection Rate: {liveDetections.length > 0 ? 'Active' : 'Idle'}</span>
                  <span>Last Update: {new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-effect rounded-xl p-6 border-2 border-neon-blue/30 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white font-poppins">Detection Log</h3>
              <div className="px-2 py-1 bg-neon-blue/20 rounded text-neon-blue text-xs font-semibold">
                LIVE
              </div>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {liveDetections.length === 0 ? (
                <div className="text-center py-8 text-steel-grey">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No detections yet</p>
                  <p className="text-sm mt-1">Start monitoring to see live detections</p>
                </div>
              ) : (
                liveDetections.map((detection, index) => (
                  <div
                    key={detection.id}
                    className="glass-effect rounded-lg p-4 border-l-4 hover:bg-white/5 transition-all duration-300 animate-slide-up"
                    style={{
                      borderLeftColor: detection.status === 'defect' ? '#ef4444' : '#10b981',
                      animationDelay: `${index * 0.1}s`,
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {detection.status === 'defect' ? (
                          <AlertTriangle className="h-5 w-5 text-red-400" />
                        ) : (
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        )}
                        <span
                          className={`font-semibold ${
                            detection.status === 'defect' ? 'text-red-400' : 'text-green-400'
                          }`}
                        >
                          {detection.type}
                        </span>
                        {detection.severity && (
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              detection.severity === 'high'
                                ? 'bg-red-500/20 text-red-400'
                                : detection.severity === 'medium'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-green-500/20 text-green-400'
                            }`}
                          >
                            {detection.severity}
                          </span>
                        )}
                      </div>
                      <span className="text-steel-grey text-xs">{detection.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1">
                        <div className="flex-1 bg-white/10 rounded-full h-1.5 max-w-[80px]">
                          <div
                            className={`h-1.5 rounded-full ${
                              detection.status === 'defect' ? 'bg-red-400' : 'bg-green-400'
                            }`}
                            style={{ width: `${detection.confidence}%` }}
                          ></div>
                        </div>
                        <span
                          className={`text-xs font-semibold ${
                            detection.status === 'defect' ? 'text-red-400' : 'text-green-400'
                          }`}
                        >
                          {detection.confidence.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
