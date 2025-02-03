'use client'

import { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

export default function ImageGeneratorForm() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('modern');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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

      {generatedImage && !loading && (
        <div className="rounded-lg overflow-hidden shadow-lg">
          <img
            src={generatedImage}
            alt="Generated image"
            className="w-full"
          />
        </div>
      )}
    </div>
  );
}
