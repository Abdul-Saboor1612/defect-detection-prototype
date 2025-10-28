import { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Video, X, ZoomIn, AlertCircle, CheckCircle, TestTube, Grid3X3 } from 'lucide-react';
import { defectDetectionAPI, DetectionResult } from '../services/api';
import { testImages, getTestImageUrl, TestImage } from '../services/testImages';

export default function DetectionPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<DetectionResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showTestImages, setShowTestImages] = useState(false);
  const [selectedDefectType, setSelectedDefectType] = useState<string>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const response = await defectDetectionAPI.predictDefects(selectedFile);
      setResults(response.detections);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during analysis');
      setResults([]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreview(null);
    setResults([]);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTestImageSelect = async (testImage: TestImage) => {
    try {
      // Fetch the test image from the backend
      const response = await fetch(getTestImageUrl(testImage.filename));
      if (!response.ok) {
        throw new Error('Failed to load test image');
      }
      
      const blob = await response.blob();
      const file = new File([blob], testImage.filename, { type: 'image/jpeg' });
      
      setSelectedFile(file);
      setPreview(getTestImageUrl(testImage.filename));
      setResults([]);
      setError(null);
      setShowTestImages(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load test image');
    }
  };

  const filteredTestImages = selectedDefectType === 'all' 
    ? testImages 
    : testImages.filter(img => img.defectType === selectedDefectType);

  const defectTypes = ['all', ...Array.from(new Set(testImages.map(img => img.defectType)))];

  return (
    <div className="min-h-screen gradient-bg pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 animate-slide-up">
          <h1 className="text-4xl font-bold text-white mb-2 font-poppins neon-text">
            Defect Detection
          </h1>
          <p className="text-steel-grey">Upload images or videos for AI-powered inspection</p>
        </div>

        {/* Test Images Section */}
        <div className="mb-8 animate-slide-up">
          <div className="glass-effect rounded-xl p-6 border-2 border-neon-blue/30">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <TestTube className="h-6 w-6 text-neon-blue" />
                <h2 className="text-2xl font-semibold text-white font-poppins">
                  Expert Test Images
                </h2>
              </div>
              <button
                onClick={() => setShowTestImages(!showTestImages)}
                className="px-4 py-2 glass-effect text-neon-blue rounded-lg font-semibold hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
              >
                <Grid3X3 className="h-5 w-5" />
                {showTestImages ? 'Hide Gallery' : 'Show Gallery'}
              </button>
            </div>
            
            <p className="text-steel-grey mb-4">
              Pre-loaded test images from the NEU-DET dataset for evaluation. 
              Select any image, download the image and upload it for analysis..
            </p>

            {showTestImages && (
              <div className="space-y-4">
                {/* Defect Type Filter */}
                <div className="flex flex-wrap gap-2">
                  {defectTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedDefectType(type)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                        selectedDefectType === type
                          ? 'bg-neon-blue text-navy-dark'
                          : 'glass-effect text-steel-grey hover:bg-white/10'
                      }`}
                    >
                      {type === 'all' ? 'All Types' : type.replace('_', ' ').toUpperCase()}
                    </button>
                  ))}
                </div>

                {/* Test Images Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 max-h-96 overflow-y-auto">
                  {filteredTestImages.map((testImage) => (
                    <div
                      key={testImage.id}
                      onClick={() => handleTestImageSelect(testImage)}
                      className="group cursor-pointer glass-effect rounded-lg p-3 border-2 border-white/10 hover:border-neon-blue/50 transition-all duration-300 hover:bg-white/5"
                    >
                      <div className="aspect-square rounded-lg overflow-hidden mb-2 bg-almost-black">
                        <img
                          src={getTestImageUrl(testImage.filename)}
                          alt={testImage.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.parentElement!.innerHTML = '<div class="flex items-center justify-center h-full text-steel-grey text-xs">Loading...</div>';
                          }}
                        />
                      </div>
                      <div className="text-center">
                        <p className="text-white text-xs font-semibold truncate">
                          {testImage.name}
                        </p>
                        <p className="text-steel-grey text-xs truncate">
                          {testImage.defectType.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="glass-effect rounded-xl p-6 border-2 border-neon-blue/30 animate-slide-up">
            <h2 className="text-2xl font-semibold text-white mb-6 font-poppins">Upload Media</h2>

            {!preview ? (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-neon-blue/50 rounded-xl p-12 text-center cursor-pointer hover:border-neon-blue hover:bg-white/5 transition-all duration-300 animate-neon-pulse"
              >
                <Upload className="h-16 w-16 text-neon-blue mx-auto mb-4" />
                <p className="text-white font-semibold mb-2">
                  Drop files here or click to browse
                </p>
                <p className="text-steel-grey text-sm mb-4">
                  Supports JPG, PNG, MP4 (Max 50MB)
                </p>
                <div className="flex justify-center gap-4 text-neon-blue">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    <span className="text-sm">Images</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    <span className="text-sm">Videos</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-xl overflow-hidden border-2 border-neon-blue/50 neon-glow">
                  <img src={preview} alt="Preview" className="w-full h-auto" />
                  <button
                    onClick={clearFile}
                    className="absolute top-4 right-4 p-2 bg-red-500/80 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <X className="h-5 w-5 text-white" />
                  </button>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="flex-1 px-6 py-3 bg-neon-blue text-navy-dark rounded-lg font-semibold hover:bg-neon-blue/90 transition-all duration-300 neon-glow disabled:opacity-50"
                  >
                    {isAnalyzing ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-navy-dark border-t-transparent rounded-full animate-spin"></div>
                        Analyzing...
                      </span>
                    ) : (
                      'Analyze Defects'
                    )}
                  </button>
                  <button 
                    onClick={() => setShowTestImages(true)}
                    className="px-6 py-3 glass-effect text-neon-blue rounded-lg font-semibold hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
                  >
                    <TestTube className="h-5 w-5" />
                    Test Images
                  </button>
                  <button className="px-6 py-3 glass-effect text-neon-blue rounded-lg font-semibold hover:bg-white/10 transition-all duration-300 flex items-center gap-2">
                    <ZoomIn className="h-5 w-5" />
                    Zoom
                  </button>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          <div className="glass-effect rounded-xl p-6 border-2 border-neon-blue/30 animate-slide-up">
            <h2 className="text-2xl font-semibold text-white mb-6 font-poppins">
              AI Analysis Result
            </h2>

            {error ? (
              <div className="flex items-center justify-center h-64 text-red-400">
                <div className="text-center">
                  <AlertCircle className="h-16 w-16 mx-auto mb-4" />
                  <p className="font-semibold">Analysis Failed</p>
                  <p className="text-sm mt-2">{error}</p>
                </div>
              </div>
            ) : results.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-steel-grey">
                <div className="text-center">
                  <AlertCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>No analysis results yet</p>
                  <p className="text-sm mt-2">Upload and analyze media to see results</p>
                </div>
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden border-2 border-green-500/50">
                <img src={preview!} alt="Analyzed" className="w-full h-auto opacity-90" />
                <div className="absolute top-4 left-4 px-4 py-2 bg-green-500/80 rounded-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-white" />
                  <span className="text-white font-semibold">{results.length} Defects Detected</span>
                </div>

                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <rect x="10%" y="10%" width="20%" height="15%" fill="none" stroke="#ef4444" strokeWidth="2" className="animate-pulse-glow">
                    <animate attributeName="stroke-opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
                  </rect>
                  <rect x="45%" y="40%" width="15%" height="18%" fill="none" stroke="#f59e0b" strokeWidth="2" className="animate-pulse-glow" style={{ animationDelay: '0.5s' }}>
                    <animate attributeName="stroke-opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
                  </rect>
                  <rect x="70%" y="70%" width="18%" height="12%" fill="none" stroke="#10b981" strokeWidth="2" className="animate-pulse-glow" style={{ animationDelay: '1s' }}>
                    <animate attributeName="stroke-opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
                  </rect>
                </svg>
              </div>
            )}
          </div>
        </div>

        {results.length > 0 && (
          <div className="glass-effect rounded-xl p-6 border-2 border-neon-blue/30 animate-slide-up">
            <h2 className="text-2xl font-semibold text-white mb-6 font-poppins">
              Defect Details
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neon-blue/30">
                    <th className="text-left py-3 px-4 text-steel-grey font-semibold">Defect Type</th>
                    <th className="text-left py-3 px-4 text-steel-grey font-semibold">Confidence</th>
                    <th className="text-left py-3 px-4 text-steel-grey font-semibold">Area</th>
                    <th className="text-left py-3 px-4 text-steel-grey font-semibold">Severity</th>
                    <th className="text-left py-3 px-4 text-steel-grey font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => (
                    <tr
                      key={result.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-3 px-4 text-white font-semibold">{result.type}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-white/10 rounded-full h-2 max-w-[100px]">
                            <div
                              className="bg-neon-blue h-2 rounded-full neon-glow"
                              style={{ width: `${result.confidence}%` }}
                            ></div>
                          </div>
                          <span className="text-neon-blue text-sm font-semibold">
                            {result.confidence}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-steel-grey">{result.area}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            result.severity === 'high'
                              ? 'bg-red-500/20 text-red-400'
                              : result.severity === 'medium'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-green-500/20 text-green-400'
                          }`}
                        >
                          {result.severity}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            result.action === 'Reject'
                              ? 'bg-red-500/20 text-red-400'
                              : result.action === 'Review'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-green-500/20 text-green-400'
                          }`}
                        >
                          {result.action}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
