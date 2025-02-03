'use client'

import { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { FaDownload, FaAdjust, FaImage, FaMagic, FaFont, FaArrowsAlt } from 'react-icons/fa';

export default function ImageGeneratorForm() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('modern');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [textOverlay, setTextOverlay] = useState('');
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const [textColor, setTextColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState(24);
  const [imageSize, setImageSize] = useState({ width: 1024, height: 1024 });
  const [selectedFont, setSelectedFont] = useState('Inter');
  const [grayscale, setGrayscale] = useState(0);
  const [sepia, setSepia] = useState(0);
  const [blur, setBlur] = useState(0);
  const [hueRotate, setHueRotate] = useState(0);
  const [downloadFormat, setDownloadFormat] = useState<'webp' | 'png' | 'jpg'>('webp');


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, style }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      setGeneratedImage(data.result.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedImage) return;

    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();

      // Create a canvas to handle format conversion
      const img = new Image();
      img.src = URL.createObjectURL(blob);

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      // Apply the current filters to the canvas
      ctx.filter = getImageStyle().filter;
      ctx.drawImage(img, 0, 0);

      // Add text overlay if exists
      if (textOverlay) {
        ctx.font = `${fontSize}px ${selectedFont}`;
        ctx.fillStyle = textColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const x = (canvas.width * textPosition.x) / 100;
        const y = (canvas.height * textPosition.y) / 100;
        ctx.fillText(textOverlay, x, y);
      }

      // Convert to selected format
      const mimeType = `image/${downloadFormat}`;
      const quality = downloadFormat === 'jpg' ? 0.9 : undefined;
      const dataUrl = canvas.toDataURL(mimeType, quality);

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `generated-image-${Date.now()}.${downloadFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      setError('Failed to download image');
    }
  };

  const getImageStyle = () => {
    return {
      filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) grayscale(${grayscale}%) sepia(${sepia}%) blur(${blur}px) hue-rotate(${hueRotate}deg)`,
      transition: 'filter 0.3s ease',
      width: `${imageSize.width}px`,
      height: `${imageSize.height}px`,
      objectFit: 'cover' as const
    };
  };

  const getTextStyle = () => {
    return {
      position: 'absolute' as const,
      left: `${textPosition.x}%`,
      top: `${textPosition.y}%`,
      color: textColor,
      fontSize: `${fontSize}px`,
      fontFamily: selectedFont,
      transform: 'translate(-50%, -50%)',
      textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
      userSelect: 'none' as const
    };
  };

  const resetFilters = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setGrayscale(0);
    setSepia(0);
    setBlur(0);
    setHueRotate(0);
  };


  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image Description
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            rows={4}
            placeholder="Describe the image you want to generate..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Style
          </label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="modern">Modern</option>
            <option value="vintage">Vintage</option>
            <option value="abstract">Abstract</option>
            <option value="realistic">Realistic</option>
            <option value="minimalist">Minimalist</option>
            <option value="bold">Bold</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-lg'
          }`}
        >
          {loading ? 'Generating...' : 'Generate Image'}
        </button>
      </form>

      {error && (
        <div className="text-red-500 text-center">
          {error}
        </div>
      )}

      {loading && (
        <div className="py-8">
          <LoadingSpinner />
        </div>
      )}

{generatedImage && (
        <div className="mt-8">
          <div className="flex gap-6">
            {/* Editor Sidebar */}
            <div className="w-80 bg-white p-4 rounded-lg shadow-lg space-y-4 max-h-[800px] overflow-y-auto border border-gray-100">
              {/* Image Settings */}
              <div className="border-b pb-4">
                <h3 className="text-sm font-semibold mb-3 text-gray-700">Image Settings</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="flex items-center text-xs font-medium mb-1 text-gray-600">
                      <FaArrowsAlt className="mr-1 w-3 h-3" />
                      Width
                    </label>
                    <input
                      type="number"
                      value={imageSize.width}
                      onChange={(e) => setImageSize(prev => ({...prev, width: Number(e.target.value)}))}
                      className="w-full p-1 border rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="flex items-center text-xs font-medium mb-1 text-gray-600">
                      <FaArrowsAlt className="mr-1 w-3 h-3" />
                      Height
                    </label>
                    <input
                      type="number"
                      value={imageSize.height}
                      onChange={(e) => setImageSize(prev => ({...prev, height: Number(e.target.value)}))}
                      className="w-full p-1 border rounded text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Text Overlay */}
              <div className="border-b pb-4">
                <h3 className="text-sm font-semibold mb-3 text-gray-700">Text Overlay</h3>
                <div className="space-y-3">
                  <div>
                    <label className="flex items-center text-xs font-medium mb-1 text-gray-600">
                      <FaFont className="mr-1 w-3 h-3" />
                      Text
                    </label>
                    <input
                      type="text"
                      value={textOverlay}
                      onChange={(e) => setTextOverlay(e.target.value)}
                      className="w-full p-1 border rounded text-sm"
                      placeholder="Add text..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium mb-1 text-gray-600 block">
                        Font Family
                      </label>
                      <select
                        value={selectedFont}
                        onChange={(e) => setSelectedFont(e.target.value)}
                        className="w-full p-1 border rounded text-sm"
                      >
                        <option value="Inter">Inter</option>
                        <option value="Arial">Arial</option>
                        <option value="Helvetica">Helvetica</option>
                        <option value="Times New Roman">Times New Roman</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1 text-gray-600 block">
                        Color
                      </label>
                      <input
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-full h-7 p-0 rounded"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium mb-1 text-gray-600 block">
                      Font Size
                    </label>
                    <input
                      type="range"
                      min="12"
                      max="800"
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium mb-1 text-gray-600 block">
                        X Position
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={textPosition.x}
                        onChange={(e) => setTextPosition(prev => ({...prev, x: Number(e.target.value)}))}
                        className="w-full accent-blue-600"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1 text-gray-600 block">
                        Y Position
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={textPosition.y}
                        onChange={(e) => setTextPosition(prev => ({...prev, y: Number(e.target.value)}))}
                        className="w-full accent-blue-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Adjustments */}
              <div className="border-b pb-4">
                <h3 className="text-sm font-semibold mb-3 text-gray-700">Adjustments</h3>
                <div className="space-y-2">
                  {/* Each adjustment control */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="flex items-center text-xs font-medium mb-1 text-gray-600">
                        <FaAdjust className="mr-1 w-3 h-3" />
                        Brightness
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={brightness}
                        onChange={(e) => setBrightness(Number(e.target.value))}
                        className="w-full accent-blue-600"
                      />
                    </div>
                    <div>
                      <label className="flex items-center text-xs font-medium mb-1 text-gray-600">
                        <FaImage className="mr-1 w-3 h-3" />
                        Contrast
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={contrast}
                        onChange={(e) => setContrast(Number(e.target.value))}
                        className="w-full accent-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="flex items-center text-xs font-medium mb-1 text-gray-600">
                        <FaMagic className="mr-1 w-3 h-3" />
                        Saturation
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={saturation}
                        onChange={(e) => setSaturation(Number(e.target.value))}
                        className="w-full accent-blue-600"
                      />
                    </div>
                    <div>
                      <label className="flex items-center text-xs font-medium mb-1 text-gray-600">
                        B&W
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={grayscale}
                        onChange={(e) => setGrayscale(Number(e.target.value))}
                        className="w-full accent-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="flex items-center text-xs font-medium mb-1 text-gray-600">
                        Sepia
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={sepia}
                        onChange={(e) => setSepia(Number(e.target.value))}
                        className="w-full accent-blue-600"
                      />
                    </div>
                    <div>
                      <label className="flex items-center text-xs font-medium mb-1 text-gray-600">
                        Blur
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="0.5"
                        value={blur}
                        onChange={(e) => setBlur(Number(e.target.value))}
                        className="w-full accent-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center text-xs font-medium mb-1 text-gray-600">
                      Hue Rotate
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={hueRotate}
                      onChange={(e) => setHueRotate(Number(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Filters */}
              <div>
                <h3 className="text-sm font-semibold mb-3 text-gray-700">Quick Filters</h3>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={resetFilters}
                    className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md text-xs hover:shadow-md transition-all"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => {
                      setBrightness(110);
                      setContrast(120);
                      setSaturation(130);
                    }}
                    className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-md text-xs hover:shadow-md transition-all"
                  >
                    Vibrant
                  </button>
                  <button
                    onClick={() => {
                      setBrightness(100);
                      setContrast(120);
                      setGrayscale(100);
                    }}
                    className="px-3 py-1.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-md text-xs hover:shadow-md transition-all"
                  >
                    B&W
                  </button>
                  <button
                    onClick={() => {
                      setBrightness(110);
                      setContrast(110);
                      setSepia(60);
                    }}
                    className="px-3 py-1.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-md text-xs hover:shadow-md transition-all"
                  >
                    Retro
                  </button>
                  <button
                    onClick={() => {
                      setBrightness(100);
                      setBlur(2);
                    }}
                    className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-md text-xs hover:shadow-md transition-all"
                  >
                    Dreamy
                  </button>
                  <button
                    onClick={() => {
                      setBrightness(110);
                      setSaturation(150);
                      setHueRotate(180);
                    }}
                    className="px-3 py-1.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-md text-xs hover:shadow-md transition-all"
                  >
                    Psychedelic
                  </button>
                </div>
              </div>
            </div>

            {/* Image Preview */}
            <div className="flex-1">
              <div className="relative group">
                <div className="relative overflow-hidden rounded-lg shadow-md">
                  <img
                    src={generatedImage}
                    alt="Generated viral image"
                    className="w-full"
                    style={getImageStyle()}
                  />
                  {textOverlay && (
                    <div style={getTextStyle()}>
                      {textOverlay}
                    </div>
                  )}
                </div>

                <div className="absolute bottom-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <select
                    value={downloadFormat}
                    onChange={(e) => setDownloadFormat(e.target.value as 'webp' | 'png' | 'jpg')}
                    className="px-2 py-1 text-sm bg-white/90 hover:bg-white rounded-md shadow-lg"
                  >
                    <option value="webp">WebP</option>
                    <option value="png">PNG</option>
                    <option value="jpg">JPG</option>
                  </select>

                  <button
                    onClick={handleDownload}
                    className="bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
                    title="Download Image"
                  >
                    <FaDownload className="w-5 h-5 text-gray-700" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
